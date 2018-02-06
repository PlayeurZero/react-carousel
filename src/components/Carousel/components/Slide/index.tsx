import * as React from 'react'

interface IProps {
  children: React.ReactNode
}

interface IState { }

class Slide extends React.Component<IProps, IState> {

  public render() {
    const { children } = this.props

    return (
      <div
        className="carousel-slide"
      >
        {children}
      </div>
    )
  }
}

export { Slide as default, IProps, IState }
