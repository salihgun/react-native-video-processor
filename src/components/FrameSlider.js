import * as React from 'react';
import { FlatList, View } from 'react-native';
import Frame from './Frame';
import Marker from './Marker';
import styles from './styles';
const itemAmountPerScreen = 10;
export class FrameSlider extends React.Component {
  flatList = React.createRef();
  static defaultProps = {
    multiplicity: 0.1,
    decimalPlaces: 1,
    arrayLength: 10000,
    scrollEnabled: true,
    mainContainerStyle: null,
    itemStyle: null,
    tenthItemStyle: null,
    initialPositionValue: 0,
  };
  constructor(props) {
    super(props);
    this.state = {
      items: this.generateArrayBlock(),
      width: 0,
      oneItemWidth: 0,
      value: props.initialPositionValue,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { width } = this.state;
    if (width === 0 && nextState.width !== 0) {
      return true;
    }
    if (nextProps.value !== nextState.value) {
      this.setState({
        value: nextProps.value,
      });
      this.scrollToElement(nextProps.value);
    }
    return false;
  }
  onLayout = (event) => {
    this.setState({
      width: event.nativeEvent.layout.width,
      oneItemWidth: Math.round(
        event.nativeEvent.layout.width / itemAmountPerScreen
      ),
    });
    this.init();
  };
  onSliderMoved = (event) => {
    const { oneItemWidth } = this.state;
    const { onValueChange, initialPositionValue, maximumValue, decimalPlaces } =
      this.props;
    let newValue =
      initialPositionValue +
      (event.nativeEvent.contentOffset.x / oneItemWidth) *
        this.props.multiplicity;
    if (maximumValue && newValue > maximumValue) {
      newValue = maximumValue;
    }
    const setValue = parseFloat(
      parseFloat(newValue.toString()).toFixed(decimalPlaces)
    );
    this.setState({
      value: setValue,
    });
    onValueChange(setValue);
  };
  generateArrayBlock = () => {
    const { arrayLength, maximumValue, multiplicity } = this.props;
    let length = arrayLength;
    if (maximumValue) {
      length = maximumValue / multiplicity;
      length += itemAmountPerScreen;
    }
    return new Array(length).fill(0);
  };
  init = () => {
    setTimeout(() => this.scrollToElement(this.props.value), 100);
  };
  scrollToElement = (value) =>
    this.flatList.current &&
    this.flatList.current.scrollToOffset({
      offset: (value * this.state.oneItemWidth) / this.props.multiplicity,
      animated: false,
    });
  renderFrame = (element) =>
    React.createElement(Frame, {
      duration: this.props.duration,
      index: element.index,
      framesPath: this.props.framesPath,
    });
  renderDefaultThumb = () =>
    React.createElement(Marker, { thumbStyle: this.props.thumbStyle });
  render() {
    const { renderThumb, scrollEnabled, mainContainerStyle } = this.props;
    const { items, width } = this.state;
    return React.createElement(
      View,
      {
        style: [styles.mainContainer, mainContainerStyle],
        onLayout: this.onLayout,
      },
      React.createElement(FlatList, {
        style: [
          styles.flatlistContainer,
          this.props.flatlistStyle && this.props.flatlistStyle,
        ],
        ref: this.flatList,
        getItemLayout: (_, index) => ({
          length: this.state.oneItemWidth,
          offset: this.state.oneItemWidth * index,
          index,
        }),
        scrollEnabled: scrollEnabled,
        data: width === 0 ? [] : items,
        keyboardShouldPersistTaps: 'always',
        horizontal: true,
        onScrollEndDrag: this.onSliderMoved,
        onScroll: this.onSliderMoved,
        onMomentumScrollBegin: this.onSliderMoved,
        onMomentumScrollEnd: this.onSliderMoved,
        keyExtractor: (_, index) => index.toString(),
        renderItem: this.renderFrame,
        showsHorizontalScrollIndicator: false,
      }),
      renderThumb ? renderThumb() : this.renderDefaultThumb()
    );
  }
}
