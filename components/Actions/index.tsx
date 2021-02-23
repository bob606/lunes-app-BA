import {
  React,
  Text,
  styles,
  WhiteNextArrow,
  NextArrow,
  IActionsProps,
  Button,
  BUTTONS_THEME,
} from './imports';

const Actions = ({
  result,
  giveUp,
  checkEntry,
  getNextWord,
  input,
  isFinished,
  tryLater,
}: IActionsProps) => {
  return result ? (
    <Button onPress={getNextWord} theme={BUTTONS_THEME.dark}>
      <Text style={[styles.lightLabel, styles.arrowLabel]}>
        {isFinished ? 'Check out' : 'Next Word'}
      </Text>
      <WhiteNextArrow />
    </Button>
  ) : (
    <>
      <Button onPress={checkEntry} disabled={!input} theme={BUTTONS_THEME.dark}>
        <Text style={[styles.lightLabel, !input && styles.disabledButtonLabel]}>
          Check entry
        </Text>
      </Button>

      <Button onPress={giveUp} theme={BUTTONS_THEME.light}>
        <Text style={styles.darkLabel}>I give up!</Text>
      </Button>

      {!isFinished && !result && (
        <Button onPress={tryLater}>
          <Text style={styles.darkLabel}>Try later</Text>
          <NextArrow style={styles.arrow} />
        </Button>
      )}
    </>
  );
};

export default Actions;
