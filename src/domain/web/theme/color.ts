export type ColorValue = {
  light: string;
  dark: string;
};

export type ThemeColor = {
  background: ColorValue;
  text: ColorValue;
  subText: ColorValue;
  primary: ColorValue;
  accent: ColorValue;
  primaryText: ColorValue;
  accentText: ColorValue;
};

export type useColor = (key: keyof ThemeColor) => string;
