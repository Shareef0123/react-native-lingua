import { colors } from "./colors";
import { fonts, typography } from "./typography";

export const theme = {
  colors,
  fonts,
  typography,
} as const;

export * from "./colors";
export * from "./typography";
export default theme;
