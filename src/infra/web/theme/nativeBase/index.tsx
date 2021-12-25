import type { IContextProvider } from '$/web/shared/contextProvider';
import type { VFC } from 'react';
import type { PropsWithChildren } from 'react';
import { NativeBaseProvider, extendTheme, Box } from 'native-base';
import { memo } from 'react';
import { singleton } from 'tsyringe';

@singleton()
export class NativeBaseThemeProvider implements IContextProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly __provider: VFC<PropsWithChildren<any>>;

  public constructor() {
    const theme = extendTheme({
      colors: {
        // https://smart-swatch.netlify.app/
        // primary: {
        //   50: '#E3F2F9',
        //   100: '#C5E4F3',
        //   200: '#A2D4EC',
        //   300: '#7AC1E4',
        //   400: '#47A9DA',
        //   500: '#0088CC',
        //   600: '#007AB8',
        //   700: '#006BA1',
        //   800: '#005885',
        //   900: '#003F5E',
        // },
      },
      config: {
        useSystemColorMode: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = memo(({ children }: PropsWithChildren<any>) => {
      return <NativeBaseProvider theme={theme}>
        <Box
          display="flex"
          height="100vh"
          overflow="auto"
          _light={{ bg: '#fffaf0' }}
          _dark={{ bg: '#1a202c' }}
        >
          {children}
        </Box>
      </NativeBaseProvider>;
    });
    provider.displayName = 'NativeBaseThemeProvider';
    this.__provider = provider;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getProvider(): VFC<PropsWithChildren<any>> {
    return this.__provider;
  }
}
