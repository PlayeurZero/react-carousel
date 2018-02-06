export const classConcat = (...args) =>
  args.map((arg) => {
    if ('string' === typeof arg) { return arg }
    if ('object' === typeof arg) {
      return Object.keys(arg).filter((key) => arg[key] === true).join(' ')
    }
  }).filter((arg) => arg !== '').join(' ')
