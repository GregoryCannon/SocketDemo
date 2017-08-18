import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import styles from './stylesheet.css';

const socket = io('http://localhost:3000');
const room = 47;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'disconnected',
      hasHeardPong: false,
      id: '',
      messages: ['Welcome to Socket Demo!'],
      members: []
    };
  }

  componentWillMount() {
    socket.on('connect', this.connect);
    socket.on('disconnect', this.disconnect);
    socket.on('server.pong', this.hearPong);
    socket.on('server.newId', this.hearId);
    socket.on('server.message', this.hearMessage);
    socket.on('server.roomMessage', this.hearMessage);
    socket.on('server.roomMembers', this.hearMembers);
  }

  connect = () => {
    this.setState({
      status: 'connected',
      messages: ['Welcome to Socket Demo!']
    });
    socket.emit('client.requestId');
  }

  disconnect = () => {    // When server disconnects
    this.setState({ status: 'disconnected'});
  }

  sendPing = () => {
    if (this.state.hasHeardPong) return;
    socket.emit('client.ping');
  }

  hearPong = () => {
    this.setState({ hasHeardPong: true });
    setTimeout(() => { this.setState({ hasHeardPong: false })}, 3000);
  }

  hearId = (newId) => {
    this.setState({ id: newId });
    socket.emit('client.joinRoom', 47, newId);
  }

  hearMessage = (message) => {
    this.state.messages.push(message);
    this.setState({ messages: this.state.messages });
  }

  hearMembers = (members) => {
    this.setState({ members: members });
  }

  render() {
    const title = this.state.hasHeardPong ? 'We heard a pong!' : 'Click here to ping the server';
    const concatMembers = () => {
      console.log('members: ', this.state.members);
      var result = '';
      this.state.members.forEach(function(id){
        result += id + ', ';
      })
      return result.slice(0, -2);
    }

    return (
      <div className='app-root'>
        <h1>React/Socket Demo</h1>
        <h4>Status: {this.state.status}</h4>
        <h4>ID: {this.state.id}</h4>
        <h4>Members: {concatMembers()}</h4>

        <h2 onClick={this.sendPing}>{title}</h2>

        <div className='message-box'>
          <ul>
            {this.state.messages.map(function(message, i){
              return <li key={i}>{message}</li>;
            })}
          </ul>
        </div>

        <div className='page-container'>
          <Link to='/'>Home</Link>
          <Link to='/info'>Info</Link>

          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
