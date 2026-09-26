import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";

import { Colors, Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function AppButton({
  title,
  variant = "primary",
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  const backgroundColor =
    variant === "secondary"
      ? theme.primarySoft
      : variant === "ghost"
        ? theme.card
        : Colors.primary;

  const textColor = variant === "primary" ? "#FFFFFF" : theme.text;

  return (
    <TouchableOpacity
      {...props}
      accessibilityRole="button"
      disabled={disabled}
      activeOpacity={0.85}
      hitSlop={8}
      style={[
        styles.button,
        { backgroundColor: disabled ? "#D1D5DB" : backgroundColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: disabled ? "#6B7280" : textColor },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
});
