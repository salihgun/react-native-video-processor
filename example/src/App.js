import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import VideoManager from '@salihgun/react-native-video-processor';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
const width = Dimensions.get('window').width;
export default function App() {
  const [videoInfo, setVideoInfo] = React.useState({
    duration: 0,
    creationDate: '',
    size: 0,
    width: 0,
    height: 0,
    bit_rate: 0,
    codec_name: '',
    codec_type: '',
    sample_aspect_ratio: '',
    frame_rate: '',
  });
  const [thumbnail, setThumbnail] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [videoPath, setVideoPath] = React.useState('');
  const [framesPath, setFramesPath] = React.useState('');
  const [reversedVideoPath, setReversedVideoPath] = React.useState('');
  const [mergedVideoPath, setMergedVideoPath] = React.useState('');
  const [boomerangVideoPath, setBoomerangVideoPath] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const onPickVideo = async () => {
    const video = await ImagePicker.openPicker({
      mediaType: 'video',
      multiple: true,
    });
    const paths = video.map((item) => item.path);
    setLoading(true);
    const videoInfoResponse = await VideoManager.getVideoInfo(video[0]?.path);
    const videoThumbnail = await VideoManager.createThumbnail(video[0]?.path);
    const framePath = await VideoManager.createFrames(video[0]?.path, 5);
    const clippedVideo = await VideoManager.trimVideo(
      video[0]?.path,
      startTime,
      duration
    );
    const reversedVideo = await VideoManager.reverseVideo(clippedVideo);
    const newVideoPath = RNFS.DocumentDirectoryPath + '/newVideo.mp4';
    const mergedVideo = await VideoManager.mergeVideos(paths, newVideoPath);
    const boomerangVideo = await VideoManager.boomerang(video[0]?.path, true);
    setBoomerangVideoPath(boomerangVideo);
    setMergedVideoPath(mergedVideo);
    setReversedVideoPath(reversedVideo);
    setVideoPath(clippedVideo);
    setThumbnail(videoThumbnail);
    setVideoInfo(videoInfoResponse);
    setFramesPath(framePath);
    setLoading(false);
  };
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(
      ScrollView,
      {
        showsVerticalScrollIndicator: false,
        contentContainerStyle: styles.scrollContainer,
      },
      React.createElement(
        Pressable,
        { style: styles.buttonContainer, onPress: onPickVideo },
        React.createElement(Text, null, 'Choose Video')
      ),
      React.createElement(
        View,
        { style: styles.inputContainer },
        React.createElement(Text, null, 'Start time:'),
        React.createElement(TextInput, {
          style: styles.input,
          value: startTime,
          onChangeText: setStartTime,
        })
      ),
      React.createElement(
        View,
        { style: styles.inputContainer },
        React.createElement(Text, null, 'Clip duration:'),
        React.createElement(TextInput, {
          style: styles.input,
          value: duration,
          onChangeText: setDuration,
        })
      ),
      React.createElement(
        Text,
        { style: styles.text },
        'Duration: ',
        videoInfo.duration.toFixed(2),
        ' seconds'
      ),
      React.createElement(
        Text,
        { style: styles.text },
        'Creation Date: ',
        videoInfo.creationDate
      ),
      React.createElement(
        Text,
        { style: styles.text },
        'Size: ',
        videoInfo.size,
        ' bytes'
      ),
      React.createElement(Text, { style: styles.title }, 'Thumbnail'),
      thumbnail !== '' &&
        React.createElement(Image, {
          style: styles.thumbnail,
          source: { uri: thumbnail },
        }),
      React.createElement(Text, { style: styles.title }, 'Clipped Video'),
      videoPath !== '' &&
        React.createElement(Video, {
          source: { uri: videoPath },
          style: styles.video,
          resizeMode: 'contain',
          paused: false,
          repeat: true,
        }),
      React.createElement(Text, { style: styles.title }, 'Frames'),
      framesPath &&
        React.createElement(
          ScrollView,
          {
            horizontal: true,
            contentContainerStyle: styles.framesScrollContainer,
          },
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => {
            return React.createElement(Image, {
              key: index,
              style: styles.frame,
              source: { uri: `${framesPath}${index + 1}.jpg` },
            });
          })
        ),
      React.createElement(Text, { style: styles.title }, 'Reversed Video'),
      reversedVideoPath !== '' &&
        React.createElement(Video, {
          source: { uri: reversedVideoPath },
          style: styles.video,
          resizeMode: 'contain',
          paused: false,
          repeat: true,
        }),
      React.createElement(Text, { style: styles.title }, 'Merged Video'),
      mergedVideoPath !== '' &&
        React.createElement(Video, {
          source: { uri: mergedVideoPath },
          style: styles.video,
          resizeMode: 'contain',
          paused: false,
          repeat: true,
        }),
      React.createElement(Text, { style: styles.title }, 'Boomerang Video'),
      boomerangVideoPath !== '' &&
        React.createElement(Video, {
          source: { uri: boomerangVideoPath },
          style: styles.video,
          resizeMode: 'contain',
          paused: false,
          repeat: true,
        })
    ),
    React.createElement(
      Modal,
      { transparent: true, visible: loading },
      React.createElement(
        View,
        { style: styles.modal },
        React.createElement(ActivityIndicator, { size: 50 })
      )
    )
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  buttonContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  text: {
    color: 'black',
    marginBottom: 5,
  },
  thumbnail: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: { paddingHorizontal: 20, paddingVertical: 10 },
  video: {
    width: 200,
    height: 200,
    backgroundColor: 'black',
    marginTop: 20,
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
  },
  scrollContainer: {
    paddingTop: 100,
    alignItems: 'center',
    paddingBottom: 100,
  },
  frame: {
    width: width,
    height: 200,
  },
  framesScrollContainer: { paddingTop: 20 },
});
