'use client';

import { useEffect } from 'react';

const OneSignalWrapper = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!window.OneSignal) {
        const queue = [];
        queue.push = function (callback) {
          return Array.prototype.push.call(this, callback);
        };
        window.OneSignal = queue;
      }

      window.OneSignal.push(() => {
        window.OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
          notifyButton: {
            enable: true,
          },
          allowLocalhostAsSecureOrigin: true,
        });

        window.OneSignal.showSlidedownPrompt();
        window.OneSignal.sendTag('role', 'admin');
      });
    };
  }, []);

  return null;
};

export default OneSignalWrapper;
