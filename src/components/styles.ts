import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flatlistContainer: {
    flex: 1,
  },
  mainContainer: {
    width: '100%',
    height: 80,
    position: 'relative',
  },
  middleContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    justifyContent: 'center',
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  defaultThumb: {
    position: 'absolute',
    left: '50%',
    borderLeftWidth: 3,
    height: 80,
    alignSelf: 'center',
  },
  mainBlock: {
    borderRightWidth: 2,
    borderColor: '#979797',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  lastBlock: {
    borderRightWidth: 0,
  },
  subBlock: {
    height: 55,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    flexDirection: 'row',
    borderColor: '#979797',
  },
  subBlockLine: {
    borderRightWidth: 1,
    borderColor: '#979797',
    height: '100%',
  },
  blocksContainer: {
    flexDirection: 'row',
  },
});

export default styles;
