/* proxy/worker.js — PPT AI 생성 프록시 (Cloudflare Workers)
   목적: 관리자 API 키 1개를 서버에 숨기고 팀 전체가 사용. 클라이언트엔 키 없음.
   남용 방지:
   - PPT 브리프 전용(프롬프트 서버 조립) — 범용 LLM 중계로 못 씀
   - 모델 서버 고정(Sonnet 5), max_tokens 상한
   - IP당 일일 호출 제한(KV) — DAILY_LIMIT
   - 최후 안전망: Anthropic 콘솔의 월 지출 한도(Spend Limit) ← 콘솔에서 별도 설정 필수
   배포: proxy/README.md 참조. 시크릿: wrangler secret put ANTHROPIC_API_KEY */

const MODEL = 'claude-sonnet-5';   // 서버 고정 — 클라이언트가 못 바꿈
const MAX_TOKENS = 16000;   // deep(20~24장) 덱 + 문서 첨부 브리프 여유 — 8000에서 잘리던 문제 상향
const DAILY_LIMIT = 999;           // 개발·테스트 중 임시 해제(사용자 요청 2026-07-28). 전면 배포 전 운영값 재설정 필수

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};
const json = (obj, status) => new Response(JSON.stringify(obj), {
  status: status || 200, headers: { 'content-type': 'application/json', ...CORS },
});

const SCHEMA_DOC =
  'cover:{title,subtitle,eyebrow?,meta?:[{k,v}]} | ' +
  'agenda:{title,items:[문자열]} | ' +
  'rows:{title,index?,rows:[{num,label,desc}]} | ' +
  'cols:{title,index?,cols:[{sub,items?:[문자열],text?}]} | ' +
  'bigstat:{title,index?,big,sides:[{sub,text}]} | ' +
  'statement:{title,index?,text,cols?} | ' +
  'closing:{title,sub?,contacts?:[{k,v}]}';

const SYSTEM =
  '너는 시니어 발표 장표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입과 필드: ' + SCHEMA_DOC + '\n' +
  '규칙: 첫 장은 cover, 본문이 2섹션 이상이면 두번째는 agenda, 마지막은 closing. ' +
  '브리프의 plan(자유 기획 텍스트)을 해석해 구조를 잡는다 — plan에 목차·순서가 보이면 그대로 따르고, ' +
  '없으면 주제·목적·청중에 맞는 논리적 목차를 직접 구성한다. plan의 구체 정보(수치·기능·일정 등)는 반드시 슬라이드에 반영. ' +
  '섹션마다 본문 슬라이드(rows/cols/bigstat/statement) 1장 이상을 실제 내용으로 채운다(플레이스홀더 금지). ' +
  '레이아웃은 내용 성격에 맞게 다양하게. 수치는 plan에 있으면 그 값, 없으면 맥락상 그럴듯하게. ' +
  '총 장수는 length를 따른다: short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.' +
  '작법 규칙(엄수): 한 장에 한 메시지 — 메시지가 둘이면 장을 나눈다. 제목만 이어 읽어도 논리가 성립하게. ' +
  '첫 3장 안에 "왜 지금 이 이야기인가"가 나오고, 마지막에는 다음 행동을 명시한다. ' +
  '연속 3장 같은 타입·골격 반복 금지 — 풀블리드·타입온리·데이터 장을 섞어 리듬을 만들고, 밀도 높은 장 뒤엔 숨 쉬는 장을 둔다. ' +
  '수치·인용에는 출처를 붙이고(footnote 등), 추정치는 "약/추정"으로 확정과 구분한다. 근거 없는 장식용 수치·게이지 금지. ' +
  '제목·리드는 의미 단위로 줄바꿈(\\n)한다 — 어절 중간에서 끊지 않는다. ' +
  '넘버 리스트의 번호(01·02…)는 자동 부여된다 — head·label 텍스트에 번호를 다시 쓰지 말 것.';

/* Pitch(Creatable) 팩 — 레이아웃 카탈로그("언제 쓰나")를 기준으로 AI가 장표 타입을 고른다.
   app/packs.pitch.js의 PITCH_CATALOG·FIELD_DOC과 동일 계약. 팩이 늘면 여기도 팩별 스키마가 붙는다. */
const PITCH_USE_DOC =
  'statement(대형 문장): 표지·미션·섹션 전환·투자 요청. bg=green이 브랜드 강조면. ' +
  'quote(인용): 고객·전문가 발언으로 신뢰 | ' +
  'split(좌우 2분할): 설명+시각자료 나란히 — 문제 정의·제품 화면·경쟁 우위 | ' +
  'grid(N열 반복): 동급 항목 3~4개 — 기능·강점·팀원·경쟁사. variant num=큰 번호 카드(비전·기회·차별점, 첫 카드 강조), 항목 image=이미지 타일 셀 | ' +
  'stats(수치 그리드): 트랙션·성과 지표 2~6개 | ' +
  'bigstat(단일 대형 수치): 시장 규모·점유율 숫자 하나로 임팩트 | ' +
  'list(넘버드 카드 리스트): 해결책·핵심 기능·문제점을 번호 카드 행으로(첫 행 강조). image 주면 좌측 이미지+우측 카드 | ' +
  'table(표): 거래처·계약 등 열이 정해진 데이터 | ' +
  'pricing(요금 티어): 플랜 2~3개 비교 | ' +
  'timeline(타임라인): 로드맵·절차·연혁 | ' +
  'milestone(마일스톤): 기간 계획 간트 — 단계 카드+월축 계단 바, 일정·완료 기준 중심일 때 | ' +
  'chart(차트): 추이=area/line, 항목 비교=bar, 구성비=donut/pie, 규모 비교=bubble, 포함 관계=concentric, 전환 퍼널=pyramid, 겹침=venn, 목표 대비 달성·점수=gauge(max 필수), 진행률·완료율 %=ring | ' +
  'matrix(2×2): 포지셔닝·경쟁 지형 | ' +
  'gallery(목업): 제품 화면 2~3개 | ' +
  'closing(마무리): 인사+연락처';
const PITCH_FIELD_DOC =
  'statement:{bg:"green|grey|white",pos:"bottom|center",eyebrow?,title,sub?,bottomImage?:{label}} | ' +
  'quote:{text,by,stat?:{value,label,stars?:true},bg?} | ' +
  'split:{eyebrow?,title,bullets?:[str],text?,stat?:{value,label},visual?:{label:str},side:"left|right",bg?} | ' +
  'grid:{eyebrow?,title,variant:"text|icon|card|person|num",cols:2~4,items:[{head?,role?,text,image?:{label}}],accent?:정수,bg?} | ' +
  'stats:{eyebrow?,title,cols:2~3,items:[{value,label}],bg?} | ' +
  'bigstat:{eyebrow?,title,value,caption,bg?} | ' +
  'list:{title,rows:[{label,sub}],image?:{label},accent?:정수,bg?} | ' +
  'table:{eyebrow?,title,text?,columns:[str],rows:[{cells:[str]}],bg?} | ' +
  'pricing:{title,tiers:[{name,price,per,features:[str],featured?:true}],bg?} | ' +
  'timeline:{title,items:[{when,head,text}],bg?} | ' +
  'milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),caption?,bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[월 라벨 4~6],note?} | ' +
  'chart:{eyebrow?,title,note?,chart:{type:"bar|area|line|donut|pie|bubble|concentric|arc|pyramid|venn|gauge|ring",categories:[str],series:[{name:str,values:[숫자]}],max?:숫자(gauge·ring 상한),emphasis?:정수,format?:{prefix,suffix}},bg?} | ' +
  'matrix:{title,axisX,axisY,points:[{x:0~100,y:0~100,label}],bg?} | ' +
  'gallery:{title,items:[{head?,text?,image?:{label:str}}],bg?} | ' +
  'closing:{title,contacts:[{k,v}]}';
const PITCH_SYSTEM =
  '너는 시니어 피치덱 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + PITCH_USE_DOC + '\n' +
  '각 타입의 필드: ' + PITCH_FIELD_DOC + '\n' +
  '규칙: 첫 장은 statement(bg green, pos bottom, eyebrow "PITCH DECK"류), 마지막은 closing. ' +
  'Q&A 장(statement, title "Q&A")을 넣는다면 반드시 덱 맨 끝(closing 바로 앞)에만 둔다. ' +
  '수치가 있으면 stats/bigstat/chart로 시각화하고, 추이·비교·구성비 데이터는 chart를 적극 사용(값은 plan의 실제 수치). ' +
  'plan의 구체 정보(수치·기능·일정)는 반드시 반영. 실제 내용으로 채운다(플레이스홀더 금지). ' +
  'bg는 white/grey를 번갈아 리듬을 만들고 green은 전환점 1~3장에만. ' +
  '총 장수는 length를 따른다: short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.' +
  '작법 규칙(엄수): 한 장에 한 메시지 — 메시지가 둘이면 장을 나눈다. 제목만 이어 읽어도 논리가 성립하게. ' +
  '첫 3장 안에 "왜 지금 이 이야기인가"가 나오고, 마지막에는 다음 행동을 명시한다. ' +
  '연속 3장 같은 타입·골격 반복 금지 — 풀블리드·타입온리·데이터 장을 섞어 리듬을 만들고, 밀도 높은 장 뒤엔 숨 쉬는 장을 둔다. ' +
  '수치·인용에는 출처를 붙이고(footnote 등), 추정치는 "약/추정"으로 확정과 구분한다. 근거 없는 장식용 수치·게이지 금지. ' +
  '제목·리드는 의미 단위로 줄바꿈(\\n)한다 — 어절 중간에서 끊지 않는다. ' +
  '넘버 리스트의 번호(01·02…)는 자동 부여된다 — head·label 텍스트에 번호를 다시 쓰지 말 것.';
/* honors 팩(MIDAS Honors) — pitch 레이아웃 + toc(목차)·divider(간지) */
const HONORS_USE_DOC = PITCH_USE_DOC + ' | ' +
  'toc(목차): 표지 바로 다음 장, 발표 전체 목차 | ' +
  'divider(간지): 각 섹션 시작 전 전환 장 — 목차 항목과 1:1';
const HONORS_FIELD_DOC = PITCH_FIELD_DOC + ' | ' +
  'toc:{eyebrow?,title?,items:[문자열]} | ' +
  'divider:{title,sub?,v?:1~3(배경 변형)} | ' +
  'statement 추가필드: v?:3~5(전면 블루 배경) | closing 추가필드: v?:3~5';
const HONORS_SYSTEM =
  '너는 시니어 발표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + HONORS_USE_DOC + '\n' +
  '각 타입의 필드: ' + HONORS_FIELD_DOC + '\n' +
  '규칙: 1장은 statement(pos bottom, v는 3~5 중 하나·기본 3). 전면 배경이 이미 이미지이므로 statement에 bottomImage는 쓰지 않는다. ' +
  '2장은 toc(items=섹션 제목들). 각 섹션이 시작될 때마다 divider(title은 toc 항목과 동일, v는 1→2→3 순환). ' +
  'Q&A 장(statement, title "Q&A")을 넣는다면 반드시 덱 맨 끝(closing 바로 앞)에만 둔다. ' +
  '수치가 있으면 stats/bigstat/chart로 시각화(값은 plan의 실제 수치). plan의 구체 정보는 반드시 반영(플레이스홀더 금지). ' +
  '본문 bg는 white/grey 교대. 마지막은 closing. ' +
  '총 장수는 length를 따른다(목차·간지 포함): short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.' +
  '작법 규칙(엄수): 한 장에 한 메시지 — 메시지가 둘이면 장을 나눈다. 제목만 이어 읽어도 논리가 성립하게. ' +
  '첫 3장 안에 "왜 지금 이 이야기인가"가 나오고, 마지막에는 다음 행동을 명시한다. ' +
  '연속 3장 같은 타입·골격 반복 금지 — 풀블리드·타입온리·데이터 장을 섞어 리듬을 만들고, 밀도 높은 장 뒤엔 숨 쉬는 장을 둔다. ' +
  '수치·인용에는 출처를 붙이고(footnote 등), 추정치는 "약/추정"으로 확정과 구분한다. 근거 없는 장식용 수치·게이지 금지. ' +
  '제목·리드는 의미 단위로 줄바꿈(\\n)한다 — 어절 중간에서 끊지 않는다. ' +
  '넘버 리스트의 번호(01·02…)는 자동 부여된다 — head·label 텍스트에 번호를 다시 쓰지 말 것.';
