# React Web Test Project

This is a test project for the ChatStorm Client package using React (web).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Link the local package (from the parent directory):
```bash
# Option 1: Use npm link
cd ../..
npm link
cd test/react-web
npm link chatstorm-client

# Option 2: Or install directly from parent
npm install ../../..
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Configuration

Before testing, make sure you have:
- A ChatStorm server running (default: `ws://localhost:3001`)
- Valid user IDs for testing

## Testing

1. Enter your server URL (default: `ws://localhost:3001`)
2. Enter a User ID
3. Enter a Receiver ID
4. The connection should establish automatically
5. Try sending messages, joining chats, and testing other features

## Features Tested

- ✅ Socket connection
- ✅ Handshake success callback
- ✅ Sending messages
- ✅ Receiving messages
- ✅ Joining chats
- ✅ Getting chat list
- ✅ Retrieving messages
- ✅ Typing alerts

