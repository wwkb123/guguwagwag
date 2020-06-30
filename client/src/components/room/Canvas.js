import React, { Component } from "react";
import { v4 } from "uuid";
import Pusher from "pusher-js";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
      userStrokeStyle: "#000000",
      isDrawing: false
    };
    this.canvas = React.createRef();

    this.pusher = new Pusher("PUSHER_KEY", {
      cluster: "eu",
    });

    // Listen for events
    if (this.state.socket != null) {
      this.state.socket.on("draw", (data) => {
        // this.paint(data.prevPos, data.currPos, data.strokeStyle);
        // console.log(data.prevPos, data.currPos, data.strokeStyle)
        // let w = window.innerWidth;
        // let h = window.innerHeight;
  
        // if (!isNaN(data.x0 / w) && !isNaN(data.y0)) {
          this.draw(
            // data.x0 * w,
            // data.y0 * h,
            // data.x1 * w,
            // data.y1 * h,
            data.x0,
            data.y0,
            data.x1,
            data.y1,
            data.color
          );
        // }
      });
      this.state.socket.on("draw_clear", (data) => {
        this.clearCanvas();
      });

      console.log("Connected to server.");
    } else {
      console.log("Failed to connect server.");
    }


  }

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

  onMouseDown = (e) => {
    // const { offsetX, offsetY } = nativeEvent;
    // this.isPainting = true;
    // this.prevPos = { offsetX, offsetY };
    
    this.setState(() => {
      return {
        currentX: e.offsetX,
        currentY: e.offsetY,
        isDrawing: true
      };
    });
  }

  onMouseMove = (e) => {
    // if (this.isPainting) {
    //   const { offsetX, offsetY } = nativeEvent;
    //   const offSetData = { offsetX, offsetY };
    //   this.position = {
    //     start: { ...this.prevPos },
    //     stop: { ...offSetData },
    //   };
    //   this.line = this.line.concat(this.position);
    //   // this.paint(this.prevPos, offSetData, this.userStrokeStyle);

    //   // send to socket
    //   if (this.state.socket != null) {
    //     const stroke = {
    //       prevPos: this.prevPos,
    //       currPos: offSetData,
    //       strokeStyle: this.userStrokeStyle,
    //     }
    //     this.state.socket.emit("draw", stroke, (data) => {
    //         // console.log("data sent", data);
    //     });
    //   }
    // }
    if (!this.state.isDrawing) {
      return;
    }

    this.setState(() => {
      return {
        currentX: e.offsetX,
        currentY: e.offsetY
      };
    }, this.draw(this.state.currentX, this.state.currentY, e.offsetX, e.offsetY, this.state.userStrokeStyle, true));
  }

  onMouseUp = (e) => {
    // if (this.isPainting) {
    //   this.isPainting = false;
    //   // this.sendPaintData();
    //   // this.paint(this.prevPos, this.prevPos, this.userStrokeStyle);
    //   if (this.state.socket != null) {
    //     const stroke = {
    //       prevPos: this.prevPos,
    //       currPos: this.prevPos,
    //       strokeStyle: this.userStrokeStyle,
    //     }
    //     this.state.socket.emit("draw", stroke, (data) => {
    //         // console.log("data sent", data);
    //     });
    //   }
    // }
    this.setState(() => {
      return {
        isDrawing: false,
        currentX: e.offsetX,
        currentY: e.offsetY
      };
    });
  }

  draw = (x0, y0, x1, y1, color, emit, force) => {
    // const { offsetX, offsetY } = currPos;
    // const { offsetX: x, offsetY: y } = prevPos;

    // this.ctx.beginPath();
    // this.ctx.strokeStyle = strokeStyle;
    // this.ctx.moveTo(x, y);
    // this.ctx.lineTo(offsetX, offsetY);
    // this.ctx.stroke();
    // this.ctx.closePath();
    // this.prevPos = { offsetX, offsetY };
    if(this.state.canvas == null) return;
    let context = this.state.canvas.getContext("2d");
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
    // var w = window.innerWidth;
    // var h = window.innerHeight;
    this.setState(() => {
      // if (!isNaN(x0 / w)) {
        this.state.socket.emit("draw", {
          // x0: x0 / w,
          // y0: y0 / h,
          // x1: x1 / w,
          // y1: y1 / h,
          x0: x0,
          y0: y0,
          x1: x1,
          y1: y1,
          color: color
          // room: this.state.room,
          // force: force
        });

        return {
          cleared: false
        };
      // }
    });
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
    if(this.state.canvas == null) return;
    const ctx = this.state.canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function() {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  componentDidMount() {
    // this.canvas.width = 800;
    // this.canvas.height = 500;
    // this.ctx = this.state.canvas.getContext("2d");
    // this.ctx.lineJoin = "round";
    // this.ctx.lineCap = "round";
    // this.ctx.lineWidth = 5;

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

    this.setState({
      canvas: this.canvas.current
    });

    // this.canvas.current.style.height = 800;
    // this.canvas.current.style.width = 500;
    
    this.canvas.current.addEventListener(
      "mousedown",
      this.onMouseDown,
      false
    );
    this.canvas.current.addEventListener("mouseup", this.onMouseUp, false);
    this.canvas.current.addEventListener("mouseout", this.onMouseUp, false);
    this.canvas.current.addEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 5),
      false
    );

  }

  render() {
    return (
      <div>
        <canvas
          // ref={(ref) => (this.canvas = ref)}
          ref={this.canvas}
          style={{ background: "white", border: "1px solid lightgray" }}
          // onMouseDown={this.onMouseDown}
          // onMouseLeave={this.onMouseUp}
          // onMouseUp={this.onMouseUp}
          // onMouseMove={this.onMouseMove}
          // onTouchStart={this.onTouchStart}
          // onTouchMove={this.onTouchMove}
          // onTouchEnd={this.onTouchLeave}
          // onTouchCancel={this.onTouchLeave}
          height={500}
          width={800}
        />
        <button onClick={this.onClearClick}>Clear</button>
      </div>
    );
  }
}

export default Canvas;
