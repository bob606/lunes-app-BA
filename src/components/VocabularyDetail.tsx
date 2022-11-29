import React, { ReactElement, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import { DocumentDirectoryPath, exists, moveFile } from 'react-native-fs'
import styled, { useTheme } from 'styled-components/native'

import { MicrophoneCircleIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import { VocabularyItem } from '../constants/endpoints'
import AudioRecordOverlay from '../routes/process-user-vocabulary/components/AudioRecordOverlay'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import Button from './Button'
import VocabularyItemImageSection from './VocabularyItemImageSection'
import WordItem from './WordItem'

const ItemContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xl};
  height: 10%;
  width: 85%;
  align-self: center;
`

// TODO: for clean code export, double of AudioRecorder.tsx line 35
const AddAudioButton = styled(Button)`
  margin-top: ${props => props.theme.spacings.md};
  justify-content: flex-start;
  padding: 0;
`

interface VocabularyDetailProps {
  vocabularyItem: VocabularyItem
}

const accuracy = 0.1

const audioRecorderPlayer = new AudioRecorderPlayer()
audioRecorderPlayer.setSubscriptionDuration(accuracy).catch(reportError)

const VocabularyDetail = ({ vocabularyItem }: VocabularyDetailProps): ReactElement => {
  const theme = useTheme()
  const [showAudioRecordOverlay, setShowAudioRecordOverlay] = useState<boolean>(false)
  const [userAudioExists, setUserAudioExists] = useState<boolean | null>(null)
  const { addAudio, retakeAudio } = getLabels().userAudio

  const audioPath = `file:///${DocumentDirectoryPath}/userAudio-${vocabularyItem.id}`
  const audioPathWithFormat = Platform.OS === 'ios' ? `${audioPath}.m4a` : `${audioPath}.mp4`

  useEffect(() => {
    exists(audioPathWithFormat)
      .then(result => {
        setUserAudioExists(result)
      })
      .catch(() => {
        // insert error catching here
      })
  }, [audioPathWithFormat])

  const onAudioRecorded = async (recordingPath: string): Promise<void> => {
    setUserAudioExists(true)
    await moveFile(recordingPath, audioPathWithFormat)
  }

  const onCloseRecording = (): void => {
    setShowAudioRecordOverlay(false)
  }

  return (
    <>
      {showAudioRecordOverlay && (
        <AudioRecordOverlay
          onClose={onCloseRecording}
          onAudioRecorded={onAudioRecorded}
          recordingPath={null}
          setShowAudioRecordOverlay={setShowAudioRecordOverlay}
          audioRecorderPlayer={audioRecorderPlayer}
        />
      )}
      <VocabularyItemImageSection
        vocabularyItem={vocabularyItem}
        userAudioPath={userAudioExists ? audioPathWithFormat : undefined}
      />
      <ItemContainer>
        <WordItem answer={{ word: vocabularyItem.word, article: vocabularyItem.article }} />
        <AddAudioButton
          onPress={() => setShowAudioRecordOverlay(true)}
          label={userAudioExists ? retakeAudio : addAudio}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={MicrophoneCircleIcon}
          iconSize={theme.spacingsPlain.xl}
        />
      </ItemContainer>
    </>
  )
}

export default VocabularyDetail
