import * as React from 'react'

enum EInteractiveTypes {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  RandomString = 'RandomString',
  RandomNumber = 'RandomNumber',
}

interface IProps {
  name: string
  type: string
  defaultValue?: string
  description?: string
}

interface IInteractiveProps {
  name: string
  type?: EInteractiveTypes
  values?: any
  defaultValue?: any
  min?: number
  max?: number
  step?: number
}

interface IExample {
  name: string
  namespace: string[]
  props: IProps[]
  interactiveProps: IInteractiveProps[]
  preview: React.ReactNode
}

export { IExample, IProps, IInteractiveProps, EInteractiveTypes }
