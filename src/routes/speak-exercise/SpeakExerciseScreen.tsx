import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState } from 'react'
import { Dimensions, Platform } from 'react-native'
import AudioRecorderPlayer, { PlayBackType } from 'react-native-audio-recorder-player'
import { DocumentDirectoryPath, moveFile } from 'react-native-fs'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { ArrowRightIcon, MicrophoneCircleIcon, PlayArrowIcon } from '../../../assets/images'
import Button from '../../components/Button'
import ExerciseHeader from '../../components/ExerciseHeader'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import VocabularyItemImageSection from '../../components/VocabularyItemImageSection'
import WordItem from '../../components/WordItem'
import { BUTTONS_THEME, ExerciseKeys, FeedbackType, SIMPLE_RESULTS } from '../../constants/data'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getExerciseProgress, saveExerciseProgress } from '../../services/AsyncStorage'
import { calculateScore, getLabels, moveToEnd, shuffleArray, willNextExerciseUnlock } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import AudioRecordOverlay from '../process-user-vocabulary/components/AudioRecordOverlay'

const InputContainer = styled.View`
  margin-top: ${props => props.theme.spacings.md};
  height: ${hp('33%')}px;
  width: 85%;
  align-self: center;
`

// TODO: for clean code export, double of AudioRecorder.tsx line 35
const AddAudioButton = styled(Button)`
  margin-top: ${props => props.theme.spacings.md};
  justify-content: flex-start;
  padding: 0;
`

const PlayIcon = styled(PressableOpacity)<{ disabled: boolean; isActive: boolean; isUserAudio?: boolean }>`
  width: ${props => props.theme.spacings.xl};
  height: ${props => props.theme.spacings.xl};
  border-radius: 50px;
  background-color: ${props => {
    if (props.disabled) {
      return props.theme.colors.disabled
    }
    if (props.isActive) {
      return props.isUserAudio ? props.theme.colors.userAudioIconSelected : props.theme.colors.audioIconSelected
    }
    return props.isUserAudio ? props.theme.colors.userAudioIconHighlight : props.theme.colors.audioIconHighlight
  }};
  justify-content: center;
  align-items: center;
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const audioBarHeight = '40px'

const AudioBar = styled.View`
  background-color: #ccc;
  height: ${audioBarHeight};
  align-self: stretch;
`

const AudioBarPlay = styled.View<{ width: number }>`
  background-color: white;
  height: ${audioBarHeight};
  width: ${props => props.width}px;
`

const ButtonContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacings.sm};
  flex: 1;
`

export interface SpeakExerciseScreenProps {
  route: RouteProp<RoutesParams, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>
}

const audioPathWithFormatStr = (id: number): string => {
  const audioPath = `file:///${DocumentDirectoryPath}/userAudio-${id}`
  return Platform.OS === 'ios' ? `${audioPath}.m4a` : `${audioPath}.mp4`
}

const accuracy = 0.1

const playerForRecording = new AudioRecorderPlayer()
playerForRecording.setSubscriptionDuration(accuracy).catch(reportError)
const playerForPlayingProfAudio = new AudioRecorderPlayer()
playerForPlayingProfAudio.setSubscriptionDuration(accuracy).catch(reportError)
const playerForPlayingUserAudio = new AudioRecorderPlayer()
playerForPlayingUserAudio.setSubscriptionDuration(accuracy).catch(reportError)

const screenWidth = Dimensions.get('screen').width

const calculatePlayWidth = (position: number, duration: number): number => {
  const indent = 56
  return (position / duration) * (screenWidth - indent)
}

