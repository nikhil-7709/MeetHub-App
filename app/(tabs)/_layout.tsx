import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";

const tabIcons: Record<
  string,
  {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  }
> = {
  index: { active: "home", inactive: "home-outline" },
  meetings: { active: "calendar", inactive: "calendar-outline" },
  create: { active: "add-circle", inactive: "add-circle-outline" },
  notifications: { active: "notifications", inactive: "notifications-outline" },
  profile: { active: "person", inactive: "person-outline" },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: (Platform.OS === "android" ? 65 : 90) + Math.max(insets.bottom, 0),
          paddingTop: 8,
          paddingBottom: (Platform.OS === "android" ? 8 : 26) + Math.max(insets.bottom, 0),
          borderTopWidth: 0,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          elevation: 14,
          shadowColor: "#4F46E5",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
          marginBottom: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          const iconName = focused
            ? tabIcons[route.name]?.active
            : tabIcons[route.name]?.inactive;
          return (
            <Ionicons
              name={iconName ?? "home-outline"}
              size={22}
              color={color}
            />
          );
        },
        tabBarButton: (props: any) => (
          <TouchableOpacity
            {...props}
            activeOpacity={0.8}
            style={[
              props.style,
              {
                borderRadius: 18,
                marginHorizontal: 4,
                marginVertical: 4,
                backgroundColor: props.accessibilityState?.selected
                  ? "#EEF2FF"
                  : "transparent",
              },
            ]}
          />
        ),
        tabBarIconStyle: {
          marginBottom: 0,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="meetings"
        options={{
          title: "Meetings",
          tabBarLabel: "Meetings",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarLabel: "Create",
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarLabel: "Alerts",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
