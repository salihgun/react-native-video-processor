import type { ViewStyle } from 'react-native';

export interface FrameSliderPropTypes {
  value: number;
  onValueChange: Function;
  duration: number;
  framesPath: string;
  renderThumb?: Function;
  thumbStyle?: Object;
  multiplicity: number;
  decimalPlaces?: number;
  arrayLength: number;
  scrollEnabled: boolean;
  mainContainerStyle?: Object;
  itemStyle?: Object;
  tenthItemStyle?: Object;
  initialPositionValue: number;
  maximumValue?: number;
  flatlistStyle?: ViewStyle;
}

export interface FrameSliderState {
  width: number;
  items: Array<number>;
  oneItemWidth: number;
  value: number;
}

export interface Element {
  index: number;
}

export interface IMarkerProps {
  readonly thumbStyle?: ViewStyle;
}

export interface ITrimmerComponentProps {
  readonly seekValue: number;
  readonly setSeekValue: (value: number) => void;
  readonly path: string;
  readonly framesPath: string;
  readonly duration: number;
  readonly clipDuration: number;
  readonly renderThumb?: Function;
  readonly thumbStyle?: ViewStyle;
  readonly sliderListStyle?: ViewStyle;
  readonly sliderContainerStyle?: ViewStyle;
  readonly videoContainerStyle?: ViewStyle;
  readonly paused?: boolean;
  readonly muted?: boolean;
  readonly controls?: boolean;
  readonly resizeMode?: 'stretch' | 'cover' | 'contain' | 'none' | undefined;
  readonly repeat?: boolean;
}
