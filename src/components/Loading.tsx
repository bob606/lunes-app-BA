import React, { ReactElement, ReactNode } from 'react'
import { ActivityIndicator } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

const Indicator = styled.View`
  height: 50%;
  justify-content: center;
  align-items: center;
`

interface ILoadingProps {
  children?: ReactNode
  isLoading: boolean
}

const Loading = ({ children, isLoading }: ILoadingProps): ReactElement => {
  const theme = useTheme()

  if (isLoading) {
    return (
      <Indicator>
        <ActivityIndicator size='large' color={theme.colors.primary} testID='loading' />
      </Indicator>
    )
  }

  return <>{children}</>
}

export default Loading
