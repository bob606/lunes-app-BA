import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../assets/images'
import Button from '../components/Button'
import ExerciseHeader from '../components/ExerciseHeader'
import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetailView from '../components/VocabularyDetailView'
import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'

const ButtonContainer = styled.View`
  display: flex;
  align-self: center;
`

interface VocabularyDetailScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyDetail'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyDetail'>
}

const VocabularyDetailScreen = ({ route, navigation }: VocabularyDetailScreenProps): ReactElement => {
  const { documents, documentIndex, closeExerciseAction } = route.params
  const document = documents[documentIndex]
  const hasNextDocument = documentIndex + 1 < documents.length

  const goToNextWord = () =>
    navigation.navigate('VocabularyDetail', { ...route.params, documentIndex: documentIndex + 1 })

  return (
    <RouteWrapper>
      <ExerciseHeader
        navigation={navigation}
        currentWord={documentIndex}
        numberOfWords={documents.length}
        confirmClose={false}
        closeExerciseAction={closeExerciseAction}
      />
      <VocabularyDetailView document={document} />
      <ButtonContainer>
        {hasNextDocument ? (
          <Button
            label={labels.exercises.next}
            iconRight={ArrowRightIcon}
            onPress={goToNextWord}
            buttonTheme={BUTTONS_THEME.contained}
          />
        ) : (
          <Button
            label={labels.general.header.cancelExercise}
            onPress={navigation.goBack}
            buttonTheme={BUTTONS_THEME.contained}
          />
        )}
      </ButtonContainer>
    </RouteWrapper>
  )
}

export default VocabularyDetailScreen
