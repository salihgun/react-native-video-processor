import { FFmpegKit, FFprobeKit } from 'ffmpeg-kit-react-native';
async function getVideoInfo(path) {
  const command = `-i ${path} -v quiet -print_format json -show_format -show_streams`;
  const response = await FFprobeKit.execute(command);
  const output = await JSON.parse(await response.getOutput());
  const videoInfo = {
    duration: +output.format.duration,
    creationDate: output.format.tags.creation_time,
  };
  return videoInfo;
}
async function getVideoThumbnail(path, fps = 3) {
  const command = `-i ${path} -vf fps=${fps} ${path.replace(
    '.mp4',
    '_'
  )}thumb_%01d.jpg`;
  await FFmpegKit.execute(command);
  const thumnailPath = path.replace('.mp4', '_thumb_1.jpg');
  return thumnailPath;
}
async function trimVideo(path, startTime, duration, outputPath) {
  const command = `-y -i ${path} -ss ${startTime} -t ${duration} ${outputPath}`;
  await FFmpegKit.execute(command);
  return outputPath;
}
async function createFrames(path, fps = 3) {
  const command = `-i ${path} -vf fps=${fps} ${path.replace(
    '.mp4',
    '_'
  )}thumb_%01d.jpg`;
  await FFmpegKit.execute(command);
  return `${path.replace('.mp4', '_')}thumb_`;
}
export { getVideoInfo, getVideoThumbnail, trimVideo, createFrames };