/* rams 팩(Rams Report) — naver와 동일 타입 어휘, 웜그레이·라운드 카드·버밀리언 단일 액센트. packs.rams.js와 동기 */
const RAMS_USE_DOC = "cover(표지): 첫 장 — 로고·날짜·대형 3톤 타이틀·아이소 큐브 그래픽\nstatement(대형 선언): 표지 다음 선언·전환 — 대형 타이틀+본문+비교 카드 2개(흰/다크)\ntoc(목차): 표지·선언 다음 장. 카드 행 리스트(divider 제목과 1:1 일치)\ndivider(간지): 챕터 시작 전환 장 — 다크/오렌지 풀블리드 자동 교대(bg로 지정 가능), 큐브 진행 인디케이터\nsection(본문 넘버 행): 핵심 항목 3~4개 — 대형 번호+굵은 소제목+흐린 설명 규칙선 행\ncards(N열 카드): 동급 항목 2~4개 — 흰 라운드 카드(번호 자동)\nsplit(좌우 대비): 반반 대비(라이트 vs 다크) — 활용/설계, 남/우리 구도\nstats(수치): 도넛(다크 카드)+게이지 카드 행 — 진행률·지표 비교\nmedia(이미지 증빙): 스펙 시트(좌 라벨+행, 중간 다크 강조)+우 이미지 슬롯 — 데모·프로토타입 증빙\nroadmap(로드맵): 월별 진행 바+Now/Next/Then 카드 — 단계별 계획\nbigstat(단독 대형 수치): 숫자 하나로 임팩트 — 좌 설명/우 초대형 액센트 숫자\nkpi(수치 그리드): 지표 2~4개 카드 요약(tone:on=다크 강조)\ntable(표): 열 고정 데이터 나열\ntimeline(타임라인): 기간 진행 바 열(on=현재 액센트) — 연혁·월별 마일스톤\nmilestone(마일스톤): 기간 계획 간트 — 단계 카드+월축 계단 바, 일정·완료 기준 중심일 때\nprocess(프로세스): 단계 카드 3~4개, 담당 구간=액센트 풀 카드(accent 인덱스)\ncompare(비교): Before(옅음)/After(다크) 패널+옵션 이미지 — 전환 효과\nquote(인용): 발언·선언 하나를 크게\nposition(포지셔닝): 흐름 3단계 중 우리 위치 — 중앙 액센트 카드\nchecklist(체크리스트): 확인·완료 항목(액센트 체크 원). 4개 이하 1열·많으면 2열 자동\nlineup(라인업): 제품·에이전트 구성 2×2 카드 — 첫 카드 다크+액센트 뱃지, state:dim=후보\nbranch(분기/조직): 좌 다크 리드 카드+우 카드 행(이름·역할·설명) — 조직·영역 분류\nhighlight(하이라이트/데모): 오렌지 풀블리드+재생 행 — 라이브 데모·핵심 안내 임팩트 장\nboard(현황 보드): 진행 중 작업 요약 — 카드 2+다크 사이드(리스트+뱃지 칩)\nclosing(마무리): 마지막 장 — 다크, 다음 행동(Next)+연락 메타+큐브 군집";
const RAMS_FIELD_DOC = "cover:{label?(로고 옆 이름),date?,eyebrow?(\"PROLOGUE\"류),title(3톤: **굵게**·__회색 흐림__, \\n 2~3줄),band?(하단 좌 비유 문구, **강조**),docLabel?(하단 우)} | statement:{title(**굵게** 조합),sub?,cols?:[{tag,text(\"A → **B**\" 비교)}](2개 — 둘째=다크 카드)} | toc:{title?,items:[{no?,label(영문 챕터명),desc(한 줄, **강조**),pages?:\"04—08\"}]} | divider:{no?:\"01\",title(영문 2줄 \\n, 둘째 줄 **굵게**),lead(한 문장, **강조**),bg?:\"dark|accent\"(생략 시 자동 교대)} | section:{title,points:[{head,text}](3~4개),tag?(러닝헤드 보조),note?(마무리, **강조**=액센트)} | cards:{title,cards:[{head,text?,tag?,tone?:\"dark\"}](2~4개),note?} | split:{left:{kicker,title(**굵게**),items:[str],foot?},right:{kicker,title(**굵게**),items:[str],foot?}} — 좌 라이트/우 다크 대비 | stats:{title,donut?:{pct:0~100,value?,caption?,label?},bars?:[{label,pct:0~100,value?,on?:true(다크 강조 행),text?}],note?} | media:{title,specs:[{label,text,on?:true(다크 강조 행)}],image?:{label},caption?} | roadmap:{title,months?:[{when,text}](4개 진행 바),steps:[{when:\"Now|Next|Then\",head,items:[str],state?:\"now|later\"}](3개),note?} | bigstat:{title,value,caption?(**강조**),note?} | kpi:{title,items:[{value,label,desc?,tone?:\"on\"}](2~4개),note?} | table:{title,columns:[str],rows:[{cells:[str]}],note?} | timeline:{title,items:[{when,head,text?,on?:true}](3~5개),note?} | milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),caption?,bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[월 라벨 4~6],note?} | process:{title,steps:[{tag:\"1 · 기획\"류,head(\\n 2줄 가능·**굵게**),text?}](3~4개),accent?:강조 인덱스(기본 중앙),note?} | compare:{title,items:[{head:\"Before|After\",items:[str]}](2개),image?:{label},caption?,note?} | quote:{text(**강조**),by?} | position:{title,panels:[{tag,head(**굵게**),text?}](3개),accent?,note?} | checklist:{title,items:[str],cols?:1~2,note?} | lineup:{title,items:[{tag(분야),head(이름),text,badge?(상태 라벨),state?:\"dim\"(후보)}](4개 — 첫 항목=현재·다크),note?} | branch:{title,lead?:{label,text(**굵게**),foot?},branches:[{label(조직명),head(역할),text}](3개),note?} | highlight:{title(**굵게**),items:[{no?,head,text?}](2~3개 재생 행),note?(**강조**),footnote?(우하단 2줄)} | board:{title(**굵게**),cards:[{tag:\"01 · 분야\",head,text?}](2개),side?:{title,items:[str],pills?:[str]},note?} | closing:{label?,title(마지막 줄 **굵게**),sub?(**강조**=액센트),nextLabel?,contacts?:[{k?,v}](우하단 2줄)}\n규칙: 넘버는 자동 부여 — head에 번호 금지. 액센트는 오렌지 하나 — 강조 남발 금지(장당 **강조** 1~2회). 간지 bg는 자동 교대(다크→오렌지). title은 의미 단위 \\n 줄바꿈. 이모지 금지.";
const RAMS_SYSTEM_FREE =   // [시연 잠금 해제 시 복귀용] 자유 구성 원본
  '너는 시니어 발표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + RAMS_USE_DOC + '\n' +
  '각 타입의 필드: ' + RAMS_FIELD_DOC + '\n' +
  '규칙: 1장 cover. 2장 statement(선언) 또는 toc. toc의 items는 divider title과 1:1. ' +
  '챕터마다 divider(title=영문 2줄 \\n, 둘째 줄 **굵게**, bg 지정은 생략 — 다크/오렌지 자동 교대) 후 그 챕터 본문 장들. ' +
  '본문 장은 밀도 있게 — section은 points 3~4개, 장 마무리 note(**강조**=액센트 1회)를 적극 넣는다. ' +
  '수치가 있으면 stats(도넛+게이지)/kpi로 시각화(값은 plan의 실제 수치). 데모·발표 안내는 highlight, 진행 현황은 board/media. ' +
  'plan의 구체 정보는 반드시 반영(플레이스홀더 금지). 마지막은 closing(다음 행동 명시). ' +
  '총 장수는 length를 따른다(목차·간지 포함): short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.' +
  '작법 규칙(엄수): 한 장에 한 메시지 — 메시지가 둘이면 장을 나눈다. 제목만 이어 읽어도 논리가 성립하게. ' +
  '첫 3장 안에 "왜 지금 이 이야기인가"가 나오고, 마지막에는 다음 행동을 명시한다. ' +
  '연속 3장 같은 타입·골격 반복 금지 — 풀블리드·타입온리·데이터 장을 섞어 리듬을 만들고, 밀도 높은 장 뒤엔 숨 쉬는 장을 둔다. ' +
  '수치·인용에는 출처를 붙이고, 추정치는 "약/추정"으로 확정과 구분한다. 근거 없는 장식용 수치·게이지 금지. ' +
  '제목·리드는 의미 단위로 줄바꿈(\\n)한다 — 어절 중간에서 끊지 않는다. ' +
  '모든 장의 title에는 핵심 어구 한 곳을 **굵게**로 강약을 준다(문장 전체 굵게 금지). ' +
  '넘버 리스트의 번호(01·02…)는 자동 부여된다 — head·label 텍스트에 번호를 다시 쓰지 말 것.';

/* pastel 팩(Pastel Gradient) — naver와 동일 타입 어휘, 화이트·챕터 그라데이션·키밴드. packs.pastel.js와 동기 */
const PASTEL_USE_DOC = "cover(표지): 첫 장 — 그라데이션 대형 번호·Archivo 타이틀·5색 바\nstatement(대형 선언): 표지 다음 선언 — 대형 영문+그라데이션 키워드+비교 카드 2\ntoc(목차): 챕터 목차 — 챕터별 그라데이션 컬럼(번호·영문 라벨·메시지)\ndivider(간지): 챕터 시작 — 풀블리드 챕터 그라데이션+대형 타이틀\nsection(본문 표준): 핵심 논점 3~4개 — 대형 번호+보더탑 소제목+설명\ncards(N열 카드): 동급 항목 2~4개 — 그라데이션 톤 사다리 셀\nsplit(좌우 대비): 흐린 리스트 vs 강조 리스트(활용 vs 설계 대비)\nstats(수치): 대형 그라데이션 %+진행바 — 진척도·달성률\nmedia(스펙 rows): 구조·사양 행(라벨+내용, 핵심 행 그라데이션 강조)+이미지 슬롯\nroadmap(로드맵): 단계 계획 — Now/Next/Then 3열+월별 타임라인 밴드\nbigstat(대형 수치): 수치 하나로 임팩트 — 그라데이션 클립 숫자\nkpi(KPI 셀): 지표 2~4개 — 값+라벨 그라데이션 셀\ntable(표): 열이 정해진 데이터 — 보더바텀 rows\ntimeline(타임라인): 시간순 이벤트 — when+제목+설명 행\nmilestone(마일스톤): 기간 계획 간트 — 단계 카드+월축 계단 바. 일정·완료 기준 중심일 때\nprocess(프로세스): 단계 흐름 3~4개 — 중앙(또는 지정) 그라데이션 강조\ncompare(비교): Before/After — 보더 vs 그라데이션 카드\nquote(질문/인용): 핵심 질문·인용 — 풀블리드 그라데이션 Q 패널\nposition(포지셔닝): 흐름 3단계 중 우리 위치 — 중앙 그라데이션 카드\nchecklist(체크리스트): 확인·항목 목록 — 대시바+보더바텀 rows. 5개 초과 시 2열\nlineup(라인업): 제품·계획 라인업 4개 — 진행=그라데이션·후보=보더\nbranch(갈래): 조직·영역 3갈래+공통 리드 박스\nhighlight(하이라이트): 데모·발표 안내 — 풀블리드 그라데이션+대형 타이틀+단계 행\nboard(현황 보드): 진행 현황 — 2톤 대형 타이틀+카드 2+사이드 리스트\nclosing(엔딩): 마지막 장 — dim+강조 대형 타이틀+다음 행동+5색 바";
/* [시연 고정] rams(Structure style) — 10장 스켈레톤 잠금. 다양 구성(도식·그래프·건축 이미지 포함), 텍스트만 채움. */
const RAMS_SYSTEM =
  '너는 시니어 발표 기획자다. 브리프로 프레젠테이션 슬라이드 덱을 만든다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '[템플릿 고정 모드] 정확히 아래 10장을 이 순서·이 타입으로. 타입·순서·장수 변경 금지 — 텍스트 필드만 브리프·첨부로 채운다:\n' +
  '1) cover — {label,date,eyebrow("PROLOGUE"류),title(3톤 2~3줄 \\n: **굵게**+__회색 흐림__),band(비유 한 줄,**강조**),docLabel}\n' +
  '2) statement — {title(**굵게** 조합 2줄),sub,cols 2개:[{tag,text("A → **B**")}]}\n' +
  '3) toc — {items 4~5개:[{no,label(영문 챕터명),desc(**강조** 1회),pages}]}\n' +
  '4) divider — {no:"01",title(영문 2줄 \\n, 둘째 줄 **굵게**),lead(**강조**)}\n' +
  '5) section — {title,points 3~4개:[{head,text}],note(**강조** 1회)}\n' +
  '6) media — {title,specs 3~4개:[{label(짧은 영문),text,on:true 1개},...],image:{label:"Architecture reference"},caption} — 건축 이미지 장\n' +
  '7) divider — {no:"02",title(영문 2줄),lead(**강조**)}\n' +
  '8) stats — {title,donut:{pct,value?,caption?,label?},bars 3개:[{label,pct,value?,on:true 1개}],note(SO WHAT,**강조**)} — 수치는 브리프 근거 우선, 없으면 목표치 라벨\n' +
  '9) process — {title,steps 3~4개:[{tag:"1 · 기획"류,head,text?}],accent?,note}\n' +
  '10) closing — {label?,title(마지막 줄 **굵게**),sub?(**강조**),nextLabel?,contacts?:[{k?,v}]}\n' +
  '각 타입의 필드: ' + RAMS_FIELD_DOC + '\n' +
  '규칙: 브리프·첨부([첨부 문서])가 1차 소스, 플레이스홀더 금지. 인명·팀명·고유명사는 첨부 표기 그대로(임의 음차·재번역 금지). **굵게** 장당 1~2회, 이모지 금지, 번호 자동 부여(재기입 금지), 의미 단위 \\n 줄바꿈. length와 무관하게 정확히 10장. 언어는 lang.';

