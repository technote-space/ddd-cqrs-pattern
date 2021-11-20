export interface IDarkMode {
  useColorModeValue<T>(lightModeValue: T, darkModeValue: T): T;

  toggleColorMode(): () => void;
}
