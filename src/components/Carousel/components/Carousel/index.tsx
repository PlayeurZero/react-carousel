import * as React from 'react'
import Slide from '../Slide'

import { classConcat } from '../../../../libraries/utils'

interface IProps {
  transitionDuration?: number
  hideArrows?: boolean
  hideDots?: boolean
  children: Array<React.ReactElement<any>>
}

interface IState {
  activeSlide: number
  animationShift: number
}

class Carousel extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    transitionDuration: 1500,
    hideArrows: false,
    hideDots: false,
    children: [],
  }

  constructor(props) {
    super(props)

    this.state = {
      activeSlide: props.children.length > 0 ? 1 : 0,
      animationShift: 0,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClickArrowLeft = this.handleClickArrowLeft.bind(this)
    this.handleClickArrowRight = this.handleClickArrowRight.bind(this)
    this.handleClickDot = this.handleClickDot.bind(this)
  }

  private getSlideCount() {
    const length = this.props.children.length

    return length > 0 ? length + 2 : 0
  }

  private handleChange(id) {
    const slideCount = this.getSlideCount()
    let activeSlide = (id + slideCount) % slideCount

    const animationShift = this.state.activeSlide - activeSlide

    if (this.state.animationShift !== 0 || animationShift === 0) {
      return
    }

    if (activeSlide === 0) {
      activeSlide = slideCount - 2
    }

    if (activeSlide === slideCount - 1) {
      activeSlide = 1
    }

    this.setState({ animationShift })

    setTimeout(() => {
      this.setState({ animationShift: 0, activeSlide })
    }, this.props.transitionDuration)
  }

  private handleClickDot(id) {
    return () => {
      this.handleChange(id)
    }
  }

  private handleClickArrowLeft() {
    this.handleChange(this.state.activeSlide - 1)
  }

  private handleClickArrowRight() {
    this.handleChange(this.state.activeSlide + 1)
  }

  private renderFirstSlide() {
    const { transitionDuration, children } = this.props

    if (children.length > 0) {
      return React.cloneElement(
        React.Children.toArray(children)[children.length - 1] as React.ReactElement<any>,
      )
    }
  }

  private renderLastSlide() {
    const { transitionDuration, children } = this.props

    if (children.length > 0) {
      return React.cloneElement(
        React.Children.toArray(children)[0] as React.ReactElement<any>,
      )
    }
  }

  private renderDots() {
    const { children } = this.props

    if (children.length > 0) {
      return Array.apply(null, Array(this.getSlideCount() - 2))
        .fill(null)
        .map(($null, index) =>
          <div key={index} className="carousel-dots-dot" onClick={this.handleClickDot(index + 1)} />,
      )
    }
  }

  public render() {
    const { transitionDuration, hideArrows, hideDots, children } = this.props
    const { activeSlide, animationShift } = this.state

    const styles = {
      $body: {
        left: `${activeSlide * -100}%`,
        transform: `translate3d(${animationShift * 100}% , 0, 0)`,
        transitionProperty: animationShift !== 0 ? 'transform' : 'none',
        transitionDuration: animationShift !== 0 ? `${transitionDuration}ms` : '0',
      },
    }

    return (
      <div className="carousel">
        <div
          className={classConcat(
            'carousel-arrows',
            { ['carousel-arrows--is-hidden']: hideArrows },
          )}
        >
          <div className="carousel-arrows-arrowLeft" onClick={this.handleClickArrowLeft}>◀</div>
          <div className="carousel-arrows-arrowRight" onClick={this.handleClickArrowRight}>▶</div>
        </div>

        <div
          className={classConcat(
            'carousel-dots',
            { ['carousel-dots--is-hidden']: hideDots },
          )}
        >
          {this.renderDots()}
        </div>

        <div className="carousel-ratio" />
        <div className="carousel-body" style={styles.$body}>
          {this.renderFirstSlide()}
          {
            React.Children.map(
              children,
              (child) =>
                React.cloneElement(child as React.ReactElement<any>,
                ),
            )
          }
          {this.renderLastSlide()}
        </div>
      </div>
    )

  }
}

export { Carousel as default, IProps, IState }