const PASTEL_FIELD_DOC = "cover:{label?(좌상 로고명),date?,eyebrow?(하단 영문 밴드),title(**강조**=500, \\n 2~3줄),band?(리드 문장, **강조**),docLabel?} | statement:{title(영문 대형, **키워드**=그라데이션),sub?(**강조**),cols?:[{tag,text(\"A **→ B**\")}](2개)} | toc:{title?,items:[{no?,label(영문 챕터명),desc(한 줄 메시지, **강조**, \\n 가능),pages?:\"04 — 07\"}](3~5개)} | divider:{no?:\"01\",title(영문 2줄 \\n, 둘째 줄 **굵게**),lead(한 문장, **강조**)} | section:{title,points:[{no?,head,text}](3~4개),tag?,sub?,note?(키밴드 문장, **강조**)} | cards:{title,cards:[{head,text?,tag?,tone?:\"dark\"(강조 셀)}](2~4개),sub?,note?} | split:{title?,left:{kicker,items:[str],foot?},right:{kicker,items:[str],foot?},note?} — 좌 흐림/우 강조 | stats:{title,donut?:{pct:0~100,label?,caption?},bars?:[{label,pct:0~100,value?,on?:true(강조 행),text?}],sub?,note?} | media:{title,specs:[{label(짧은 영문),text,on?:true(그라데이션 강조 행)}](3~5개),image?:{label},caption?,sub?,note?} | roadmap:{title,steps:[{when:\"Now|Next|Then\",head,items:[str],state?:\"now\"}](3개),months?:[{when:\"8월\",text}](4~5개 하단 밴드),sub?,note?} | bigstat:{title,value,caption?(**강조**),note?} | kpi:{title,items:[{value,label,desc?,tone?:\"on\"}](2~4개),sub?,note?} | table:{title,columns:[str],rows:[{cells:[str]}],sub?,note?} | timeline:{title,items:[{when,head,text?,on?:true}](3~5개),sub?,note?} | milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),caption?,bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[월 라벨 4~6],note?} | process:{title,steps:[{tag:\"1단계 · 기획\"류,head(\\n 2줄 가능),text?}](3~4개),accent?,sub?,note?} | compare:{title,items:[{head:\"Before|After\",items:[str]}](2개),sub?,note?} | quote:{text(질문·인용, **강조**, \\n),by?} | position:{title,panels:[{tag,head(**굵게**),text?}](3개),accent?,note?} | checklist:{title,items:[str],cols?:1~2,sub?,note?} | lineup:{title,items:[{tag(분야),head(이름),text,badge?(상태),state?:\"dim\"(후보)}](4개),sub?,note?} | branch:{title,branches:[{label(조직명),head(역할),text}](3개),lead?:{label,text(**굵게**)},sub?,note?} | highlight:{title(영문 대형 \\n, **강조**),items:[{no?,head,text?}](2~3개),footnote?} | board:{title(2톤: __흐림__+**강조**),cards:[{tag:\"01 · 분야\",head,text?}](2개),side?:{title,items:[str],pills?:[str]},note?} | closing:{label?,title(2톤: __흐림__ 줄+**강조** 줄),sub?,nextLabel?(**강조**),contacts?:[{v}](우하단 2줄)}\n규칙: note=하단 키밴드 문장(장당 1개, **강조** 1회) — 본문 장엔 적극 넣는다. 챕터 컬러는 간지 순서 자동(블루→틸→그린→코랄→딥블루). title은 의미 단위 \\n 줄바꿈. 이모지 금지.";
const PASTEL_SYSTEM =
  '너는 시니어 발표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + PASTEL_USE_DOC + '\n' +
  '각 타입의 필드: ' + PASTEL_FIELD_DOC + '\n' +
  '규칙: 1장 cover. 2장 statement(선언) 또는 toc. toc의 items는 divider title과 1:1. ' +
  '챕터마다 divider(title=영문 2줄 \\n, 둘째 줄 **굵게** — 챕터 컬러는 순서 자동) 후 그 챕터 본문 장들. ' +
  '본문 장은 밀도 있게 — section은 points 3~4개, 장 마무리 note(하단 키밴드 문장, **강조** 1회)를 적극 넣는다. ' +
  '수치가 있으면 stats(대형 %+진행바)/kpi로 시각화(값은 plan의 실제 수치). 데모·발표 안내는 highlight, 진행 현황은 board/media. ' +
  'plan의 구체 정보는 반드시 반영(플레이스홀더 금지). 마지막은 closing(다음 행동 명시). ' +
  '총 장수는 length를 따른다(목차·간지 포함): short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.' +
  '작법 규칙(엄수): 한 장에 한 메시지 — 메시지가 둘이면 장을 나눈다. 제목만 이어 읽어도 논리가 성립하게. ' +
  '첫 3장 안에 "왜 지금 이 이야기인가"가 나오고, 마지막에는 다음 행동을 명시한다. ' +
  '연속 3장 같은 타입·골격 반복 금지 — 풀블리드·타입온리·데이터 장을 섞어 리듬을 만들고, 밀도 높은 장 뒤엔 숨 쉬는 장을 둔다. ' +
  '수치·인용에는 출처를 붙이고, 추정치는 "약/추정"으로 확정과 구분한다. 근거 없는 장식용 수치·게이지 금지. ' +
  '제목·리드는 의미 단위로 줄바꿈(\\n)한다 — 어절 중간에서 끊지 않는다. ' +
  '모든 장의 title에는 핵심 어구 한 곳을 **굵게**로 강약을 준다(문장 전체 굵게 금지). ' +
  '넘버 리스트의 번호(01·02…)는 자동 부여된다 — head·label 텍스트에 번호를 다시 쓰지 말 것.';

