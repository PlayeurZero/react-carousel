import * as React from 'react'

import { classConcat, delayFallback } from '../../../../libraries/utils'

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
  defaultActiveSlide?: number
  activeSlide?: number
  setActiveSlide?: (() => number)
  renderDot?: (active: boolean) => React.ReactElement<any>
  renderLeftArrow?: () => React.ReactElement<any>
  renderRightArrow?: () => React.ReactElement<any>
  children: Array<React.ReactElement<any>> | React.ReactElement<any>
  onSlideChange?: (activeSlide: number) => void
}

interface IState {
  activeSlide: number
  animationShift: number
}

class Carousel extends React.PureComponent<IProps, IState> {
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
    children: [],
    renderDot: (active: boolean) =>
      <div className={classConcat(classes['carousel-dots-dot'], { [classes['is-active']]: active })} />,
    renderLeftArrow: () =>
      <div className={classes['carousel-arrows-arrowLeft']}>◀</div>,
    renderRightArrow: () =>
      <div className={classes['carousel-arrows-arrowRight']}>▶</div>,
    onSlideChange: () => { return },
  }

  private $nodes: any = {
    carousel: React.createRef(),
    carouselBody: React.createRef(),
    carouselWrapper: React.createRef(),
  }
  private autoplay: number
  private hammer: any

  constructor(props: IProps) {
    super(props)

    const childrenCount = React.Children.toArray(this.props.children).length
    const slideCount = childrenCount > 0 ? childrenCount + 2 : 0

    const activeSlide = (
      null != props.activeSlide
        ? props.activeSlide
        : props.defaultActiveSlide) % slideCount
      || 0

    this.state = {
      activeSlide: childrenCount > 0 ? activeSlide + 1 : 0,
      animationShift: 0,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClickArrowLeft = this.handleClickArrowLeft.bind(this)
    this.handleClickArrowRight = this.handleClickArrowRight.bind(this)
    this.handleClickDot = this.handleClickDot.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.nextSlide = this.nextSlide.bind(this)
    this.previousSlide = this.previousSlide.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handlePanMove = this.handlePanMove.bind(this)
    this.handlePanEnd = this.handlePanEnd.bind(this)
  }

  public componentDidMount() {
    const {
      carousel: $carousel,
    } = this.$nodes

    if (!($carousel instanceof HTMLElement)) {
      return
    }

    if ('undefined' !== typeof Hammer && !this.props.noTouch) {
      this.hammer = new Hammer($carousel)
        .on('swipeleft', this.nextSlide)
        .on('swiperight', this.previousSlide)
        .on('panmove', this.handlePanMove)
        .on('panend', this.handlePanEnd)
    }

    this.runAutoplay()

    if (this.props.defaultActiveSlide) {
      this.handleChange(this.props.defaultActiveSlide)
    }

    $carousel.addEventListener('keydown', this.handleKeyDown)
  }

  public componentWillUnmount() {
    const { carousel: $carousel } = this.$nodes

    if (null != this.hammer) {
      this.hammer
        .off('swipeleft', this.nextSlide)
        .off('swiperight', this.previousSlide)
    }

    $carousel.removeEventListener('keydown', this.handleKeyDown)
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (null != nextProps.activeSlide && this.getActiveSlide(nextProps.activeSlide) !== this.state.activeSlide) {
      if (0 !== this.state.animationShift) {
        return
      }

      this.resetAutoplay()
      this.handleChange(this.getActiveSlide(nextProps.activeSlide))
    }
  }

  public nextSlide() {
    this.resetAutoplay()
    this.handleChange(this.state.activeSlide + 1)
  }

  public previousSlide() {
    this.resetAutoplay()
    this.handleChange(this.state.activeSlide - 1)
  }

  public setSlide(id) {
    this.handleChange(this.getActiveSlide(id))
  }

  public render() {
    const { transitionDuration, hideArrows, hideDots, ratio, renderLeftArrow, renderRightArrow, children } = this.props
    const { activeSlide, animationShift } = this.state

    const styles = {
      carouselWrapper: {
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

        <div className={classes['carousel-ratio']} style={{ paddingBottom: `${ratio * 100}% ` }} />
        <div
          className={classes['carousel-body']}
          ref={this.$nodes.carouselBody}
        >
          <div
            style={styles.carouselWrapper}
            className={classes['carousel-wrapper']}
            ref={this.$nodes.carouselWrapper}
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

  private runAutoplay() {
    if (null != this.autoplay || !this.props.autoplay) { return }

    this.autoplay = window.setInterval(() => {
      this.handleChange(this.state.activeSlide + 1, true)
    }, this.props.autoplayDuration + this.props.transitionDuration)
  }

  private pauseAutoplay() {
    window.clearInterval(this.autoplay)

    this.autoplay = null
  }

  private resetAutoplay() {
    this.pauseAutoplay()
    this.runAutoplay()
  }

  private getChildrenCount(): number {
    return React.Children.toArray(this.props.children).length
  }

  private getSlideCount(): number {
    const length = this.getChildrenCount()

    return length > 0 ? length + 2 : 0
  }

  private getActiveSlide(id, includesFakeSlides: boolean = false) {
    const length = this.getChildrenCount()

    if (includesFakeSlides) {
      return length > 0 ? id - 1 : 0
    } else {
      if (id > (length - 1) || id < 0) {
        throw new RangeError('`activeSlide` must be between 0 and the slide count.')
      }

      return length > 0 ? id + 1 : 0
    }
  }

  private handlePanMove(e) {
    const {
      carouselWrapper: $carouselWrapper,
    } = this.$nodes

    this.pauseAutoplay()

    if (this.state.animationShift !== 0) {
      return
    }

    $carouselWrapper.style.transitionProperty = 'none'
    // $carouselWrapper.style.transform = `translate3d(${e.deltaX}px, 0, 0)`
    $carouselWrapper.style.transform =
      `translate3d(
          ${((this.state.animationShift - this.state.activeSlide)
        + (e.deltaX / $carouselWrapper.clientWidth)) * 100}% , 0, 0)`
  }

  private handlePanEnd(e) {
    const {
      carousel: $carousel,
      carouselWrapper: $carouselWrapper,
    } = this.$nodes

    if (Math.abs(e.deltaX) > ($carousel.offsetWidth / 2)) {
      this.handleChange(this.state.activeSlide + (e.deltaX > 0 ? -1 : 1))
    }

    $carouselWrapper.style.transitionProperty = null
    $carouselWrapper.style.transform =
      `translate3d(
        ${(this.state.animationShift - this.state.activeSlide) * 100}% , 0, 0)`

    this.runAutoplay()
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      // ArrowLeft
      case 0x25: {
        this.previousSlide()
        return
      }

      // ArrowRight
      case 0x27: {
        this.nextSlide()
        return
      }
    }
  }

  private handleChange(id, fromAutoplay = false) {
    const slideCount = this.getSlideCount()
    let activeSlide = (id + slideCount) % slideCount

    const animationShift = this.state.activeSlide - activeSlide

    if (this.state.animationShift !== 0 || animationShift === 0) {
      return
    }

    if (!(fromAutoplay && null != this.props.activeSlide)) {
      this.props.onSlideChange(this.getActiveSlide(activeSlide, true))
    }

    if (activeSlide === 0) {
      activeSlide = slideCount - 2
    }

    if (activeSlide === slideCount - 1) {
      activeSlide = 1
    }

    this.setState({ animationShift }, () => {
      const callback = delayFallback(() => {
        (this.$nodes.carousel as HTMLElement).removeEventListener('transitionEnd', callback)

        this.setState({ animationShift: 0, activeSlide })
      }, this.props.transitionDuration) as () => {}

      (this.$nodes.carousel as HTMLElement).addEventListener('transitionEnd', callback)
    })
  }

  private handleClickDot(id) {
    return () => {
      this.resetAutoplay()

      this.handleChange(id)
    }
  }

  private handleClickArrowLeft() {
    this.resetAutoplay()

    this.handleChange(this.state.activeSlide - 1)
  }

  private handleClickArrowRight() {
    this.resetAutoplay()

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
    const { children } = this.props

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return React.cloneElement(
        React.Children.toArray(children)[0] as React.ReactElement<any>,
        { key: 'carousel__lastSlide' },
      )
    }
  }

  private renderDots() {
    const { renderDot } = this.props
    const { activeSlide, animationShift } = this.state

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return Array.apply(null, Array(this.getSlideCount() - 2))
        .fill(null)
        .map(($null, index) => (
          React.cloneElement(
            renderDot(activeSlide - animationShift === index + 1),
            { onClick: this.handleClickDot(index + 1), key: index },
          )
        ),
      )
    }
  }
}

export { Carousel as default, IProps, IState }
