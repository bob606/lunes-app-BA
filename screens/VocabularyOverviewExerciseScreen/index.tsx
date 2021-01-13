import {
  React,
  Text,
  View,
  styles,
  IVocabularyOverviewScreen,
  TouchableOpacity,
  Home,
  useState,
  ENDPOINTS,
  IDocumentProps,
  useFocusEffect,
  axios,
  ListView,
} from './imports';

const VocabularyOverviewExerciseScreen = ({
  navigation,
  route,
}: IVocabularyOverviewScreen) => {
  const {extraParams} = route.params;
  const [documents, setDocuments] = useState<IDocumentProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <Home />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      let isActive: boolean = true;

      const getProfessions = async () => {
        try {
          const documentsRes = await axios.get(
            ENDPOINTS.documents.all.replace(':id', `${extraParams}`),
          );

          if (isActive) {
            setDocuments(documentsRes.data);
            setCount(documentsRes.data.length);
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
        }
      };

      getProfessions();

      return () => {
        isActive = false;
      };
    }, [extraParams]),
  );

  return (
    <View style={styles.root}>
      <ListView
        listData={documents}
        title={
          <>
            <Text style={styles.title}>Vocabulary Overview</Text>
            <Text style={styles.description}>
              {count} {count == 1 ? 'Word' : 'Words'}
            </Text>
          </>
        }
        navigation={navigation}
        fromExercises
        isLoading={isLoading}
      />
    </View>
  );
};

export default VocabularyOverviewExerciseScreen;
