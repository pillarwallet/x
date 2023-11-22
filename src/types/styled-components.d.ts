import 'styled-components';

// theme
import { Theme } from '../theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