const SpeakExerciseScreen = ({ route, navigation }: SpeakExerciseScreenProps): ReactElement => {
  const theme = useTheme()
  const { vocabularyItems, disciplineTitle, closeExerciseAction, disciplineId } = route.params

  const [showAudioRecordOverlay, setShowAudioRecordOverlay] = useState(false)
  const [userAudioExists, setUserAudioExists] = useState(false)
  const [userAudioWasPlayed, setUserAudioWasPlayed] = useState(false)
  const { addAudio, retakeAudio } = getLabels().userAudio // TODO: change labels

  const [currentIndex, setCurrentIndex] = useState(0) // in production check for empty array
  const [vocabularyItemsShuffled, setVocabularyItemsShuffled] = useState(shuffleArray(vocabularyItems)) // TODO: hier gucken, dass wenn ich die Übung direkt nochmal mache, die Wörter nicht die gleiche Reihenfolge haben
  const [userAudioPathWithFormat, setUserAudioPathWithFormat] = useState(
    audioPathWithFormatStr(vocabularyItemsShuffled[currentIndex].id)
  )

  const [playWidthProfAudio, setPlayWidthProfAudio] = useState(0)

  const [playWidthUserAudio, setPlayWidthUserAudio] = useState(0)

  const startUserAudioPlayer = async (): Promise<void> => {
    await playerForPlayingUserAudio.startPlayer(userAudioPathWithFormat)
    playerForPlayingUserAudio.addPlayBackListener((e: PlayBackType) => {
      if (e.duration === 0) {
        setPlayWidthUserAudio(0)
      } else if (e.currentPosition === e.duration) {
        setPlayWidthUserAudio(0)
        // eslint-disable-next-line no-void
        void playerForPlayingUserAudio.stopPlayer()
        playerForPlayingUserAudio.removePlayBackListener()
        setUserAudioWasPlayed(true)
      } else {
        setPlayWidthUserAudio(calculatePlayWidth(e.currentPosition, e.duration))
      }
    })
  }

  const startProfAudioPlayer = async (playUserAudioAfter?: boolean): Promise<void> => {
    const audio = vocabularyItemsShuffled[currentIndex].audio
    if (!audio) {
      return
    }
    await playerForPlayingProfAudio.startPlayer(audio)
    playerForPlayingProfAudio.addPlayBackListener(async (e: PlayBackType) => {
      if (e.duration === 0) {
        setPlayWidthProfAudio(0)
      } else if (e.currentPosition === e.duration) {
        setPlayWidthProfAudio(0)
        // eslint-disable-next-line no-void
        await playerForPlayingProfAudio.stopPlayer()
        playerForPlayingProfAudio.removePlayBackListener()
        if (playUserAudioAfter) {
          // eslint-disable-next-line no-void
          await startUserAudioPlayer()
        }
      } else {
        setPlayWidthProfAudio(calculatePlayWidth(e.currentPosition, e.duration))
      }
    })
  }

  useEffect(() => {
    setUserAudioPathWithFormat(audioPathWithFormatStr(vocabularyItemsShuffled[currentIndex].id))
  }, [vocabularyItemsShuffled, currentIndex])

  const onAudioRecorded = async (recordingPath: string): Promise<void> => {
    await moveFile(recordingPath, userAudioPathWithFormat)
    setUserAudioExists(true)
    await startProfAudioPlayer(true)
  }

  const onCloseRecording = (): void => {
    setShowAudioRecordOverlay(false)
  }

  const onProfAudioButtonPressed = async (): Promise<void> => {
    await startProfAudioPlayer()
  }

  const onUserAudioButtonPressed = async (): Promise<void> => {
    await startUserAudioPlayer()
  }

  const tryLater = () => {
    setVocabularyItemsShuffled(moveToEnd(vocabularyItemsShuffled, currentIndex))
  }

  const onExerciseFinished = async (): Promise<void> => {
    const progress = await getExerciseProgress()
    const results = vocabularyItemsShuffled.map(vocabularyItem => ({
      vocabularyItem,
      result: SIMPLE_RESULTS.correct,
      numberOfTries: 1,
    }))
    await saveExerciseProgress(disciplineId, ExerciseKeys.speakExercise, results)
    navigation.navigate('ExerciseFinished', {
      vocabularyItems,
      disciplineId,
      disciplineTitle,
      exercise: ExerciseKeys.speakExercise,
      results,
      closeExerciseAction,
      unlockedNextExercise: willNextExerciseUnlock(
        progress[disciplineId]?.[ExerciseKeys.speakExercise],
        calculateScore(results)
      ),
    })
  }

  const onNextButtonPressed = async (): Promise<void> => {
    if (currentIndex === vocabularyItemsShuffled.length - 1) {
      await onExerciseFinished()
    } else {
      setUserAudioExists(false)
      setUserAudioWasPlayed(false)
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <RouteWrapper>
      {showAudioRecordOverlay && (
        <AudioRecordOverlay
          onClose={onCloseRecording}
          onAudioRecorded={onAudioRecorded}
          setShowAudioRecordOverlay={setShowAudioRecordOverlay}
          audioRecorderPlayer={playerForRecording}
        />
      )}
      <ExerciseHeader
        navigation={navigation}
        currentWord={currentIndex}
        numberOfWords={vocabularyItemsShuffled.length}
        closeExerciseAction={route.params.closeExerciseAction}
        feedbackType={FeedbackType.vocabularyItem}
        feedbackForId={vocabularyItemsShuffled[currentIndex].id}
      />
      <VocabularyItemImageSection vocabularyItem={vocabularyItemsShuffled[currentIndex]} />
      <InputContainer>
        <WordItem
          answer={{
            word: vocabularyItemsShuffled[currentIndex].word,
            article: vocabularyItemsShuffled[currentIndex].article,
          }}
        />
        <PlayIcon
          disabled={playWidthUserAudio > 0}
          isActive={playWidthProfAudio > 0}
          onPress={onProfAudioButtonPressed}>
          <PlayArrowIcon width={theme.spacingsPlain.xl} height={theme.spacingsPlain.xl /* TODO: is not shown */} />
        </PlayIcon>
        <AudioBar>
          <AudioBarPlay width={playWidthProfAudio} />
        </AudioBar>
        {userAudioExists && (
          <>
            <PlayIcon
              disabled={playWidthProfAudio > 0}
              isActive={playWidthUserAudio > 0}
              isUserAudio
              onPress={onUserAudioButtonPressed}>
              <PlayArrowIcon width={theme.spacingsPlain.xl} height={theme.spacingsPlain.xl /* TODO: is not shown */} />
            </PlayIcon>
            <AudioBar>
              <AudioBarPlay width={playWidthUserAudio} />
            </AudioBar>
          </>
        )}
        <AddAudioButton
          onPress={() => setShowAudioRecordOverlay(true)}
          label={userAudioExists ? retakeAudio : addAudio}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={MicrophoneCircleIcon}
          iconSize={theme.spacingsPlain.xl}
        />
      </InputContainer>
      <ButtonContainer>
        {userAudioExists && userAudioWasPlayed && (
          <Button
            label={
              currentIndex === vocabularyItemsShuffled.length - 1
                ? getLabels().exercises.showResults
                : getLabels().exercises.next
            }
            iconRight={ArrowRightIcon}
            onPress={onNextButtonPressed}
            buttonTheme={BUTTONS_THEME.contained}
          />
        )}
        {!userAudioExists && currentIndex < vocabularyItemsShuffled.length - 1 && (
          <Button
            label={getLabels().exercises.tryLater}
            iconRight={ArrowRightIcon}
            onPress={tryLater}
            buttonTheme={BUTTONS_THEME.text}
          />
        )}
      </ButtonContainer>
    </RouteWrapper>
  )
}

export default SpeakExerciseScreen
