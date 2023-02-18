import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect } from 'react'

import ExerciseHeader from '../components/ExerciseHeader'
import RouteWrapper from '../components/RouteWrapper'
import VocabularyList from '../components/VocabularyList'
import { ExerciseKeys, FeedbackType, SIMPLE_RESULTS } from '../constants/data'
import { RoutesParams } from '../navigation/NavigationTypes'
import { setExerciseProgress } from '../services/AsyncStorage'
import { calculateScore, getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'

interface VocabularyListScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyList'>
}

const VocabularyListScreen = ({ route, navigation }: VocabularyListScreenProps): JSX.Element => {
  const { disciplineId, closeExerciseAction, vocabularyItems } = route.params

  useEffect(() => {
    const fakePassingResults = vocabularyItems.map(vocabularyItem => ({
      vocabularyItem,
      result: SIMPLE_RESULTS.correct,
      numberOfTries: 1,
    }))
    setExerciseProgress(disciplineId, ExerciseKeys.vocabularyList, calculateScore(fakePassingResults)).catch(
      reportError
    )
  }, [disciplineId, vocabularyItems])

  const onItemPress = (index: number) =>
    navigation.navigate('VocabularyDetailExercise', { ...route.params, vocabularyItemIndex: index })

  return (
    <RouteWrapper>
      <ExerciseHeader
        navigation={navigation}
        confirmClose={false}
        closeExerciseAction={closeExerciseAction}
        feedbackType={FeedbackType.leaf_discipline}
        feedbackForId={disciplineId}
      />
      <VocabularyList
        vocabularyItems={vocabularyItems}
        onItemPress={onItemPress}
        title={getLabels().exercises.vocabularyList.title}
      />
    </RouteWrapper>
  )
}

export default VocabularyListScreen
