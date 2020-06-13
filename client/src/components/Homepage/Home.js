import React, { Component } from "react";
import Login from "../login/Login";
import "./home.css";
export default class Home extends Component {
  render() {
    return (
      <div
        className="homescreen container"
        style={{ border: "1px solid grey", width: "800px", height: "400px" }}
      >
        <div className="row">
          <div className="col col-border">
            <Login />
          </div>

          <div className="col">
            <h1 className="h1-social">Social media login</h1>
          </div>
        </div>
      </div>
    );
  }
}
