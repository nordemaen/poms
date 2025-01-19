import './components/components.mjs';

import './components/init.mjs';
import { requestNotificationPermission } from './components/utils.mjs';

// Since this script is deferred, the DOM is guaranteed to be ready.
document.querySelector('#notificationButton').addEventListener('click', requestNotificationPermission);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/worker.mjs');
}
