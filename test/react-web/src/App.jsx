import React, { useState, useEffect, useRef } from "react";
import useChatSocket from "../../../src/utils/ChatSocket.tsx";
import "./App.css";

function App() {
  const [serverUrl, setServerUrl] = useState("http://localhost:3001");
  const [userId, setUserId] = useState('test-user-1');
  const [receiverId, setReceiverId] = useState('test-user-2');
  const [messageText, setMessageText] = useState("");
  const [messageLink, setMessageLink] = useState("");
  const [messageMedia, setMessageMedia] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [chatMessages, setChatMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const listRef = useRef(null);

  const {
    messages,
    sendMessage,
    joinChat,
    getChatList,
    retrieveMessages,
    updateTypingAlert,
    setHandshakeSuccessCallback,
    setMessageReceivedCallback,
    setMessageSentCallback,
    setChatListCallback,
    setRetrieveMessagesCallback,
    setTypingAlertCallback,
  } = useChatSocket(serverUrl, userId);

  useEffect(() => {
    setHandshakeSuccessCallback((data) => {
      console.log("✅ Handshake success:", data);
      setConnectionStatus("Connected");
      setIsConnected(true);
    });

    setMessageReceivedCallback((message) => {
      console.log("📨 Message received:", message);
      handleRetrieveMessages()
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
      });
    });

    setMessageSentCallback((data) => {
      console.log("✅ Message sent:", data);
      handleRetrieveMessages()

    });

    setChatListCallback((data) => {
      console.log("💬 Chat list:", data);
    });

    setRetrieveMessagesCallback((data) => {
      console.log("📋 Messages retrieved:", data);
      if (data && data.data) {
        setChatMessages(data.data);
        requestAnimationFrame(() => {
          if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
        });
      }
    });

    setTypingAlertCallback((data) => {
      console.log("⌨️ Typing alert:", data);
    });
  }, [
    setHandshakeSuccessCallback,
    setMessageReceivedCallback,
    setMessageSentCallback,
    setChatListCallback,
    setRetrieveMessagesCallback,
    setTypingAlertCallback,
  ]);

  const handleSendMessage = () => {
    if (messageText.trim() && receiverId.trim()) {
      sendMessage({
        receiverId,
        message: {
          text: messageText,
          link: messageLink,
          media: messageMedia,
        },
      });
      setMessageText("");
      setMessageLink("");
      setMessageMedia("");

    }
  };

  const handleJoinChat = () => {
    if (receiverId.trim()) {
      joinChat({ receiverId });
    }
  };

  const handleGetChatList = () => {
    getChatList({ keyword: "" });
  };

  const handleRetrieveMessages = () => {
    if (receiverId.trim()) {
      retrieveMessages({ receiverId, keyword: "" });
    }
  };

  const handleTypingAlert = (isTyping) => {
    if (receiverId.trim()) {
      updateTypingAlert({ receiverId, isTyping });
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>ChatStorm Client - React Test</h1>

        <div className="config-section">
          <h2>Configuration</h2>
          <div className="input-group">
            <label>Server URL:</label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="ws://localhost:3001"
            />
          </div>
          <div className="input-group">
            <label>User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="your-user-id"
            />
          </div>
          <div className="input-group">
            <label>Receiver ID:</label>
            <input
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="receiver-user-id"
            />
          </div>
          <div className="status">
            Status:{" "}
            <span className={isConnected ? "connected" : "disconnected"}>
              {connectionStatus}
            </span>
          </div>
        </div>

        <div className="actions-section">
          <h2>Actions</h2>
          <div className="button-group">
            <button onClick={handleJoinChat} >
              Join Chat
            </button>
            <button onClick={handleGetChatList} disabled={!isConnected}>
              Get Chat List
            </button>
            <button onClick={handleRetrieveMessages} disabled={!isConnected}>
              Retrieve Messages
            </button>
            <button
              onMouseDown={() => handleTypingAlert(true)}
              onMouseUp={() => handleTypingAlert(false)}
              disabled={!isConnected}
            >
              Typing Alert
            </button>
          </div>
        </div>

        <div className="message-section">
          <h2>Send Message</h2>
          <div className="input-group">
            <label>Message Text:</label>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter message text"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <div className="input-group">
            <label>Link (optional):</label>
            <input
              type="text"
              value={messageLink}
              onChange={(e) => setMessageLink(e.target.value)}
              placeholder="Enter link"
            />
          </div>
          <div className="input-group">
            <label>Media (optional):</label>
            <input
              type="text"
              value={messageMedia}
              onChange={(e) => setMessageMedia(e.target.value)}
              placeholder="Enter media URL"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !messageText.trim()}
          >
            Send Message
          </button>
        </div>

        <div className="messages-section">
          <h2>Messages ({chatMessages.length})</h2>
          <div className="messages-list" ref={listRef}>
            {chatMessages.length === 0 ? (
              <p className="no-messages">
                No messages yet. Send a message to get started!
              </p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className="message-item">
                  <div className="message-header">
                    <strong>{msg.senderId?.name || msg.senderId?._id || "Unknown"}</strong>
                    <span className="message-time">
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString()
                        : "Now"}
                    </span>
                  </div>
                  <div className="message-content">
                    {msg.message?.text ||
                      msg.text ||
                      msg.message ||
                      "No content"}
                  </div>
                  {msg.message?.link && (
                    <div className="message-link">
                      <a
                        href={msg.message.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {msg.message.link}
                      </a>
                    </div>
                  )}
                  {msg.message?.media && (
                    <div className="message-media">
                      <a
                        href={msg.message.media}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Media: {msg.message.media}
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
