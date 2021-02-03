import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 16,
    paddingLeft: 25,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('85%'),
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
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  clickedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.white,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  icon: {
    justifyContent: 'center',
    marginRight: 10,
    width: 24,
    height: 24,
  },
  left: {flexDirection: 'row', alignItems: 'center'},
});
