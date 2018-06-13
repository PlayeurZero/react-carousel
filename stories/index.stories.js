import React from 'react';

import { storiesOf } from '@storybook/react';

import Carousel from "../src/components/Carousel"

storiesOf('Carousel', module)
  .add('with some slides', () => {
    return (
      <div style={{ width: 800, height: 600 }}>
        <Carousel>
          <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
          <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
          <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
          <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
          <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
        </Carousel>
      </div>
  )});
