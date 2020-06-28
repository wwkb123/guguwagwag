import React, { Component } from "react";
import { v4 } from "uuid";
import Pusher from "pusher-js";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
      userStrokeStyle: "#000000"
    };
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

  onTouchStart = (e) => {
    e.preventDefault();
    let offsetX = e.touches[0].clientX;
    let offsetY = e.touches[0].clientY;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  };

  onTouchMove = (e) => {
    e.preventDefault();
    if (this.isPainting) {
      let offsetX = e.touches[0].clientX;
      let offsetY = e.touches[0].clientY;
      const offSetData = { offsetX, offsetY };
      this.position = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      this.line = this.line.concat(this.position);
      // this.paint(this.prevPos, offSetData, this.userStrokeStyle);

      // send to socket
      if (this.state.socket != null) {
        const stroke = {
          prevPos: this.prevPos,
          currPos: offSetData,
          strokeStyle: this.userStrokeStyle,
        }
        this.state.socket.emit("draw", stroke, (data) => {
            // console.log("data sent", data);
        });
      }
    }
  };

  onTouchLeave = (e) => {
    e.preventDefault();
    if (this.isPainting) {
      this.isPainting = false;
      // this.sendPaintData();
      // this.paint(this.prevPos, this.prevPos, this.userStrokeStyle);
      // send to socket
      if (this.state.socket != null) {
        const stroke = {
          prevPos: this.prevPos,
          currPos: this.prevPos,
          strokeStyle: this.userStrokeStyle
        };
        this.state.socket.emit("draw", stroke, (data) => {
            // console.log("data sent", data);
        });
      }
    }
  };

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

      // send to socket
      if (this.state.socket != null) {
        const stroke = {
          prevPos: this.prevPos,
          currPos: offSetData,
          strokeStyle: this.userStrokeStyle,
        }
        this.state.socket.emit("draw", stroke, (data) => {
            // console.log("data sent", data);
        });
      }
    }
  }

  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      // this.sendPaintData();
      // this.paint(this.prevPos, this.prevPos, this.userStrokeStyle);
      if (this.state.socket != null) {
        const stroke = {
          prevPos: this.prevPos,
          currPos: this.prevPos,
          strokeStyle: this.userStrokeStyle,
        }
        this.state.socket.emit("draw", stroke, (data) => {
            // console.log("data sent", data);
        });
      }
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
    this.ctx.closePath();
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

  onClearClick = () => {
    // send to socket
    if (this.state.socket != null) {
      this.state.socket.emit("draw_clear", {}, (data) => {
        // console.log("data sent", data);
      });
    }
  };

  clearCanvas = () => {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

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


    // Listen for events
    if (this.state.socket != null) {
      this.state.socket.on("draw", (data) => {
        this.paint(data.prevPos, data.currPos, data.strokeStyle);
        // console.log(data.prevPos, data.currPos, data.strokeStyle);
      });
      this.state.socket.on("draw_clear", (data) => {
        this.clearCanvas();
      });
      console.log("Connected to server.");
    } else {
      console.log("Failed to connect server.");
    }
  }

  render() {
    return (
      <div>
        <canvas
          ref={(ref) => (this.canvas = ref)}
          style={{ background: "white", border: "1px solid lightgray" }}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchLeave}
          onTouchCancel={this.onTouchLeave}
        />
        <button onClick={this.onClearClick}>Clear</button>
      </div>
    );
  }
}

export default Canvas;