/* sfmi 팩(SFMI Report) — naver와 동일 타입 어휘, 래디얼 시안·원형 모티프·스트로크 간지. packs.sfmi.js와 동기 */
const SFMI_USE_DOC = "cover(표지): 첫 장 — 래디얼 시안 그라데이션·사선·Archivo 대형 2톤\nstatement(대형 선언): 표지 다음 선언 — 좌 리드/우 Archivo 대형+비교 2열\ntoc(목차): 챕터 목차 — 2열 챕터 블록(대시+보더바텀+페이지 행)\ndivider(간지): 챕터 시작 — 좌 챕터 그라데이션+아웃라인 스트로크 영문/우 국문 리드\nsection(본문 표준): 핵심 논점 3~4개 — 원 넘버+보더바텀 소제목+설명\ncards(원 카드): 동급 항목 2~4개 — 그라데이션 원+설명\nsplit(좌우 대비): 흐린 리스트 vs 강조 리스트(활용 vs 설계)\nstats(링 수치): 링 도넛 1~3개 — 진척도·달성률(on=중앙 대형)\nmedia(스펙 rows): 구조·사양 행(라벨+내용, 핵심 행 그라데이션)+이미지 슬롯\nroadmap(로드맵): 단계 계획 — 상단 chevron 월 밴드+Now/Next/Then 3열\nbigstat(대형 수치): 수치 하나로 임팩트 — 그라데이션 원 안 값\nkpi(KPI 원): 지표 2~4개 — 미니 원+값\ntable(표): 열이 정해진 데이터 — 보더바텀 rows\ntimeline(타임라인): 시간순 이벤트 — when+제목+설명 행\nmilestone(마일스톤): 기간 계획 간트 — 단계 카드+월축 계단 바, 일정·완료 기준 중심일 때\nprocess(프로세스): 단계 흐름 3~4개 — 원 소→대(그라데이션)→소+화살표\ncompare(비교): Before→After — 보더 원 vs 그라데이션 원\nquote(질문/인용): 핵심 질문 — 보더레프트+코랄 포인트 대형 문장\nposition(포지셔닝): 흐름 3단계 중 우리 위치 — 중앙 대형 원\nchecklist(체크리스트): 확인·항목 목록 — 대시+보더바텀 rows. 5개 초과 2열\nlineup(라인업): 제품·계획 라인업 4개 — 진행=그라데이션 원·후보=점선 원\nbranch(갈래(벤)): 조직·영역 3갈래 벤다이어그램+공통 리드 박스\nhighlight(하이라이트): 데모·발표 안내 — 래디얼 풀블리드+대형 타이틀+원 번호 행\nboard(현황 보드): 진행 현황 — 2톤 대형 타이틀+원 2+보더레프트 리스트\nclosing(엔딩): 마지막 장 — 래디얼+Archivo 대형 2톤+다음 행동";
const SFMI_FIELD_DOC = "cover:{label?(로고명),docLabel?(부제),eyebrow?(\"Prologue — 01\"류),date?,title(Archivo 대형 \\n 2~3줄, **강조**=화이트 500),band?(리드, **강조**=화이트)} | statement:{title(영문 대형 \\n, **키워드**=포인트색),sub(좌측 리드, **강조**),cols?:[{tag,text(\"A **→ B**\")}](2개)} | toc:{title?,items:[{label(\"Chapter 1. 제목\"),desc(한 줄),pages?:\"04\"}](3~5개)} | divider:{no?:\"01\",title(영문 대문자 1~3단어 \\n 줄바꿈 — 아웃라인 스트로크로 크게),lead(국문 헤드라인, **강조**, \\n),text?(보조 2~3문장)} | section:{title,points:[{no?,head,text}](3~4개),tag?,sub?,note?(풋라인 문장, **강조**)} | cards:{title,cards:[{head(원 안 이름),tag?(원 안 라벨),text?(원 아래 설명),tone?:\"dark\"}](2~4개),sub?,note?} | split:{title?,left:{kicker,items:[str],foot?},right:{kicker,items:[str],foot?},note?} — 좌 흐림/우 강조 | stats:{title,bars:[{label,pct:0~100,on?:true(중앙 대형 링),text?}](1~3개),sub?,note?} — 링 도넛 | media:{title,specs:[{label(짧은 영문),text,on?:true(그라데이션 강조 행)}](3~5개),image?:{label},caption?,sub?,note?} | roadmap:{title,steps:[{when:\"Now|Next|Then\",head,items:[str],state?:\"now\"}](3개),months?:[{when:\"8월\",text}](4~5개 상단 chevron 밴드),sub?,note?} | bigstat:{title,value,caption?(**강조**),note?} | kpi:{title,items:[{value,label,desc?,tone?:\"on\"}](2~4개),sub?,note?} | table:{title,columns:[str],rows:[{cells:[str]}],sub?,note?} | timeline:{title,items:[{when,head,text?,on?:true}](3~5개),sub?,note?} | milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),caption?,bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[월 라벨 4~6],note?} | process:{title,steps:[{tag:\"1단계\"류,head(\\n 2줄 가능),text?}](3~4개),accent?:강조 인덱스(기본 중앙 — 대형 그라데이션 원),sub?,note?} | compare:{title,items:[{head:\"Before|After\",items:[str 3~4개 짧게]}](2개),sub?,note?} — 원 2개 | quote:{text(질문·인용, **강조**=코랄, \\n),by?(라벨)} | position:{title,panels:[{tag,head(**굵게**),text?}](3개),accent?,note?} | checklist:{title,items:[str],cols?:1~2,sub?,note?} | lineup:{title,items:[{tag?(분야),head(이름 \\n 2줄 가능),text,badge?(상태),state?:\"dim\"(후보=점선 원)}](4개),sub?,note?} | branch:{title,branches:[{label(조직명),head(역할),text?}](3개 — 벤다이어그램),lead?:{label,text(**굵게**)},sub?,note?} | highlight:{title(영문 대형 \\n, **강조**),items:[{no?,head,text?}](2~3개),footnote?} | board:{title(2톤: __흐림__+**강조**),cards:[{tag:\"01\",head(\\n 2줄 가능),text?}](2개 — 원),side?:{title,items:[str],pills?:[str]},note?} | closing:{label?,title(2톤: __흐림__ 줄+**강조** 줄, \\n),sub?(**강조**),nextLabel?,contacts?:[{v}]}\n규칙: note=하단 풋라인 문장(장당 1개, **강조** 1회) — 본문 장엔 적극 넣는다. 챕터 컬러는 간지 순서 자동(시안→틸→블루→코랄→딥블루). divider.title은 영문 1~3단어(대문자 스트로크용) — 국문 메시지는 lead에. title은 의미 단위 \\n 줄바꿈. 이모지 금지.";
const MACHINE_USE_DOC = "cover(표지·다크 포토): 첫 장 — 사진 배경+3톤 영문 대형 타이틀+그린 대시 캡션\nstatement(그린 선언): 핵심 선언 — 풀블리드 그린+대형 화이트+하단 비교 2열\ntoc(목차·다크): 챕터 목차 — 5행(번호 그린·영문 챕터·설명·페이지 범위)\ntwocol(2열 리스트): 대비·나열 — 좌/우 톤 지정(num 번호·dash 대시·dim 흐림·bold 강조)\nquote(리스트+인용): 문제 제기 — 좌 리스트/우 그린 세로바+큰 질문\nrefcards(레퍼런스 3열): 사례·근거 — 굵은 그린 라인+영문 타이틀+출처 미주\nlinecards(라인 카드): 개념 3~4열 — 그린 라인+캡션+타이틀+설명, 틴트 밴드 옵션\nbignum(빅넘버 4열): 핵심 N가지 — 대형 그린 숫자 01~04\nagenda(어젠다 상태): 항목별 진행 상태 — on=그린 강조/후보=회색\nprocess(3스텝 강조): 단계 중 하나 강조 — 중앙 그린 필 카드\ndarkhero(다크 히어로): 섹션 전환 — 초대형 영문 2톤+좌 리드/우 리스트\nspec(스펙 시트·다크): 구조 설명 — 레일 캡션 행+그린 필 밴드(on)\nbeforeafter(비포·애프터·다크): 개선 대비 — 좌 딤/우 그린\ndemo(데모 간지·그린): 시연 안내 — Live Demo 대형+2열 플로우\nprogress(진행률·다크): 현황 보고 — 좌 대형 %+우 게이지 바(하이라이트 박스 on)\nroadmap(로드맵 3열): NOW/NEXT/THEN+하단 월별 타임라인\nclosing(엔딩·다크 포토): 마지막 장 — 딤+볼드 타이틀+다음 행동\nmilestone(마일스톤): 기간 계획 간트 — 월축+바\nchart(차트): 우상향 추이·값 비교 그래프 — area/line/bar/donut/gauge/ring + 우측 KPI 스탯";
const MACHINE_FIELD_DOC = "공통: kicker(러닝헤더 캡션 — \"01 — WHY NOW\"류 영문), title(**볼드**·__딤__ 마크업), sub, note(하단 풋라인, **강조**=그린 1회), noteR(풋라인 우측 보조 캡션) | cover/closing:{title(영문 \\n 2~3줄, **볼드**+__딤__ 3톤),band(대시 옆 한 줄),label?,date?} | statement/demo:{title(영문 대형),cols:[{tag(대문자 라벨),text(\"A → **B**\")|title,text}](2개)} | toc:{items:[{no:\"01\",label(영문 챕터 대문자),desc(**강조** 1회),pages:\"04 — 07\",on?:true(그린)}](5행 내외)} | twocol:{cols:[{tag(라벨),tone:\"num|dash|dim|bold\",green?:true(캡션 그린),items:[str]}](2개)} | quote:{tag,items:[str 4~6],quote(**강조**=그린, \\n 2~3줄)} | refcards:{items:[{title(영문 브랜드),tag(그린 캡션 대문자),desc}](3개),source?(출처 문장)} | linecards:{items:[{tag,title,desc}](3~4개),bandTag?,band?(틴트 밴드 문장)} | bignum:{items:[{no:\"01\",title,desc}](4개)} | agenda:{items:[{tag(영역 대문자),title(\\n 2줄),state(상태 캡션),desc,on?:true}](4개)} | process:{tag(라벨),tagR?(우측 캡션),items:[{tag:\"1단계 · 기획\"류,title(\\n),desc,on?:true(중앙 강조)}](3개)} | darkhero:{title(영문, **볼드**+__딤__),tag,sub(**=화이트),items:[{tag,title,desc}](2개),sideTag,side:[str, **=화이트]} | spec:{rows:[{tag(레일 대문자),text,on?:true(그린 밴드),green?:true}](3~5행)} | beforeafter:{cols:[{tag:\"BEFORE|AFTER\",items:[str 4]}](2개)} | progress:{bigLabel(대문자),big(숫자),rows:[{label,pct:0~100,cap,cap2?(그린 캡션),on?:true(하이라이트 박스)}](3개 내외)} | roadmap:{items:[{tag:\"NOW|NEXT|THEN\",title,items:[str 4, **=그린 강조 항목]}](3개),timeline:[{label:\"8월\",text,dim?:true}](4~5개)} | milestone:{months:[str],rows:[{label,start,len,tag?,on?}],phases?:[{label,text}]} | chart:{chart:{type:\"area|line|bar|donut|gauge|ring\",categories:[str],series:[{name,values:[숫자]}],max?(gauge·ring 상한),format?:{prefix,suffix}},stats?:[{value:\"84%\",label,on?:true(그린)}](≤3),dark?:true(다크 지면)} — 추이는 area/line, 비교는 bar. 근거 없는 수치 창작 금지, 브리프에 있는 값만\n규칙: note=풋라인(장당 1개, **강조** 1회 그린). 다크 장(toc·darkhero·spec·beforeafter·progress)과 라이트 장을 리듬 있게 교차. 영문 타이틀은 라이트+**볼드** 또는 __딤__ 조합 3톤. 이모지 금지.";
const MACHINE_SYSTEM_FREE =   // [시연 잠금 해제 시 복귀용] 자유 구성 원본
  '너는 시니어 발표 기획자다. 브리프로 프레젠테이션 슬라이드 덱을 설계한다. 모든 문구는 lang 언어로 쓴다(영문 챕터 라벨 제외 혼용 금지).\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + MACHINE_USE_DOC + '\n' +
  '각 타입의 필드: ' + MACHINE_FIELD_DOC + '\n' +
  '규칙: cover.title은 2~3줄(\\n)·전체 40자 이내로 짧게 — 긴 설명은 sub·band로 뺀다. 1장 cover(영문 3톤 타이틀). 2장 statement 또는 toc(items.label=영문 챕터 대문자, 본문 순서와 1:1). ' +
  '섹션 전환은 darkhero(초대형 영문)나 demo(그린). 진행 현황은 progress(pct는 plan의 실제 수치, 핵심 행 on:true). ' +
  '본문 장은 밀도 있게 — note(하단 풋라인 문장, **강조** 1회 그린)를 적극 넣는다. 다크·라이트 지면을 리듬 있게 교차. ' +
  'plan의 구체 정보는 반드시 반영(플레이스홀더 금지). 마지막은 closing(다음 행동 명시). ' +
  '총 장수는 length를 따른다: short=5~8장, std=10~15장, deep=18~22장, 없으면 6~12장. ' +
  '작법 규칙(엄수): 한 장에 한 메시지. 제목만 이어 읽어도 논리 성립. 첫 3장 안에 왜-지금, 마지막에 다음 행동. ' +
  '연속 3장 같은 골격 금지. 수치엔 출처, 추정은 표기. 모든 장 title에 핵심 어구 **굵게** 강약.' + '\n' + GENNX_FACTS;
/* [시연 고정] machine(AX Machine) = MIDAS GEN NX 제품소개 10장 잠금.
   공식 제품 정보(GENNX_FACTS) 중심 — 세미나 운영 시간표류 배제, 첨부는 행사 개요(일시·장소·톤)에만. */
const MACHINE_SYSTEM =
  '너는 MIDAS GEN NX 제품 소개 발표를 만드는 시니어 프로덕트 마케터다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지. 형식: {"slides":[ ... ]}\n' +
  '[템플릿 고정] 정확히 아래 10장, 이 순서·타입 그대로. 텍스트만 채운다. 제품 내용은 아래 공식 정보가 1차 소스(지어내기 금지), 첨부 문서는 행사 일시·장소·청중 톤에만 사용:\n' +
  '1) cover — {kicker:"PROLOGUE",label,date,title(2~3줄 \\n·전체 40자 이내, **볼드**+__딤__ 3톤),band(한 줄 가치 선언, **강조**)}\n' +
  '2) statement — {title("GEN NX × API × AI"류 영문 대형),cols 2개:[{tag,text("복잡한 구조해석은 → **더 빠르게**"류)}]}\n' +
  '3) toc — {items 정확히 4개:[{no,label(영문 대문자 한 단어),desc(한 줄),pages}]} — title 필드 쓰지 말 것\n' +
  '4) twocol — 왜 지금: {title,cols 2개:[{tag,tone,items 3~4}] — 좌=설계 환경의 변화, 우=GEN NX의 접근}\n' +
  '5) shot — 고급 해석: {title(**강조**),sub,img:"gennx-1.jpg",rows 3~4개:[{tag(짧은 영문),text}] — 시공단계·시간이력·비선형·좌굴(공식 정보),caption(화면 설명 한 줄)}\n' +
  '6) shot — API·자동화: {title(**강조**),sub,img:"gennx-4.jpg",rows 3~4개:[{tag,text}] — Excel·Python 자동화·Grasshopper 플러그인·MIDAS Pro(예정),caption}\n' +
  '7) bignum — 핵심 가치 4: {items 4개:[{no,title,desc}] — 설계기준 대응·고급 해석·4K 작업환경·API 확장}\n' +
  '8) refcards — 적용 사례: {items 3개:[{title(프로젝트명 영문),tag(해석 키워드 대문자),desc(공식 사례 설명 요약)}],source:"midasuser.com — GEN NX Application Cases"}\n' +
  '9) beforeafter — {title,cols 2개:[{tag:"BEFORE|AFTER",items 4개}] — 단절된 도구·반복 입력 vs 하나의 플랫폼·자동화}\n' +
  '10) closing — {title(마지막 줄 **볼드**),band(참석 유도 한 줄),label(행사명),date(첨부의 일시·장소)}\n' +
  '각 타입의 필드: ' + MACHINE_FIELD_DOC + ' | shot:{title,sub?,img("gennx-1.jpg"|"gennx-3.jpg"|"gennx-4.jpg"|"gennx-s1.jpg"),rows:[{tag,text}],caption?}\n' +
  '규칙: 모든 문구는 lang 언어로(영문 라벨·챕터명 제외 한국어 혼용 절대 금지). 인명·고유명사는 원문 표기 그대로. ' +
  '**굵게** 장당 1~2회, 이모지 금지, 번호 자동 부여(재기입 금지), length 무관 정확히 10장.\n' + GENNX_FACTS;

