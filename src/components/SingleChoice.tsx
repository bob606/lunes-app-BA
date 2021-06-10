import React from 'react'
import { StyleSheet, View } from 'react-native'
import SingleChoiceListItem, { SingleChoiceListItemType } from './SingleChoiceListItem'
import styled from 'styled-components/native'
import {Article} from "../constants/data";

export const StyledContainer = styled.View`
  margin-horizontal: 8%;
`

export interface SingleChoicePropsType {
  onClick: (article: Article) => void
  answerOptions: SingleChoiceListItemType[]
}

export const SingleChoice = ({ answerOptions, onClick }: SingleChoicePropsType) => {
  return (
    <StyledContainer>
      {answerOptions.map((answerOption, index) => {
        return <SingleChoiceListItem key={index} answerOption={answerOption} onClick={onClick}/>
      })}
    </StyledContainer>
  )
}
