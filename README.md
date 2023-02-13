# @salihgun/react-native-video-processor

Video processing functions using [@ffmpeg-kit](https://github.com/arthenica/ffmpeg-kit)

## Preview

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

```sh
yarn add @salihgun/react-native-video-processor ffmpeg-kit-react-native
```

or

```sh
npm install @salihgun/react-native-video-processor ffmpeg-kit-react-native
```

## Android Setup

- Edit `android/build.gradle` file and add the package name in `ext.ffmpegKitPackage` variable.

```gradle
    ext {
        ffmpegKitPackage = "full-gpl-lts"
    }
```

- Edit `android/app/build.gradle` file and add packaging options above `defaultConfig`.

```gradle
packagingOptions {
        pickFirst 'lib/x86/libc++_shared.so'
        pickFirst 'lib/x86_64/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
    }
```

## iOS Setup

- Edit `ios/Podfile` file and add the package name as `subspec`. After that run `pod install` again.

```ruby
pod 'ffmpeg-kit-react-native', :subspecs => ['full-gpl-lts'], :podspec => '../node_modules/ffmpeg-kit-react-native/ffmpeg-kit-react-native.podspec'
```

## Usage

<p align="center">Video Trimmer Component</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/216847946-2c3eb232-f5a4-4aab-b315-045423b09a25.gif" alt="animated" />
</p>

```js
// ** Important! Please install react-native-video to run this component.
// yarn add react-native-video

import VideoManager, { TrimmerComponent } from '@salihgun/react-native-video-processor'

  // Use createFreames function to create frames for the video // fps=5 for the example
  const framesPath = await VideoManager.createFrames(videoPath, 5);
  
  //User getVideoInfo function to get video duration
  const videoInfo = await VideoManager.getVideoInfo(videoPath)

  // Then you can use trimVideo function to trim selected part.
  const clippedVideoPath = await VideoManager.trimVideo(videoPath, value, clipDuration)

  <TrimmerComponent
    path={videoPath}
    seekValue={value}
    setSeekValue={setValue}
    framesPath={framesPath}
    duration={videoInfo.duration} // Total video duration
    clipDuration={clipDuration} // You can set the clip duration
  />
```


<p align="center">Video Info</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207990236-dc080b28-ef07-4b2b-8c4b-93e20e560ffb.gif" alt="animated" />
</p>

```js
import VideoManager from '@salihgun/react-native-video-processor'


const result = await VideoManager.getVideoInfo(videoPath)

// example result
// result = {
//  duration: 4.5,
//  creationDate: "2022-11-11T19:08:08.547Z",
//  size: 496145 bytes,
//  bit_rate: 882035,
//  width: 320,
//  height: 568,
//  frame_rate: "30/1",
//  codec_name: "h264",
//  codec_type: "video",
//  sample_aspect_radio: "1:1",
// }
```

<p align="center">Create Thumbnail</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207992898-5ae3e11a-779d-46e4-9b0d-79269ada5724.gif" alt="animated" />
</p>

```js
import VideoManager from '@salihgun/react-native-video-processor'

const thumbnailPath = await VideoManager.createThumbnail(videoPath)
```


<p align="center">Trim Video</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207992962-2a2ddd1f-14d5-43a5-8753-c19785791a6f.gif" alt="animated" />
</p>

```js
import VideoManager from '@salihgun/react-native-video-processor'

const [startTime, setStartTime] = React.useState<string>('');
const [duration, setDuration] = React.useState<string>('');

const clippedVideoPath = await VideoManager.trimVideo(videoPath, startTime, duration)
```

<p align="center">Create Frames of a Video</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207993033-b5e1ac96-556a-46e6-969e-33b1c9e5c719.gif" alt="animated" />
</p>

```js
import VideoManager from '@salihgun/react-native-video-processor'

// createFrames function has two parameters. Video path and an optional fps value which is default 1
const framesPath = await VideoManager.createFrames(videoPath, 3) // fps = 3

// render method
 <ScrollView horizontal>
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

```

<p align="center">Reverse Video</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207993117-96db9881-2f44-47b7-abe1-e8eed40ff70f.gif" alt="animated" />
</p>

```js
import VideoManager from '@salihgun/react-native-video-processor'

const reversedVideoPath = await VideoManager.reverseVideo(videoPath)

```

<p align="center">Merge Videos</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207993209-39fd297d-bf04-4cc6-8832-641c6d32d056.gif" alt="animated" />
</p>

```js
import VideoManager from '@salihgun/react-native-video-processor'
import RNFS from "react-native-fs";

// You can use RNFS to create a video path
const outputPath = RNFS.DocumentDirectoryPath + "/mergedVideos.mp4";

// There are two optional scale parameters to merge video
// height and width default value is 1920x1080
// you can change it if you need.
// There is also an optional "hasAudio" parameter and default value is true.
// If one of your videos has no audio, merge doesn't work in this version.
const mergedVideoPath = await VideoManager.mergeVideos(videoPathsArray,outputPath);

```

<p align="center">Boomerang Video</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207993269-a2c35cf0-71e2-4911-a76e-5a94f5f5e128.gif" alt="animated" />
</p>

```js
import VideoManager from '@salihgun/react-native-video-processor'

// Set 'reorder' option to true if you want to reorder videos.
// There are height and width parameters now. You can set a custom height and/or width.
const boomerangVideoPath = await VideoManager.boomerang(videoPath) // reorder = false

```

<p align="center">Set speed of the Video</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/217052414-2658de1c-b186-4ba6-a7d4-1e1bb1a8737e.gif" alt="animated" />
</p>

```js
import VideoManager from '@salihgun/react-native-video-processor'

// Use speed property to set speed. Default is 1
const speedVideoPath = await VideoManager.setSpeed(videoPath) // speed = 1

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
