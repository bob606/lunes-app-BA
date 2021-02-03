import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
  },
  list: {
    paddingHorizontal: 15,
    flex: 1,
    width: wp('100%'),
    marginTop: 50,
  },
  screenDescription: {
    fontSize: 14,
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
  description: {
    fontSize: 14,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular',
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  container: {
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 16,
    paddingLeft: 25,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('85%'),
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  clickedContainer: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 16,
    paddingLeft: 25,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('85%'),
    backgroundColor: COLORS.lunesBlack,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  clickedItemTitle: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  clickedItemDescription: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.white,
    fontFamily: 'SourceSansPro-Regular',
  },
  level: {
    marginTop: 11,
  },
  title2: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
  },
});
