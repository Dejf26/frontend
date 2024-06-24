import { BehaviorSubject, Observable } from 'rxjs';

export type ISOString = string;

export type Notification = {
  title: string;
  message: string;
  date: ISOString;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
};

class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  send(notification: Notification) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    this.updateUnreadCount();
  }

  list(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  unreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  markAllAsRead() {
    const updatedNotifications = this.notificationsSubject.value.map((n) => ({ ...n, read: true }));
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  clearAll() {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
  }

  private updateUnreadCount() {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }
}

export default new NotificationService();
