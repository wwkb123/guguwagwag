import React from "react";
import Canvas from "./Canvas";
import Chat from "./Chat";
import { Row, Col } from "react-simple-flex-grid";
import "react-simple-flex-grid/lib/main.css";
export default function Game() {
  return (
    <div>
      <Row>
        <Col span={8}>
          <Canvas />
        </Col>
        <Col span={4}>
          <Chat />
        </Col>
      </Row>
    </div>
  );
}
