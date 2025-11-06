import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type Callback<T = any> = (data: T) => void;

export default function useChatSocket(serverUrl: string, userId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const callbacks = useRef({
    handshakeSuccess: null as Callback | null,
    messageReceived: null as Callback | null,
    messageSent: null as Callback | null,
    chatList: null as Callback | null,
    retrieveAllMessages: null as Callback | null,
    typingAlert: null as Callback | null,
  });

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(serverUrl, {
      transports: ['websocket'],
      extraHeaders: { token: userId, Authorization: `Bearer ${userId}` },
    });

    const s = socketRef.current;

    s.on('receive_message', (data: any) => {
      setMessages(prev => [...prev, data]);
      callbacks.current.messageReceived?.(data);
    });
    s.on('handshake_success', (data: any) => callbacks.current.handshakeSuccess?.(data));
    s.on('retrieve_message', (data: any) => callbacks.current.retrieveAllMessages?.(data));
    s.on('message_sent', (data: any) => callbacks.current.messageSent?.(data));
    s.on('chatlist', (data: any) => callbacks.current.chatList?.(data));
    s.on('typing_alert', (data: any) => callbacks.current.typingAlert?.(data));

    return () => {
      try {
        s.emit('disconnect_user');
      } catch {}
      s.disconnect();
    };
  }, [serverUrl, userId]);

  const sendMessage = ({ receiverId, message }: { receiverId: string; message: { text: string; link?: string; media?: string } }) => {
    socketRef.current?.emit('send_message', { receiverId, message });
  };
  const joinChat = ({ receiverId }: { receiverId: string }) => {
    socketRef.current?.emit('joinchat', { receiverId });
  };
  const getChatList = ({ keyword }: { keyword: string }) => {
    socketRef.current?.emit('get_chatlist', { keyword });
  };
  const retrieveMessages = ({ receiverId, keyword }: { receiverId: string; keyword: string }) => {
    socketRef.current?.emit('chat_message', { receiverId, keyword });
  };
  const updateTypingAlert = ({ receiverId, isTyping }: { receiverId: string; isTyping: boolean }) => {
    socketRef.current?.emit('typing_alert', { receiverId, type: isTyping ? 'user_typing' : 'typing_stopped' });
  };

  const setHandshakeSuccessCallback = useCallback((cb: Callback) => (callbacks.current.handshakeSuccess = cb), []);
  const setMessageReceivedCallback = useCallback((cb: Callback) => (callbacks.current.messageReceived = cb), []);
  const setMessageSentCallback = useCallback((cb: Callback) => (callbacks.current.messageSent = cb), []);
  const setChatListCallback = useCallback((cb: Callback) => (callbacks.current.chatList = cb), []);
  const setRetrieveMessagesCallback = useCallback((cb: Callback) => (callbacks.current.retrieveAllMessages = cb), []);
  const setTypingAlertCallback = useCallback((cb: Callback) => (callbacks.current.typingAlert = cb), []);

  return {
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
  };
}


