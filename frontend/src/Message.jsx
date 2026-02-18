import React, { memo } from 'react';
import './Message.css';

const Message = memo(({ message }) => {
  const { role, content, timestamp } = message;

  const formatTime = (date) => {
    try {
      const now = new Date();
      const messageDate = new Date(date);
      const diff = now - messageDate;

      // Less than 1 minute
      if (diff < 60000) {
        return 'now';
      }

      // Less than 1 hour
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
      }

      // Less than 1 day
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
      }

      // Format as time
      return messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return '';
    }
  };

  const messageClassName = `chat-message chat-message-${role}`;

  return (
    <div className={messageClassName}>
      <div className="message-container">
        <div className="message-bubble">{content}</div>
        <span className="message-time">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
});

Message.displayName = 'Message';

export default Message;
