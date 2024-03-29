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
import VideoManager, {
  // TrimmerComponent,
  VideoInfoType,
} from '@salihgun/react-native-video-processor';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

const width = Dimensions.get('window').width;
export default function App() {
  const [videoInfo, setVideoInfo] = React.useState<VideoInfoType>({
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
  const [thumbnail, setThumbnail] = React.useState<string>('');
  const [startTime, setStartTime] = React.useState<string>('');
  const [duration, setDuration] = React.useState<string>('');
  const [videoPath, setVideoPath] = React.useState<string>('');
  const [framesPath, setFramesPath] = React.useState<string>('');
  const [reversedVideoPath, setReversedVideoPath] = React.useState<string>('');
  const [mergedVideoPath, setMergedVideoPath] = React.useState<string>('');
  // const [newPath, setNewPath] = React.useState<string>('');
  // const [value, setValue] = React.useState<number>(0);
  const [speedPath, setSpeedPath] = React.useState<string>('');
  const [boomerangVideoPath, setBoomerangVideoPath] =
    React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const onPickVideo = async () => {
    const video = (await ImagePicker.openPicker({
      mediaType: 'video',
      multiple: true,
    })) as ImageOrVideo[];

    const paths = video.map((item) => item.path);

    setLoading(true);

    const videoInfoResponse = await VideoManager.getVideoInfo(
      video[0]?.path as string
    );
    const videoThumbnail = await VideoManager.createThumbnail(
      video[0]?.path as string
    );
    const framePath = await VideoManager.createFrames(
      video[0]?.path as string,
      5
    );
    const clippedVideo = await VideoManager.trimVideo(
      video[0]?.path as string,
      startTime,
      duration
    );
    const reversedVideo = await VideoManager.reverseVideo(clippedVideo);
    const newVideoPath = RNFS.DocumentDirectoryPath + '/newVideo.mp4';
    const mergedVideo = await VideoManager.mergeVideos(paths, newVideoPath);
    const boomerangVideo = await VideoManager.boomerang(
      video[0]?.path as string,
      true
    );

    const speedVideo = await VideoManager.setSpeed(video[0]?.path as string, 4);

    setSpeedPath(speedVideo);
    setBoomerangVideoPath(boomerangVideo);
    setMergedVideoPath(mergedVideo);
    setReversedVideoPath(reversedVideo);
    setVideoPath(clippedVideo);
    setThumbnail(videoThumbnail);
    setVideoInfo(videoInfoResponse);
    setFramesPath(framePath);
    setLoading(false);
    // setNewPath(video[0]?.path as string);
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
        <Text style={styles.text}>Size: {videoInfo.size} bytes</Text>
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
        <Text style={styles.title}>Reversed Video</Text>
        {reversedVideoPath !== '' && (
          <Video
            source={{ uri: reversedVideoPath }}
            style={styles.video}
            resizeMode="contain"
            paused={false}
            repeat={true}
          />
        )}
        <Text style={styles.title}>Merged Video</Text>
        {mergedVideoPath !== '' && (
          <Video
            source={{ uri: mergedVideoPath }}
            style={styles.video}
            resizeMode="contain"
            paused={false}
            repeat={true}
          />
        )}
        <Text style={styles.title}>Boomerang Video</Text>
        {boomerangVideoPath !== '' && (
          <Video
            source={{ uri: boomerangVideoPath }}
            style={styles.video}
            resizeMode="contain"
            paused={false}
            repeat={true}
          />
        )}
        <Text style={styles.title}>Speed Video</Text>
        {speedPath !== '' && (
          <Video
            source={{ uri: speedPath }}
            style={styles.video}
            resizeMode="contain"
            paused={false}
            repeat={true}
          />
        )}
      </ScrollView>
      {/*   <Pressable style={styles.buttonContainer} onPress={onPickVideo}>
        <Text>Choose Video</Text>
      </Pressable>
     {newPath !== '' && (
        <TrimmerComponent
          path={newPath}
          seekValue={value}
          setSeekValue={setValue}
          framesPath={framesPath}
          duration={videoInfo.duration}
          clipDuration={1}
        />
      )} */}
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
