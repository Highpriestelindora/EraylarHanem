
export const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Bu tarayıcı bildirimleri desteklemiyor.');
      return false;
    }

    if (Notification.permission === 'granted') return true;

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  send(title, body, icon = '/logo192.png') {
    if (Notification.permission === 'granted') {
      try {
        const n = new Notification(title, {
          body,
          icon,
          badge: icon,
          vibrate: [200, 100, 200]
        });

        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch (err) {
        console.error('Bildirim gönderilemedi:', err);
      }
    }
  }
};
