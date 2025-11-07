import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// Interfaces for function parameters
interface SendMessageParams {
  receiverId: string;
  message: {
    text: string;
    link: string;
    media: string;
  };
}

interface JoinChatParams {
  receiverId: string;
}

interface TypingAlertParams {
  receiverId: string;
  isTyping: boolean;
}

interface DeleteMessageParams {
  messageId: string;
}

interface RetrieveMessagesParams {
  receiverId: string;
  keyword: string;
}

interface ChatListParams {
  keyword: string;
}

interface CallbackFunction<T = any> {
  (data: T): void;
}

interface Callbacks {
  handshakeSuccess: CallbackFunction | null;
  messageReceived: CallbackFunction | null;
  messageSent: CallbackFunction | null;
  retrieveMessages: CallbackFunction | null;
  retrieveAllMessages: CallbackFunction | null;
  chatList: CallbackFunction | null;
  messageUpdate: CallbackFunction | null;
  messageUpdateReceiver: CallbackFunction | null;
  typingAlert: CallbackFunction | null;
  onLeave: CallbackFunction | null;
}

const useChatSocket = (serverUrl: string, userId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<Callbacks>({
    handshakeSuccess: null,
    messageReceived: null,
    messageSent: null,
    retrieveMessages: null,
    retrieveAllMessages: null,
    chatList: null,
    messageUpdate: null,
    messageUpdateReceiver: null,
    typingAlert: null,
    onLeave: null,
  });
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Initialize socket connection
    if (userId) {
          console.log(userId, "userId in chat socket");

      // React Native compatible Socket.IO configuration
      socketRef.current = io(serverUrl, {
        // transports: ["websocket", "polling"], // Support both transports for React Native
        // reconnection: true,
        // reconnectionDelay: 1000,
        // reconnectionAttempts: 5,
        extraHeaders: {
          token: userId,
          Authorization: `Bearer ${userId}`,
        },
        
      });

      // Listen to socket events
      socketRef.current.on("receive_message", (data: any) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        if (callbacksRef.current.messageReceived) {
          callbacksRef.current.messageReceived(data);
        }
      });

      socketRef.current.on("handshake_success", (data: any) => {
        if (callbacksRef.current.handshakeSuccess) {
          callbacksRef.current.handshakeSuccess(data);
        }
      });

      socketRef.current.on("retrieve_message", (data: any) => {
        if (callbacksRef.current.retrieveAllMessages) {
          callbacksRef.current.retrieveAllMessages(data);
        }
      });
      socketRef.current.on("message_sent", (data: any) => {

        if (callbacksRef.current.messageSent) {
          callbacksRef.current.messageSent(data);
        }
      });
      socketRef.current.on("chatlist", (data: any) => {
        if (callbacksRef.current.chatList) {
          callbacksRef.current.chatList(data);
        }
      });

      socketRef.current.on("message_update", (data: any) => {
        if (callbacksRef.current.messageUpdate) {
          callbacksRef.current.messageUpdate(data);
        }
      });

      socketRef.current.on("message_update_receiver", (data: any) => {
        if (callbacksRef.current.messageUpdateReceiver) {
          callbacksRef.current.messageUpdateReceiver(data);
        }
      });

      socketRef.current.on("typing_alert", (data: any) => {
        if (callbacksRef.current.typingAlert) {
          callbacksRef.current.typingAlert(data);
        }
      });

      socketRef.current.on("leave", (data: any) => {
        if (callbacksRef.current.onLeave) {
          callbacksRef.current.onLeave(data);
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.emit("disconnect_user");
          socketRef.current.disconnect();
        }
      };
    }
  }, [serverUrl, userId]);

  // Typings for function arguments and returns
  const sendMessage = ({ receiverId, message }: SendMessageParams) => {
    if (socketRef.current) {
      socketRef.current.emit("send_message", { receiverId, message });
    }
  };

  const joinChat = ({ receiverId }: JoinChatParams) => {
    if (socketRef.current) {
      socketRef.current.emit("joinchat", { receiverId });
    }
  };

  const updateTypingAlert = ({ receiverId, isTyping }: TypingAlertParams) => {
    if (socketRef.current) {
      socketRef.current.emit("user_typing", {
        receiverId,
        type: isTyping ? "user_typing" : "typing_stopped",
      });
    }
  };

  const deleteMessage = ({ messageId }: DeleteMessageParams) => {
    if (socketRef.current) {
      socketRef.current.emit("delete_message", {
        messageId,
      });
    }
  };

  const getChatList = ({ keyword }: ChatListParams) => {
    if (socketRef.current) {
      socketRef.current.emit("get_chatlist", {
        keyword,
      });
    }
  };

  const retrieveMessages = ({
    receiverId,
    keyword,
  }: RetrieveMessagesParams) => {
    if (socketRef.current) {
      socketRef.current.emit("chat_message", {
        receiverId,
        keyword,
      });
    }
  };

  const setHandshakeSuccessCallback = useCallback(
    (callback: CallbackFunction) => {
      callbacksRef.current.handshakeSuccess = callback;
    },
    []
  );

  const setMessageReceivedCallback = useCallback(
    (callback: CallbackFunction) => {
      callbacksRef.current.messageReceived = callback;
    },
    []
  );

  const setMessageSentCallback = useCallback((callback: CallbackFunction) => {
    callbacksRef.current.messageSent = callback;
  }, []);

  const setRetrieveMessagesCallback = useCallback(
    (callback: CallbackFunction) => {
      callbacksRef.current.retrieveAllMessages = callback;
    },
    []
  );

  const setChatListCallback = useCallback((callback: CallbackFunction) => {
    callbacksRef.current.chatList = callback;
  }, []);

  const setMessageUpdateCallback = useCallback((callback: CallbackFunction) => {
    callbacksRef.current.messageUpdate = callback;
  }, []);

  const setReceiverMessageUpdateCallback = useCallback(
    (callback: CallbackFunction) => {
      callbacksRef.current.messageUpdateReceiver = callback;
    },
    []
  );

  const setTypingAlertCallback = useCallback((callback: CallbackFunction) => {
    callbacksRef.current.typingAlert = callback;
  }, []);

  const setOnLeaveCallback = useCallback((callback: CallbackFunction) => {
    callbacksRef.current.onLeave = callback;
  }, []);

  return {
    messages,
    sendMessage,
    getChatList,
    joinChat,
    updateTypingAlert,
    deleteMessage,
    retrieveMessages,
    setHandshakeSuccessCallback,
    setMessageReceivedCallback,
    setMessageSentCallback,
    setRetrieveMessagesCallback,
    setChatListCallback,
    setMessageUpdateCallback,
    setReceiverMessageUpdateCallback,
    setTypingAlertCallback,
    setOnLeaveCallback,
  };
};

export default useChatSocket;
