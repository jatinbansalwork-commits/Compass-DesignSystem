import { KdesignProvider } from '@klearnow/kdesign/components';
import { paymentTheme } from '@klearnow/kdesign/tokens';
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
    <KdesignProvider themeTokens={paymentTheme} colorScheme="light">
      <App />
    </KdesignProvider>
  </StrictMode>,
);

console.clear();
