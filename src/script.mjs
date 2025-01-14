import './components/components.mjs';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/worker.mjs');
}
