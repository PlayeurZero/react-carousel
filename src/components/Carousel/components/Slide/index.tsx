import * as React from 'react'

import * as classes from './styles.css'

interface IProps {
  children: React.ReactNode
}

interface IState { }

class Slide extends React.PureComponent<IProps, IState> {

  public render() {
    const { children } = this.props

    return (
      <div
        className={classes['carousel-slide']}
      >
        {children}
      </div>
    )
  }
}

export { Slide as default, IProps, IState }
