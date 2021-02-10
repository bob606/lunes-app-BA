import {
  React,
  TouchableOpacity,
  styles,
  IButtonProps,
  BUTTONS_THEME,
} from './imports';

const Button = ({children, onPress, disabled, theme, style}: IButtonProps) => {
  const buttonStyle = disabled
    ? [styles.darkButton, styles.disabledButton]
    : theme === BUTTONS_THEME.light
    ? styles.lightButton
    : theme === BUTTONS_THEME.dark
    ? styles.darkButton
    : styles.button;

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}
      disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;
