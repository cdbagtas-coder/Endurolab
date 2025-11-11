import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Bell, 
  Package, 
  Bike,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Trash2
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'order' | 'rental' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: any;
}

interface NotificationsProps {
  onClose: () => void;
}

export function Notifications({ onClose }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order #ORD-2025-001 has been confirmed and is being prepared for shipment.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      icon: Package
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Payment of ₱18,078.00 was processed successfully.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      read: false,
      icon: CreditCard
    },
    {
      id: '3',
      type: 'rental',
      title: 'Rental Reminder',
      message: 'Your bike rental is scheduled for tomorrow. Please complete your verification.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      icon: Bike
    },
    {
      id: '4',
      type: 'system',
      title: 'Welcome to ENDURO LAB!',
      message: 'Thanks for joining! Check out our latest parts and gear.',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      read: true,
      icon: CheckCircle2
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-teal-400 bg-teal-400/10';
      case 'payment':
        return 'text-green-400 bg-green-400/10';
      case 'rental':
        return 'text-blue-400 bg-blue-400/10';
      case 'system':
        return 'text-slate-400 bg-slate-400/10';
      default:
        return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-white">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-slate-400">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-teal-400 hover:text-teal-300 hover:bg-slate-700"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-white mb-2">No notifications</h2>
            <p className="text-slate-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon || Bell;
              return (
                <Card
                  key={notification.id}
                  className={`${
                    notification.read
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-slate-800 border-teal-500/50'
                  } transition-all hover:border-teal-500/70`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white">{notification.title}</h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-teal-500 rounded-full" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-teal-400 hover:text-teal-300 hover:bg-slate-700 h-8 px-3 -ml-3"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
