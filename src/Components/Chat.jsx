import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';

export default class Chat extends Component {

  render() {
    return (

      <div id="chat-list-and-input">
        <div id="chat-messages">
          <MessageList
            chatMessages={this.props.chatMessages}
            currentClue={this.props.currentClue}
            guesserPoints={this.props.guesserPoints}
          />
        </div>
        <div className="message-input-box">
          <MessageInput
            currentUser={this.props.currentUser}
            currentlyDrawing={this.props.currentlyDrawing}
            sendMessage={this.props.sendMessage}
            />
        </div>
      </div>

    )
  }
}
