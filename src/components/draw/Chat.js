import React from 'react';
import '../../css/styles.css'
import io from 'socket.io-client'
import { Button, TextInput } from "react-bootstrap";

class Chat extends React.Component {

    state = {
        socket: null

    }
    constructor(){
        super();
        // Make connection
        this.setState({ socket: io.connect('http://192.168.1.12:4000/')});


        // Listen for events

        this.state.socket.on('chat', function(data){
            var output
            output.innerHTML += "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
        })
    }

    onSendBtnClick = () => {
        this.state.socket.emit('chat', {
            message: message.value,
            handle: handle.value
        })
    }


    render() {
        return (
            <div id="mario-chat">
                <div id="chat-window">
                    <div id="output"></div>
                </div>
                <TextInput id="handle" type="text" placeholder="Handle"></TextInput>
                <TextInput id="message" type="text" placeholder="Message"></TextInput>
                <Button id="send" onClick={this.onSendBtnClick}>Send</Button>
            </div>
        );
    }

}


export default Chat