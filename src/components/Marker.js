import * as React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
class Marker extends React.PureComponent {
  render() {
    return React.createElement(View, {
      style: {
        ...styles.container,
        ...this.props.thumbStyle,
      },
    });
  }
}
const styles = StyleSheet.create({
  container: {
    width: 40,
    borderWidth: width / 70,
    borderColor: 'black',
    height: Platform.select({
      ios: width / 6,
      android: width / 6.5,
    }),
    zIndex: 99,
    backgroundColor: 'transparent',
    position: 'absolute',
    left: width / 2 - 20,
    alignSelf: 'center',
  },
});
export default Marker;
