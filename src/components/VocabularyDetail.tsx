import React, { ReactElement, useEffect, useState } from 'react'
import { Platform, View } from 'react-native'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import { DocumentDirectoryPath, exists, moveFile } from 'react-native-fs'
import styled from 'styled-components/native'

import { VocabularyItem } from '../constants/endpoints'
import AudioRecordOverlay from '../routes/process-user-vocabulary/components/AudioRecordOverlay'
import AlternativeWordsSection from '../routes/vocabulary-detail-exercise/components/AlternativeWordsSection'
import { getLabels, getUserAudioPathWithFormat } from '../services/helpers'
import { reportError } from '../services/sentry'
import AddAudioButton from './AddAudioButton'
import HorizontalLine from './HorizontalLine'
import VocabularyItemImageSection from './VocabularyItemImageSection'
import WordItem from './WordItem'

const ItemContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xl};
  height: 10%;
  width: 85%;
  align-self: center;
`

interface VocabularyDetailProps {
  vocabularyItem: VocabularyItem
}

const accuracy = 0.1

const audioRecorderPlayer = new AudioRecorderPlayer()
audioRecorderPlayer.setSubscriptionDuration(accuracy).catch(reportError)

const VocabularyDetail = ({ vocabularyItem }: VocabularyDetailProps): ReactElement => {
  const [showAudioRecordOverlay, setShowAudioRecordOverlay] = useState<boolean>(false)
  const [userAudioExists, setUserAudioExists] = useState(false)
  const { addAudio, retakeAudio } = getLabels().userAudio
  const [userAudioPathWithFormat, setUserAudioPathWithFormat] = useState(getUserAudioPathWithFormat(vocabularyItem.id))
  const audioPath = `file:///${DocumentDirectoryPath}/userAudio-${vocabularyItem.id}`
  const audioPathWithFormat = Platform.OS === 'ios' ? `${audioPath}.m4a` : `${audioPath}.mp4`

  useEffect(() => {
    exists(userAudioPathWithFormat)
      .then(result => {
        setUserAudioExists(result)
      })
      .catch(() => {
        // insert error catching here for production
      })
  }, [userAudioPathWithFormat])

  useEffect(() => {
    setUserAudioPathWithFormat(getUserAudioPathWithFormat(vocabularyItem.id))
  }, [vocabularyItem])

  const onAudioRecorded = async (recordingPath: string): Promise<void> => {
    setUserAudioExists(true)
    await moveFile(recordingPath, audioPathWithFormat)
  }

  const onCloseRecording = (): void => {
    setShowAudioRecordOverlay(false)
  }

  return (
    <View style={{ flex: 1 }}>
      {showAudioRecordOverlay && (
        <AudioRecordOverlay
          onClose={onCloseRecording}
          onAudioRecorded={onAudioRecorded}
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
        />
        <HorizontalLine />
        <AlternativeWordsSection vocabularyItem={vocabularyItem} />
      </ItemContainer>
    </View>
  )
}

export default VocabularyDetail