const SFMI_SYSTEM =
  '너는 시니어 발표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + SFMI_USE_DOC + '\n' +
  '각 타입의 필드: ' + SFMI_FIELD_DOC + '\n' +
  '규칙: 1장 cover. 2장 statement(선언) 또는 toc. toc의 items는 divider와 1:1. ' +
  '챕터마다 divider(title=영문 1~3단어 대문자 — 아웃라인 스트로크, lead=국문 헤드라인. 챕터 컬러는 순서 자동) 후 그 챕터 본문 장들. ' +
  '본문 장은 밀도 있게 — section은 points 3~4개, 장 마무리 note(하단 풋라인 문장, **강조** 1회)를 적극 넣는다. ' +
  '수치가 있으면 stats(링 도넛)/kpi로 시각화(값은 plan의 실제 수치). 데모·발표 안내는 highlight, 진행 현황은 board/media. ' +
  'plan의 구체 정보는 반드시 반영(플레이스홀더 금지). 마지막은 closing(다음 행동 명시). ' +
  '총 장수는 length를 따른다(목차·간지 포함): short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.' +
  '작법 규칙(엄수): 한 장에 한 메시지 — 메시지가 둘이면 장을 나눈다. 제목만 이어 읽어도 논리가 성립하게. ' +
  '첫 3장 안에 "왜 지금 이 이야기인가"가 나오고, 마지막에는 다음 행동을 명시한다. ' +
  '연속 3장 같은 타입·골격 반복 금지 — 풀블리드·타입온리·데이터 장을 섞어 리듬을 만들고, 밀도 높은 장 뒤엔 숨 쉬는 장을 둔다. ' +
  '수치·인용에는 출처를 붙이고, 추정치는 "약/추정"으로 확정과 구분한다. 근거 없는 장식용 수치·게이지 금지. ' +
  '제목·리드는 의미 단위로 줄바꿈(\\n)한다 — 어절 중간에서 끊지 않는다. ' +
  '모든 장의 title에는 핵심 어구 한 곳을 **굵게**로 강약을 준다(문장 전체 굵게 금지). ' +
  '넘버 리스트의 번호(01·02…)는 자동 부여된다 — head·label 텍스트에 번호를 다시 쓰지 말 것.';

/* naver 팩(Design AX Line) — 독자 타입 체계: 직각·라인·챕터 컬러 보고서. packs.naver.js CATALOG와 동기 */
const NAVER_USE_DOC =
  'cover(표지): 첫 장 — 타이틀·밴드 문구·크레딧 | ' +
  'statement(대형 문장): 그린 풀블리드 선언·전환 | ' +
  'toc(목차): 표지 다음 장, 챕터 리스트(divider와 1:1) | ' +
  'divider(간지): 챕터 시작 전환 장 — ch(1~5)가 챕터 컬러를 정한다 | ' +
  'section(본문 표준): 헤드라인+설명 행 — 개념·배경·맥락 | ' +
  'cards(N열 카드): 동급 항목 2~4개 비교·나열 | ' +
  'split(좌우 분할): 설명+시각물(큐브 그래픽/체크 리스트/대형 수치) | ' +
  'stats(수치): 대형 수치·도넛+게이지 비교 | ' +
  'media(이미지 증빙): 제품 화면·데모 캡처 크게 | ' +
  'roadmap(로드맵): 단계·일정 흐름(현재 강조) | ' +
  'bigstat(단독 대형 수치): 숫자 하나로 임팩트 | ' +
  'kpi(수치 그리드): 지표 2~4개 요약 | ' +
  'table(표): 열 고정 데이터 나열 | ' +
  'timeline(타임라인): 연혁·마일스톤(on=현재) | ' +
  'milestone(마일스톤): 기간 계획 간트 — 단계 카드+월축 계단 바, 일정·완료 기준 중심일 때 | ' +
  'process(프로세스): 입력→처리→출력 단계 화살표 | ' +
  'compare(비교): 전/후·A vs B 두 패널 | ' +
  'quote(인용): 발언·선언 하나를 크게 | ' +
  'position(포지셔닝): 흐름 속 우리 위치, 3패널 중앙 강조 | ' +
  'checklist(체크리스트): 확인·완료 항목 나열 | ' +
  'highlight(하이라이트): 챕터컬러 풀블리드 강조 장 — 데모·핵심 안내, 챕터 중간 임팩트 | ' +
  'board(현황 보드): 진행 중 작업 요약 — 좌 리드+틴트 카드 2, 우 보조 리스트 | ' +
  'lineup(라인업): 제품·에이전트 구성 — 좌 다이아 그래픽, 우 리스트(dim=후보) | ' +
  'branch(분기): 하나→여럿 구조(조직·영역 분류) | ' +
  'closing(마무리): 인사+연락처';
const NAVER_FIELD_DOC =
  'cover:{label?(상단좌 문서 라벨),date?("2026 · 07"),eyebrow?("PROLOGUE"류),title(3톤 조합: **굵게**·__회색 흐림__),sub?,band?(좌하단 그린 밴드 문구 — 비유 한 줄, **강조**),docLabel?(하단좌),team?(하단우)} | ' +
  'statement:{title(**굵게** 조합),sub?,cols?:[{tag(영문 라벨),text("A → **B**" 비교)}](2개)} | ' +
  'toc:{title?,items:[{no?,label(영문 대문자 챕터명),desc(한 줄 메시지, **강조**),pages?:"04 — 08"}]} | ' +
  'divider:{ch:1~5,no?:"01",title(영문 대문자),lead(핵심 문장 — **강조** 권장),text?(보조 설명 2~3문장),items?:[{head,text}](넘버 리스트 2~3개),note?(하단 주석 한 줄, **강조** 가능)} | ' +
  'section:{title,listTitle?,points?:[{head?,text}],text?,points2?:[{head?,text}]+listTitle2?(2열 대비 리스트),aside?:{title,items:[str]},summary?} | ' +
  'cards:{title,cols?:2~4,variant?:"brand"(사례·기업 카드)|"tile"(틴트 면 카드 — 구성 요소·산출물),banner?:true(상단 컬러 밴드 헤더),cards:[{head,text?,tone?:"on|dim",tag?}],summary?,footnote?(우하단 출처 각주)} | ' +
  'split:{title,listTitle?,text?,points?:[{head?,text}],panel?:{kind:"iso|list|stat|question",items?:[str],value?,label?,text?},side?:"left",summary?} | ' +
  'stats:{title,big?:{value,label},donut?:{pct:0~100,value?,label?},bars?:[{label,pct:0~100,value?,on?:true}],summary?} | ' +
  'media:{title,image?:{label},caption?,summary?} | ' +
  'roadmap:{title,steps:[{when,head,text?,state?:"done|now|next"}],summary?} | ' +
  'bigstat:{title,value,caption?,summary?} | ' +
  'kpi:{title,cols?:2~4,items:[{value,label,desc?,tone?:"on"}],summary?} | ' +
  'table:{title,columns:[str],rows:[{cells:[str]}],summary?} | ' +
  'timeline:{title,items:[{when,head,text?,on?:true}],summary?} | ' +
  'milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),caption?,bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[월 라벨 4~6],note?} | ' +
  'process:{title,steps:[{head,text?,tag?}],accent?:강조인덱스,summary?} | ' +
  'compare:{title,items:[{head,points:[str],tone?:"on|dim"}](2개),summary?} | ' +
  'quote:{text,by?,summary?} | ' +
  'position:{title,panels:[{tag?,head,text?,tone?:"on"}](3개),summary?} | ' +
  'checklist:{title,items:[str],cols?:1~2,summary?} | ' +
  'highlight:{title(**굵게**),items:[{head,text?}](2~3개),note?(**강조**),noteLabel?,footnote?} | ' +
  'board:{title(**굵게**),lead?:{label,text(**강조**)},cards:[{tag,head,text?}](2개),side?:{title,items:[str],foot?:[str]},summary?} | ' +
  'lineup:{title?,badge?,name?,items:[{head(영문 대문자),tag?,text,state?:"dim"}],summary?} | ' +
  'branch:{title,lead?:{label,text},branches:[{label,head,text?}],summary?} | ' +
  'closing:{title,sub?,contacts?:[{k,v}]}';
const NAVER_SYSTEM_FREE =   // [시연 잠금 해제 시 복귀용] 자유 구성 원본
  '너는 시니어 발표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + NAVER_USE_DOC + '\n' +
  '각 타입의 필드: ' + NAVER_FIELD_DOC + '\n' +
  '규칙: 1장 cover, 2장 toc(items의 label=각 divider title과 1:1). ' +
  '챕터마다 divider(ch=1부터 등장 순서대로, title=영문 대문자 짧게 예 "WHY NOW", no="01"…) 후 그 챕터 본문 장들. ' +
  'divider는 lead 한 줄로 끝내지 말 것 — text(보조 설명 2~3문장) 또는 items(넘버 리스트 2~3개, 챕터에서 다룰 근거·범위)로 채우고 필요하면 note 한 줄. ' +
  '챕터 컬러 규칙(엄수): 컬러는 divider의 ch가 정하고, 그 챕터의 모든 하위 본문 장은 같은 컬러를 자동 상속한다 — 본문 장에 ch를 절대 쓰지 말 것(다른 챕터 컬러 교차 금지). ' +
  'title·lead·summary에서 **단어** 마크업으로 핵심어만 굵게(장당 1~2회, 과용 금지). 이모지 금지. ' +
  '본문 장은 밀도 있게 — section엔 listTitle+points(3개 내외)+가능하면 aside, split은 question 패널을 문제 제기 장에 적극 활용, 사례·벤치마크 장은 cards(variant brand, banner true). ' +
  '본문 장(section/cards/split/stats)에는 가능하면 summary("SO WHAT" 정리 문장, 마무리 구절 **굵게**)를 넣는다. ' +
  '수치가 있으면 stats로 시각화(값은 plan의 실제 수치). plan의 구체 정보는 반드시 반영(플레이스홀더 금지). 마지막은 closing. ' +
  '총 장수는 length를 따른다(목차·간지 포함): short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.' +
  '작법 규칙(엄수): 한 장에 한 메시지 — 메시지가 둘이면 장을 나눈다. 제목만 이어 읽어도 논리가 성립하게. ' +
  '첫 3장 안에 "왜 지금 이 이야기인가"가 나오고, 마지막에는 다음 행동을 명시한다. ' +
  '연속 3장 같은 타입·골격 반복 금지 — 풀블리드·타입온리·데이터 장을 섞어 리듬을 만들고, 밀도 높은 장 뒤엔 숨 쉬는 장을 둔다. ' +
  '수치·인용에는 출처를 붙이고(footnote 등), 추정치는 "약/추정"으로 확정과 구분한다. 근거 없는 장식용 수치·게이지 금지. ' +
  '제목·리드는 의미 단위로 줄바꿈(\\n)한다 — 어절 중간에서 끊지 않는다. ' +
  '넘버 리스트의 번호(01·02…)는 자동 부여된다 — head·label 텍스트에 번호를 다시 쓰지 말 것.';
