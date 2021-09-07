import React, { ReactElement } from 'react'
import { CloseButton, WhiteNextArrow } from '../../../../assets/images'
import ImageCarousel from '../../../components/ImageCarousel'
import AudioPlayer from '../../../components/AudioPlayer'
import SingleChoiceListItem from '../../choice-exercises/components/SingleChoiceListItem'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { Modal, SafeAreaView } from 'react-native'
import { DocumentsType } from '../../../constants/endpoints'
import styled from 'styled-components/native'

const ModalContainer = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
  width: 100%;
`

const ModalHeader = styled.View`
  display: flex;
  align-items: flex-end;
  padding: 10px;
  border-bottom-color: ${props => props.theme.colors.lunesBlackUltralight};
  border-bottom-width: 1px;
  margin-bottom: 10px;
`

const ItemContainer = styled.View`
  padding: 5%;
  height: 45%;
`

const ButtonContainer = styled.View`
  display: flex;
  align-items: center;
  margin-top: -40%;
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.lunesWhite};
  font-weight: 600;
  margin-left: 10px;
  text-transform: uppercase;
`

interface VocabularyListModalPropsType {
  documents: DocumentsType
  isModalVisible: boolean
  setIsModalVisible: (isModalVisible: boolean) => void
  selectedDocumentIndex: number
  setSelectedDocumentIndex: (selectedDocumentIndex: number) => void
}

const VocabularyListModal = ({
  documents,
  isModalVisible,
  setIsModalVisible,
  selectedDocumentIndex,
  setSelectedDocumentIndex
}: VocabularyListModalPropsType): ReactElement => {
  const goToNextWord = (): void => {
    if (documents && selectedDocumentIndex + 1 < documents.length) {
      setSelectedDocumentIndex(selectedDocumentIndex + 1)
    }
  }

  return (
    <Modal animationType='slide' transparent={true} visible={isModalVisible}>
      <SafeAreaView>
        <ModalContainer>
          <ModalHeader>
            <CloseButton onPress={() => setIsModalVisible(false)} />
          </ModalHeader>
          <ImageCarousel images={documents[selectedDocumentIndex].document_image} />
          <AudioPlayer document={documents[selectedDocumentIndex]} disabled={false} />
          <ItemContainer>
            <SingleChoiceListItem
              answer={{
                word: documents[selectedDocumentIndex].word,
                article: documents[selectedDocumentIndex].article
              }}
              onClick={() => {}}
              correct={false}
              selected={false}
              anyAnswerSelected={false}
              delayPassed={false}
              disabled={true}
            />
          </ItemContainer>
          <ButtonContainer>
            {documents.length > selectedDocumentIndex + 1 ? (
              <Button onPress={goToNextWord} buttonTheme={BUTTONS_THEME.dark}>
                <>
                  <ButtonText>{labels.exercises.next}</ButtonText>
                  <WhiteNextArrow />
                </>
              </Button>
            ) : (
              <Button onPress={() => setIsModalVisible(false)} buttonTheme={BUTTONS_THEME.dark}>
                <>
                  <ButtonText>{labels.general.header.cancelExercise}</ButtonText>
                </>
              </Button>
            )}
          </ButtonContainer>
        </ModalContainer>
      </SafeAreaView>
    </Modal>
  )
}

export default VocabularyListModal