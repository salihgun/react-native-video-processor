import * as React from 'react';

import { StyleSheet, View, Text, Pressable } from 'react-native';
import { getVideoInfo, VideoInfoType } from 'react-native-video-processor';
import ImagePicker from 'react-native-image-crop-picker';

export default function App() {
  const [videoInfo, setVideoInfo] = React.useState<VideoInfoType>({
    duration: 0,
    creationDate: '',
  });

  const onPickVideo = async () => {
    const video = await ImagePicker.openPicker({
      mediaType: 'video',
    });
    const videoInfoResponse = await getVideoInfo(video.path);
    setVideoInfo(videoInfoResponse);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.buttonContainer} onPress={onPickVideo}>
        <Text>Choose Video</Text>
      </Pressable>
      <View>
        <Text style={styles.text}>
          Duration: {videoInfo.duration.toFixed(2)} seconds
        </Text>
        <Text style={styles.text}>Creation Date: {videoInfo.creationDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
