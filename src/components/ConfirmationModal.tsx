import React, { ReactNode } from 'react'
import { Modal } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import Button from './Button'
import { HeadingText } from './text/Heading'

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.overlay};
`
const ModalContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccent};
  align-items: center;
  width: ${wp('85%')}px;
  border-radius: 4px;
  position: relative;
  padding-top: ${props => props.theme.spacings.lg};
  padding-bottom: ${props => props.theme.spacings.lg};
`
const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  width: ${wp('6%')}px;
  height: ${wp('6%')}px;
`
const Message = styled(HeadingText)`
  width: ${wp('60%')}px;
  margin-bottom: ${props => props.theme.spacings.lg};
  padding-top: ${props => props.theme.spacings.lg};
  text-align: center;
`

export interface ConfirmationModalProps {
  visible: boolean
  onClose: () => void
  text: string
  children?: ReactNode
  confirmationButtonText: string
  cancelButtonText?: string
  confirmationAction: () => void
  confirmationDisabled?: boolean
  testID?: string
}

// TODO Further adjustments gonna be done with LUN-312
const ConfirmationModal = (props: ConfirmationModalProps): JSX.Element => {
  const {
    visible,
    text,
    confirmationButtonText,
    cancelButtonText,
    confirmationAction,
    children,
    onClose,
    confirmationDisabled = false,
    testID
  } = props

  return (
    <Modal testID={testID} visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Overlay>
        <ModalContainer>
          <Icon onPress={onClose}>
            <CloseIcon width={wp('6%')} height={wp('6%')} />
          </Icon>
          <Message>{text}</Message>
          {children}

          {cancelButtonText && (
            <Button label={cancelButtonText} onPress={onClose} buttonTheme={BUTTONS_THEME.contained} />
          )}
          <Button
            label={confirmationButtonText}
            onPress={confirmationAction}
            disabled={confirmationDisabled}
            buttonTheme={cancelButtonText ? BUTTONS_THEME.outlined : BUTTONS_THEME.contained}
          />
        </ModalContainer>
      </Overlay>
    </Modal>
  )
}
export default ConfirmationModal
