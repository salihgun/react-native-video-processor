import { FFmpegKit, FFprobeKit } from 'ffmpeg-kit-react-native';
async function getVideoInfo(path) {
  const command = `-i ${path} -v quiet -print_format json -show_format -show_streams`;
  const response = await FFprobeKit.execute(command);
  const output = await JSON.parse(await response.getOutput());
  const videoInfo = {
    duration: +output.format.duration,
    creationDate: output.format.tags.creation_time,
    size: +output.format.size,
    bit_rate: +output.format.bit_rate,
    width: +output.streams[1].width,
    height: +output.streams[1].height,
    frame_rate: output.streams[1].avg_frame_rate,
    codec_name: output.streams[1].codec_name,
    codec_type: output.streams[1].codec_type,
    sample_aspect_ratio: output.streams[1].sample_aspect_ratio,
  };
  return videoInfo;
}
async function createThumbnail(path, fps = 1) {
  const command = `-i ${path} -vf fps=${fps} ${path.replace(
    '.mp4',
    '_'
  )}thumb_%01d.jpg`;
  await FFmpegKit.execute(command);
  const thumnailPath = path.replace('.mp4', '_thumb_1.jpg');
  return thumnailPath;
}
async function trimVideo(path, startTime, duration) {
  const command = `-y -i ${path} -ss ${startTime} -t ${duration} ${path.replace(
    '.mp4',
    '_'
  )}trim.mp4`;
  await FFmpegKit.execute(command);
  return `${path.replace('.mp4', '_')}trim.mp4`;
}
async function createFrames(path, fps = 1) {
  const command = `-i ${path} -vf fps=${fps} ${path.replace(
    '.mp4',
    '_'
  )}thumb_%01d.jpg`;
  await FFmpegKit.execute(command);
  return `${path.replace('.mp4', '_')}thumb_`;
}
async function reverseVideo(path) {
  const command = `-i ${path} -vf reverse ${path.replace(
    '.mp4',
    '_reverse.mp4'
  )}`;
  await FFmpegKit.execute(command);
  return `${path.replace('.mp4', '_reverse.mp4')}`;
}
async function concatVideos(path1, path2, type = 'merged') {
  const orderPath1 = type === 'boomerang' ? path2 : path1;
  const orderPath2 = type === 'boomerang' ? path1 : path2;
  const command = `-y -i ${orderPath1} -i ${orderPath2} \
    -filter_complex "[0:v] [0:a] [1:v] [1:a] \
    concat=n=2:v=1:a=1 [v] [a]" \
    -map "[v]" -map "[a]" ${path1.replace('.mp4', `_${type}.mp4`)}`;
  await FFmpegKit.execute(command);
  return path1.replace('.mp4', '_merged.mp4');
}
async function boomerang(path) {
  const reversedVideo = await reverseVideo(path);
  await concatVideos(path, reversedVideo, 'boomerang');
  return `${path.replace('.mp4', '_boomerang.mp4')}`;
}
export {
  getVideoInfo,
  createThumbnail,
  trimVideo,
  createFrames,
  reverseVideo,
  concatVideos,
  boomerang,
};
