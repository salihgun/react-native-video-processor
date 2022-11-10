import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  getVideoInfo,
  getVideoThumbnail,
  trimVideo,
  createFrames,
} from 'react-native-video-processor';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import moment from 'moment';
const width = Dimensions.get('window').width;
export default function App() {
  const [videoInfo, setVideoInfo] = React.useState({
    duration: 0,
    creationDate: '',
  });
  const [thumbnail, setThumbnail] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [videoPath, setVideoPath] = React.useState('');
  const [framesPath, setFramesPath] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const onPickVideo = async () => {
    const video = await ImagePicker.openPicker({
      mediaType: 'video',
    });
    setLoading(true);
    const videoInfoResponse = await getVideoInfo(video.path);
    const videoThumbnail = await getVideoThumbnail(video.path);
    const framePath = await createFrames(video.path, 5);
    const secondDotIndex = video.path.lastIndexOf('.');
    const newPath = Platform.select({
      ios: video.path.split('.')[0],
      android: video.path.substring(0, secondDotIndex),
    });
    const outputPath = `${newPath}-trimmed.mp4`;
    const startsAt = moment()
      .startOf('day')
      .second(+startTime)
      .format('HH:mm:ss');
    const durationAt = moment()
      .startOf('day')
      .second(+duration)
      .format('HH:mm:ss');
    const clippedVideo = await trimVideo(
      video.path,
      startsAt,
      durationAt,
      outputPath
    );
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
        )
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
  input: { paddingHorizontal: 20 },
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
