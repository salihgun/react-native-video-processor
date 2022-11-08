import { FFprobeKit } from 'ffmpeg-kit-react-native';
import type { VideoInfoType } from 'src/types/VideoInfoType';

async function getVideoInfo(path: string): Promise<VideoInfoType> {
  const command = `-i ${path} -v quiet -print_format json -show_format -show_streams`;
  const response = await FFprobeKit.execute(command);
  const output = await JSON.parse(await response.getOutput());
  const videoInfo: VideoInfoType = {
    duration: +output.format.duration,
    creationDate: output.format.tags.creation_time,
  };
  return videoInfo;
}

export { getVideoInfo };
