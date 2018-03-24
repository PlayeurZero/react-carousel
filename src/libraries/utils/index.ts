type IClassConcatArgs = string | { [str: string]: boolean }

/**
 * Returns a string concatenated with given class.
 */
export const classConcat = (...args: IClassConcatArgs[]): string =>
  args.map((arg) => {
    if ('string' === typeof arg) { return arg }
    if ('object' === typeof arg) {
      return Object.keys(arg).filter((key) => arg[key] === true).join(' ')
    }
  }).filter((arg) => arg !== '').join(' ')

export const delayFallback = (callback, delay: number, marginOfError: number = 150) => {
  const func = (...args) => {
    clearTimeout(timer)
    callback(...args)
  }

  const timer = setTimeout(func, delay)

  return func
}
