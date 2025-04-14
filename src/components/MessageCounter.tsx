import type { FC } from '../lib/teact/teact';
import { useEffect } from '../lib/teact/teact';

const badgeId = 'message-counter-badge';

const MessageCounter: FC = () => {
  useEffect(() => {
    function showBadge(text: string) {
      let badge = document.getElementById(badgeId) as HTMLDivElement | null;

      if (!badge) {
        badge = document.createElement('div');
        badge.id = badgeId;
        document.body.appendChild(badge);
      }

      badge.innerText = text;
    }

    if (!document.getElementById(`style-${badgeId}`)) {
      const style = document.createElement('style');
      style.id = `style-${badgeId}`;
      style.innerHTML = `
        #${badgeId} {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #2a2f45;
          color: white;
          font-weight: bold;
          padding: 10px 18px;
          border-radius: 12px;
          z-index: 9999;
          font-family: monospace;
          min-width: 180px;
          text-align: center;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
      `;
      document.head.appendChild(style);
    }

    function countMyMessages() {
      showBadge('Подсчет сообщений...');

      setTimeout(() => {
        const myMessages = document.querySelectorAll('div.Message.own');
        showBadge(`Моих сообщений: ${myMessages.length}`);
      }, 800);
    }

    let attempts = 0;
    const maxAttempts = 15;
    const interval = setInterval(() => {
      const chatContainer = document.querySelector('.MessageList.custom-scroll.with-default-bg');

      if (chatContainer) {
        const observer = new MutationObserver(() => {
          countMyMessages();
        });

        observer.observe(chatContainer, { childList: true, subtree: true });

        countMyMessages();
        clearInterval(interval);

        return () => observer.disconnect();
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }

      return undefined;
    }, 500);
  }, []);

  return undefined;
};

export default MessageCounter;
