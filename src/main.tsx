import 'intro.js/introjs.css';
import { createRoot } from 'react-dom/client';

import App from '@/App';
import '@/styles/index.css';

const accessToken = localStorage.getItem('accessToken');
const isInviteLink = window.location.pathname.startsWith('/rooms/join/');

if (!accessToken && isInviteLink) {
  localStorage.setItem('redirectAfterLogin', window.location.href);
}

createRoot(document.getElementById('root')!).render(<App />);
