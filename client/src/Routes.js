import { Switch, Route } from "react-router-dom";
import React, { Component } from "react";
import LoginScreen from "./components/home/LoginScreen";
import RoomScreen from "./components/room/RoomScreen";

export default class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={LoginScreen}></Route>
          <Route exact path="/room" component={RoomScreen}></Route>
         
        </Switch>
      </div>
    );
  }
}
