
# ChatStorm-Client

# useChatSocket Hook - Socket.IO Hook for React

**ChatStorm** The useChatSocket hook provides an easy-to-use interface for integrating socket-based messaging functionality into your React applications. It connects to a WebSocket server (via socket.io) and provides a set of methods and event handlers for sending and receiving messages, joining chats, typing alerts, retrieving message history, and more..

## Features
- **Socket Connection**: Automatically establishes a socket connection with a given server..
- **Event Handlers**: Handles various events such as receiving messages, typing alerts, and message updates.
- **Callbacks**:  Provides a flexible system for handling events through callback functions.
- **Typing Alerts**: Sends typing alerts when the user is typing or stops typing.
- **Message History**: Retrieves past messages based on keywords or receiver ID.
- **Chat List**: Retrieves a list of available chats based on keywords.

---

## Installation

### 1. Install ChatStorm via NPM

In your Node.js project, install the `chatstorm-client` package from NPM:

```bash
npm install chatstorm-client
```

```
import useChatSocket from 'chatstorm-client';

```

```
  let {
    joinChat,
    messages,
    getChatList,
    sendMessage,
    setChatListCallback,
    setHandshakeSuccessCallback,
    setMessageReceivedCallback,
    retrieveMessages,
    updateTypingAlert,
    setRetrieveMessagesCallback,
  } = useChatSocket(BACKEND_SOCKET_URL, MONGO_USER_ID);
```

### 2. It Provides Premade Functions.

### 2.1. Join Chat using MongoID.

```
    joinChat({
      receiverId: '680868132c1c4b2ea5072061',
    });
```

### 2.2. Retrieve  Past Messages With User.

```
    joinChat({
      receiverId: '680868132c1c4b2ea5072061',
    });
```

### 3. It Provides Callbacks, So you will get Response at real-time.

```
setHandshakeSuccessCallback(async (data: any) => {
      console.log('setHandshakeSuccessCallback:', data);
    });
    setMessageReceivedCallback(async (data: any) => {
      console.log('setMessageReceivedCallback:', data);
    });
    setChatListCallback(async (data: any) => {
      console.log('setChatListCallback:', data);
    });
    setRetrieveMessagesCallback(async (data: any) => {
      console.log('setRetrieveMessagesCallback:', data);
    });
```



### 3.1.You will get all available functions once you set it up.



###  Best Of Luck.
