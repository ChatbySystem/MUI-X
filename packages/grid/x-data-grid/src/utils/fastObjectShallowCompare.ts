const is = Object.is;

export function fastObjectShallowCompare<T extends Record<string, any> | null>(a: T, b: T) {
  if (a === b) {
    return true;
  }
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }

  let aLength = 0;
  let bLength = 0;

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable guard-for-in */
  for (const key in a) {
    aLength += 1;

    if (!(key in b)) {
      return false;
    }
    if (!is(a[key], b[key])) {
      return false;
    }
  }

  for (const _ in b) {
    bLength += 1;
  }
  /* eslint-enable no-restricted-syntax */
  /* eslint-enable guard-for-in */

  return aLength === bLength;
}
