import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ExerciseHeader from '../../components/ExerciseHeader'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ExerciseKeys } from '../../constants/data'
import { DocumentType } from '../../constants/endpoints'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import { moveToEnd } from '../../services/helpers'
import WriteExercise from './components/WriteExercise'

interface WriteExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WriteExercise'>
}

const WriteExerciseScreen = ({ navigation, route }: WriteExerciseScreenPropsType): JSX.Element => {
  const { discipline, retryData } = route.params
  const { id } = discipline
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(0)
  const [newDocuments, setNewDocuments] = useState<DocumentType[] | null>(null)
  const { height } = useWindowDimensions()

  const { data, loading, error, refresh } = useLoadDocuments(discipline)
  const documents = newDocuments ?? retryData?.data ?? data

  useEffect(() => {
    AsyncStorage.setSession({ ...discipline, exercise: ExerciseKeys.writeExercise, results: [] }).catch(e =>
      console.error(e)
    )
  }, [discipline])

  const tryLater = useCallback(() => {
    if (documents !== null) {
      setNewDocuments(moveToEnd(documents, currentDocumentNumber))
    }
  }, [documents, currentDocumentNumber])

  const finishExercise = (): void => {
    AsyncStorage.clearSession().catch(e => console.error(e))
    setCurrentDocumentNumber(0)
    setNewDocuments(null)
    navigation.navigate('InitialSummary', {
      result: {
        discipline: { ...discipline },
        results: [],
        exercise: ExerciseKeys.writeExercise
      }
    })
  }

  const docsLength = documents?.length ?? 0
  const document = documents?.[currentDocumentNumber]

  return (
    <>
      <ExerciseHeader
        navigation={navigation}
        route={route}
        currentWord={currentDocumentNumber}
        numberOfWords={docsLength}
      />

      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {documents && document && (
          <KeyboardAwareScrollView contentContainerStyle={{ height }}>
            <WriteExercise
              currentDocumentNumber={currentDocumentNumber}
              setCurrentDocumentNumber={setCurrentDocumentNumber}
              documents={documents}
              finishExercise={finishExercise}
              tryLater={tryLater}
              disciplineId={id}
            />
          </KeyboardAwareScrollView>
        )}
      </ServerResponseHandler>
    </>
  )
}

export default WriteExerciseScreen
