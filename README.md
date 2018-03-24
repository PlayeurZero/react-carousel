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

### Props

| Name                   | Description                         |
|------------------------|-------------------------------------|
| `transitionDuration`   | `number?` = `1500` in ms            |
| `hideArrows`           | `boolean?` = `false`                |
| `hideDots`             | `boolean?` = `false`                |
| `ratio`                | `number?` = `0.5625` 16:9           |
| `noTouch`              | `boolean?` = `false`                |
| `autoplay`             | `boolean?` = `false`                |
| `autoplayDuration`     | `number?` = `3000` in ms            |
| `autoplayPauseOnHover` | `boolean?` = `true`                 |
| `defaultActiveSlide`   | `number?` = `0`                     |
| `activeSlide`          | `number?`                           |
| `renderDot`            | `(active: boolean) => ReactElement` |
| `renderLeftArrow`      | `() => ReactElement`                |
| `renderRightArrow`     | `() => ReactElement`                |
| `children`             | `<Carousel.Slide>`                  |

## License

[MIT licensed](LICENSE)
