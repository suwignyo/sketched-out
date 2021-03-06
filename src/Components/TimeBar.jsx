import React, {Component} from 'react';
import { Line, Circle }   from 'rc-progress';

class TimeBar extends Component {

  render() {

    let percent = Math.floor(this.props.timeRemaining / 40 * 100)

    return (
        <div id="progress">
          <Line
            strokeColor='#fa8072'
            strokeWidth='1'
            trailWidth='1'
            strokeLinecap='square'
            percent={percent} id="time-bar"/>
        </div>
    )
  }
}

export default TimeBar;
