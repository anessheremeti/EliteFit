import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../api/user/notifications/notifications';
import { signalRService } from '../api/user/notifications/signalRService';
import { useAuth } from './useAuth';

export function useNotifications() {
  console.log("🔥 useNotifications running");

  const { user } = useAuth();
  const userId = user?.id;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===============================
  // FETCH NOTIFICATIONS (STABLE)
  // ===============================
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const [notifRes, unreadRes] = await Promise.all([
        notificationService.getUserNotifications(userId),
        notificationService.getUnreadCount(userId),
      ]);

      setNotifications(notifRes?.data || notifRes || []);
      setUnreadCount(unreadRes?.data?.unreadCount ?? unreadRes?.unreadCount ?? 0);

    } catch (err) {
      console.error("Gabim në marrjen e njoftimeve:", err);
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
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!userId) return;

    signalRService.startConnection(handleNewNotification);

    // ⚠️ MOS E NDALIM NË DEV RE-RENDER LOOP
    // stopConnection vetëm në logout / app unmount globalisht

  }, [userId, handleNewNotification]);

  // ===============================
  // ACTIONS
  // ===============================
  const markRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (err) {
      console.error("Gabim gjatë mark-as-read:", err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (!userId) return;

    try {
      await notificationService.markAllAsRead(userId);

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );

      setUnreadCount(0);

    } catch (err) {
      console.error("Gabim gjatë mark-all-read:", err);
    }
  }, [userId]);

  const remove = useCallback((notificationId) => {
    setNotifications(prev => {
      const target = prev.find(n => n.id === notificationId);

      if (target && !target.isRead) {
        setUnreadCount(count => Math.max(0, count - 1));
      }

      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  const reload = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ===============================
  // RETURN
  // ===============================
  return {
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    remove,
    reload
  };
}