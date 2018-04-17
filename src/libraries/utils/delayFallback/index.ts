/**
 * Execute the callback if it have not be called before delay passed.
 * It is useful if you trust a delayed callback that will never fire.
 * @param {(...args: any[]) => {}} callback
 * @param {number} delay
 * @param {number} [marginOfError=150]
 */
export default (callback: (...args: any[]) => {}, delay: number, marginOfError: number = 150) => {
  const func = (...args) => {
    clearTimeout(timer)
    callback(...args)
  }

  const timer = setTimeout(func, delay + marginOfError)

  return func
}
