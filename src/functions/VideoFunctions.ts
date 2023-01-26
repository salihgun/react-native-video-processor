import { FFmpegKit, FFprobeKit } from 'ffmpeg-kit-react-native';
import { Platform } from 'react-native';
import type { VideoInfoType } from 'src/types/VideoInfoType';

export class VideoManager {
  static async getVideoInfo(path: string): Promise<VideoInfoType> {
    const command = `-i ${path} -v quiet -print_format json -show_format -show_streams`;
    const response = await FFprobeKit.execute(command);
    const output = await JSON.parse(await response.getOutput());
    const videoInfo: VideoInfoType = {
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

  private static formatPath(path: string): string {
    const secondDotIndex = path.lastIndexOf('.');
    const newPath = Platform.select({
      ios: path.split('.')[0],
      android: path.substring(0, secondDotIndex),
    }) as string;
    return newPath;
  }

  static async createThumbnail(path: string, fps: number = 1): Promise<string> {
    const newPath = this.formatPath(path);
    const command = `-i ${path} -vf fps=${fps} ${newPath}_thumb_%01d.jpg`;
    await FFmpegKit.execute(command);
    const thumnailPath = `${newPath}_thumb_1.jpg`;
    return thumnailPath;
  }

  static async trimVideo(
    path: string,
    startTime: string,
    duration: string
  ): Promise<string> {
    const newPath = this.formatPath(path);
    const outputPath = `${newPath}_trim.mp4`;
    const command = `-y -i ${path} -ss ${startTime} -t ${duration} ${outputPath}`;
    await FFmpegKit.execute(command);
    return outputPath;
  }

  static async createFrames(path: string, fps: number = 1): Promise<string> {
    const newPath = this.formatPath(path);
    const command = `-i ${path} -vf fps=${fps} ${newPath}_thumb_%01d.jpg`;
    await FFmpegKit.execute(command);
    return `${newPath}_thumb_`;
  }

  static async reverseVideo(path: string): Promise<string> {
    const newPath = this.formatPath(path);
    const outputPath = `${newPath}_reverse.mp4`;
    const command = `-i ${path} -vf reverse ${outputPath}`;
    await FFmpegKit.execute(command);
    return outputPath;
  }

  static async mergeVideos(
    paths: string[],
    newVideoPath: string,
    height: string = '1920',
    width: string = '1080'
  ) {
    const inputStrings = paths.map((videoPath) => `-i ${videoPath}`).join(' ');
    const resizeString = paths
      .map(
        (_, index) =>
          `[${index}:v]scale=${height}:${width},setsar=1[v${index}]; `
      )
      .join(' ');
    const concatString = paths
      .map((_, index) => `[v${index}][${index}:a]`)
      .join('');

    await FFmpegKit.execute(`-y ${inputStrings}  -filter_complex \
      "${resizeString} \
      ${concatString}concat=n=${paths.length}:v=1:a=1[v][a]" -vsync 2 -map "[v]" -map "[a]" ${newVideoPath}`);

    return newVideoPath;
  }

  static async boomerang(path: string, reorder?: boolean): Promise<string> {
    const newPath = this.formatPath(path);
    const reversedVideo = await this.reverseVideo(path);
    const outputPath = `${newPath}_boomerang.mp4`;
    const pathList = reorder ? [reversedVideo, path] : [path, reversedVideo];
    await this.mergeVideos(pathList, `${outputPath}`);
    return outputPath;
  }
}

export default VideoManager;
