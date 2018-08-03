import React, {Component} from 'react';

export default class MainCanvas extends Component {
  constructor(props) {
    super(props)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.stopPainting = this.stopPainting.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
  }

  isPainting = false;
  line = null;

  userLines = []
  latestLineIndex = 0

  prevPos = { offsetX: 0, offsetY: 0}
  userStrokeStyle = this.props.lineColor;

  componentDidMount() {
    this.canvas.width = 900;
    this.canvas.height = 450;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 10
  }

  handleMouseDown = ({ nativeEvent })=> {
    console.log({nativeEvent})
    if (this.props.currentlyDrawing === this.props.currentUser) {
      const { offsetX, offsetY } = nativeEvent;
      this.isPainting = true;
      this.prevPos = { offsetX, offsetY };
    }
  }

  handleMouseMove = ({ nativeEvent }) => {
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offsetData = { offsetX, offsetY };

      const positionData = {
        start: { ...this.prevPos },
        stop: {...offsetData}
      };

      this.line = {
        prevPos: this.prevPos,
        currPos: offsetData,
        strokeStyle: this.userStrokeStyle
      }

      this.paint(this.prevPos, offsetData, this.userStrokeStyle);
      this.sendPaintData()
    }
  }
  onTouchStart = ({ nativeEvent })=> {
    console.log({nativeEvent})
    // nativeEvent.preventDefault()
    if (this.props.currentlyDrawing === this.props.currentUser) {
      const { clientX, clientY } = nativeEvent.targetTouches[0];
      console.log( {clientX, clientY})
      this.isPainting = true;
      this.prevPos = { clientX, clientY };
    }
  }

  onTouchMove = ({ nativeEvent }) => {
    // nativeEvent.preventDefault()
    if (this.isPainting) {
      const { clientX, clientY } = nativeEvent.targetTouches[0];
      const offsetData = { clientX, clientY };
      const positionData = {
        start: { ...this.prevPos },
        stop: {...offsetData}
      };

      this.line = {
        prevPos: this.prevPos,
        currPos: offsetData,
        strokeStyle: this.userStrokeStyle
      }

      this.touchPaint(this.prevPos, offsetData, this.userStrokeStyle);
      this.sendPaintData()
    }
  }

  touchPaint = (prevPos, currPos, strokeStyle) => {
    console.log('PAINT EXECUTING')
    const { clientX, clientY } = currPos;
    const { clientX: x, clientY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(clientX, clientY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = { clientX, clientY };
  }

  paint = (prevPos, currPos, strokeStyle) => {
    console.log('PAINT EXECUTING')
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }

  setBrushSize = (size) => {
    this.ctx.lineWidth = size;
  }

  //make message into an object with options
  sendPaintData = () => {
    this.props.sendMessage({
      type: 'latestLineData',
      content: [this.line]
    })
    this.latestLineIndex = this.userLines.length - 1
  }

  stopPainting = (e) => {
    this.isPainting = false;
  }

  render() {
    if (this.props.latestLineData.length < 1 && this.ctx) {
      console.log('empty array', this.ctx.fillStyle);
      this.ctx.beginPath();
      this.ctx.rect(0, 0, 900, 450);
      this.ctx.fillStyle = 'white';
      this.ctx.fill()
    }

    if (this.props.latestLineData.length > 0) {

      this.props.latestLineData
      .slice(this.latestLineIndex)
      .forEach((line) => {
        this.paint(line.prevPos, line.currPos, line.strokeStyle)
      });

      this.latestLineIndex = this.userLines.length - 1
    }

    this.userStrokeStyle = this.props.lineColor

    return (
        <div>
          <canvas
            id='canvas'
            ref={(ref) => (this.canvas = ref)}
            style={ {background: 'white'} }
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.stopPainting}
            onMouseLeave={this.stopPainting}
            onTouchStart={this.onTouchStart}
            onTouchMove={this.onTouchMove}
            onTouchEnd={this.stopPainting}
          />
          <div id='brush-sizes'>
            <button onClick={() => this.setBrushSize(5)}>small</button>
            <button onClick={() => this.setBrushSize(10)}>medium</button>
            <button onClick={() => this.setBrushSize(15)}>large</button>
            <button>undo</button>
          </div>
        </div>
    )
  }
}
