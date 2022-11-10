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
  VideoInfoType,
} from 'react-native-video-processor';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import moment from 'moment';
const width = Dimensions.get('window').width;
export default function App() {
  const [videoInfo, setVideoInfo] = React.useState<VideoInfoType>({
    duration: 0,
    creationDate: '',
  });
  const [thumbnail, setThumbnail] = React.useState<string>('');
  const [startTime, setStartTime] = React.useState<string>('');
  const [duration, setDuration] = React.useState<string>('');
  const [videoPath, setVideoPath] = React.useState<string>('');
  const [framesPath, setFramesPath] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

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
    }) as string;
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Pressable style={styles.buttonContainer} onPress={onPickVideo}>
          <Text>Choose Video</Text>
        </Pressable>
        <View style={styles.inputContainer}>
          <Text>Start time:</Text>
          <TextInput
            style={styles.input}
            value={startTime}
            onChangeText={setStartTime}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Clip duration:</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
          />
        </View>

        <Text style={styles.text}>
          Duration: {videoInfo.duration.toFixed(2)} seconds
        </Text>
        <Text style={styles.text}>Creation Date: {videoInfo.creationDate}</Text>
        <Text style={styles.title}>Thumbnail</Text>
        {thumbnail !== '' && (
          <Image style={styles.thumbnail} source={{ uri: thumbnail }} />
        )}
        <Text style={styles.title}>Clipped Video</Text>
        {videoPath !== '' && (
          <Video
            source={{ uri: videoPath }}
            style={styles.video}
            resizeMode="contain"
            paused={false}
            repeat={true}
          />
        )}
        <Text style={styles.title}>Frames</Text>
        {framesPath && (
          <ScrollView
            horizontal
            contentContainerStyle={styles.framesScrollContainer}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => {
              return (
                <Image
                  key={index}
                  style={styles.frame}
                  source={{ uri: `${framesPath}${index + 1}.jpg` }}
                />
              );
            })}
          </ScrollView>
        )}
      </ScrollView>
      <Modal transparent visible={loading}>
        <View style={styles.modal}>
          <ActivityIndicator size={50} />
        </View>
      </Modal>
    </View>
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
