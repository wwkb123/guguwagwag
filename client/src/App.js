import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Chat from "./components/draw/Chat";
import Canvas from "./components/draw/Canvas";
import "./css/canvas.css";
function App() {
  return (
    <div>
      <Chat></Chat>
      <h3 style={{ textAlign: "center" }}>Paint</h3>
      <div className="main">
        <div className="color-guide">
          <h5>Color Guide</h5>
          <div className="user user">User</div>
          <div className="user guest">Guest</div>
        </div>

        <Canvas />
      </div>
    </div>
  );
}

export default App;
