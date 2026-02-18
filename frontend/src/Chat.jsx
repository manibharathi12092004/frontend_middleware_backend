import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! How can I help you today? Feel free to ask me to summarize any text.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validate input
    if (!input.trim()) {
      setError('Please enter a message');
      return;
    }

    if (input.length > 5000) {
      setError('Message is too long (max 5000 characters)');
      return;
    }

    // Clear error and add user message
    setError(null);
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call the API
      const response = await fetch(
        "https://backend-lxo6.onrender.com/api/summarize/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: input,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.summary || 'Summary generated successfully.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'error',
        content: `Error: ${err.message}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setError(err.message);

      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter, but allow Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! How can I help you today? Feel free to ask me to summarize any text.',
        timestamp: new Date(),
      },
    ]);
    setInput('');
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-container">
      {/* Background gradient */}
      <div className="chat-background" />

      <div className="chat-wrapper">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <h1 className="chat-title">Text Summarizer Assistant</h1>
            <p className="chat-subtitle">An AI-powered tool to generate concise summaries of your text content.</p>
          </div>
          <button
            className="chat-clear-btn"
            onClick={handleClearChat}
            title="Clear chat history"
            aria-label="Clear chat"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h14M8 6V4a2 2 0 012-2h2a2 2 0 012 2v2m-9 0v10a2 2 0 002 2h6a2 2 0 002-2V6" />
            </svg>
          </button>
        </div>

        {/* Messages container */}
        <div className="chat-messages">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="chat-message chat-message-assistant">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error display */}
        {error && (
          <div className="chat-error">
            <span className="error-icon">⚠</span>
            {error}
            <button
              className="error-close"
              onClick={() => setError(null)}
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input area */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to summarize something..."
              disabled={loading}
              rows="1"
              style={{
                maxHeight: '120px',
                minHeight: '44px',
              }}
              aria-label="Message input"
            />
            <button
              className="chat-send-btn"
              type="submit"
              disabled={loading || !input.trim()}
              title={loading ? 'Loading...' : 'Send message'}
              aria-label="Send message"
            >
              {loading ? (
                <svg
                  className="send-icon loading"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
              ) : (
                <svg
                  className="send-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 10a1 1 0 011-1h12.59l-3.3-3.3a1 1 0 111.42-1.42l5 5a1 1 0 010 1.42l-5 5a1 1 0 01-1.42-1.42l3.3-3.3H3a1 1 0 01-1-1z" />
                </svg>
              )}
            </button>
          </div>
          <p className="chat-input-hint">Press Enter to send, Shift+Enter for new line</p>
        </form>
      </div>
    </div>
  );
};

export default Chat;
