import * as React from 'react'
import Slide from '../Slide'

import { classConcat } from '../../../../libraries/utils'

declare const Hammer: (...args: any[]) => void

interface IProps {
  transitionDuration?: number
  hideArrows?: boolean
  hideDots?: boolean
  ratio?: number
  noTouch?: boolean
  children: Array<React.ReactElement<any>> | React.ReactElement<any>
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
    ratio: .5625,
    noTouch: false,
    children: [],
  }

  private $nodes: any = {}

  constructor(props) {
    super(props)

    this.state = {
      activeSlide: React.Children.toArray(props.children).length > 0 ? 1 : 0,
      animationShift: 0,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClickArrowLeft = this.handleClickArrowLeft.bind(this)
    this.handleClickArrowRight = this.handleClickArrowRight.bind(this)
    this.handleClickDot = this.handleClickDot.bind(this)
  }

  public componentDidMount() {
    try {
      if (null != Hammer && !this.props.noTouch) {
        const { carousel: $carousel, carouselBody: $carouselBody } = this.$nodes

        new Hammer($carousel)
        .on('panmove', (e) => {
          if (this.state.animationShift !== 0) {
            return
          }

          $carouselBody.style.transitionProperty = 'none'
          $carouselBody.style.transform = `translate3d(${e.deltaX}px, 0, 0)`
        })
        .on('panend', (e) => {
          if (Math.abs(e.deltaX) > ($carousel.offsetWidth / 2)) {
            this.handleChange(this.state.activeSlide + (e.deltaX > 0 ? -1 : 1))
          } else {
            $carouselBody.style.transform = 'translate3d(0, 0, 0)'
          }

          $carouselBody.style.transitionProperty = null
        })
      }
    } catch { }
  }

  private getChildrenCount(): number {
    return React.Children.toArray(this.props.children).length
  }

  private getSlideCount(): number {
    const length = this.getChildrenCount()

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

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return React.cloneElement(
        React.Children.toArray(children)[childrenCount - 1] as React.ReactElement<any>,
      )
    }
  }

  private renderLastSlide() {
    const { transitionDuration, children } = this.props

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return React.cloneElement(
        React.Children.toArray(children)[0] as React.ReactElement<any>,
      )
    }
  }

  private renderDots() {
    const { children } = this.props
    const { activeSlide, animationShift } = this.state

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return Array.apply(null, Array(this.getSlideCount() - 2))
        .fill(null)
        .map(($null, index) => (
          <div
            key={index}
            className={classConcat(
              'carousel-dots-dot',
              { 'is-active': activeSlide === index + 1 && animationShift === 0 },
            )}
            onClick={this.handleClickDot(index + 1)}
          />
        ),
      )
    }
  }

  public render() {
    const { transitionDuration, hideArrows, hideDots, ratio, children } = this.props
    const { activeSlide, animationShift } = this.state

    const styles = {
      $body: {
        left: `${activeSlide * -100}%`,
        transform: `translate3d(${animationShift * 100}% , 0, 0)`,
        transitionDuration: `${transitionDuration}ms`,
        transitionProperty: animationShift !== 0 ? 'transform' : 'none',
      },
    }

    return (
      <div
        className="carousel"
        ref={($node) => { this.$nodes.carousel = $node }}
      >
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

        <div className="carousel-ratio" style={{ paddingBottom: `${ratio * 100}%` }} />
        <div
          className="carousel-body"
          style={styles.$body}
          ref={($node) => { this.$nodes.carouselBody = $node }}
        >
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
