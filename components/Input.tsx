import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

import { Colors, Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function AppInput({ label, error, style, ...props }: InputProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      ) : null}
      <TextInput
        {...props}
        style={[
          styles.input,
          {
            borderColor: theme.border,
            backgroundColor: theme.card,
            color: theme.text,
          },
          style,
          error ? styles.inputError : null,
        ]}
        placeholderTextColor={theme.muted}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  error: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
});
