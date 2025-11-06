import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0ea5e9', dark: '#0b2a37' }}
      headerImage={
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      {/* Hero */}
      <ThemedView style={[styles.card, { alignItems: 'center' }] }>
        <View style={styles.rowCenter}>
          <ThemedText type="title">ChatStorm</ThemedText>
          <HelloWave />
        </View>
        <ThemedText style={{ textAlign: 'center' }}>
          Real‑time chat demo using the chatstorm-client hook. Explore chats, send messages, and see typing indicators.
        </ThemedText>
        <View style={styles.ctaRow}>
          <TouchableOpacity style={[styles.ctaBtn, styles.ctaPrimary]} onPress={() => router.push('/(tabs)/chat')}>
            <ThemedText style={styles.ctaPrimaryText}>Open Chat</ThemedText>
          </TouchableOpacity>
          <Link href="/modal" asChild>
            <TouchableOpacity style={[styles.ctaBtn, styles.ctaGhost]}>
              <ThemedText>About</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </ThemedView>

      {/* Features */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Features</ThemedText>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><ThemedText>Socket.IO</ThemedText></View>
          <View style={styles.badge}><ThemedText>Typing</ThemedText></View>
          <View style={styles.badge}><ThemedText>History</ThemedText></View>
          <View style={styles.badge}><ThemedText>Chat List</ThemedText></View>
          <View style={styles.badge}><ThemedText>Expo Go</ThemedText></View>
        </View>
        <ThemedText>
          Navigate to the Chat tab to connect, join a conversation, view available chats, and send messages in real time.
        </ThemedText>
      </ThemedView>

      {/* Dev tips */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Developer Tips</ThemedText>
        <ThemedText>
          Press <ThemedText type="defaultSemiBold">{Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}</ThemedText> for dev tools.
        </ThemedText>
        <ThemedText>
          Update <ThemedText type="defaultSemiBold">app/(tabs)/chat.tsx</ThemedText> to tweak the UI and behavior.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 10 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  ctaBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 9999, borderWidth: 1, borderColor: '#e5e7eb' },
  ctaPrimary: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  ctaPrimaryText: { color: '#fff', fontWeight: '700' },
  ctaGhost: { },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9999, borderWidth: 1, borderColor: '#e5e7eb' },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
