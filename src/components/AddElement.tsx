import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AddCircleIcon } from '../../assets/images'
import PressableOpacity from './PressableOpacity'
import { ContentSecondary } from './text/Content'
import { SubheadingPrimary } from './text/Subheading'

const PressableContainer = styled(PressableOpacity)`
  margin: ${props => props.theme.spacings.sm} 0;
`

const AddCustomDisciplineText = styled(SubheadingPrimary)`
  text-transform: uppercase;
  padding-left: ${props => props.theme.spacings.xs};
  margin-right: ${props => props.theme.spacings.xs};
`

const Explanation = styled(ContentSecondary)`
  padding: 0 ${props => props.theme.spacings.xxl} 0 11%;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => props.theme.colors.textSecondary};
`

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

interface AddElementProps {
  onPress: () => void
  label: string
  explanation?: string
}

const AddElement = ({ onPress, label, explanation }: AddElementProps): ReactElement => {
  const theme = useTheme()
  return (
    <>
      <PressableContainer onPress={onPress}>
        <FlexRow>
          <AddCustomDisciplineText>{label}</AddCustomDisciplineText>
          <AddCircleIcon width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
        </FlexRow>
      </PressableContainer>
      {explanation && <Explanation>{explanation}</Explanation>}
    </>
  )
}

export default AddElement
