import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback } from 'react'
import { Pressable } from 'react-native'
import { Subheading } from 'react-native-paper'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../assets/images'
import AddElement from '../../components/AddElement'
import HorizontalLine from '../../components/HorizontalLine'
import ListItem from '../../components/ListItem'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { Heading } from '../../components/text/Heading'
import { Discipline } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { removeSelectedProfession } from '../../services/AsyncStorage'
import { reportError } from '../../services/sentry'
import CustomDisciplineItem from './components/CustomDisciplineItem'

const Root = styled.ScrollView`
  display: flex;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacings.md};
`

const SectionHeading = styled(Subheading)`
  padding-top: ${props => props.theme.spacings.xl};
`

const Padding = styled.View`
  padding-bottom: ${props => props.theme.spacings.xxl};
`

interface Props {
  navigation: StackNavigationProp<RoutesParams, 'ManageDisciplines'>
}

const ManageDisciplinesScreen = ({ navigation }: Props): ReactElement => {
  const {
    data: selectedProfessions,
    loading,
    error,
    refresh: refreshSelectedProfessions
  } = useReadSelectedProfessions()
  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()

  const refresh = useCallback(() => {
    refreshCustomDisciplines()
    refreshSelectedProfessions()
  }, [refreshCustomDisciplines, refreshSelectedProfessions])

  React.useEffect(() => {
    refresh()
    const willFocusSubscription = navigation.addListener('focus', () => {
      refresh()
    })
    return willFocusSubscription
  }, [navigation, refresh])

  const Item = ({ item }: { item: Discipline }): JSX.Element => {
    const unselectProfessionAndRefresh = (item: Discipline) => {
      removeSelectedProfession(item)
        .then(refreshSelectedProfessions)
        .catch(err => reportError(err))
    }
    return (
      <ListItem
        icon={item.icon}
        title={item.title}
        rightChildren={
          <Pressable onPress={() => unselectProfessionAndRefresh(item)} testID='delete-icon'>
            <CloseIconRed />
          </Pressable>
        }
      />
    )
  }

  const navigateToProfessionSelection = () => {
    navigation.push('Intro', { initialSelection: false })
  }

  const navigateToAddCustomDiscipline = () => {
    navigation.push('AddCustomDiscipline')
  }

  return (
    <Root contentContainerStyle={{ flexGrow: 1 }}>
      <Heading>{labels.manageDisciplines.heading}</Heading>
      <SectionHeading>{labels.manageDisciplines.yourProfessions}</SectionHeading>
      <HorizontalLine />
      <ServerResponseHandler error={error} loading={loading} refresh={refreshSelectedProfessions}>
        {selectedProfessions?.map(profession => (
          <Item key={profession.id} item={profession} />
        ))}
      </ServerResponseHandler>
      <AddElement onPress={navigateToProfessionSelection} label={labels.manageDisciplines.addProfession} />

      <SectionHeading>{labels.manageDisciplines.yourCustomDisciplines}</SectionHeading>
      <HorizontalLine />
      <ServerResponseHandler error={error} loading={loading} refresh={refreshCustomDisciplines}>
        {customDisciplines?.map(customDiscipline => (
          <CustomDisciplineItem key={customDiscipline} refresh={refreshCustomDisciplines} apiKey={customDiscipline} />
        ))}
      </ServerResponseHandler>

      <AddElement
        onPress={navigateToAddCustomDiscipline}
        label={labels.home.addCustomDiscipline}
        explanation={labels.manageDisciplines.descriptionAddCustomDiscipline}
      />
      <Padding />
    </Root>
  )
}

export default ManageDisciplinesScreen
