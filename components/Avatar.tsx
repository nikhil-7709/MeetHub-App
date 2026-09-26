import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";

type AvatarProps = {
  label: string;
  size?: number;
  color?: string;
};

export function Avatar({
  label,
  size = 40,
  color = Colors.primary,
}: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.28 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
