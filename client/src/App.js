import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Chat from "./components/room/Chat";
import Canvas from "./components/room/Canvas";
import Routes from "./Routes";

import { Row, Col } from "react-simple-flex-grid";
import "react-simple-flex-grid/lib/main.css";
import { Link } from "react-router-dom";
function App() {
  return (
    <div>
      <div className="main">
        {/* <h3 style={{ textAlign: "center" }}>Paint</h3>
          <div className="color-guide">
            <h5>Color Guide</h5>
            <div className="user user">User</div>
            <div className="user guest">Guest</div>
          </div>
        </div> */}
        {/* <Row>
          <Col span={8}><Canvas /></Col>
          <Col span={4}><Chat /></Col>
        </Row>   */}
        <Routes />
        {/* <Link to="/game">game</Link> */}
      </div>
    </div>
  );
}

export default App;
