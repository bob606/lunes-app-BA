import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../assets/images'
import Button from '../../components/Button'
import ExerciseHeader from '../../components/ExerciseHeader'
import FeedbackModal from '../../components/FeedbackModal'
import VocabularyDetail from '../../components/VocabularyDetail'
import { BUTTONS_THEME, FeedbackType } from '../../constants/data'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'

const ButtonContainer = styled.View`
  align-self: center;
`

interface VocabularyDetailExerciseScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyDetailExercise'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyDetailExercise'>
}

const VocabularyDetailExerciseScreen = ({ route, navigation }: VocabularyDetailExerciseScreenProps): ReactElement => {
  const { vocabularyItems, vocabularyItemIndex, closeExerciseAction, labelOverrides } = route.params
  const vocabularyItem = vocabularyItems[vocabularyItemIndex]
  const hasNextVocabularyItem = vocabularyItemIndex + 1 < vocabularyItems.length
  const closeExerciseLabel = labelOverrides?.closeExerciseButtonLabel ?? getLabels().results.action.backToWordlist
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)

  const goToNextWord = () =>
    navigation.navigate('VocabularyDetailExercise', { ...route.params, vocabularyItemIndex: vocabularyItemIndex + 1 })

  return (
    <SafeAreaView>
      <ScrollView>
        <ExerciseHeader
          navigation={navigation}
          currentWord={vocabularyItemIndex}
          numberOfWords={vocabularyItems.length}
          confirmClose={false}
          closeExerciseAction={closeExerciseAction}
          feedbackType={FeedbackType.vocabularyItem}
          feedbackForId={vocabularyItem.id}
          labelOverride={labelOverrides?.closeExerciseHeaderLabel}
          isCloseButton={labelOverrides?.isCloseButton}
        />
        <VocabularyDetail vocabularyItem={vocabularyItem} />
        <ButtonContainer>
          {hasNextVocabularyItem ? (
            <Button
              label={getLabels().exercises.next}
              iconRight={ArrowRightIcon}
              onPress={goToNextWord}
              buttonTheme={BUTTONS_THEME.contained}
            />
          ) : (
            <Button label={closeExerciseLabel} onPress={navigation.goBack} buttonTheme={BUTTONS_THEME.contained} />
          )}
        </ButtonContainer>
        <FeedbackModal
          visible={isFeedbackModalVisible}
          onClose={() => setIsFeedbackModalVisible(false)}
          feedbackType={FeedbackType.vocabularyItem}
          feedbackForId={vocabularyItem.id}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default VocabularyDetailExerciseScreen
