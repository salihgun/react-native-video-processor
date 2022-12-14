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

<p align="center">Video Info</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207990236-dc080b28-ef07-4b2b-8c4b-93e20e560ffb.gif" alt="animated" />
</p>

```js
import { getVideoInfo } from '@salihgun/react-native-video-processor'


const result = await getVideoInfo(videoPath)

//example result
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
import { createThumbnail } from '@salihgun/react-native-video-processor'

const thumbnailPath = await createThumbnail(videoPath)
```


<p align="center">Trim Video</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207992962-2a2ddd1f-14d5-43a5-8753-c19785791a6f.gif" alt="animated" />
</p>

```js
import { trimVideo } from '@salihgun/react-native-video-processor'

const [startTime, setStartTime] = React.useState<string>('');
const [duration, setDuration] = React.useState<string>('');

const clippedVideo = await trimVideo(video?.path, startTime, duration)
```

<p align="center">Create Frames of a Video</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207993033-b5e1ac96-556a-46e6-969e-33b1c9e5c719.gif" alt="animated" />
</p>

```js
import { createFrames } from '@salihgun/react-native-video-processor'

//createFrames function has two parameters. Video path and an optional fps value which is default 1
const framesPath = await createFrames(videoPath, 3) // fps = 3

//render method
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
import { reverseVideo } from '@salihgun/react-native-video-processor'

const reversedVideo = await reverseVideo(video.path)

```

<p align="center">Concat Videos</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207993209-39fd297d-bf04-4cc6-8832-641c6d32d056.gif" alt="animated" />
</p>

```js
import { concatVideos } from '@salihgun/react-native-video-processor';

//***IMPORTANT***
//Video sizes,formats must be same for now otherwise it won't work!
//Also supports only 2 videos for now!
const mergedVideo = await concatVideos(videoPath1,videoPath2);

```

<p align="center">Boomerang Video</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/47421572/207993269-a2c35cf0-71e2-4911-a76e-5a94f5f5e128.gif" alt="animated" />
</p>

```js
import { boomerang } from '@salihgun/react-native-video-processor'

const boomerangVideo = await boomerang(video.path)

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