/* [시연 고정] naver(Design AX Line) = "PPT 템플릿 제작 요청" 1~10장 스켈레톤 잠금.
   타입·순서·장수 불변, 텍스트만 브리프로 채움. 해제 = NAVER_SYSTEM_FREE로 되돌리기. */
const NAVER_SYSTEM =
  '너는 시니어 발표 기획자다. 브리프로 프레젠테이션 슬라이드 덱을 만든다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '[템플릿 고정 모드] 정확히 아래 10장을 이 순서·이 타입으로 만든다. 타입·순서·장수 변경 절대 금지 — 각 장의 텍스트 필드만 브리프·첨부 내용으로 새로 쓴다:\n' +
  '1) cover — {label(상단좌 영문 시스템명),date("2026 · 08" 형식),eyebrow:"PROLOGUE",title(2줄 \\n, 3톤: 첫 줄 보통+둘째 줄 **굵게**+꼬리 __회색 흐림__),band(비유 한 줄 2행 \\n, 둘째 행 **강조**),docLabel(하단좌 보고명),team(하단우 팀명)}\n' +
  '2) statement — {title(영문 대형 2줄 \\n, 둘째 줄 **굵게**),sub(2문장 \\n — lang 언어로),cols 정확히 2개:[{tag(영문 라벨),text("A → **B**" 전환)}]}\n' +
  '3) section — 결론 요약: {title(2줄 \\n, 둘째 줄에 **핵심 강조**),text(리드 한 문장 — **강조** 1회),listTitle(좌 리스트 제목),points 3개:[{text}],listTitle2(우 리스트 제목),points2 3개:[{text}]}\n' +
  '4) toc — {title(영문 짧게, 예 "PGWO Flow"류 흐름명),items 정확히 5개:[{no,label(영문 대문자 한 단어),desc(한 줄),pages:"05 – 06" 형식}]}\n' +
  '5) divider — {ch:1,no:"01",title(영문 대문자 2줄 \\n, 예 "WHERE\\nIT HURTS"),lead(질문형 핵심 문장, **강조**),items 1~2개:[{head,text}]}\n' +
  '6) table — 1챕터 본문: {title(2줄 \\n, **강조** 1회),columns 2개(브리프 성격에 맞는 대비 축 — 예: 현상/문제, 발표자/핵심 메시지, 이전/이후),rows 4~5개:[{cells:[좌,우]}]}\n' +
  '7) divider — {ch:2,no:"02",title(영문 대문자 2줄, 예 "WHAT\\nWE GAIN"),lead(**강조**),items 2개:[{head,text}]}\n' +
  '8) process — 방법·사이클 도식: {title(2줄 \\n, **강조**),steps 정확히 4개:[{tag(영문 또는 한 글자 키워드),head(단계명 \\n 가능),text(한 줄)}],accent:2} — 브리프의 방법론·흐름을 4단계로 분해\n' +
  '9) cards — 핵심 항목 카드: {title(2줄 \\n, **강조** 1회 — 반드시 채움),cols:4~5,cards 4~5개:[{tag(부제 — 역할·발표자·주제 등),head(이름/항목명),text(1~2문장)}]} — banner·variant 쓰지 않음\n' +
  '10) stats — 성과·기대 지표 그래프: {title(2줄 \\n, **강조**),donut:{pct(0~100),label},bars 3개:[{label,pct,value?,on?:true(1개만)}],summary(SO WHAT 한 문장, **강조**)} — 수치는 브리프 근거 우선, 없으면 목표치임이 드러나는 라벨(목표·Target)로\n' +
  '각 타입의 필드: ' + NAVER_FIELD_DOC + '\n' +
  '규칙: 브리프·첨부([첨부 문서])가 1차 소스 — 실제 내용으로 채우고 플레이스홀더 금지. 인명·팀명·고유명사는 첨부 표기 그대로(임의 음차·재번역 금지). ' +
  '챕터 컬러는 divider의 ch가 정한다(1·2·3 고정). 본문 장에 ch 금지. ' +
  '**굵게**는 장당 1~2회. 이모지 금지. 번호(01·02…)는 자동 부여 — head·label에 번호 재기입 금지. ' +
  '제목·리드는 의미 단위 \\n 줄바꿈. length 값과 무관하게 정확히 10장. 문구 언어는 lang을 따른다(영문 라벨·챕터 타이틀은 영문 유지).';

const PITCH_EDIT_SYSTEM =
  '너는 프레젠테이션 편집자다. 현재 덱(slides 배열)과 사용자 지시를 받아 덱을 수정한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·설명 문장 금지.\n' +
  '형식: {"slides":[...수정 후 전체 슬라이드 배열...],"message":"<사용자에게 보여줄 한 줄 요약>"}\n' +
  '슬라이드 스키마: ' + PITCH_FIELD_DOC + '\n' +
  '할 수 있는 것: 문구·수치·톤 수정, 슬라이드 추가·분할·삭제·순서 변경 — 전부 가능. 지시대로 실행하라.\n' +
  '규칙:\n' +
  '- 지시와 무관한 슬라이드는 원본 그대로 복사해 유지(임의 수정 금지). _pos/_hide/_fmt/_z/_grp 같은 밑줄 키도 그대로 보존.\n' +
  '- 새로 만드는 슬라이드는 실제 내용으로 채운다(플레이스홀더 금지). 기존 덱의 맥락·톤을 따른다.\n' +
  '- 일부 장만 바뀌는 요청(장 추가·삭제·한두 장 수정)은 전체 배열 대신 바뀐 부분만 출력: {"ops":[{"op":"insert","at":인덱스,"slide":{...}}|{"op":"replace","at":인덱스,"slide":{...}}|{"op":"remove","at":인덱스}],"message":"..."} — at은 0부터(두 번째 장 앞에 삽입=at 1). 긴 덱을 전부 다시 쓰다 응답이 잘리는 사고를 막는다. 여러 장이 광범위하게 바뀔 때만 slides 전체 배열 사용.\n' +
  '- 덱은 1~24장.\n' +
  '- 디자인(색·폰트·크기·배치·테마) 요청만 예외: slides를 null로 하고 message에 "디자인은 스타일 팩에서 일괄 관리돼요. 내용·구성 수정을 말씀해주세요." 취지로 안내.\n' +
  '- 발표와 무관한 요청이면 slides null + 정중히 수정 요청을 유도.\n' +
  '- message는 {LANG} 한두 문장, 무엇을 했는지 구체적으로.';

/* MIDAS GEN NX 공식 제품 팩트 — midasuser.com/en/product/gen-nx 실측 추출(2026-08).
   GEN NX 관련 브리프에서 소개·기능 장을 채울 1차 지식. 무관한 브리프면 무시된다. */
const GENNX_FACTS =
  '[MIDAS GEN NX 공식 제품 정보 — 브리프가 MIDAS GEN NX 관련일 때 소개·기능·가치 장에 이 사실만 사용(지어내기 금지), 무관하면 무시]\n' +
  '- 포지셔닝: The Next Generation of Structural Design — "GEN NX × API × AI. Faster analysis. Smarter design. More flexible workflows."\n' +
  '- Global Design Codes: 글로벌 재료·단면·설계 기준 내장, 반복 입력 축소·코드 기반 설계 검토 가속\n' +
  '- Advanced Analysis: 시공단계(construction stage)·시간이력(time-history)·비선형(nonlinear) 해석을 한 워크플로우에서\n' +
  '- Enhanced Workspace: 4K 대응 그래픽·최적화 인터페이스, 장시간 검토에도 선명한 모델·결과 확인\n' +
  '- API Integration: Excel·Python·사내 시스템 연동, 입력·해석·리포트 자동화\n' +
  '- Plug-in Workflow: Grasshopper 연동 — 파라메트릭 모델링과 구조해석 연결, 복잡 형상 대안 비교 가속\n' +
  '- MIDAS Pro(예정): GEN NX 안의 AI 가이드 — 기능·해석 조건·기술 정보 탐색 지원\n' +
  '- 공식 카피(KO): "차세대 구조 설계의 시작", "복잡한 구조해석은 더 빠르게, 설계 워크플로우는 더 유연하게"\n' +
  '- 적용 사례(공식): Beijing Capital Airport T3(장스팬 곡면 지붕 — FEM 선형 정적해석·노드 로컬축 반력) · Dongdaemun Design Plaza(비정형 곡면 — 응답스펙트럼 동적해석) · Shanghai Center(120° 비틀림 초고층 — 시공단계 크리프·건조수축, 등가풍하중) · City Center & Hard Rock Hotel(DXF 비정형 모델 — 시공단계·보행진동 시간이력)\n';

/* 웹(랜딩/웹사이트) 초안 — 모든 필드를 채운다. 브리프에 근거 없는 항목은
   그럴듯한 예시로 채우되 assumed 목록에 표시 → 스튜디오가 "임의로 채운 부분" 안내. */
