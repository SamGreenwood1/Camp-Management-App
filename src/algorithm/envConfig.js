/**
 * Parses the UNTIS environment variable into an array of strings.
 * @param {string} envVar - The value of the UNTIS environment variable.
 * @returns {string[]} An array of unit names.
 */
export function parseUnits(envVar) {
  if (!envVar) {
    return [];
  }
  return envVar.split(',').map(unit => unit.trim());
}

/**
 * Parses the ACTIVITY_AREAS environment variable into a 2D array.
 * The format is "Department1:Area1,Area2;Department2:Area3,Area4".
 * @param {string} envVar - The value of the ACTIVITY_AREAS environment variable.
 * @returns {Array<[string, string[]]>} A 2D array of activity areas.
 */
export function parseActivityAreas(envVar) {
  if (!envVar) {
    return [];
  }
  const departments = envVar.split(';');
  return departments.map(dept => {
    const [deptName, areas] = dept.split(':');
    const areaList = areas.split(',').map(area => area.trim());
    return [deptName.trim(), areaList];
  });
}
