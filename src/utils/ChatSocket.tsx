import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Interfaces for function parameters
interface SendMessageParams {
  receiverId: string;
  message: string;
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
  chatList: CallbackFunction | null;
  messageUpdate: CallbackFunction | null;
  messageUpdateReceiver: CallbackFunction | null;
  typingAlert: CallbackFunction | null;
  onLeave: CallbackFunction | null;
}

const useChatSocket = (serverUrl: string, userId: string) => {
  const socketRef = useRef<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const [callbacks, setCallbacks] = useState<Callbacks>({
    handshakeSuccess: null,
    messageReceived: null,
    messageSent: null,
    retrieveAllMessages: null,
    chatList: null,
    messageUpdate: null,
    messageUpdateReceiver: null,
    typingAlert: null,
    onLeave: null,
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

      socketRef.current.on("retrieve_message", (data: any) => {
        if (callbacks.retrieveAllMessages) {
          callbacks.retrieveAllMessages(data);
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

      socketRef.current.on("message_update_receiver", (data: any) => {
        if (callbacks.messageUpdateReceiver) {
          callbacks.messageUpdateReceiver(data);
        }
      });

      socketRef.current.on("typing_alert", (data: any) => {
        if (callbacks.typingAlert) {
          callbacks.typingAlert(data);
        }
      });

      socketRef.current.on("leave", (data: any) => {
        if (callbacks.onLeave) {
          callbacks.onLeave(data);
        }
      });

      return () => {
        socketRef.current.emit("disconnect_user");
        socketRef.current.disconnect();
      };
    }
  }, [serverUrl, userId, callbacks]);

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
      socketRef.current.emit("typing_alert", {
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

  const setHandshakeSuccessCallback = (callback: CallbackFunction) => {
    setCallbacks((prev) => ({ ...prev, handshakeSuccess: callback }));
  };

  const setMessageReceivedCallback = (callback: CallbackFunction) => {
    setCallbacks((prev) => ({ ...prev, messageReceived: callback }));
  };

  const setMessageSentCallback = (callback: CallbackFunction) => {
    setCallbacks((prev) => ({ ...prev, messageSent: callback }));
  };

  const setRetrieveMessagesCallback = (callback: CallbackFunction) => {
    setCallbacks((prev) => ({ ...prev, retrieveAllMessages: callback }));
  };

  const setChatListCallback = (callback: CallbackFunction) => {
    setCallbacks((prev) => ({ ...prev, chatList: callback }));
  };

  const setMessageUpdateCallback = (callback: CallbackFunction) => {
    setCallbacks((prev) => ({ ...prev, messageUpdate: callback }));
  };

  const setReceiverMessageUpdateCallback = (callback: CallbackFunction) => {
    setCallbacks((prev) => ({ ...prev, messageUpdateReceiver: callback }));
  };

  const setOnLeaveCallback = (callback: CallbackFunction) => {
    setCallbacks((prev) => ({ ...prev, onLeave: callback }));
  };

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
    setOnLeaveCallback,
  };
};

export default useChatSocket;
