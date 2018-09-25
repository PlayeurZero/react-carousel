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
  noMouse?: boolean
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
    noMouse: false,
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
  private isHoldingClick: boolean = false
  private initialDeltaX: number = null

  constructor(props: IProps) {
    super(props)

    this.state = {
      activeSlide: props.defaultActiveSlide,
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
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  public componentDidMount() {
    const {
      carousel: $carousel,
    } = this.$nodes

    if (!($carousel.current instanceof HTMLElement)) {
      return
    }

    /**
     * if the optional dependency Hammer.js exists, defines touch events
     */
    if ('undefined' !== typeof Hammer && !this.props.noTouch) {
      this.hammer = new Hammer($carousel.current)
        .on('swipeleft', this.nextSlide)
        .on('swiperight', this.previousSlide)
        .on('panmove', this.handlePanMove)
        .on('panend', this.handlePanEnd)
    }

    if (!this.props.noMouse) {
      window.addEventListener('mouseup', this.handleMouseUp)
      window.addEventListener('dragstart', this.handleDragStart)
      window.addEventListener('mousemove', this.handleMouseMove)
      $carousel.current.addEventListener('keydown', this.handleKeyDown)
    }

    this.runAutoplay()
  }

  public componentWillUnmount() {
    const { carousel: $carousel } = this.$nodes

    if (null != this.hammer) {
      this.hammer
        .off('swipeleft', this.nextSlide)
        .off('swiperight', this.previousSlide)
        .off('panmove', this.handlePanMove)
        .off('panend', this.handlePanEnd)
    }

    $carousel.current.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('dragstart', this.handleDragStart)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (null != nextProps.activeSlide && nextProps.activeSlide !== this.state.activeSlide) {
      if (0 !== this.state.animationShift) {
        return
      }

      this.resetAutoplay()
      this.setSlide(nextProps.activeSlide, true)
    }

    const newChildrenCount = React.Children.count(nextProps.children)
    // if the number of child has changed
    if (newChildrenCount !== this.getChildrenCount()) {
      if (this.state.activeSlide > (newChildrenCount - 1)) {
        this.setState((state) => ({ activeSlide: state.activeSlide - 1 }))
      }
    }
  }

  public nextSlide(force?, fromAutoplay?) {
    this.setSlide(this.state.activeSlide + 1, force, fromAutoplay)
  }

  public previousSlide(force?, fromAutoplay?) {
    this.setSlide(this.state.activeSlide - 1, force, fromAutoplay)
  }

  public setSlide(id, force?, fromAutoplay = false) {
    this.handleChange(id, force)

    if (!fromAutoplay) {
      this.resetAutoplay()
    }
  }

  public render() {
    const { transitionDuration, hideArrows, hideDots, ratio, renderLeftArrow, renderRightArrow, children } = this.props
    const { activeSlide, animationShift } = this.state
    const childrenCount = this.getChildrenCount()

    const styles = {
      carouselWrapper: {
        transform: `translate3d(${(animationShift - activeSlide - (childrenCount > 0 ? 1 : 0)) * 100}% , 0, 0)`,
        transitionDuration: `${transitionDuration}ms`,
        transitionProperty: animationShift !== 0 ? 'transform' : 'none',
      },
    }

    return (
      <div
        className={classes['carousel']}
        ref={this.$nodes.carousel}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
        {...(!this.props.noMouse ? { onMouseDown: this.handleMouseDown } : undefined)}
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

  private renderFirstSlide() {
    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return React.cloneElement(
        React.Children.toArray(this.props.children)[childrenCount - 1] as React.ReactElement<any>,
        { key: 'carousel__firstSlide' },
      )
    }
  }

  private renderLastSlide() {
    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return React.cloneElement(
        React.Children.toArray(this.props.children)[0] as React.ReactElement<any>,
        { key: 'carousel__lastSlide' },
      )
    }
  }

  private renderDots() {
    const { renderDot } = this.props
    const { activeSlide, animationShift } = this.state

    const childrenCount = this.getChildrenCount()

    if (childrenCount > 0) {
      return Array.apply(null, Array(this.getChildrenCount()))
        .fill(null)
        .map(($null, index) => (
          React.cloneElement(
            renderDot(activeSlide - animationShift === index),
            { onClick: this.handleClickDot(index), key: index },
          )
        ),
      )
    }
  }

  private runAutoplay() {
    if (null != this.autoplay || !this.props.autoplay) {
      return
    }

    this.autoplay = window.setInterval(() => {
      if (this.getChildrenCount() > 1) {
        this.nextSlide(false, true)
      }
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
    return React.Children.count(this.props.children)
  }

  private handleMouseDown(e) {
    this.isHoldingClick = true
    this.initialDeltaX = e.clientX

    this.pauseAutoplay()
  }

  private handleMouseUp(e) {
    if (this.isHoldingClick) {
      const {
        carousel: $carousel,
        carouselWrapper: $carouselWrapper,
      } = this.$nodes

      this.isHoldingClick = false
      const diff = e.clientX - this.initialDeltaX

      if (Math.abs(diff) > ($carousel.current.offsetWidth / 2)) {
        this.handleChange(this.state.activeSlide + (diff > 0 ? -1 : 1))
      }

      $carouselWrapper.current.style.transitionProperty = null
      $carouselWrapper.current.style.transform =
        `translate3d(
          ${(this.state.animationShift - this.state.activeSlide - 1) * 100}% , 0, 0)`

      this.runAutoplay()
    }
  }

  private handleMouseOver() {
    if (this.props.autoplayPauseOnHover && this.props.autoplay) {
      this.pauseAutoplay()
    }
  }

  private handleMouseMove(e) {
    if (!this.props.noMouse && this.isHoldingClick) {
      if (this.state.animationShift !== 0) {
        return
      }

      const {
        carouselWrapper: $carouselWrapper,
      } = this.$nodes

      const diff = e.clientX - this.initialDeltaX

      $carouselWrapper.current.style.transitionProperty = 'none'
      $carouselWrapper.current.style.transform =
      `translate3d(
          ${((this.state.animationShift - this.state.activeSlide - 1)
        + (diff / $carouselWrapper.current.clientWidth)) * 100}% , 0, 0)`
    }
  }

  private handleDragStart(e) {
    if (this.isHoldingClick) {
      e.preventDefault()
    }
  }

  private handleMouseLeave() {
    if (!(this.props.autoplayPauseOnHover && this.props.autoplay) || this.isHoldingClick) {
      return
    }

    this.runAutoplay()
  }

  private handlePanMove(e) {
    const {
      carouselWrapper: $carouselWrapper,
    } = this.$nodes

    this.pauseAutoplay()

    if (this.state.animationShift !== 0) {
      return
    }

    $carouselWrapper.current.style.transitionProperty = 'none'
    $carouselWrapper.current.style.transform =
      `translate3d(
          ${((this.state.animationShift - this.state.activeSlide - 1)
        + (e.deltaX / $carouselWrapper.current.clientWidth)) * 100}% , 0, 0)`
  }

  private handlePanEnd(e) {
    const {
      carousel: $carousel,
      carouselWrapper: $carouselWrapper,
    } = this.$nodes

    if (Math.abs(e.deltaX) > ($carousel.current.offsetWidth / 2)) {
      this.handleChange(this.state.activeSlide + (e.deltaX > 0 ? -1 : 1))
    }

    $carouselWrapper.current.style.transitionProperty = null
    $carouselWrapper.current.style.transform =
      `translate3d(
        ${(this.state.animationShift - this.state.activeSlide - 1) * 100}% , 0, 0)`

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

  private handleChange(id, force = false) {
    const childrenCount = this.getChildrenCount()
    let activeSlide = id

    let animationShift = this.state.activeSlide - activeSlide
    if (activeSlide === -1) {
      animationShift = 1
    } else if (childrenCount === activeSlide) {
      animationShift = -1
    }

    activeSlide = (activeSlide + childrenCount) % childrenCount

    if (this.state.animationShift !== 0 || animationShift === 0) {
      return
    }

    if (id > childrenCount) {
      // tslint:disable-next-line
      console.warn('[react-carousel] try to open inexisting slide (slide n°' + id + ')')
      return
    }

    this.props.onSlideChange(activeSlide)

    if (null != this.props.activeSlide && !force) {
      return
    }

    this.setState({ animationShift }, () => {
      const callback = delayFallback(() => {
        (this.$nodes.carousel.current as HTMLElement).removeEventListener('transitionEnd', callback)

        this.setState({ animationShift: 0, activeSlide })
      }, this.props.transitionDuration) as () => {}

      (this.$nodes.carousel.current as HTMLElement).addEventListener('transitionEnd', callback)
    })
  }

  private handleClickDot(id) {
    return () => {
      this.resetAutoplay()

      this.setSlide(id)
    }
  }

  private handleClickArrowLeft() {
    this.previousSlide()
  }

  private handleClickArrowRight() {
    this.nextSlide()
  }
}

export { Carousel as default, IProps, IState }
