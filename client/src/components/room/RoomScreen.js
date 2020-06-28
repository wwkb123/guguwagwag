import React, { Component } from "react";
import Canvas from "./Canvas";
import Chat from "./Chat";
import { Row, Col } from "react-simple-flex-grid";
import "react-simple-flex-grid/lib/main.css";
import io from "socket.io-client";

class RoomScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      socket: null
    }
  }

  render() {
    if(this.state.socket == null){
      // Make connection
      var url = "https://guguwagwag.herokuapp.com";
      // var url = "192.168.1.12:4000";

      this.setState({ socket: io.connect(url) }, function () {
        if (this.state.socket != null) {
          return (
            <div>
              <Row>
                <Col span={8}>
                  <Canvas socket={this.state.socket} />
                </Col>
                <Col span={4}>
                  <Chat socket={this.state.socket} />
                </Col>
              </Row>
            </div>
          );
        } else {
          console.log("Failed to connect server.");
        }
      });

      return (
        <div>Loading...</div>
      );
    }else{
      return (
        <div>
          <Row>
            <Col span={8}>
              <Canvas socket={this.state.socket} />
            </Col>
            <Col span={4}>
              <Chat socket={this.state.socket} />
            </Col>
          </Row>
        </div>
      );
    }
  }
}
export default RoomScreen;