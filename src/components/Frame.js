import * as React from 'react';
import { View, Image, StyleSheet, Platform, Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
class Frame extends React.PureComponent {
  render() {
    const { index, duration, framesPath } = this.props;
    const frame = `${framesPath}${index + 1}.jpg`;
    const lastFrameIndex = 2 * duration - 1;
    return index < lastFrameIndex
      ? React.createElement(Image, {
          source: {
            uri: frame,
          },
          style: styles.container,
        })
      : React.createElement(View, { style: styles.container });
  }
}
const styles = StyleSheet.create({
  container: {
    width: 40,
    height: Platform.select({
      ios: width / 6,
      android: width / 6.5,
    }),
  },
});
export default Frame;
