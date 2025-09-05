/**
 * Utility function for generating cabin names based on different strategies
 */

/**
 * Derives a cabin name based on a template or keyword
 * @param {Object} cabin - The cabin object
 * @param {string} template - The naming template or keyword
 * @returns {string} The derived cabin name
 */
export function deriveCabinName(cabin, template) {
  switch (template) {
    case 'existing':
      return cabin.name;
    case 'unit_initial_and_number':
      return `${cabin.unit.charAt(0).toUpperCase()}-${cabin.id.replace('cabin', '')}`;
    case 'full_unit_name_and_number':
      return `${cabin.unit}-${cabin.id.replace('cabin', '')}`;
    case 'generic_prefix_and_number':
      return `Cabin-${cabin.id.replace('cabin', '')}`;
    default:
      // Treat as a template string
      return template
        .replace('{unit_initial}', cabin.unit.charAt(0).toUpperCase())
        .replace('{cabin_id}', cabin.id.replace('cabin', ''));
  }
}
