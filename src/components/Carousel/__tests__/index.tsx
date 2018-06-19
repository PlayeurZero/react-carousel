import * as React from 'react'
import { shallow } from 'enzyme'

import Carousel from '../'

describe('<Carousel />', () => {
  it('renders <Carousel /> with 4 slides', () => {
    const wrapper = shallow((
      <Carousel>
        <Carousel.Slide>
          <img src="http://lorempicsum.com/simpsons/1600/900/1" style={{ maxWidth: '100%', height: '100%' }} />
        </Carousel.Slide>

        <Carousel.Slide>
          <img src="http://lorempicsum.com/simpsons/1600/900/2" style={{ maxWidth: '100%', height: '100%' }} />
        </Carousel.Slide>

        <Carousel.Slide>
          <img src="http://lorempicsum.com/simpsons/1600/900/3" style={{ maxWidth: '100%', height: '100%' }} />
        </Carousel.Slide>

        <Carousel.Slide>
          <img src="http://lorempicsum.com/simpsons/1600/900/4" style={{ maxWidth: '100%', height: '100%' }} />
        </Carousel.Slide>
      </Carousel>
    ))

    expect(wrapper.state().activeSlide).toBe(0)
  })

  it('renders <Carousel /> with one slide', () => {
    const wrapper = shallow((
      <Carousel>
        <Carousel.Slide>
          <img src="http://lorempicsum.com/simpsons/1600/900/1" style={{ maxWidth: '100%', height: '100%' }} />
        </Carousel.Slide>
      </Carousel>
    ))

    expect(wrapper.state().activeSlide).toBe(0)
  })
})
