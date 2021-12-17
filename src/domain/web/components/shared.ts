import type { ReactNode } from 'react';

type ColorValue = string;
type FlexAlignType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

export type ViewStyle = {
  backgroundColor?: ColorValue;
  borderColor?: ColorValue;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  borderWidth?: number;
  opacity?: number;
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
  alignItems?: FlexAlignType;
  alignSelf?: 'auto' | FlexAlignType;
  display?: 'none' | 'flex';
  flex?: number;
  flexBasis?: number | string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  height: number | string,
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  margin?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  marginHorizontal?: number | string;
  marginVertical?: number | string;
  maxHeight?: number | string | undefined;
  maxWidth?: number | string | undefined;
  minHeight?: number | string | undefined;
  minWidth?: number | string | undefined;
  overflow?: 'visible' | 'hidden' | 'scroll' | undefined;
  padding?: number | string | undefined;
  paddingBottom?: number | string | undefined;
  paddingLeft?: number | string | undefined;
  paddingRight?: number | string | undefined;
  paddingTop?: number | string | undefined;
  paddingHorizontal?: number | string | undefined;
  paddingVertical?: number | string | undefined;
  position?: 'absolute' | 'relative' | undefined;
  width?: number | string | undefined;
  zIndex?: number | undefined;
};
export type TextStyle = ViewStyle & {
  color?: ColorValue;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
};

export type ViewProps<Style = ViewStyle> = {
  children?: ReactNode;

  style?: Style;
};
