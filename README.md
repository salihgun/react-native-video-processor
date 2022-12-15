# @salihgun/react-native-video-processor

Video processing functions using [@ffmpeg-kit](https://github.com/arthenica/ffmpeg-kit)

## Preview

https://user-images.githubusercontent.com/47421572/201497525-aa8b1a2e-b461-48b3-ac08-cc480ae37c0f.mp4

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

- Video Info

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

- Create thumbnail

```js
import { createThumbnail } from '@salihgun/react-native-video-processor'

const thumbnailPath = await createThumbnail(videoPath)
```

- Trim video

```js
import { trimVideo } from '@salihgun/react-native-video-processor'

const [startTime, setStartTime] = React.useState < string > ''
const [duration, setDuration] = React.useState < string > ''

const clippedVideo = await trimVideo(video?.path, startTime, duration)
```

- Create frames of video

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

- Reverse video

```js
import { reverseVideo } from '@salihgun/react-native-video-processor'

const reversedVideo = await reverseVideo(video.path)

```

- Concat videos

```js
import { concatVideos } from '@salihgun/react-native-video-processor';

//***IMPORTANT***
//Video sizes,formats must be same for now otherwise it won't work!
//Also supports only 2 videos for now!
const mergedVideo = await concatVideos(videoPath1,videoPath2);

```

- Boomerang video

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
