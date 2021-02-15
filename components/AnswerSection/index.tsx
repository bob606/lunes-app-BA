import {
  React,
  TouchableOpacity,
  useState,
  View,
  COLORS,
  styles,
  TextInput,
  CloseIcon,
  IAnswerSectionProps,
  Popover,
  VolumeUp,
  Platform,
  SoundPlayer,
  Tts,
  AsyncStorage,
  IDocumentProps,
  Feedback,
  stringSimilarity,
  Actions,
  SCREENS,
  PopoverContent,
  useFocusEffect,
} from './imports';

const AnswerSection = ({
  count,
  index,
  setIndex,
  currentWordNumber,
  setCurrentWordNumber,
  document,
  setDocuments,
  increaseProgress,
  navigation,
  extraParams,
}: IAnswerSectionProps) => {
  const [input, setInput] = useState('');
  const touchable: any = React.createRef();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [dataLength, setDataLength] = useState(count); //for try later documents array
  const [tryLaterDocuments, setTryLaterDocuments] = useState<IDocumentProps[]>(
    [],
  );
  const [isTryLater, setIsTryLater] = useState(false); //repeat try later documents
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [word, setWord] = useState('');
  const [documentArticle, setArticle] = useState('');
  const [isAlmostCorrect, setIsAlmostCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const borderColor = isCorrect
    ? COLORS.lunesFunctionalCorrectDark
    : isIncorrect
    ? COLORS.lunesFunctionalIncorrectDark
    : isAlmostCorrect
    ? COLORS.lunesFunctionalAlmostCorrectDark
    : input
    ? COLORS.lunesBlack
    : COLORS.lunesGreyMedium;

  const volumeIconColor =
    !isCorrect && !isIncorrect
      ? COLORS.lunesBlackUltralight
      : isActive
      ? COLORS.lunesRedDark
      : COLORS.lunesRed;

  const clearTextInput = () => {
    setInput('');
  };

  const modifyHeaderCounter = () => {
    if (currentWordNumber < count) {
      setCurrentWordNumber(currentWordNumber + 1);
    }
  };

  const getNextWord = () => {
    if (index < dataLength - 1) {
      setIndex(index + 1);
    } else {
      if (currentWordNumber !== count) {
        setIsTryLater(true);
      }
    }
  };

  const modifyStates = (
    newIsCorrect: boolean,
    newIsIncorrect: boolean,
    newIsAlmostCorrect: boolean,
  ) => {
    setIsCorrect(newIsCorrect);
    setIsIncorrect(newIsIncorrect);
    setIsAlmostCorrect(newIsAlmostCorrect);
  };

  const checkIfLastWord = () => {
    if (currentWordNumber === count) {
      setIsFinished(true);
    }
  };

  const storeCorrectResults = (checkedDocument: IDocumentProps) => {
    try {
      AsyncStorage.getItem('correct').then((value) => {
        const results: IDocumentProps[] = value && JSON.parse(value);
        results.push(checkedDocument);
        AsyncStorage.setItem('correct', JSON.stringify(results));
      });

      AsyncStorage.getItem('incorrect').then((value) => {
        const results: IDocumentProps[] = value && JSON.parse(value);
        const index = results.findIndex(
          (value) => value.id === checkedDocument.id,
        );
        if (index > -1) {
          results.splice(index, 1);
          AsyncStorage.setItem('incorrect', JSON.stringify(results));
        }
      });

      AsyncStorage.getItem('almost correct').then((value) => {
        const results: IDocumentProps[] = value && JSON.parse(value);
        const index = results.findIndex(
          (value) => value.id === checkedDocument.id,
        );
        if (index > -1) {
          results.splice(index, 1);
          AsyncStorage.setItem('almost correct', JSON.stringify(results));
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const storeAlmsotCorrectAnswers = (checkedDocument: IDocumentProps) => {
    try {
      AsyncStorage.getItem('almost correct').then((value) => {
        const results: IDocumentProps[] = value && JSON.parse(value);
        const index = results.findIndex(
          (value) => value.id === checkedDocument.id,
        );
        if (index > -1) {
          return;
        } else {
          results.push(checkedDocument);
          AsyncStorage.setItem('almost correct', JSON.stringify(results));

          AsyncStorage.getItem('incorrect').then((value) => {
            const results: IDocumentProps[] = value && JSON.parse(value);
            const index = results.findIndex(
              (value) => value.id === checkedDocument.id,
            );
            if (index > -1) {
              results.splice(index, 1);
              AsyncStorage.setItem('incorrect', JSON.stringify(results));
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const storeIncorrectAnswers = (checkedDocument: IDocumentProps) => {
    try {
      AsyncStorage.getItem('incorrect').then((value) => {
        const results: IDocumentProps[] = value && JSON.parse(value);
        const index = results.findIndex(
          (value) => value.id === checkedDocument.id,
        );
        if (index > -1) {
          return;
        } else {
          results.push(checkedDocument);
          AsyncStorage.setItem('incorrect', JSON.stringify(results));

          AsyncStorage.getItem('almost correct').then((value) => {
            const results: IDocumentProps[] = value && JSON.parse(value);
            const index = results.findIndex(
              (value) => value.id === checkedDocument.id,
            );
            if (index > -1) {
              results.splice(index, 1);
              AsyncStorage.setItem('almost correct', JSON.stringify(results));
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const validateForCorrect = (inputArticle: string, inputWord: string) => {
    let correct: boolean | undefined = false;

    if (inputArticle === document?.article && inputWord === document?.word) {
      correct = true;
    } else {
      correct = document?.alternatives?.some(
        ({article, alt_word}) =>
          inputArticle === article && inputWord === alt_word,
      );
    }

    if (document && correct) {
      modifyStates(true, false, false);
      storeCorrectResults(document);
      checkIfLastWord();
    }

    return correct;
  };

  const validateForSimilar = (inputArticle: string, inputWord: string) => {
    if (isAlmostCorrect && document) {
      modifyStates(false, true, false);
      storeAlmsotCorrectAnswers(document);
      checkIfLastWord();
      return true;
    } else {
      let similar: boolean | undefined = false;

      if (
        document &&
        inputArticle === document.article &&
        stringSimilarity.compareTwoStrings(inputWord, document.word) > 0.4
      ) {
        similar = true;
      } else {
        similar = document?.alternatives?.some(
          ({article, alt_word}) =>
            inputArticle === article &&
            stringSimilarity.compareTwoStrings(inputWord, alt_word) > 0.4,
        );
      }

      if (similar) {
        modifyStates(false, false, true);
      }

      return similar;
    }
  };

  const validateForIncorrect = () => {
    if (document) {
      modifyStates(false, true, false);
      storeIncorrectAnswers(document);
      checkIfLastWord();
    }
  };

  const validateInput = (inputArticle: string, inputWord: string) => {
    if (!validateForCorrect(inputArticle, inputWord)) {
      if (!validateForSimilar(inputArticle, inputWord)) {
        validateForIncorrect();
      }
    }
  };

  const checkEntry = () => {
    const splitInput = input.trim().split(' ');

    if (splitInput.length < 2) {
      setIsPopoverVisible(true);
    } else {
      let inputArticle = splitInput[0];
      let inputWord = splitInput[1];
      setWord(inputWord);
      setArticle(inputArticle);

      validateInput(inputArticle.toLowerCase(), inputWord);
    }
  };

  const markAsIncorrect = () => {
    if (document) {
      storeIncorrectAnswers(document);
    }
    increaseProgress();

    if (currentWordNumber === count) {
      handleCheckOutClick();
    } else {
      getNextWordAndModifyCounter();
    }
  };

  const addToTryLater = () => {
    if (document) {
      setTryLaterDocuments((oldDocuments) => [...oldDocuments, document]);
    }
    getNextWord();
  };

  const handleSpeakerClick = (audio?: string) => {
    setIsActive(true);

    // Don't use soundplayer for IOS, since IOS doesn't support .ogg files
    if (audio && Platform.OS !== 'ios') {
      //audio from API
      SoundPlayer.playUrl(document?.audio);
    } else {
      Tts.speak(document?.word, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }
  };

  const getNextWordAndModifyCounter = () => {
    getNextWord();
    modifyHeaderCounter();
    modifyStates(false, false, false);
  };

  const handleCheckOutClick = () => {
    navigation.navigate(SCREENS.initialSummaryScreen, extraParams);
  };

  const resetStates = () => {
    setTryLaterDocuments([]);
    setIsCorrect(false);
    setIsIncorrect(false);
    setIsTryLater(false);
    setIsAlmostCorrect(false);
    setIsFinished(false);
    setInput('');
  };

  useFocusEffect(
    React.useCallback(() => {
      resetStates();
    }, []),
  );

  React.useEffect(() => {
    let _onSoundPlayerFinishPlaying: any = null;
    let _onTtsFinishPlaying: any = null;

    _onSoundPlayerFinishPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => {
        setIsActive(false);
      },
    );

    _onTtsFinishPlaying = Tts.addEventListener('tts-finish', () =>
      setIsActive(false),
    );

    return () => {
      _onSoundPlayerFinishPlaying.remove();
      _onTtsFinishPlaying.remove();
    };
  }, []);

  React.useEffect(() => {
    clearTextInput();
  }, [index]);

  React.useEffect(() => {
    setDataLength(count);
  }, [count]);

  React.useEffect(() => {
    if (isTryLater) {
      setIndex(0);
      setDocuments(tryLaterDocuments);
      setDataLength(tryLaterDocuments.length);
      setTryLaterDocuments([]);
      setIsTryLater(false);
    }
  }, [isTryLater, setIndex, setDocuments, tryLaterDocuments]);

  React.useEffect(() => {
    if (isCorrect || isIncorrect) {
      increaseProgress();
    }
  }, [isCorrect, isIncorrect, increaseProgress]);

  React.useEffect(() => {
    if (isAlmostCorrect) {
      clearTextInput();
    }
  }, [isAlmostCorrect]);

  return (
    <View style={styles.container}>
      <Popover
        isVisible={isPopoverVisible}
        setIsPopoverVisible={setIsPopoverVisible}
        ref={touchable}>
        <PopoverContent />
      </Popover>

      <TouchableOpacity
        disabled={isCorrect || isIncorrect ? false : true}
        style={styles.volumeIcon}
        onPress={() => handleSpeakerClick(document?.audio)}>
        <VolumeUp fill={volumeIconColor} />
      </TouchableOpacity>

      <View
        ref={touchable}
        style={[
          styles.textInputContainer,
          {
            borderColor: borderColor,
          },
        ]}>
        <TextInput
          style={styles.textInput}
          placeholder={
            isAlmostCorrect ? 'Try again' : 'Enter Word with article'
          }
          placeholderTextColor={COLORS.lunesBlackLight}
          value={input}
          onChangeText={(text) => setInput(text)}
          editable={!isCorrect && !isIncorrect}
        />
        {!!input && !isCorrect && !isIncorrect && (
          <TouchableOpacity onPress={clearTextInput}>
            <CloseIcon />
          </TouchableOpacity>
        )}
      </View>

      <Feedback
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        almostCorrect={isAlmostCorrect}
        document={document}
        word={word}
        article={documentArticle}
      />

      <Actions
        input={input}
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        isAlmostCorrect={isAlmostCorrect}
        checkEntry={checkEntry}
        addToTryLater={addToTryLater}
        getNextWordAndModifyCounter={getNextWordAndModifyCounter}
        markAsIncorrect={markAsIncorrect}
        isFinished={isFinished}
        checkOut={handleCheckOutClick}
      />
    </View>
  );
};

export default AnswerSection;
