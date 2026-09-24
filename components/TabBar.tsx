import type { BottomTabBarProps } from "expo-router/js-tabs";
import type { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SvgProps } from "react-native-svg";

import AiTeacherIcon from "@/assets/icons/ai-teacher.svg";
import ChatIcon from "@/assets/icons/chat.svg";
import HomeIcon from "@/assets/icons/home.svg";
import LearnIcon from "@/assets/icons/learn.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

// Purple for the selected tab; gray for the rest.
const ACTIVE_COLOR = "#5B3BF6";
const INACTIVE_COLOR = "#9CA3AF";

// Map each route name to its icon + label shown in the bar.
const TABS: Record<string, { Icon: FC<SvgProps>; label: string }> = {
  home: { Icon: HomeIcon, label: "Home" },
  learn: { Icon: LearnIcon, label: "Learn" },
  "ai-teacher": { Icon: AiTeacherIcon, label: "AI Teacher" },
  chat: { Icon: ChatIcon, label: "Chat" },
  profile: { Icon: ProfileIcon, label: "Profile" },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;

          const isActive = state.index === index;
          const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
          const { Icon } = tab;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tab}
            >
              <Icon width={24} height={24} color={color} />
              <Text
                numberOfLines={1}
                className="font-poppins text-[11px]"
                style={{ color, marginTop: 4 }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EEF0F4",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 12,
  },
  row: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
});
