import { CompassProvider } from '@klearnow/compass/components';
import { paymentTheme } from '@klearnow/compass/tokens';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('root is null');
}
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <CompassProvider themeTokens={paymentTheme} colorScheme="light">
      <App />
    </CompassProvider>
  </StrictMode>,
);

console.clear();
