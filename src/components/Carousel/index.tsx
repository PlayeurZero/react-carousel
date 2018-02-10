import * as React from 'react'

import { default as Carousel, IProps as ICarouselProps } from './components/Carousel'
import { default as Slide, IProps as ISlideProps } from './components/Slide'

interface ICarouselDecorator extends React.ComponentClass<ICarouselProps> {
  Slide: ISlideDecorator
}

interface ISlideDecorator extends React.ComponentClass<ISlideProps> {
}

export default Object.assign(Carousel, { Slide }) as ICarouselDecorator
