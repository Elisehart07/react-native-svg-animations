import React, {
  PureComponent, Component,
} from 'react';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import {
  Animated,
  Dimensions,
} from 'react-native';
import {
  svgPathProperties,
} from 'svg-path-properties';

import Path from '../AnimatedSVG';

const { height, width } = Dimensions.get('window');
class AnimatedSVGPath extends Component {
  static propTypes = {
    d: PropTypes.string.isRequired,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    duration: PropTypes.number,
    height: PropTypes.number,
    delay: PropTypes.number,
    width: PropTypes.number,
    scale: PropTypes.number,
    fill: PropTypes.string,
    loop: PropTypes.bool,
    padding: PropTypes.number
  };
  
  static defaultProps = {
    strokeColor: "black",
    strokeWidth: 1,
    duration: 1000,
    delay: 1000,
    fill: "none",
    scale: 1,
    height,
    width,
    loop: true,
    padding: 10
  };
  
  constructor(props) {
    super(props);
    const { d } = this.props;
    const properties = svgPathProperties(d)
    this.length = properties.getTotalLength();
    this.strokeDashoffset = new Animated.Value(this.length);
  }

  animate = () => {
    const {
      delay,
      duration,
      loop,
    } = this.props;
    this.strokeDashoffset.setValue(this.length);
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this.strokeDashoffset, {
        toValue: 0,
        duration: duration,
      })
    ]).start(() => {
      if (loop) {
          this.animate();
      }
    });
  }

  componentDidMount() {
    this.animate();
  }
  
  render() {
    const {
      d,
      fill,
      scale,
      width,
      height,
      strokeColor,
      strokeWidth,
      padding,
    } = this.props;
    return (
      <Svg
        height={(height * scale) + (padding * 2)}
        width={(width * scale) + (padding * 2)}
      >
        <Path
          x={padding}
          y={padding}
          strokeDasharray={[this.length, this.length]}
          strokeDashoffset={this.strokeDashoffset}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          scale={scale}
          fill={fill}
          d={d}
        />
      </Svg>
    );
  }
}

/* Export ==================================================================== */

module.exports = AnimatedSVGPath;
module.exports.details = {
  title: 'AnimatedSVGPath',
};