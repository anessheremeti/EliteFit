import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../api/user/notifications/notifications';
import { signalRService } from '../api/user/notifications/signalRService';
import { useAuth } from './useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const userId = user?.id;

  console.log("🔥 [useNotifications] Hook running. Current userId:", userId);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===============================
  // FETCH NOTIFICATIONS (STABLE)
  // ===============================
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      console.warn("⚠️ [useNotifications] fetchNotifications u thirr por userId mungon!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`📡 [API Request] Duke thirrur njoftimet për userId: ${userId}...`);

      const [notifRes, unreadRes] = await Promise.all([
        notificationService.getUserNotifications(userId),
        notificationService.getUnreadCount(userId),
      ]);

      // DEBUG: Këtu shohim strukturën e plotë të kthyer nga Axios
      console.log("📥 [API Response Raw] Përgjigja e plotë nga serveri (notifRes):", notifRes);
      console.log("📥 [API Response Raw] Numri i palexuar (unreadRes):", unreadRes);

      const rawData = notifRes?.data || notifRes;
      console.log("🔍 [Data Extraction] Të dhënat e nxjerra nga përgjigja:", rawData);

      let cleanArray = [];
      if (Array.isArray(rawData)) {
        cleanArray = rawData;
      } else if (rawData && typeof rawData === 'object' && Array.isArray(rawData.$values)) {
        console.log("🔗 [Detected EF Core] U gjet strukturë $values nga .NET JSON:");
        cleanArray = rawData.$values;
      } else if (rawData && typeof rawData === 'object' && Array.isArray(rawData.items)) {
        cleanArray = rawData.items;
      }

      console.log(`📊 [Process] U gjetën ${cleanArray.length} njoftime të papërpunuara.`);
      if (cleanArray.length > 0) {
        console.log("📋 [Sample Item Check] Shiko objektin e parë në listë për çështje Casing (shkronja të mëdha/vogla):", cleanArray[0]);
        console.table(cleanArray); // Shfaq njoftimet si tabelë në konsolë
      }

      setNotifications(cleanArray);
      
      const count = unreadRes?.data?.unreadCount ?? unreadRes?.unreadCount ?? 0;
      setUnreadCount(count);

    } catch (err) {
      console.error("❌ [API Error] Gabim kritik gjatë marrjes së njoftimeve:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
  }, [userId, fetchNotifications]);

  // ===============================
  // SIGNALR (SAFE + NO LOOP)
  // ===============================
  const handleNewNotification = useCallback((newNotification) => {
    console.log("⚡ [SignalR Event] Ka ardhur një njoftim i ri LIVE në websockets:", newNotification);
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!userId) return;

    console.log("🔌 [SignalR Connection] Duke ndezur dëgjuesin e SignalR...");
    signalRService.startConnection(handleNewNotification);

  }, [userId, handleNewNotification]);

  // ===============================
  // ACTIONS
  // ===============================
  const markRead = useCallback(async (notificationId) => {
    console.log(`👆 [Action] Duke bërë si të lexuar njoftimin ID: ${notificationId}`);
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("❌ [Action Error] Gabim në markAsRead:", err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    console.log(`👆 [Action] Duke bërë TË GJITHA njoftimet si të lexuara për userId: ${userId}`);
    if (!userId) return;
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("❌ [Action Error] Gabim në markAllAsRead:", err);
    }
  }, [userId]);

  const remove = useCallback((notificationId) => {
    console.log(`🗑️ [Action] Duke fshirë njoftimin ID: ${notificationId}`);
    setNotifications(prev => {
      const target = prev.find(n => n.id === notificationId);
      if (target && !target.isRead) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  const reload = useCallback(() => {
    console.log("🔄 [Action] Forcim i rifreskimit të listës...");
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, unreadCount, loading, error, markRead, markAllRead, remove, reload };
}