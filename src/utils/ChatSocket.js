import { io } from "socket.io-client";

class ChatSocket {
  constructor(serverUrl, userId) {
    this.serverUrl = serverUrl;
    this.userId = userId;
    this.socket = null;
    this.messages = [];

    // Callback storage
    this.callbacks = {
      handshakeSuccess: null,
      messageReceived: null,
      messageSent: null,
      retrieveMessages: null,
      chatList: null,
      messageUpdate: null,
    };

    this.initializeSocket();
  }

  initializeSocket() {
    if (this.userId) {
      this.socket = io(this.serverUrl, {
        extraHeaders: {
          token: this.userId,
        },
      });
    }

    // Register socket listeners (users do not need to handle this directly)
    this.socket.on("receive_message", (message) => {
      this.messages.push(message);
      if (this.callbacks.messageReceived) {
        this.callbacks.messageReceived(message);
      }
    });

    this.socket.on("handshake_success", (data) => {
      if (this.callbacks.handshakeSuccess) {
        this.callbacks.handshakeSuccess(data);
      }
    });

    this.socket.on("retrieve_message", (data) => {
      if (this.callbacks.retrieveMessages) {
        this.callbacks.retrieveMessages(data);
      }
    });

    this.socket.on("message_sent", (data) => {
      if (this.callbacks.messageSent) {
        this.callbacks.messageSent(data);
      }
    });

    this.socket.on("chatlist", (data) => {
      if (this.callbacks.chatList) {
        this.callbacks.chatList(data);
      }
    });

    this.socket.on("message_update", (data) => {
      if (this.callbacks.messageUpdate) {
        this.callbacks.messageUpdate(data);
      }
    });
  }

  // Exposed methods for the users

  sendMessage(received, message) {
    if (this.socket) {
      this.socket.emit("send_message", {
        receiverId: received,
        message,
      });
    }
  }

  joinChat(receiverId) {
    if (this.socket) {
      this.socket.emit("joinChat", { receiverId });
    }
  }

  getMessages() {
    return this.messages;
  }

  // Callback Registration Methods
  setHandshakeSuccessCallback(callback) {
    this.callbacks.handshakeSuccess = callback;
  }

  setMessageReceivedCallback(callback) {
    this.callbacks.messageReceived = callback;
  }

  setMessageSentCallback(callback) {
    this.callbacks.messageSent = callback;
  }

  setRetrieveMessagesCallback(callback) {
    this.callbacks.retrieveMessages = callback;
  }

  setChatListCallback(callback) {
    this.callbacks.chatList = callback;
  }

  setMessageUpdateCallback(callback) {
    this.callbacks.messageUpdate = callback;
  }
}

export default ChatSocket;
