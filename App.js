import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && username.trim()) {
      const message = {
        type: 'message',
        user: username,
        text: messageInput,
      };
      ws.current.send(JSON.stringify(message));
      setMessageInput('');
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <h1>Real-Time Chat</h1>
        {!username ? (
          <div className="username-form">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={() => setUsername(username)}>Join Chat</button>
          </div>
        ) : (
          <>
            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <strong>{message.user}: </strong>
                  {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App; 