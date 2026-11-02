import styled, { ThemeProvider } from 'styled-components';
import { KdesignProvider, Button } from '@klearnow/kdesign/components';
import { kdesignTheme } from '@klearnow/kdesign/tokens';
import '@klearnow/kdesign/fonts.css';

import './app.css';

const customTheme = {
  // it is crucial to namespace your theme inside a key such as below to ensure it doesn't override anything unexpected in kdesign's theme object
  // styled-components theme provider, when nested, shallow merges any theme objects passed
  myTheme: {
    colors: {
      primary: 'hotpink',
    },
  },
};

const MyButton = styled.button(({ theme }) => ({
  // this uses customTheme, note how we namespaced this behind `myTheme` so it doesn't override kdesign's `color` key
  background: theme.myTheme.colors.primary,
  // this uses kdesign's theme
  color: theme.colors.brand.primary[800],
  margin: '0 8px',
  padding: '8px 16px',
}));

function App(): React.ReactElement {
  return (
    <KdesignProvider themeTokens={kdesignTheme} colorScheme="light">
      <ThemeProvider theme={customTheme}>
        <Button onClick={() => console.log('hi')}>Hello</Button>
        <MyButton onClick={() => console.log('hi')}>World</MyButton>
      </ThemeProvider>
    </KdesignProvider>
  );
}

export default App;
