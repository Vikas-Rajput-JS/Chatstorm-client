# Test Projects for ChatStorm Client

This directory contains test projects to verify the ChatStorm Client package works correctly in different environments.

## Test Projects

### 1. React Web Test (`react-web/`)
A simple React web application using Vite to test the package in a browser environment.

**Quick Start:**
```bash
cd react-web
npm install
npm link ../../..  # Link the parent package
npm run dev
```

### 2. React Native Test (`react-native/`)
A React Native application to test the package in a mobile environment.

**Quick Start:**
```bash
cd react-native
npm install
npm link ../../..  # Link the parent package
npm run ios        # or npm run android
```

## Testing Checklist

Before testing, ensure you have:
- ✅ ChatStorm server running
- ✅ Valid server URL configured
- ✅ Test user IDs ready
- ✅ Network connectivity

### Features to Test

- [ ] Socket connection establishment
- [ ] Handshake success callback
- [ ] Sending messages
- [ ] Receiving messages
- [ ] Joining chats
- [ ] Getting chat list
- [ ] Retrieving message history
- [ ] Typing indicators
- [ ] Message updates
- [ ] Disconnection handling

## Linking the Package

To test the local package, you have two options:

### Option 1: npm link (Recommended for development)
```bash
# In the package root directory
cd ../..
npm link

# In the test project directory
cd test/react-web  # or test/react-native
npm link chatstorm-client
```

### Option 2: Direct install
```bash
# In the test project directory
npm install ../../..
```

## Notes

- The React Native test requires `react-native-get-random-values` which is already included
- Make sure to import it at the top of `index.js` (already done)
- For localhost testing in React Native, you may need to use your computer's IP address instead of `localhost`

