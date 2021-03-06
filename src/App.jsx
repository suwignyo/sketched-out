import React, {Component} from 'react';
import Leaderboard        from './Components/Leaderboard.jsx';
import Main               from './Main.jsx';
import NavBar             from './Components/NavBar.jsx';
import AuthService        from "./AuthService.jsx";

const pointSound = new Audio();
pointSound.src = "./src/Sounds/Button_Click.mp3";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latestLineData: [],
      chatMessages: [],
      currentUser: '',
      currentUsers: [],
      latestCanvas: [],
      gameStarted: true,
      currentClue: '',
      correctGuesser: '',
      secondsLeft: 40,
      brushSize: 10,
      players: [],
      guesserPoints: 0,
      countdownTicks: null,
      showStartButton: true,
    }
  }

  componentDidMount() {
    this.Auth = new AuthService();
    if (this.Auth.loggedIn()){
      this.setState({
        currentUser: this.Auth.getProfile().username
      })
    }
    this.socket = new WebSocket(`ws://localhost:8080`);

    this.socket.onopen = (e) => {
      console.log('==> Socket connection started!')
    }
    this.socket.onmessage = (e) => {
      const parsedMessage = JSON.parse(e.data)

      switch (parsedMessage.type) {
        case 'latestLineData':
          this.setState({
            latestLineData: parsedMessage.content
          });
        break;
        case 'chatMessages':
          let allMessages = this.state.chatMessages.slice();
          allMessages.push(parsedMessage.content)
          this.setState({
            chatMessages: allMessages
          })
        break;
        case 'userList':
          this.setState({
            currentUsers: parsedMessage.content
          })
          this.setState({
            players: parsedMessage.content
          })
        break;
        case 'latestCanvas':
          this.setState({
            latestLineData: parsedMessage.content
          })
        break;
        case 'roundStarted':
          this.setState({
            currentClue: parsedMessage.content.currentClue
          })
          this.setState({
            currentlyDrawing: parsedMessage.content.currentlyDrawing
          })
          this.setState({
            nextGuesser: parsedMessage.content.nextGuesser
          })
          this.setState({
            players: parsedMessage.content.players
          })
          this.setState({
            countdown: true
          })
        break;
        case 'timer':
          this.setState({
            secondsLeft: parsedMessage.content
          })
        break;
        case 'playPointSound':
          pointSound.play();
        break;
        case 'clearCanvas':
          console.log('clearcanvas called');
          this.setState({
            latestLineData: []
          })
        break;
        case 'changeBrushSize':
          this.setState({
            brushSize: parsedMessage.content
          })
        break;
        case 'guesserPoints':
          this.setState({
            guesserPoints: parsedMessage.content
          })
        break;
        case 'startCountdown':
          this.setState({
            countdownTicks: parsedMessage.content
          });
        break;
        case 'clearCountdown':
          this.setState({
            countdownTicks: null
          })
        break;
        case 'showStartButton':
          this.setState({
            showStartButton: false
          })
      }
    }
  }

  setUser = (userName, cb) => {
    console.log('setuser user:',userName)
    this.setState({
      currentUser: userName
    }, cb())
  }

  clearUser = () => {
    this.setState({
      currentUser: ''
    })
  }

  resetCountdown = () => {
    this.setState({
      countdown: false
    })
  }

  sendMessage = message => {
    this.socket.send(JSON.stringify(message));
  }

  render() {
    return (
      <div className='mainContainer'>
        <NavBar
          currentUser={this.state.currentUser}
          clearUser={this.clearUser}
          setUser={this.setUser}
        />
        <Main
          latestLineData={this.state.latestLineData}
          sendMessage={this.sendMessage}
          chatMessages={this.state.chatMessages}
          currentUser={this.state.currentUser}
          setUser={this.setUser}
          clearUser={this.clearUser}
          userList={this.state.currentUsers}
          currentClue={this.state.currentClue}
          gameStarted={this.state.gameStarted}
          socket={this.socket}
          secondsLeft={this.state.secondsLeft}
          brushSize={this.state.brushSize}
          currentlyDrawing={this.state.currentlyDrawing}
          nextGuesser={this.state.nextGuesser}
          players={this.state.players}
          guesserPoints={this.state.guesserPoints}
          countdownTicks={this.state.countdownTicks}
          showStartButton={this.state.showStartButton}
        />
      </div>
    )
  }
}

export default App;
