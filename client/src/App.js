import React from "react";
import { Switch, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import "react-simple-flex-grid/lib/main.css";
import LoginScreen from "./components/home/LoginScreen";
import RoomScreen from "./components/room/RoomScreen";

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

        <Switch>
          <Route exact path="/" component={LoginScreen}></Route>
          <Route exact path="/room" component={RoomScreen}></Route>
         
        </Switch>
        
      </div>
    </div>
  );
}

export default App;
