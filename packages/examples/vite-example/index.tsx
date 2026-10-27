import { Klear360Provider } from '@klearnow/klear360/components';
import { paymentTheme } from '@klearnow/klear360/tokens';
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
    <Klear360Provider themeTokens={paymentTheme} colorScheme="light">
      <App />
    </Klear360Provider>
  </StrictMode>,
);

console.clear();
