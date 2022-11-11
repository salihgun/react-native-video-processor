# react-native-video-processor

Video processing functions using [@ffmpeg-kit](https://github.com/arthenica/ffmpeg-kit)

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
//  creationDate: "2022-11-11T19:08:08.547Z"
// }
```

- Create thumbnail

```js
import { createThumbnail } from '@salihgun/react-native-video-processor'

const thumbnailPath = await createThumbnail(videoPath)
```

- Trim video

```js
import { trimVideo } from '@salihgun/react-native-video-processor';

const [startTime, setStartTime] = React.useState<string>('');
const [duration, setDuration] = React.useState<string>('');

//Convert variables to HH:mm:ss format
const startsAt = moment().startOf('day').second(+startTime).format('HH:mm:ss');
const durationAt = moment().startOf('day').second(+duration).format('HH:mm:ss');

//Parse video path (Used ImagePicker library => react-native-image-crop-picker)
const secondDotIndex = video.path.lastIndexOf('.'); // Android path has double dot, need to parse it

const newPath = Platform.select({
      ios: video.path.split('.')[0],
      android: video.path.substring(0, secondDotIndex),
    }) as string;

const outputPath = `${newPath}-trimmed.mp4`;

const clippedVideoPath = await trimVideo(videoPath, startsAt, durationAt, outputPath);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)