const WEB_SYSTEM =
  '너는 시니어 웹 카피라이터 겸 콘텐츠 기획자다. 브리프로 제품 소개 페이지의 콘텐츠 초안을 만든다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"productName":str,"tagline":str,"subcopy":str,"primaryCta":str,' +
  '"features":[{"title":str,"desc":str}],"stats":[{"value":str,"label":str}],' +
  '"bannerText":str,"bannerCta":str,"footerLinks":[str],"footerCopyright":str,"assumed":[str],' +
  '"sessions":[{"time":str,"title":str,"by":str}],"eventDate":str|null,"eventPlace":str|null,"deadline":str|null,' +
  '"faq":[{"q":str,"a":str}],"ctaTitle":str|null,"ctaSub":str|null,' +
  '"pages":[{"name":str,"type":"product"|"features"|"pricing"|"faq"|"contact"|"manual"|"blog"|"landing"|"event","tagline":str,"subcopy":str,' +
  '"features":[{"title":str,"desc":str}]}]}\n' +
  '규칙:\n' +
  '- 모든 필드를 빠짐없이 채운다. 페이지는 완성된 모습으로 나가야 한다.\n' +
  '- [최우선] 브리프에 첨부 문서([첨부 문서: ...])가 있으면 그 내용이 1차 소스다. 세션 구성·발표 제목·날짜·장소·연사·수치 등\n' +
  '  문서에 있는 실제 정보를 그대로 반영하고, 문서와 무관한 일반론으로 채우지 마라.\n' +
  '- 세미나·행사·이벤트 집객 페이지면: sessions(시간표 — 브리프의 발표/세션을 time·title·by로), eventDate(일시 문구),\n' +
  '  eventPlace(장소, 줄바꿈 \\n 허용), deadline(신청 마감 시각 ISO8601, 예 2026-09-10T18:00:00+09:00 — 근거 있을 때만),\n' +
  '  faq(브리프 근거 3~5개, 근거 없으면 행사 성격에 맞는 예시 2~3개+assumed에 "faq"),\n' +
  '  ctaTitle/ctaSub(신청 유도 카피)를 채운다. 행사 아닌 일반 제품 페이지면 sessions=[]·eventDate=null·eventPlace=null·deadline=null·faq=[].\n' +
  '- 세미나·행사·프로모션 랜딩의 productName(상단 서브텍스트·GNB에 노출)은 제품명 그대로가 아니라 브랜드+행사 성격+연도의 행사·캠페인명으로 짓는다.\n' +
  '  예: "MIDAS Global Promotion 2026", "Civil NX Seminar 2026". 제품명 자체는 tagline·subcopy 본문에서 언급한다.\n' +
  '- MIDAS 제품명 표기: GEN NX는 항상 "MIDAS GEN NX"로 쓴다.\n' +
  '- pages = 사이트의 메인홈 외 하위 페이지(IA). kind=multi이고 브리프에 메뉴·페이지 구성(IA)이 드러날 때만 채운다.\n' +
  '  브리프에 IA 언급이 없거나 kind=single이면 반드시 빈 배열 []. 지어내지 마라.\n' +
  '  name=메뉴에 걸릴 이름(2~8자), type=성격이 가장 가까운 것, tagline/subcopy=그 페이지 히어로 문구,\n' +
  '- 페이지 유형별 추가 필드(해당 유형 페이지 객체 안에, 브리프에 근거 있을 때 채움):\n' +
  '  product:{overview:{title,text,points:[str]},featureRows:[{title,desc,points:[str]}],compare:{them,rows:[{k,us,them}]}} | ' +
  'faq·pricing·features:{faq:[{q,a}]} | contact:{form:{title,sub,fields:[str],submit},infoCards:[{title,text}]} | ' +
  'manual:{docs:[{title,desc}],steps:[{title,text}]} | blog:{posts:[{title,desc,date,tag}]} | ' +
  'event:{overview:{title,text,points:[str]},intro:{title,text},agenda:[{time,title,desc}],speakers:[{name,role,desc}],notices:[{title,text}]} | 공통:{testimonials:[{text,by}]}\n' +
  '- variants(섹션 표현 변형, 최상위·각 페이지 객체에 선택): {hero:"center|split|screenshot|stat", pagehero:"banner|breadcrumb", overview:"split|center|problem", intro:"center|quote", featurerows:"zigzag|numbered|checks", feature:"icons|cards|bento|list", gallery:"grid|mosaic", stats:"numbers|kpi|big", compare:"table|beforeafter|cards", testimonial:"cards|single|logos", steps:"horizontal|vertical|cards", agenda:"timeline|table", faq:"accordion|twocol|category", form:"center|split", cta:"banner|simple|cards", bloglist:"cards|list|featured", doclist:"cards|list", pricing:"cards|table"} — 콘텐츠 성격에 맞게(수치 강조면 hero:stat, 기능 많으면 feature:bento). 페이지마다 똑같은 조합 반복 금지.\n' +
  '  features=그 페이지 주제에 맞는 카드 3개(메인홈 것과 겹치지 않게). 최대 6개 페이지, 메인홈은 제외.\n' +
  '- productName은 브리프에 있는 실제 제품·서비스명을 그대로 쓴다. 브리프에 없어 지어냈다면 assumed에 "productName"을 넣어라.\n' +
  '- 브리프(특히 plan)에 근거 있는 건 그대로 반영. 근거 없는 항목은 제품 맥락에 맞는 그럴듯한 예시로 채운다.\n' +
  '- 예시로 채운(=브리프에 없던) 필드명을 assumed 배열에 넣는다. 예: ["stats","footerLinks"]. 전부 근거 있으면 [].\n' +
  '- 특히 stats처럼 지어낸 수치는 반드시 assumed에 포함(사용자가 실제 값으로 고치도록). 단, 브리프에 있는 실제 수치를 그대로 쓴 필드는 assumed에 넣지 않는다.\n' +
  '- features는 정확히 3개(제목 2~6단어+한 줄 설명). stats는 3개.\n' +
  '- footerLinks는 이용약관·개인정보처리방침 등 표준 3개 기본, footerCopyright는 "© 연도 제품명" 형태.\n' +
  '- 문구는 lang 값의 언어로(ko=한국어, en=영어). 톤은 간결·자신감, 과장 금지.\n' +
  '- tagline은 두 줄 구성(\\n으로 분리): 첫 줄=가벼운 도입구, 둘째 줄=핵심 메시지(화면에서 볼드로 강조됨). 각 줄 6~14자(영문 3~6단어). subcopy는 1~2문장.' + '\n' + GENNX_FACTS;

/* 인테이크 되묻기 — 브리프를 읽고 "생성 품질에 정말 필요한데 빠진 정보"만 0~2개 질문.
   이름/제품명도 브리프에서 추출(따로 폼으로 안 물음). 질문 없으면 빈 배열. */
/* UI 언어 → 사용자에게 보여줄 AI 문장(되묻기 질문·수정 결과 메시지)의 언어.
   초안 콘텐츠 언어(compose-web의 lang)와는 별개다. */
const UI_LANG = { ko: '한국어', en: '영어(English)', ja: '일본어(日本語)', zh: '중국어 간체(简体中文)' };
const uiLangName = (l) => UI_LANG[l] || UI_LANG.ko;

const INTAKE_SYSTEM =
  '너는 제작 브리프를 접수하는 시니어 PM이다. 사용자의 자유 브리프를 읽고,\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·설명 금지.\n' +
  '형식: {"name":str|null,"product":str|null,"questions":[{"key":str,"q":str,"opts":[str],"multi":bool}]}\n' +
  '규칙:\n' +
  '- name=프로젝트/페이지 이름 후보, product=제품·서비스명. 브리프에서 추출 가능할 때만, 없으면 null.\n' +
  '- questions는 결과물 품질에 정말 필요한데 브리프에 없는 것만 최대 3개. 브리프가 충분하면 빈 배열 [].\n' +
  '- 좋은 질문 예: 발표 목적·청중 유형·선호 톤(kind=ppt), 대상 고객·유도할 행동(kind=web), 강조할 수치가 있는지.\n' +
  '- opts=그 질문에 대한 구체적 선택지 3~4개. 브리프 맥락에 맞게 서로 다른 방향으로("기타"는 넣지 마라 — UI가 붙인다).\n' +
  '- multi=복수 응답이 자연스러운 질문이면 true(예: 강조하고 싶은 내용, 포함할 요소). 하나만 고르는 게 맞으면 false(예: 청중, 목적, 톤).\n' +
  '  예: 청중 질문이면 ["대학생·취준생","주니어 디자이너","실무 디자이너","리더·경영진"]처럼 브리프 주제에 맞춘 구체 선택지.\n' +
  '- 브리프에 이미 있는 걸 다시 묻지 마라. 디자인 취향은 묻지 마라(스타일은 따로 고름). 분량도 묻지 마라(따로 고름).\n' +
  '- q는 정중한 한 문장. key는 영문 스네이크(예: target_audience). opts 각 항목은 내용과 어울리는 이모지 1개로 시작한다(예: "📈 매출 성장").\n' +
  '[언어 — 최우선 규칙] q와 opts의 모든 항목·name·product까지, 사용자에게 보이는 모든 문자열을 {LANG}로 작성한다.\n' +
  '브리프나 첨부 문서가 다른 언어로 쓰여 있어도 예외 없이 {LANG}로 쓴다(내용은 문서에서, 표기는 {LANG}). 브랜드·고유명사만 원문 유지.';

/* 출력물 로컬라이징 — 덱/사이트 JSON의 텍스트 값만 목표 언어로. 구조·시스템 값은 불변 */
const TRANSLATE_SYSTEM =
  '너는 전문 로컬라이저다. 받은 JSON 안의 사용자 노출 텍스트 값을 전부 {TO}로 번역해, 완전히 같은 구조의 JSON으로 돌려준다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·설명 문장 금지. 형식: {"payload":{...입력과 같은 구조...}}\n' +
  '규칙:\n' +
  '- 키 이름·배열 길이·객체 구조·숫자·불리언·null은 절대 바꾸지 않는다. 문자열 값만 번역한다.\n' +
  '- 텍스트 안의 마크업(**굵게**, __딤__)과 줄바꿈(\\n), "A → B" 화살표는 자리를 살려 그대로 유지한다.\n' +
  '- 브랜드·제품·고유명사(MIDAS, ONSITE 등)는 번역하지 않는다.\n' +
  '- type·id·kind·variants·stylePack·tone·state(on 등) 같은 시스템 열거값은 절대 번역하지 않는다.\n' +
  '- 이미 전부 영문 대문자인 짧은 디자인 라벨("01 — WHY NOW", "BEFORE", "NOW" 류 kicker·tag·label)은 영문 그대로 둔다.\n' +
  '- 번역 톤: 발표·마케팅 문맥에 맞는 자연스러운 {TO}. 직역투 금지. 길이는 원문과 비슷하게(레이아웃 유지).';

/* 웹/랜딩 자연어 수정 — 사이트 콘텐츠 JSON을 지시대로 고쳐 전체를 돌려준다.
   디자인(색·폰트·배치) 지시는 콘텐츠를 건드리지 않고 message로 안내(스타일 팩 소관). */
const WEB_EDIT_SYSTEM =
  '너는 웹 콘텐츠 편집자다. 현재 사이트 콘텐츠 JSON과 사용자 지시를 받아, 지시대로 수정한 결과를 돌려준다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"site":{...수정된 전체 사이트 JSON...},"message":"무엇을 어떻게 바꿨는지 {LANG} 한두 문장"}\n' +
  '규칙:\n' +
  '- site는 입력 JSON과 같은 구조·같은 필드 구성을 유지하고, 지시에 해당하는 부분만 바꾼다. 나머지 필드는 값 그대로 복사한다.\n' +
  '- 필드 참고: productName(제품명), tagline(히어로 타이틀), subcopy(히어로 설명), primaryCta(대표 버튼), features[](기능 카드 {title,desc}), stats[](수치 {value,label}), bannerText/bannerCta(하단 배너), footerLinks[], footerCopyright, pages[](하위 페이지 — 같은 구조 반복), variants(섹션 표현 변형), 유형별 필드(overview·featureRows·faq·form·agenda·speakers·posts·docs·steps·testimonials 등).\n' +
  '- 콘텐츠(문구·수치·항목 추가/삭제/순서·페이지 문구)만 수정한다. 색·글꼴·배치 같은 디자인 지시면 site를 그대로 두고 message에 "디자인은 스타일 팩이 자동 관리해요"라고 안내한다.\n' +
  '- 항목을 추가할 땐 이웃 항목과 같은 구조로. 근거 없는 수치 창작 금지 — 지시나 기존 값에 근거해서만.\n' +
  '- 지시가 특정 페이지를 가리키면(예: "요금 페이지") pages[]에서 그 페이지를 찾아 수정한다.\n' +
  '- message는 {LANG}로, 무엇을 했는지 구체적으로(예: "hero 영역의 타이틀을 더 임팩트 있게 바꿨어요!").';

