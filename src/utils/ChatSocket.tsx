import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const useChatSocket = (serverUrl: string, userId: string) => {
  const socketRef = useRef<any>(null);
  const [messages, setMessages] = useState<any>([]);

  const [callbacks, setCallbacks] = useState({
    handshakeSuccess: null,
    messageReceived: null,
    messageSent: null,
    retrieveMessages: null,
    chatList: null,
    messageUpdate: null,
  });

  useEffect(() => {
    // Initialize socket connection
    if (userId) {
      socketRef.current = io(serverUrl, {
        extraHeaders: {
          token: userId,
        },
      });

      // Listen to socket events
      socketRef.current.on("receive_message", (message: any) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        if (callbacks.messageReceived) {
          callbacks.messageReceived(message);
        }
      });

      socketRef.current.on("handshake_success", (data: any) => {
        if (callbacks.handshakeSuccess) {
          callbacks.handshakeSuccess(data);
        }
      });

      socketRef.current.on("message_sent", (data: any) => {
        if (callbacks.messageSent) {
          callbacks.messageSent(data);
        }
      });

      socketRef.current.on("chatlist", (data: any) => {
        if (callbacks.chatList) {
          callbacks.chatList(data);
        }
      });

      socketRef.current.on("message_update", (data: any) => {
        if (callbacks.messageUpdate) {
          callbacks.messageUpdate(data);
        }
      });

      // Cleanup when component unmounts
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [serverUrl, userId, callbacks]);

  const sendMessage = (receiverId: string, message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("send_message", { receiverId, message });
    }
  };

  const joinChat = (receiverId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("joinChat", { receiverId });
    }
  };

  const setHandshakeSuccessCallback = (callback: Function) => {
    setCallbacks((prev) => ({ ...prev, handshakeSuccess: callback }));
  };

  const setMessageReceivedCallback = (callback: Function) => {
    setCallbacks((prev) => ({ ...prev, messageReceived: callback }));
  };

  const setMessageSentCallback = (callback: Function) => {
    setCallbacks((prev) => ({ ...prev, messageSent: callback }));
  };

  const setRetrieveMessagesCallback = (callback: Function) => {
    setCallbacks((prev) => ({ ...prev, retrieveMessages: callback }));
  };

  const setChatListCallback = (callback: Function) => {
    setCallbacks((prev) => ({ ...prev, chatList: callback }));
  };

  const setMessageUpdateCallback = (callback: Function) => {
    setCallbacks((prev) => ({ ...prev, messageUpdate: callback }));
  };

  return {
    messages,
    sendMessage,
    joinChat,
    setHandshakeSuccessCallback,
    setMessageReceivedCallback,
    setMessageSentCallback,
    setRetrieveMessagesCallback,
    setChatListCallback,
    setMessageUpdateCallback,
  };
};

export default useChatSocket;
