# React Carousel

A carousel that renders medias such as images or videos using React.

## Install

To install, run in a terminal&#x202f;:

```bash
# using npm
npm install --save playeurzero/react-carousel
# using yarn
yarn add playeurzero/react-carousel
```

### Install a specific version

```bash
# using npm
npm install --save playeurzero/react-carousel#v1.0.0
# using yarn
yarn add playeurzero/react-carousel#v1.0.0
```

## Usage

### Usage in TypeScript

```tsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Carousel from 'react-carousel'

ReactDOM.render(
  (
    <Carousel>
      <Carousel.Slide>Your content...</Carousel.Slide>
      <Carousel.Slide><img src="./myAwesomeImage.jpg" /></Carousel.Slide>
    </Carousel>
  ),
  document.querySelector('.app')
)
```

### Usage in JavaScript

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Carousel from 'react-carousel'

ReactDOM.render(
  (
    <Carousel>
      <Carousel.Slide>Your content...</Carousel.Slide>
      <Carousel.Slide><img src="./myAwesomeImage.jpg" /></Carousel.Slide>
    </Carousel>
  ),
  document.querySelector('.app')
)
```

## Description

### \<Carousel> props

#### transitionDuration

`number?` = `1500` (in ms)

The delay the slide take to swipe.

#### hideArrows

`boolean?` = `false`

Hide navigation with arrows.

#### hideDots

`boolean?` = `false`

Hide navigation with dots.

#### ratio

`number?` = `0.5625`

The aspect the Carousel should take.
By default: 16:9.

#### noTouch

`boolean?` = `false`

Disable touch detection (no events will be created).
Be careful, passing this props from `true` to `false` will no disable touch events.

#### autoplay

`boolean?` = `false`

The carousel will swipe go to the next page automatically after a delay.

#### autoplayDuration

`number?` = `3000` (in ms)

The delay until the next page will be swiped.
The delay is added with the `transitionDuration` prop.

#### autoplayPauseOnHover

`boolean?` = `true`

Prevent the carousel from swiping when it is hovered.

#### defaultActiveSlide

`number?` = `0`

Defines the default active slide.
Using this props will no leed to a controlled value. It justs define the default value for startup.
Changing this prop will update the carousel active slide.

If you want to control which slide is active, use `activeSlide` prop instead.

#### activeSlide

`number?`

Defines the active slide. This is a controlled value, so you need a container to handle which slide to show.

#### renderDot

`(active: boolean) => ReactElement?`

Should return a `React.ReactElement` to define how to render a dot.
It can be useful if you want to customize how the dot should be renderer depending of the an external style sheet.

#### renderLeftArrow

`() => ReactElement?`

Should return a `React.ReactElement` to define how to render the __left__ arrow.
It can be useful if you want to customize how the dot should be renderer depending of the an external style sheet.

#### renderRightArrow

`() => ReactElement?`

Should return a `React.ReactElement` to define how to render the __right__ arrow.
It can be useful if you want to customize how the dot should be renderer depending of the an external style sheet.

#### children

`<Carousel.Slide>`

It contains the list of `<Carousel.Slide>`

#### onSlideChange

`(activeSlide: number) => void`

Fired when a slide changes.
It is also fired when autoplay.

### \<Carousel.Slide> props

#### children

`React.ReactNode`

The content of the slide (an image, a video or an iframe).

## License

[MIT licensed](LICENSE)
