import React, { ReactElement, useState } from 'react'
import { Pressable } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ChevronRight } from '../../assets/images'
import { COLORS } from '../constants/theme/colors'

const Container = styled(Pressable)<{ pressed: boolean }>`
  min-height: ${wp('22%')}px;
  width: ${wp('90%')}px;
  margin-bottom: 8px;
  align-self: center;
  padding: 12px 8px 12px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${prop => (prop.pressed ? prop.theme.colors.lunesBlack : prop.theme.colors.white)};
  border: 1px solid ${prop => (prop.pressed ? prop.theme.colors.lunesBlack : prop.theme.colors.lunesBlackUltralight)};
  border-radius: 2px;
`
const Title = styled.Text<{ pressed: boolean }>`
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => (props.pressed ? props.theme.colors.white : props.theme.colors.lunesGreyDark)};
`

const Icon = styled.Image`
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`

const IconContainer = styled.View`
  justify-content: center;
  margin-right: 10px;
`

const FlexContainer = styled.View`
  flex: 1;
`

const DescriptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Description = styled.Text<{ pressed: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.pressed ? props.theme.colors.lunesWhite : props.theme.colors.lunesGreyMedium)};
`

const BadgeLabel = styled.Text<{ pressed: boolean }>`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  min-width: ${wp('6%')}px;
  height: ${wp('4%')}px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  color: ${prop => (prop.pressed ? prop.theme.colors.lunesGreyMedium : prop.theme.colors.lunesWhite)};
  background-color: ${prop => (prop.pressed ? prop.theme.colors.lunesWhite : prop.theme.colors.lunesGreyMedium)};
  font-size: ${prop => prop.theme.fonts.smallFontSize};
  margin-right: 5px;
`

const PRESS_ANIMATION_DURATION = 300

interface ListItemProps {
  title: string | ReactElement
  icon?: string | ReactElement
  description: string
  badgeLabel?: string
  children?: ReactElement
  onPress: () => void
  rightChildren?: ReactElement
}

const ListItem = ({
  onPress,
  icon,
  title,
  description,
  badgeLabel,
  children,
  rightChildren
}: ListItemProps): ReactElement => {
  const [pressed, setPressed] = useState<boolean>(false)
  const onItemPress = () => {
    setPressed(true)
    setTimeout(() => setPressed(false), PRESS_ANIMATION_DURATION)
    onPress()
  }

  const titleToRender =
    typeof title === 'string' ? (
      <Title pressed={pressed} numberOfLines={3}>
        {title}
      </Title>
    ) : (
      title
    )

  const iconToRender = icon ? (
    <IconContainer>{typeof icon === 'string' ? <Icon source={{ uri: icon }} /> : icon}</IconContainer>
  ) : null

  const rightChildrenToRender = rightChildren ?? (
    <ChevronRight fill={pressed ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
  )

  return (
    <Container onPress={onItemPress} pressed={pressed}>
      {iconToRender}
      <FlexContainer>
        {titleToRender}
        <DescriptionContainer>
          {badgeLabel && <BadgeLabel pressed={pressed}>{badgeLabel}</BadgeLabel>}
          <Description pressed={pressed}>{description}</Description>
        </DescriptionContainer>
        {children}
      </FlexContainer>
      {rightChildrenToRender}
    </Container>
  )
}

export default ListItem
