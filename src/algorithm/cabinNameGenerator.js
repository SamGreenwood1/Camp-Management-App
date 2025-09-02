/**
 * Derives a cabin name based on the specified strategy.
 * @param {string} strategy - The naming strategy to use.
 * @param {object} cabin - The cabin object.
 * @param {string} unitName - The name of the unit the cabin belongs to.
 * @param {string} template - A template string for the 'template' strategy.
 * @returns {string} The derived cabin name.
 */
export function generateCabinName(strategy, cabin, unitName, template) {
  switch (strategy) {
    case 'unit_initial_and_number':
      return `${unitName.charAt(0)}${cabin.id.split('cabin')[1]}`;
    case 'full_unit_name_and_number':
      return `${unitName}-${cabin.id.split('cabin')[1]}`;
    case 'generic_prefix_and_number':
      return `Cabin-${cabin.id.split('cabin')[1]}`;
    case 'template':
      return template
        .replace('{unit_initial}', unitName.charAt(0))
        .replace('{cabin_id}', cabin.id.split('cabin')[1])
        .replace('{unit_name}', unitName);
    case 'existing_name':
    default:
      return cabin.name;
  }
}
