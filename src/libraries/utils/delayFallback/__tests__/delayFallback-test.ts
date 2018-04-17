import delayFallback from '../'

describe('delayFallback(...)', () => {
  test('it should call done()', (done) => {
    expect(delayFallback(done, 100, 100))
  })
})
