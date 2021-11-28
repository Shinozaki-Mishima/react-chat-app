import React, { useState, useEffect } from 'react'
import queryString from 'query-string';
import io from 'socket.io-client';

//styles import
import './Chat.css'

// chat components
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer';


let socket;

const Chat = ({ location }) => {
    // initialize state 
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    // endpoint 
    const ENDPOINT = 'https://react-chatting-app-demo.herokuapp.com/';
    // useEffect
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        //console.log(location.search);
        //const urlSearchParams = new URLSearchParams(window.location.search);
        //const {name, room} = Object.fromEntries(urlSearchParams.entries());

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {
            //
        });
        // clean up func
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });

    }, [messages]);

    // create function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
      }

    // console.log(message, messages);
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            {/* <TextContainer users={users} /> */}
        </div>
    )
}

export default Chat;
