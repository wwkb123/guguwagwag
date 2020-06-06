import React from 'react';
import '../../css/styles.css'
import io from 'socket.io-client'

class Chat extends React.Component {

    state = {
        socket: null,
        handle: "",
        message: ""
    }
    constructor(){
        super();
        // Make connection
        var url = "https://guguwagwag.herokuapp.com/";
        this.setState({ socket: io.connect(url)});


        // Listen for events
        if(this.state.socket != null){
            this.state.socket.on('chat', function(data){
                // output.innerHTML += "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
            })
        }

    }

    onSendBtnClick = () => {
        if(this.state.socket != null){
            this.state.socket.emit('chat', {
                message: this.state.message,
                handle: this.state.handle
            })
        }
    }

    handleChange = (e) => {
        const { target } = e;
    
        this.setState(state => ({
          ...state,
          [target.id]: target.value,
        }));
    }


    render() {
        return (
            <div id="mario-chat">
                <div id="chat-window">
                    <div id="output"></div>
                </div>
                <input id="handle" type="text" placeholder="Handle" onChange={this.handleChange}></input>
                <input id="message" type="text" placeholder="Message" onChange={this.handleChange}></input>
                <button id="send" onClick={this.onSendBtnClick}>Send</button>
            </div>
        );
    }

}


export default Chat