/* 내용 수정(채팅) — 전체 slides 교체 계약. 내용·구조(추가/분할/삭제/순서) 전부 허용, 디자인만 거절 */
const EDIT_SYSTEM =
  '너는 프레젠테이션 편집자다. 현재 덱(slides 배열)과 사용자 지시를 받아 덱을 수정한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·설명 문장 금지.\n' +
  '형식: {"slides":[...수정 후 전체 슬라이드 배열...],"message":"<사용자에게 보여줄 한 줄 요약>"}\n' +
  '슬라이드 스키마: ' + SCHEMA_DOC + '\n' +
  '할 수 있는 것: 문구·수치·톤 수정, 슬라이드 추가·분할·삭제·순서 변경, 한 장을 여러 장으로 상세화 — 전부 가능. 지시대로 실행하라.\n' +
  '규칙:\n' +
  '- 지시와 무관한 슬라이드는 원본 그대로 복사해 유지(임의 수정 금지).\n' +
  '- 새로 만드는 슬라이드는 실제 내용으로 채운다(플레이스홀더 금지). 기존 덱의 맥락·톤을 따른다.\n' +
  '- 일부 장만 바뀌는 요청(장 추가·삭제·한두 장 수정)은 전체 배열 대신 바뀐 부분만 출력: {"ops":[{"op":"insert","at":인덱스,"slide":{...}}|{"op":"replace","at":인덱스,"slide":{...}}|{"op":"remove","at":인덱스}],"message":"..."} — at은 0부터(두 번째 장 앞에 삽입=at 1). 긴 덱을 전부 다시 쓰다 응답이 잘리는 사고를 막는다. 여러 장이 광범위하게 바뀔 때만 slides 전체 배열 사용.\n' +
  '- 덱은 1~24장.\n' +
  '- 디자인(색·폰트·크기·배치·테마) 요청만 예외: slides를 null로 하고 message에 "디자인은 스타일 팩에서 일괄 관리돼요. 내용·구성 수정을 말씀해주세요." 취지로 안내.\n' +
  '- 발표와 무관한 요청이면 slides null + 정중히 수정 요청을 유도.\n' +
  '- message는 {LANG} 한두 문장, 무엇을 했는지 구체적으로.';

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const url = new URL(req.url);
    const route = url.pathname;
    const ROUTES = ['/compose', '/edit', '/compose-web', '/edit-web', '/translate', '/intake'];

    // ---- 공유 링크 조회 — GET /p/:id (스튜디오 "링크 만들기"로 발행된 페이지 서빙) ----
    if (req.method === 'GET' && /^\/p\/[A-Za-z0-9]{6,12}$/.test(route)) {
      let html = null;
      try { html = await env.PUB.get('p:' + route.slice(3)); } catch (e) {}
      if (!html) return new Response('<!doctype html><meta charset="utf-8"><title>Not found</title><body style="font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0"><p>이 링크는 만료됐거나 존재하지 않아요.</p>', { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
      return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-robots-tag': 'noindex' } });
    }

    // ---- 공유 링크 발행 — POST /publish {html,title} → {url} (LLM 미사용 — 일일 제한 제외) ----
    if (req.method === 'POST' && route === '/publish') {
      let pb;
      try { pb = await req.json(); } catch (e) { return json({ error: 'BAD_REQUEST' }, 400); }
      const html = typeof pb.html === 'string' ? pb.html : '';
      if (!html || html.length < 40) return json({ error: 'EMPTY_HTML' }, 400);
      if (html.length > 5 * 1024 * 1024) return json({ error: 'TOO_LARGE', message: '페이지가 5MB를 넘어 링크를 만들 수 없어요. 큰 이미지를 줄여주세요.' }, 413);
      const abc = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
      let id = '';
      const rnd = crypto.getRandomValues(new Uint8Array(8));
      for (let i = 0; i < 8; i++) id += abc[rnd[i] % abc.length];
      try { await env.PUB.put('p:' + id, html, { expirationTtl: 60 * 60 * 24 * 90 }); }
      catch (e) { return json({ error: 'STORE_FAIL' }, 500); }
      return json({ id, url: url.origin + '/p/' + id, expiresDays: 90 });
    }

    if (req.method !== 'POST' || ROUTES.indexOf(route) < 0) return json({ error: 'NOT_FOUND' }, 404);

    // ---- IP당 일일 제한 (KV) ----
    const ip = req.headers.get('cf-connecting-ip') || 'unknown';
    const day = new Date().toISOString().slice(0, 10);
    const rlKey = `rl:${ip}:${day}`;
    let used = 0;
    try { used = parseInt(await env.RATE_KV.get(rlKey), 10) || 0; } catch (e) {}
    if (used >= DAILY_LIMIT) return json({ error: 'LIMIT', message: `오늘 사용 한도(${DAILY_LIMIT}회)를 모두 썼어요. 내일 다시 시도해주세요.` }, 429);

    // ---- 입력 검증 (전용 엔드포인트 — 임의 프롬프트 불가) ----
    let body;
    try { body = await req.json(); } catch (e) { return json({ error: 'BAD_REQUEST' }, 400); }
    const clip = (s, n) => String(s == null ? '' : s).slice(0, n);

    let system, userMsg;
    if (route === '/compose') {
      const safe = {
        title: clip(body.title, 200),
        message: clip(body.message, 500),
        audience: clip(body.audience, 200),
        purpose: clip(body.purpose, 300),
        plan: clip(body.plan, 16000),   // 자유 기획 텍스트 — 목차·수치·요구 전부 여기 담김
        length: clip(body.length, 10), // short|std|deep → 목표 장수
        outline: (Array.isArray(body.outline) ? body.outline : []).slice(0, 8).map((s) => clip(s, 120)),
      };
      if (!safe.title && !safe.message && !safe.plan && !safe.outline.length) return json({ error: 'EMPTY_BRIEF' }, 400);
      system = clip(body.pack, 10) === 'machine' ? MACHINE_SYSTEM : clip(body.pack, 10) === 'sfmi' ? SFMI_SYSTEM : clip(body.pack, 10) === 'pastel' ? PASTEL_SYSTEM : clip(body.pack, 10) === 'rams' ? RAMS_SYSTEM : clip(body.pack, 10) === 'naver' ? NAVER_SYSTEM : clip(body.pack, 10) === 'honors' ? HONORS_SYSTEM : clip(body.pack, 10) === 'pitch' ? PITCH_SYSTEM : SYSTEM;   // 팩별 스키마 — pitch/honors/naver는 카탈로그 기반 타입 선택
      // 덱 콘텐츠 언어 — UI 언어를 따른다(영어 시연 등). ko면 기존 시스템의 한국어 지시 그대로.
      const deckLang = clip(body.lang, 5) || 'ko';
      if (deckLang !== 'ko') system += '\n[출력 언어 — 최우선 규칙] 위 지시의 "한국어"와 무관하게, 모든 슬라이드 텍스트(제목·본문·리스트·캡션·note·인용)를 ' + uiLangName(deckLang) + '로 작성한다. 브랜드·고유명사는 원문 유지. 영문 챕터 라벨(label·tag 대문자류)은 그대로 영문.';
      userMsg = '브리프:\n' + JSON.stringify(safe, null, 2);
    } else if (route === '/intake') {
      const safe = { kind: clip(body.kind, 10), plan: clip(body.plan, 16000), lang: clip(body.lang, 5) || 'ko' };
      if (!safe.plan) return json({ error: 'EMPTY_BRIEF' }, 400);
      system = INTAKE_SYSTEM.replace(/\{LANG\}/g, uiLangName(safe.lang));
      userMsg = '브리프(kind=' + safe.kind + '):\n' + safe.plan +
        // 시스템 지시만으론 브리프 언어(예: 한국어 첨부)에 끌려감 — 유저 메시지 끝에도 못박는다(최근성)
        (safe.lang !== 'ko' ? '\n\n[OUTPUT LANGUAGE] The brief above may be in Korean, but you MUST write q and EVERY item in opts in ' + uiLangName(safe.lang) + '. Do not output Korean in q or opts.' : '');
    } else if (route === '/compose-web') {
      const safe = {
        product: clip(body.product, 100),
        name: clip(body.name, 200),
        purpose: clip(body.purpose, 300),
        plan: clip(body.plan, 16000),   // 자유 소개/기획 텍스트
        kind: clip(body.kind, 10),     // single|multi
        lang: clip(body.lang, 5) || 'ko',
      };
      if (!safe.plan && !safe.product && !safe.name) return json({ error: 'EMPTY_BRIEF' }, 400);
      system = WEB_SYSTEM;
      userMsg = '브리프:\n' + JSON.stringify(safe, null, 2) + '\n(올해 연도: ' + new Date().getFullYear() + ')';
    } else if (route === '/translate') {
      // 출력물 로컬라이징 — 덱({slides})이든 사이트든 JSON 구조 그대로, 텍스트 값만 목표 언어로
      const payload = body.payload && typeof body.payload === 'object' ? body.payload : null;
      const to = clip(body.to, 5) || 'en';
      if (!payload) return json({ error: 'BAD_REQUEST' }, 400);
      system = TRANSLATE_SYSTEM.split('{TO}').join(uiLangName(to));
      userMsg = 'JSON:\n' + clip(JSON.stringify(payload), 26000);
    } else if (route === '/edit-web') {
      // 웹/랜딩 자연어 수정 — 현재 사이트 콘텐츠 JSON 전체를 받아 지시대로 고친 전체를 돌려받는다(PPT /edit와 같은 계약)
      const site = body.site && typeof body.site === 'object' ? body.site : null;
      const instruction = clip(body.instruction, 800);
      if (!site || !instruction) return json({ error: 'BAD_REQUEST' }, 400);
      system = WEB_EDIT_SYSTEM.replace('{LANG}', uiLangName(clip(body.lang, 5) || 'ko'));
      userMsg = '현재 사이트 콘텐츠:\n' + clip(JSON.stringify(site), 26000) + '\n\n사용자 지시:\n' + instruction;
    } else { // /edit
      const slides = Array.isArray(body.slides) ? body.slides.slice(0, 24) : [];
      const instruction = clip(body.instruction, 800);
      if (!slides.length || !instruction) return json({ error: 'BAD_REQUEST' }, 400);
      system = (clip(body.pack, 10) === 'machine' ? PITCH_EDIT_SYSTEM.replace(PITCH_FIELD_DOC, MACHINE_FIELD_DOC) : clip(body.pack, 10) === 'sfmi' ? PITCH_EDIT_SYSTEM.replace(PITCH_FIELD_DOC, SFMI_FIELD_DOC) : clip(body.pack, 10) === 'pastel' ? PITCH_EDIT_SYSTEM.replace(PITCH_FIELD_DOC, PASTEL_FIELD_DOC) : clip(body.pack, 10) === 'rams' ? PITCH_EDIT_SYSTEM.replace(PITCH_FIELD_DOC, RAMS_FIELD_DOC) : clip(body.pack, 10) === 'naver' ? PITCH_EDIT_SYSTEM.replace(PITCH_FIELD_DOC, NAVER_FIELD_DOC) : clip(body.pack, 10) === 'honors' ? PITCH_EDIT_SYSTEM.replace(PITCH_FIELD_DOC, HONORS_FIELD_DOC) : clip(body.pack, 10) === 'pitch' ? PITCH_EDIT_SYSTEM : EDIT_SYSTEM).replace('{LANG}', uiLangName(clip(body.lang, 5) || 'ko'));
      userMsg = '현재 덱:\n' + clip(JSON.stringify(slides), 24000) + '\n\n사용자 지시:\n' + instruction;
    }

    // ---- Anthropic 호출 (키·모델·토큰 전부 서버 통제) ----
    // Anthropic은 홍콩 등 미지원 지역 IP를 403으로 차단하는데, 이 워커가 HKG 콜로에서
    // 실행되면 그 IP로 나가 실패한다. AI_GATEWAY 변수가 있으면 Cloudflare AI Gateway
    // (중앙 인프라 경유 — 지역 차단 안 걸림)를 통해 호출한다. wrangler.toml [vars] 참조.
    const ACCOUNT_ID = '96adc93fc6d5c8f28f6d11a7550c698d';
    const apiUrl = env.AI_GATEWAY
      ? `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${env.AI_GATEWAY}/anthropic/v1/messages`
      : 'https://api.anthropic.com/v1/messages';
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL, max_tokens: route === '/intake' ? 800 : MAX_TOKENS,   // 인테이크는 선택지 포함 800, 나머지는 상한 공용
        // 사고(thinking) 끔 — 문서 첨부 브리프에서 모델이 사고에 출력 예산을 다 써서
        // 덱 JSON이 빈손/3장 잘림으로 나오던 실사고. 덱 설계는 사고 없이 충분하다.
        thinking: { type: 'disabled' },
        system: system,
        messages: [{ role: 'user', content: userMsg }],
        // 생성 스트리밍 — 클라이언트가 슬라이드 제목을 실시간 표시("기다리는 맛"). compose 계열만.
        ...(body.stream === true && (route === '/compose' || route === '/compose-web') ? { stream: true } : {}),
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      return json({ error: 'UPSTREAM', status: res.status, detail: t.slice(0, 300) }, 502);
    }
    // 스트리밍 요청이면 Anthropic SSE를 그대로 통과 — 카운트는 시작 시점에 선차감
    if (body.stream === true && (route === '/compose' || route === '/compose-web')) {
      try { await env.RATE_KV.put(rlKey, String(used + 1), { expirationTtl: 90000 }); } catch (e) {}
      return new Response(res.body, { status: 200, headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', ...CORS } });
    }
    const data = await res.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');

    // 성공한 호출만 카운트 (TTL 하루+1h)
    try { await env.RATE_KV.put(rlKey, String(used + 1), { expirationTtl: 90000 }); } catch (e) {}

    return json({ text, remaining: DAILY_LIMIT - used - 1 });
  },
};
