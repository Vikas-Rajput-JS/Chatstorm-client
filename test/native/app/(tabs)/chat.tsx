import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import useChatSocket from 'chatstorm-client';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ChatTab() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [serverUrl, setServerUrl] = useState('http://192.168.29.79:3001');
  const [userId, setUserId] = useState('test-user-1');
  const [receiverId, setReceiverId] = useState('test-user-2');
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [chatList, setChatList] = useState<any[]>([]);
  const listRef = useRef<FlatList<any>>(null);

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
    setHandshakeSuccessCallback(() => {
      setConnected(true);
      Alert.alert('Connected', 'Handshake success');
    });
    setMessageReceivedCallback((message: any) => {
      setChatMessages(prev => [...prev, message]);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    });
    retrieveMessages({ receiverId, keyword: '' })
    setMessageSentCallback(() => Alert.alert('Sent', 'Message sent'));
    setRetrieveMessagesCallback((payload: any) => {
    
      const next = Array.isArray(payload)
        ? payload
        : payload?.messages || payload?.data || [];
      if (Array.isArray(next)) setChatMessages(next);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    });
    setChatListCallback((payload: any) => {
      const list = Array.isArray(payload) ? payload : payload?.chats || payload?.data || [];
      if (Array.isArray(list)) setChatList(list);
    });
  }, [setHandshakeSuccessCallback, setMessageReceivedCallback, setMessageSentCallback, setRetrieveMessagesCallback, setChatListCallback, receiverId, retrieveMessages]);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">ChatStorm Demo</ThemedText>
        <View style={[styles.statusPill, connected ? styles.online : styles.offline]}>
          <Text style={styles.statusText}>{connected ? 'Connected' : 'Disconnected'}</Text>
        </View>
      </View>

      {/* Config card */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Configuration</ThemedText>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Server</Text>
          <TextInput
            style={[styles.input, { borderColor: (colorScheme === 'dark') ? '#374151' : '#ddd', color: theme.text }]}
            value={serverUrl}
            onChangeText={setServerUrl}
            placeholder="http://192.168.29.79:3001"
            placeholderTextColor={(colorScheme === 'dark') ? '#9ca3af' : '#6b7280'}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>User</Text>
          <TextInput
            style={[styles.input, { borderColor: (colorScheme === 'dark') ? '#374151' : '#ddd', color: theme.text }]}
            value={userId}
            onChangeText={setUserId}
            placeholder="your-user-id"
            placeholderTextColor={(colorScheme === 'dark') ? '#9ca3af' : '#6b7280'}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>To</Text>
          <TextInput
            style={[styles.input, { borderColor: (colorScheme === 'dark') ? '#374151' : '#ddd', color: theme.text }]}
            value={receiverId}
            onChangeText={setReceiverId}
            placeholder="receiver-id"
            placeholderTextColor={(colorScheme === 'dark') ? '#9ca3af' : '#6b7280'}
          />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={() => joinChat({ receiverId })}>
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => getChatList({ keyword: '' })}>
            <Text style={styles.buttonText}>Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => retrieveMessages({ receiverId, keyword: '' })}>
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Chat list */}
      <ThemedView style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ThemedText type="subtitle">Available Chats ({chatList.length})</ThemedText>
          <TouchableOpacity style={[styles.button, { paddingVertical: 6 }]} onPress={() => getChatList({ keyword: '' })}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={chatList}
          keyExtractor={(item, i) => String(item?.id || item?._id || item?.receiverId || i)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => {
            const id = item?.id || item?._id || item?.receiverId || item?.userId;
            const name = item?.senderId?.name;
            const mainId = item?.senderId?._id === userId ? item?.receiverId?._id : item?.senderId?._id;
            const isActive = receiverId === id;
            const border = (colorScheme === 'dark') ? '#374151' : '#e5e7eb';
            const activeBg = '#2563eb';
            const nameColor = isActive ? '#fff' : theme.text;
            return (
              <TouchableOpacity
                style={[
                  styles.chatRow,
                  { borderColor: border },
                  isActive && { backgroundColor: activeBg, borderColor: activeBg },
                ]}
                onPress={() => {
                  setReceiverId(mainId);
                  retrieveMessages({ receiverId: mainId, keyword: '' });
                }}>
                <Text style={[styles.chatName, { color: nameColor }]}>{name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </ThemedView>

      {/* Messages */}
      <FlatList
        ref={listRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8 }}
        data={chatMessages?.length ? chatMessages : messages}
        keyExtractor={(_, i) => String(i)}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const sender = item?.senderId || item?.sender || item?.userId;
          const isMine = sender === userId;
          const text = (item?.message && (item?.message.text || item?.message)) || item?.text || item?.content || '';
          const ts = item?.timestamp ? new Date(item.timestamp).toLocaleTimeString() : '';
          const otherBg = (colorScheme === 'dark') ? '#374151' : '#e5e7eb';
          const otherText = theme.text;
          return (
            <View style={[styles.bubbleRow, isMine ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
              <View style={[
                styles.bubble,
                isMine ? styles.bubbleMine : styles.bubbleOther,
                !isMine && { backgroundColor: otherBg },
              ]}>
                <Text style={[styles.bubbleText, isMine ? { color: '#fff' } : { color: otherText }]}>{text || JSON.stringify(item)}</Text>
                {!!ts && <Text style={[styles.time, isMine ? { color: '#e5e7eb' } : { color: (colorScheme === 'dark') ? '#9ca3af' : '#6b7280' }]}>{ts}</Text>}
              </View>
            </View>
          );
        }}
      />

      {/* Composer */}
      <View style={styles.composer}>
        <TextInput
          style={[styles.composerInput, { borderColor: (colorScheme === 'dark') ? '#374151' : '#ddd', color: theme.text }]}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
          placeholderTextColor={(colorScheme === 'dark') ? '#9ca3af' : '#6b7280'}
          onFocus={() => updateTypingAlert({ receiverId, isTyping: true })}
          onBlur={() => updateTypingAlert({ receiverId, isTyping: false })}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => {
            if (!messageText.trim()) return;
            sendMessage({ receiverId, message: { text: messageText } as any });
            setMessageText('');
          }}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusPill: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 9999 },
  statusText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  online: { backgroundColor: '#10b981' },
  offline: { backgroundColor: '#ef4444' },
  card: { borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', gap: 8 },
  row: { gap: 6 },
  label: { fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  actions: { flexDirection: 'row', gap: 8 },
  button: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  bubbleRow: { paddingHorizontal: 6, marginVertical: 2, flexDirection: 'row' },
  bubble: { maxWidth: '80%', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12 },
  bubbleMine: { backgroundColor: '#2563eb', borderTopRightRadius: 4 },
  bubbleOther: { backgroundColor: '#e5e7eb', borderTopLeftRadius: 4 },
  bubbleText: { fontSize: 14 },
  time: { fontSize: 10, marginTop: 4 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 6 },
  composerInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 9999, paddingVertical: 10, paddingHorizontal: 14 },
  sendBtn: { backgroundColor: '#10b981', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 9999 },
  sendText: { color: '#fff', fontWeight: '700' },
  chatRow: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 },
  chatRowActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  chatName: { color: '#111827', fontWeight: '600' },
  chatNameActive: { color: '#1d4ed8' },
});


