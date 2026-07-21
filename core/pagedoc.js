/**
 * @typedef {Object} PageDoc
 * @property {Object} [sharedFacts]
 * @property {SectionInstance[]} sections
 * @property {{title?: string, description?: string}} [meta]  페이지 메타 (title 등)
 *
 * @typedef {Object} SectionInstance
 * @property {string} type
 * @property {string} [variant]
 * @property {Object} [slotValues]
 */

/** @param {any} doc @returns {{ok: boolean, errors: string[]}} */
export function validatePageDoc(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object') {
    return { ok: false, errors: ['pageDoc must be an object'] };
  }
  if (!Array.isArray(doc.sections)) {
    errors.push('pageDoc.sections must be an array');
  } else {
    doc.sections.forEach((s, i) => {
      if (!s || typeof s.type !== 'string' || !s.type) {
        errors.push(`sections[${i}].type must be a non-empty string`);
      }
    });
  }
  return { ok: errors.length === 0, errors };
}
