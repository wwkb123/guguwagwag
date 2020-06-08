import { Switch, Route } from "react-router-dom";
import React, { Component } from "react";
import Home from "./components/Homepage/Home"
import Game from "./components/draw/Game"

export default class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/game" component={Game}></Route>
         
        </Switch>
      </div>
    );
  }
}
