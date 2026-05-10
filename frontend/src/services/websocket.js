import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

/**
 * Connect to the CricketPro WebSocket server.
 * Returns the STOMP client for subscribing to topics.
 */
export function connectWebSocket(onConnect, onError) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 3000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (msg) => {
      if (import.meta.env.DEV) {
        console.log('[STOMP]', msg);
      }
    },
    onConnect: () => {
      console.log('🏏 WebSocket connected to CricketPro');
      if (onConnect) onConnect(stompClient);
    },
    onStompError: (frame) => {
      console.error('STOMP Error:', frame.headers?.message);
      if (onError) onError(frame);
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
  });

  stompClient.activate();
  return stompClient;
}

/**
 * Subscribe to a topic channel.
 */
export function subscribe(destination, callback) {
  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP not connected. Cannot subscribe to', destination);
    return null;
  }
  return stompClient.subscribe(destination, (message) => {
    const body = JSON.parse(message.body);
    callback(body);
  });
}

/**
 * Send a message to the server (e.g., place a bid).
 */
export function sendMessage(destination, body) {
  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP not connected. Cannot send to', destination);
    return;
  }
  stompClient.publish({
    destination,
    body: JSON.stringify(body),
  });
}

export function sendBid(tournamentId, playerId, teamId, amount) {
  sendMessage(`/app/auction/${tournamentId}/bid`, { playerId, teamId, amount });
}

/**
 * Disconnect WebSocket.
 */
export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}

export function getClient() {
  return stompClient;
}
