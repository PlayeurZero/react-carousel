import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from "@storybook/addon-actions"

import "hammerjs"

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
    )
  })
  .add('with external buttons (controlled state)', () => {
    const A = class extends React.Component {
      constructor(props) {
        super(props)

        this.state = {
          slide: 0
        }
      }

      setSlide(id) {
        this.setState({ slide: id })
      }

      render() {
        return (
          <Fragment>
            <button onClick={() => this.setSlide(0)}>0</button>
            <button onClick={() => this.setSlide(1)}>1</button>
            <button onClick={() => this.setSlide(3)}>3</button>

            <div style={{ width: 800, height: 600 }}>
              <Carousel activeSlide={this.state.slide}>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
              </Carousel>
            </div>
          </Fragment>
        )
      }
    }

    return (
      <A />
    )
  })
  .add('with external buttons (uncontrolled state)', () => {
    const A = class extends React.Component {
      constructor(props) {
        super(props)

        this.carousel = React.createRef()
      }

      setSlide(id) {
        this.carousel.current.setSlide(id)
      }

      render() {
        return (
          <Fragment>
            <button onClick={() => this.setSlide(0)}>0</button>
            <button onClick={() => this.setSlide(1)}>1</button>
            <button onClick={() => this.setSlide(3)}>3</button>

            <div style={{ width: 800, height: 600 }}>
              <Carousel ref={this.carousel} defaultActiveSlide={2}>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
                <Carousel.Slide><img src="https://picsum.photos/800/600?random" /></Carousel.Slide>
              </Carousel>
            </div>
          </Fragment>
        )
      }
    }

    return (
      <A />
    )
  })
  .add('add or remove slides', () => {
    const A = class extends React.Component {
      constructor(props) {
        super(props)

        this.state = {
          slide: 0,
          count: 5,
        }

        this.add = this.add.bind(this)
        this.remove = this.remove.bind(this)
      }

      setSlide(id) {
        this.setState({ slide: id })
      }

      add() {
        this.setState({ count: this.state.count + 1 })
      }

      remove() {
        if (this.state.count <= 0) {
          return
        }

        this.setState({ count: this.state.count - 1 })
      }

      render() {
        return (
          <Fragment>
            <button onClick={() => this.setSlide(0)}>0</button>
            <button onClick={() => this.setSlide(1)}>1</button>
            <button onClick={() => this.setSlide(3)}>3</button>

            <br />
            
            <button onClick={this.add}>add</button>
            <button onClick={this.remove}>remove</button>

            <div style={{ width: 800, height: 600 }}>
              <Carousel activeSlide={this.state.slide}>
                {Array(this.state.count).fill(null).map((_, index) => (
                  <Carousel.Slide key={index}>
                    <img title={index} src={`https://picsum.photos/800/600?image=${index}`} />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          </Fragment>
        )
      }
    }

    return (
      <A />
    )
  })
  .add('autoplay & callbacks', () => {
    const A = class extends React.Component {
      render() {
        return (
          <Fragment>
            <div style={{ width: 800, height: 600 }}>
              <Carousel autoplay onSlideChange={action("slideChange")}>
                {Array(5).fill(null).map((_, index) => (
                  <Carousel.Slide key={index}>
                    <img src={`https://picsum.photos/800/600?image=${index}`} />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          </Fragment>
        )
      }
    }

    return (
      <A />
    )
  })
  .add('custom first slide and last slide (prevent video autoplay duplication)', () => {
    const A = class extends React.Component {
      render() {
        return (
          <Fragment>
            <div style={{ width: 800, height: 600 }}>
              <Carousel>
                {Array(5).fill(null).map((_, index) => (
                  <Carousel.Slide key={index} renderFirstSlide={() => "FIRST"} renderLastSlide={() => "LAST"}>
                    <img src={`https://picsum.photos/800/600?image=${index}`} />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          </Fragment>
        )
      }
    }

    return (
      <A />
    )
  })
