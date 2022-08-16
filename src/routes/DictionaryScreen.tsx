import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { Subheading } from 'react-native-paper'
import styled from 'styled-components/native'

import { SadSmileyIcon } from '../../assets/images'
import RouteWrapper from '../components/RouteWrapper'
import SearchBar from '../components/SearchBar'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import VocabularyList from '../components/VocabularyList'
import VocabularyListItem from '../components/VocabularyListItem'
import { Content } from '../components/text/Content'
import { Document } from '../constants/endpoints'
import labels from '../constants/labels.json'
import useLoadAllDocuments from '../hooks/useLoadAllDocuments'
import { RoutesParams } from '../navigation/NavigationTypes'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const ListEmptyContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0;
`

const StyledSadSmileyIcon = styled(SadSmileyIcon)`
  padding: ${props => props.theme.spacings.md} 0;
`

const Header = styled.View`
  padding-bottom: ${props => props.theme.spacings.md};
`

interface Props {
  navigation: StackNavigationProp<RoutesParams, 'DictionaryOverview'>
}

const DictionaryScreen = ({ navigation }: Props) => {
  const documents = useLoadAllDocuments()
  const [searchString, setSearchString] = useState<string>('')
  const filteredDocuments = documents.data?.filter(item => item.word.includes(searchString))

  const navigateToDetail = (document: Document): void => {
    navigation.navigate('DictionaryDetail', { document })
  }

  const renderItem = ({ item }: { item: Document }): JSX.Element => (
    <VocabularyListItem document={item} onPress={() => navigateToDetail(item)} />
  )

  return (
    <RouteWrapper>
      <ServerResponseHandler error={documents.error} loading={documents.loading} refresh={documents.refresh}>
        <Root>
          {documents.data && (
            <FlatList
              keyboardShouldPersistTaps='handled'
              ListHeaderComponent={
                <Header>
                  <Title
                    title={labels.general.dictionary}
                    description={`${filteredDocuments?.length} ${
                      documents.data.length === 1 ? labels.general.word : labels.general.words
                    }`}
                  />
                  <SearchBar value={searchString} setValue={setSearchString} />
                </Header>
              }
              data={filteredDocuments}
              renderItem={renderItem}
              keyExtractor={item => `${item.id}`}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <ListEmptyContainer>
                  <StyledSadSmileyIcon />
                  <Subheading>{labels.dictionary.noResults}</Subheading>
                </ListEmptyContainer>
              }
            />
          )}
        </Root>
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default DictionaryScreen
