// eslint-disable-next-line import/no-extraneous-dependencies
import { ZeiqThemeProvider } from '@zeiq/web'; // run: npm link @zeiq/web`
import { ThemeProvider } from 'styled-components';
// import ZeiqProvider from '../components/ZeiqProvider';
import '../styles/globals.css';

const theme = { primaryColor: 'green' };

function MyApp({ Component, pageProps }) {
  return (
    <ZeiqThemeProvider value={{ theme }}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ZeiqThemeProvider>
  );
}

export default MyApp;
