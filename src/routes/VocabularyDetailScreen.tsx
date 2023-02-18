import { RouteProp } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { ScrollView } from 'react-native'

import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetail from '../components/VocabularyDetail'
import { RoutesParams } from '../navigation/NavigationTypes'

interface VocabularyDetailScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyDetail'>
}

const VocabularyDetailScreen = ({ route }: VocabularyDetailScreenProps): ReactElement => {
  const { vocabularyItem } = route.params
  return (
    <RouteWrapper>
      <ScrollView>
        <VocabularyDetail vocabularyItem={vocabularyItem} />
      </ScrollView>
    </RouteWrapper>
  )
}

export default VocabularyDetailScreen
