import React, { ReactElement, useState } from 'react'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import styled, { useTheme } from 'styled-components/native'

import { CloseCircleIconBlue } from '../../assets/images'
import AudioRecordOverlay from '../routes/process-user-vocabulary/components/AudioRecordOverlay'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import AddAudioButton from './AddAudioButton'
import AudioPlayer from './AudioPlayer'
import { Subheading } from './text/Subheading'

const AudioContainer = styled.View`
  margin: ${props => props.theme.spacings.md} 0;
  justify-content: flex-start;
  padding: 0;
  flex-direction: row;
  align-items: center;
`

const DeleteContainer = styled.Pressable`
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.md}`};
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const AudioText = styled(Subheading)`
  align-self: center;
`

interface AudioRecorderProps {
  recordingPath: string | null
  setRecordingPath: (path: string | null) => void
}

const accuracy = 0.1

const audioRecorderPlayer = new AudioRecorderPlayer()
audioRecorderPlayer.setSubscriptionDuration(accuracy).catch(reportError)

const AudioRecorder = ({ recordingPath, setRecordingPath }: AudioRecorderProps): ReactElement => {
  const [showAudioRecordOverlay, setShowAudioRecordOverlay] = useState<boolean>(false)
  const theme = useTheme()
  const { addAudio } = getLabels().userVocabulary.creation

  const onAudioRecorded = (recordingPath: string) => {
    setRecordingPath(recordingPath)
  }

  const onCloseRecording = (): void => {
    setShowAudioRecordOverlay(false)
    setRecordingPath(null)
  }

  return (
    <>
      {showAudioRecordOverlay && (
        <AudioRecordOverlay
          onClose={onCloseRecording}
          onAudioRecorded={onAudioRecorded}
          recordingPath={recordingPath}
          setShowAudioRecordOverlay={setShowAudioRecordOverlay}
          audioRecorderPlayer={audioRecorderPlayer}
        />
      )}
      {recordingPath ? (
        <AudioContainer>
          <>
            <AudioText>{recordingPath.substring(recordingPath.lastIndexOf('/') + 1).toUpperCase()}</AudioText>
            <DeleteContainer onPress={() => setRecordingPath(null)} testID='delete-audio-recording'>
              <CloseCircleIconBlue width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
            </DeleteContainer>
            <AudioPlayer audio={recordingPath} disabled={!recordingPath} />
          </>
        </AudioContainer>
      ) : (
        <AddAudioButton onPress={() => setShowAudioRecordOverlay(true)} label={addAudio} />
      )}
    </>
  )
}

export default AudioRecorder
