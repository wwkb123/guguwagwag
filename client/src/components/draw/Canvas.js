import React, { Component } from "react";
import { v4 } from "uuid";
import Pusher from "pusher-js";
import io from 'socket.io-client';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null
    }
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);

    this.pusher = new Pusher("PUSHER_KEY", {
      cluster: "eu",
    });
    
  }
  isPainting = false;
  userStrokeStyle = "#000000";
  guestStrokeStyle = "#F0C987";
  line = [];
  userId = v4();
  prevPos = { offsetX: 0, offsetY: 0 };

  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      this.position = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      this.line = this.line.concat(this.position);
      // this.paint(this.prevPos, offSetData, this.userStrokeStyle);

              
      if(this.state.socket != null){

        this.state.socket.emit('draw', {
          prevPos: this.prevPos,
          currPos: offSetData,
          strokeStyle: this.userStrokeStyle
        }, (data) => {
            // console.log("data sent", data);
        });
      }
    }
  }

  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      // this.sendPaintData();
      this.paint(this.prevPos, this.prevPos, this.userStrokeStyle);
    }
  }

  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }

  async sendPaintData() {
    const body = {
      line: this.line,
      userId: this.userId,
    };

    const req = await fetch("http://localhost:4000/paint", {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await req.json();
    this.line = [];
  }

  componentDidMount() {
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 5;

    // const channel = this.pusher.subscribe("painting");
    // channel.bind("draw", (data) => {
    //   const { userId, line } = data;
    //   if (userId !== this.userId) {
    //     line.forEach((position) => {
    //       this.paint(position.start, position.stop, this.guestStrokeStyle);
    //     });
    //   }
    // });
    // this.paint({offsetX: 0, offsetY: 0}, {offsetX: 100, offsetY: 100}, this.userStrokeStyle);

    // Make connection
    var url = "https://guguwagwag.herokuapp.com";
    // var url = "192.168.1.12:4000";

    // Listen for events
    this.setState({ socket: io.connect(url)}, function(){

        if(this.state.socket != null){
            this.state.socket.on('draw', (data) => {
              this.paint(data.prevPos, data.currPos, data.strokeStyle);
              console.log(data.prevPos, data.currPos, data.strokeStyle);
            })
        }else{
            console.log("Failed to connect server.");
        }
    });
  }

  render() {
    return (
      <canvas
        ref={(ref) => (this.canvas = ref)}
        style={{ background: "white", border: "1px solid lightgray" }}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.endPaintEvent}
        onMouseUp={this.endPaintEvent}
        onMouseMove={this.onMouseMove}
      />
    );
  }
}

export default Canvas;
