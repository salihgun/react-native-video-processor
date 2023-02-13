import { FFmpegKit, FFprobeKit } from 'ffmpeg-kit-react-native';
import { Platform } from 'react-native';
export class VideoManager {
  static async getVideoInfo(path) {
    const command = `-i ${path} -v quiet -print_format json -show_format -show_streams`;
    const response = await FFprobeKit.execute(command);
    const output = await JSON.parse(await response.getOutput());
    const streamIndex = output.streams[1] ? 1 : 0;
    const videoInfo = {
      duration: +output.format.duration,
      creationDate: output.format.tags.creation_time,
      size: +output.format.size,
      bit_rate: +output.format.bit_rate,
      width: +output.streams[streamIndex].width,
      height: +output.streams[streamIndex].height,
      frame_rate: output.streams[streamIndex].avg_frame_rate,
      codec_name: output.streams[streamIndex].codec_name,
      codec_type: output.streams[streamIndex].codec_type,
      sample_aspect_ratio: output.streams[streamIndex].sample_aspect_ratio,
    };
    return videoInfo;
  }
  static formatPath(path) {
    const secondDotIndex = path.lastIndexOf('.');
    const newPath = Platform.select({
      ios: path.split('.')[0],
      android: path.substring(0, secondDotIndex),
    });
    return newPath;
  }
  static async createThumbnail(path, fps = 1) {
    const newPath = this.formatPath(path);
    const command = `-i ${path} -vf fps=${fps} ${newPath}_thumb_%01d.jpg`;
    await FFmpegKit.execute(command);
    const thumnailPath = `${newPath}_thumb_1.jpg`;
    return thumnailPath;
  }
  static async trimVideo(path, startTime, duration) {
    const newPath = this.formatPath(path);
    const outputPath = `${newPath}_trim.mp4`;
    const command = `-y -i ${path} -ss ${startTime} -t ${duration} ${outputPath}`;
    await FFmpegKit.execute(command);
    return outputPath;
  }
  static async createFrames(path, fps = 1) {
    const newPath = this.formatPath(path);
    const command = `-i ${path} -vf fps=${fps} ${newPath}_thumb_%01d.jpg`;
    await FFmpegKit.execute(command);
    return `${newPath}_thumb_`;
  }
  static async reverseVideo(path) {
    const newPath = this.formatPath(path);
    const outputPath = `${newPath}_reverse.mp4`;
    const command = `-i ${path} -vf reverse ${outputPath}`;
    await FFmpegKit.execute(command);
    return outputPath;
  }
  static concatString(paths, hasAudio) {
    let concat = '';
    if (hasAudio) {
      concat = paths.map((_, index) => `[v${index}][${index}:a]`).join('');
    } else {
      concat = paths.map((_, index) => `[v${index}]`).join('');
    }
    return concat;
  }
  static mergeCommand(hasAudio) {
    return hasAudio
      ? 'v=1:a=1[v][a]" -vsync 2 -map "[v]" -map "[a]"'
      : 'v=1:[v]" -vsync 2 -map "[v]"';
  }
  static async mergeVideos(
    paths,
    newVideoPath,
    height = '1920',
    width = '1080',
    hasAudio = true
  ) {
    const inputStrings = paths.map((videoPath) => `-i ${videoPath}`).join(' ');
    const resizeString = paths
      .map(
        (_, index) =>
          `[${index}:v]scale=${height}:${width},setsar=1[v${index}]; `
      )
      .join(' ');
    const concatString = this.concatString(paths, hasAudio);
    await FFmpegKit.execute(`-y ${inputStrings}  -filter_complex \
      "${resizeString} \
      ${concatString}concat=n=${paths.length}:${this.mergeCommand(
      hasAudio
    )} ${newVideoPath}`);
    return newVideoPath;
  }
  static async boomerang(path, reorder, height = '1920', width = '1080') {
    const videoResponse = await FFprobeKit.execute(
      `-v error -show_streams ${path}`
    );
    const output = await videoResponse.getOutput();
    const _hasAudio = output.includes('codec_type=audio');
    const newPath = this.formatPath(path);
    const reversedVideo = await this.reverseVideo(path);
    const outputPath = `${newPath}_boomerang.mp4`;
    const pathList = reorder ? [reversedVideo, path] : [path, reversedVideo];
    await this.mergeVideos(pathList, `${outputPath}`, height, width, _hasAudio);
    return outputPath;
  }
  static async setSpeed(path, speed = 1) {
    const newPath = this.formatPath(path);
    const outputPath = `${newPath}_slow.mp4`;
    const command = `-i ${path} -filter:v "setpts=${
      1 / speed
    }*PTS" ${outputPath}`;
    await FFmpegKit.execute(command);
    return outputPath;
  }
}
export default VideoManager;
