import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { MicrophoneCircleIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import Button from './Button'

const StyledButton = styled(Button)`
  margin-top: ${props => props.theme.spacings.md};
  justify-content: flex-start;
  padding: 0;
`

interface AddAudioProps {
  onPress: () => void
  label: string
}
const AddAudioButton = (props: AddAudioProps): ReactElement => {
  const theme = useTheme()
  const { label, onPress } = props
  return (
    <StyledButton
      onPress={onPress}
      label={label}
      buttonTheme={BUTTONS_THEME.text}
      iconLeft={MicrophoneCircleIcon}
      iconSize={theme.spacingsPlain.xl}
    />
  )
}

export default AddAudioButton
