import React from 'react';
import { KdesignProvider, Button } from '@klearnow/kdesign/components';
import { kdesignTheme } from '@klearnow/kdesign/tokens';
import '@klearnow/kdesign/fonts.css';

function App(): React.ReactElement {
  return (
    <KdesignProvider themeTokens={kdesignTheme} colorScheme="light">
      <Button onClick={() => console.log('hi')}>Hello</Button>
    </KdesignProvider>
  );
}

export default App;
