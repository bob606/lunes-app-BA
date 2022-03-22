import { CommonActions, RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import ArticleChoiceExerciseScreen from '../ArticleChoiceExerciseScreen'

jest.useFakeTimers()

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn()
}))

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('ArticleChoiceExerciseScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const documents: Document[] = [
    {
      audio: '',
      word: 'Helm',
      id: 1,
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [{ id: 1, image: 'Helm' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Auto',
      id: 2,
      article: {
        id: 3,
        value: 'Das'
      },
      document_image: [{ id: 2, image: 'Auto' }],
      alternatives: []
    }
  ]

  const navigation = createNavigationMock<'ArticleChoiceExercise'>()
  const route: RouteProp<RoutesParams, 'ArticleChoiceExercise'> = {
    key: '',
    name: 'ArticleChoiceExercise',
    params: {
      documents,
      disciplineTitle: 'TestTitel',
      closeExerciseAction: CommonActions.goBack()
    }
  }
  it('should allow to skip an exercise and try it out later', () => {
    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)
    expect(getAllByText(/Helm/)).toHaveLength(4)
    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)

    expect(getAllByText(/Auto/)).toHaveLength(4)
    fireEvent(getByText('Das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Helm/)).toHaveLength(4)
  })

  it('should not allow to skip last document', () => {
    const { queryByText, getByText, getAllByText } = render(
      <ArticleChoiceExerciseScreen route={route} navigation={navigation} />
    )

    expect(getAllByText(/Helm/)).toHaveLength(4)
    fireEvent(getByText('Der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(4)
    expect(queryByText(labels.exercises.tryLater)).toBeNull()
  })

  it('should show word again when answered wrong', () => {
    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)

    expect(getAllByText(/Helm/)).toHaveLength(4)
    fireEvent(getByText('Das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(4)
    fireEvent(getByText('Das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Helm/)).toHaveLength(4)
  })
})
