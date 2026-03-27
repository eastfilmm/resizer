import 'styled-components';

// Extend DefaultTheme if you add a ThemeProvider in the future
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme {}
}
