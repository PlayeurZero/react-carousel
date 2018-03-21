import * as React from 'react'

import { classConcat } from '../../../../libraries/utils'

import * as classes from './styles.css'

declare const Hammer: (...args: any[]) => void

interface IProps {
  transitionDuration?: number
  hideArrows?: boolean
  hideDots?: boolean
  ratio?: number
  noTouch?: boolean
  autoplay?: boolean
  autoplayDuration?: number
  autoplayPauseOnHover?: boolean
  renderDot?: (active: boolean) => React.ReactElement<any>
  renderLeftArrow?: () => React.ReactElement<any>
  renderRightArrow?: () => React.ReactElement<any>
  defaultActiveSlide?: number
  activeSlide?: number
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
    autoplay: false,
    autoplayDuration: 3000,
    autoplayPauseOnHover: true,
    defaultActiveSlide: 0,
    renderDot: (active: boolean) =>
      <div className={classConcat(classes['carousel-dots-dot'], { [classes['is-active']]: active })} />,
    renderLeftArrow: () =>
      <div className={classes['carousel-arrows-arrowLeft']}>◀</div>,
    renderRightArrow: () =>
      <div className={classes['carousel-arrows-arrowRight']}>▶</div>,
    children: [],
  }

  private $nodes: any = {
    slides: [],
  }

  private autoplay: number

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
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  public componentDidMount() {
    if ('undefined' !== typeof Hammer && !this.props.noTouch) {
      const { carousel: $carousel } = this.$nodes

      new Hammer($carousel)
        .on('swipeleft', () => {
          this.handleChange(this.state.activeSlide + 1)
        })
        .on('swiperight', () => {
          this.handleChange(this.state.activeSlide - 1)
        })
    }

    if (this.props.autoplay) {
      this.runAutoplay()
    }

    if (this.props.defaultActiveSlide) {
      this.handleChange(this.props.defaultActiveSlide)
    }
  }

  private runAutoplay() {
    if (null != this.autoplay) { return }

    this.autoplay = window.setInterval(() => {
      this.handleChange(this.state.activeSlide + 1)
    }, this.props.autoplayDuration + this.props.transitionDuration)
  }

  private pauseAutoplay() {
    window.clearInterval(this.autoplay)

    this.autoplay = null
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

    this.setState({ animationShift }, () => {
      setTimeout(() => {
        this.setState({ animationShift: 0, activeSlide })
      }, this.props.transitionDuration)
    })
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

  private handleMouseOver() {
    if (!(this.props.autoplayPauseOnHover && this.props.autoplay)) { return }

    this.pauseAutoplay()
  }

  private handleMouseLeave() {
    if (!(this.props.autoplayPauseOnHover && this.props.autoplay)) { return }

    this.runAutoplay()
  }

  private renderFirstSlide() {
    const { transitionDuration, children } = this.props

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return React.cloneElement(
        React.Children.toArray(children)[childrenCount - 1] as React.ReactElement<any>,
        { key: 'carousel__firstSlide' },
      )
    }
  }

  private renderLastSlide() {
    const { transitionDuration, children } = this.props

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return React.cloneElement(
        React.Children.toArray(children)[0] as React.ReactElement<any>,
        { key: 'carousel__lastSlide' },
      )
    }
  }

  private renderDots() {
    const { renderDot, children } = this.props
    const { activeSlide, animationShift } = this.state

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return Array.apply(null, Array(this.getSlideCount() - 2))
        .fill(null)
        .map(($null, index) => (
          React.cloneElement(
            renderDot(activeSlide === index + 1 && animationShift === 0),
            { onClick: this.handleClickDot(index + 1), key: index },
          )
        ),
      )
    }
  }

  public render() {
    const { transitionDuration, hideArrows, hideDots, ratio, renderLeftArrow, renderRightArrow, children } = this.props
    const { activeSlide, animationShift } = this.state

    const styles = {
      $carouselWrapper: {
        transform: `translate3d(${(animationShift - activeSlide) * 100}% , 0, 0)`,
        transitionDuration: `${transitionDuration}ms`,
        transitionProperty: animationShift !== 0 ? 'transform' : 'none',
      },
    }

    return (
      <div
        className={classes['carousel']}
        ref={($node) => { this.$nodes.carousel = $node }}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          className={classConcat(
            classes['carousel-arrows'],
            { [classes['carousel-arrows--is-hidden']]: hideArrows },
          )}
        >
          {React.cloneElement(renderLeftArrow(), { onClick: this.handleClickArrowLeft })}
          {React.cloneElement(renderRightArrow(), { onClick: this.handleClickArrowRight })}
        </div>

        <div
          className={classConcat(
            classes['carousel-dots'],
            { [classes['carousel-dots--is-hidden']]: hideDots },
          )}
        >
          {this.renderDots()}
        </div>

        <div className={classes['carousel-ratio']} style={{ paddingBottom: `${ratio * 100}%` }} />
        <div
          className={classes['carousel-body']}
          ref={($node) => { this.$nodes.carouselBody = $node }}
        >
          <div
            style={styles.$carouselWrapper}
            className={classes['carousel-wrapper']}
            ref={($node) => { this.$nodes.carouselWrapper = $node }}
          >
            {this.renderFirstSlide()}
            {
              React.Children.map(
                children,
                (child, index) =>
                  React.cloneElement(child as React.ReactElement<any>, { key: index }),
              )
            }
            {this.renderLastSlide()}
          </div>
        </div>
      </div>
    )
  }
}

export { Carousel as default, IProps, IState }
