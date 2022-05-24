import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import ErrorMessage from '../../../components/ErrorMessage'
import Loading from '../../../components/Loading'
import { ContentSecondary } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { Discipline, Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import theme from '../../../constants/theme'
import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { loadDocuments } from '../../../hooks/useLoadDocuments'
import useReadNextExercise from '../../../hooks/useReadNextExercise'
import useReadProgress from '../../../hooks/useReadProgress'
import { childrenLabel } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'
import Card from './Card'

const ProgressContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

const LoadingContainer = styled.View`
  padding-top: ${props => props.theme.spacings.xxl};
`

const NumberText = styled(Subheading)`
  font-size: ${props => props.theme.fonts.headingFontSize};
  padding: ${props => props.theme.spacings.xs};
`

const UnitText = styled(ContentSecondary)`
  font-size: ${props => props.theme.fonts.headingFontSize};
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.xxs} auto;
`

interface PropsType {
  disciplineId: number
  onPress: (profession: Discipline) => void
  navigateToNextExercise: (
    disciplineId: number,
    exerciseKey: number,
    disciplineTitle: string,
    documents: Document[]
  ) => void
}

const DisciplineCard = (props: PropsType): ReactElement => {
  const { disciplineId, onPress, navigateToNextExercise } = props
  const { data: discipline, loading, error, refresh } = useLoadDiscipline(disciplineId)
  const { data: nextExercise, refresh: refreshNextExercise } = useReadNextExercise(discipline)
  const { data: progress, refresh: refreshProgress } = useReadProgress(discipline)

  const moduleAlreadyStarted = progress !== null && progress !== 0
  const [documents, setDocuments] = useState<Document[] | null>(null)

  useFocusEffect(
    useCallback(() => {
      refreshProgress()
      refreshNextExercise()
    }, [refreshProgress, refreshNextExercise])
  )

  useEffect(() => {
    if (nextExercise) {
      loadDocuments({ disciplineId: nextExercise.disciplineId })
        .then(data => {
          setDocuments(data)
        })
        .catch(reportError)
    }
  }, [nextExercise])

  const navigate = () => {
    if (documents !== null && nextExercise !== null) {
      navigateToNextExercise(nextExercise.disciplineId, nextExercise.exerciseKey, '', documents) // TODO set discipline title correct LUN-320
    }
  }

  if (loading) {
    return (
      <Card>
        <LoadingContainer>
          <Loading isLoading={loading} />
        </LoadingContainer>
      </Card>
    )
  }

  if (!discipline) {
    return (
      <Card>
        <ErrorMessage error={error} refresh={refresh} />
      </Card>
    )
  }

  return (
    <Card heading={discipline.title} icon={discipline.icon} onPress={() => onPress(discipline)}>
      <>
        <ProgressContainer>
          <Progress.Circle
            progress={progress ?? 0}
            size={50}
            indeterminate={false}
            color={theme.colors.progressIndicator}
            unfilledColor={theme.colors.disabled}
            borderWidth={0}
            thickness={6}
            testID='progress-circle'
          />
          {discipline.leafDisciplines && (
            <NumberText>
              {moduleAlreadyStarted && `${Math.floor(progress * discipline.leafDisciplines.length)}/`}
              {discipline.leafDisciplines.length}
            </NumberText>
          )}
          <UnitText>{moduleAlreadyStarted ? labels.home.progressDescription : childrenLabel(discipline)}</UnitText>
        </ProgressContainer>
        <ButtonContainer>
          <Button
            onPress={navigate}
            label={moduleAlreadyStarted ? labels.home.continue : labels.home.start}
            buttonTheme={BUTTONS_THEME.outlined}
            disabled={documents === null || nextExercise === null}
          />
        </ButtonContainer>
      </>
    </Card>
  )
}

export default DisciplineCard
