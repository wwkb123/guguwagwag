import React from 'react';
import '../../css/styles.css'

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            socket: this.props.socket,
            name: "",
            message: ""
        }

    }
    
    componentDidMount(){


        // Listen for events

        var output = document.getElementById("output");
        if(this.state.socket != null){
            this.state.socket.on('chat', function(data){
                output.innerHTML += "<p><strong>" + data.name + ": </strong>" + data.message + "</p>";
            });
        }else{
            output.innerHTML = ("Failed to connect server.")
        }
    }

    onSendBtnClick = () => {
        var messageToSend = this.state.message;
        var nameToSend = this.state.name;
        if(messageToSend === "" || nameToSend === "") return;
        this.setState({message: ""});
        
        if(this.state.socket != null){
            this.state.socket.emit('chat', {
                message: messageToSend,
                name: nameToSend
            }, (data) => {
                console.log("data sent", data);
                var output = document.getElementById('output');
                output.scrollTop = output.scrollHeight;
            });
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
            <div id="chat-area">
                <div id="chat-window">
                    <div id="output"></div>
                    <div className="chat-input">
                        <input id="name" type="text" placeholder="Name" value={this.state.name} onChange={this.handleChange}></input>
                        <input id="message" type="text" placeholder="Message" value={this.state.message} onChange={this.handleChange}></input>
                        <button className="send-button" id="send" onClick={this.onSendBtnClick}>Send</button>
                    </div>
                    
                </div>
                
            </div>
        );
    }

}


export default Chat