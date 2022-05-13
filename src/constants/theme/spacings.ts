import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

// These pixels are calculated for a 800px height mobile screen
export const SPACINGS = {
  xxs: `${hp('0.5%')}px`, // 4px
  xs: `${hp('1%')}px`, // 8px
  sm: `${hp('2%')}px`, // 16px
  md: `${hp('3%')}px`, // 24px
  lg: `${hp('4%')}px`, // 32px
  xl: `${hp('5%')}px`, // 40px
  xxl: `${hp('6%')}px` // 48px
}
