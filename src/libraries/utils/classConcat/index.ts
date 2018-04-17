type IClassConcatArgs = string | { [str: string]: boolean }

/**
 * Returns a string concatenated with given class.
 */
export default (...args: IClassConcatArgs[]): string =>
  args.map((arg) => {
    if ('string' === typeof arg) { return arg }
    if ('object' === typeof arg) {
      return Object.keys(arg).filter((key) => arg[key] === true).join(' ')
    }
  }).filter((arg) => arg !== '').join(' ')
