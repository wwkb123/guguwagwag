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

  line = [];
  userId = v4();

  
  onTouchMove = (e) => {
    e.preventDefault();
    if (!this.state.isDrawing) {
      return;
    }
    var bcr = e.target.getBoundingClientRect();
    console.log(e.touches[0]);
    this.setState(() => {
      this.draw(
        this.state.currentX,
        this.state.currentY,
        e.touches[0].clientX - bcr.x,
        e.touches[0].clientY - bcr.y,
        this.state.userStrokeStyle,
        true,
        e.touches[0].force
      );
      return {
        currentX: e.touches[0].clientX - bcr.x,
        currentY: e.touches[0].clientY - bcr.y
      };
    });
  };


  onMouseDown = (e) => {
    this.setState(() => {
      return {
        currentX: e.offsetX,
        currentY: e.offsetY,
        isDrawing: true
      };
    });
  }

  onMouseMove = (e) => {
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
    this.setState(() => {
      return {
        isDrawing: false,
        currentX: e.offsetX,
        currentY: e.offsetY
      };
    }, this.draw(this.state.currentX, this.state.currentY, this.state.currentX, this.state.currentY, this.state.userStrokeStyle, true));
  }

  draw = (x0, y0, x1, y1, color, emit, force) => {
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

    this.canvas.current.addEventListener(
      "touchstart",
      this.onMouseDown,
      false
    );

    this.canvas.current.addEventListener(
      "touchmove",
      this.throttle(this.onTouchMove, 5),
      false
    );

    this.canvas.current.addEventListener("touchend", this.onMouseUp, false);

  }

  render() {
    return (
      <div>
        <canvas
          ref={this.canvas}
          style={{ background: "white", border: "1px solid lightgray" }}
          height={500}
          width={800}
        />
        <button onClick={this.onClearClick}>Clear</button>
      </div>
    );
  }
}

export default Canvas;
