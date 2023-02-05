import * as React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { FrameSlider } from './FrameSlider';
const { width, height } = Dimensions.get('window');
export class TrimmerComponent extends React.Component {
  videoPlayerRef = React.createRef();
  state = {
    progress: -1,
  };
  roundedDuration = Math.round(this.props.duration);
  componentDidUpdate(prevProps) {
    const valueChanged = prevProps.seekValue !== this.props.seekValue;
    const clipLengthChanged =
      prevProps.clipDuration !== this.props.clipDuration;
    const durationChanged = prevProps.duration !== this.props.duration;
    const progressChanged = this.state.progress !== prevProps.duration;
    if (this.videoPlayerRef.current) {
      if (clipLengthChanged || valueChanged) {
        this.videoPlayerRef.current.seek(this.props.seekValue);
      }
      if (progressChanged || clipLengthChanged || valueChanged) {
        if (
          this.props.seekValue + this.props.clipDuration ===
          this.state.progress
        ) {
          this.videoPlayerRef.current.seek(this.props.seekValue);
        }
      }
      if (clipLengthChanged || valueChanged || durationChanged) {
        if (
          this.props.seekValue + this.props.clipDuration >
          this.roundedDuration
        ) {
          this.videoPlayerRef.current.seek(this.props.seekValue);
        }
      }
    }
  }
  render() {
    const { seekValue, setSeekValue, path, framesPath } = this.props;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Video, {
        ref: this.videoPlayerRef,
        source: {
          uri: path,
        },
        style: [styles.videoContainer, this.props.videoContainerStyle],
        paused: this.props.paused || false,
        muted: this.props.muted || false,
        controls: this.props.controls || false,
        playInBackground: false,
        resizeMode: this.props.resizeMode || 'cover',
        repeat:
          this.props.repeat ||
          Platform.select({
            ios: true,
            android: false,
          }),
        onProgress: (data) =>
          this.setState({ progress: Math.round(data.currentTime) }),
        onEnd: () => {
          this.videoPlayerRef.current?.seek(seekValue);
        },
      }),
      React.createElement(FrameSlider, {
        value: seekValue,
        onValueChange: setSeekValue,
        framesPath: framesPath,
        duration: this.roundedDuration,
        multiplicity: 0.5,
        decimalPlaces: 0,
        flatlistStyle: {
          ...styles.flatlistStyle,
          ...this.props.sliderListStyle,
        },
        mainContainerStyle: {
          ...styles.mainContainerStyle,
          ...this.props.sliderContainerStyle,
        },
        maximumValue: this.roundedDuration - 1.5,
        thumbStyle: this.props.thumbStyle,
        renderThumb: this.props.renderThumb,
      })
    );
  }
}
const styles = StyleSheet.create({
  videoContainer: {
    width: width,
    height: height * 0.5,
    zIndex: 99,
  },
  flatlistStyle: {
    width: width,
    paddingLeft: width / 2 - 20,
    backgroundColor: 'gray',
  },
  mainContainerStyle: {
    height: Platform.select({
      ios: width / 6,
      android: width / 6.5,
    }),
  },
});
