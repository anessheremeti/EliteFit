import * as signalR from '@microsoft/signalr';

let connection = null;
let isStarting = false; // Ky është "lock"-u ynë
export const signalRService = {
 startConnection: async (onNotificationReceived) => {
    // Nëse lidhja është aktive ose jemi duke e hapur, mos bëj asgjë
    if ((connection && connection.state === signalR.HubConnectionState.Connected) || isStarting) {
      return;
    }

    isStarting = true; // Blloko çdo përpjekje tjetër deri sa të përfundojë kjo

    try {
      connection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7049/hubs/notifications', {
          accessTokenFactory: () => {
            let token = localStorage.getItem('token');
            return token ? token.replace(/^"|"$/g, '').replace(/"/g, '').trim() : "";
          }
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.on('ReceiveNotification', (notification) => {
        onNotificationReceived?.(notification);
      });

      connection.onclose((err) => {
        console.log('[SignalR] Closed:', err);
        connection = null;
      });

      await connection.start();
      console.log('[SignalR] Connected ✅');
    } catch (err) {
      console.error('[SignalR] Connection Error:', err);
      connection = null;
    } finally {
      isStarting = false; // Liro bllokimin
    }
  },
  stopConnection: async () => {
    if (connection) {
      await connection.stop();
      connection = null;
    }
  }
};