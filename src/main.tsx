import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { Root } from './Root';
import { initInstallCapture } from './lib/pwa';
import './styles/tokens.css';

initInstallCapture();
registerSW({ immediate: true });

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
