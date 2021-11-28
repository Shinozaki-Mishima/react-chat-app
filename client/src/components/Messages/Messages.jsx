import React from 'react';

import ScrollableFeed from 'react-scrollable-feed';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name }) => (
  <ScrollableFeed className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
  </ScrollableFeed>
);

export default Messages;