import React from 'react';
import { CompassProvider, Button } from '@klearnow/compass/components';
import { compassTheme } from '@klearnow/compass/tokens';
import '@klearnow/compass/fonts.css';

function App(): React.ReactElement {
  return (
    <CompassProvider themeTokens={compassTheme} colorScheme="light">
      <Button onClick={() => console.log('hi')}>Hello</Button>
    </CompassProvider>
  );
}

export default App;
