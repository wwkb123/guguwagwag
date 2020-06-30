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
      socket: null,
      isDataFetched: false
    }

  }

  componentDidMount(){
    if(this.state.socket == null){
      // Make connection
      var url = "https://guguwagwag.herokuapp.com";
      // var url = "192.168.1.12:4000";
      
      var socket = io(url);
      this.setState({socket: socket, isDataFetched: true}, ()=>{
        console.log(this.state.socket);
      });
      
    }
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  render() {
    if(!this.state.isDataFetched) return(<div>Loading...</div>);
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
export default RoomScreen;