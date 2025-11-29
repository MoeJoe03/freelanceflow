import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import DashboardScreen from "@/screens/DashboardScreen";
import ProposalsScreen from "@/screens/ProposalsScreen";
import ProjectsScreen from "@/screens/ProjectsScreen";
import ClientsScreen from "@/screens/ClientsScreen";
import CRMScreen from "@/screens/CRMScreen";
import ExpensesScreen from "@/screens/ExpensesScreen";
import DevelopersScreen from "@/screens/DevelopersScreen";
import SnippetsScreen from "@/screens/SnippetsScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius } from "@/constants/theme";

export type DrawerParamList = {
  Dashboard: undefined;
  Proposals: undefined;
  Projects: undefined;
  Clients: undefined;
  CRM: undefined;
  Expenses: undefined;
  Developers: undefined;
  Snippets: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.drawerContent,
        { paddingTop: insets.top + Spacing.lg },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="h2" style={[styles.appName, { color: theme.primary }]}>
          BarakahOps
        </ThemedText>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitleAlign: "center",
        headerTransparent: true,
        headerTintColor: theme.text,
        headerStyle: {
          backgroundColor: Platform.select({
            ios: undefined,
            android: theme.backgroundRoot,
            web: theme.backgroundRoot,
          }),
        },
        headerBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.textSecondary,
        drawerActiveBackgroundColor: isDark
          ? "rgba(129, 140, 248, 0.15)"
          : "rgba(99, 102, 241, 0.1)",
        drawerLabelStyle: {
          marginLeft: Spacing.sm,
          fontSize: 16,
          fontWeight: "500",
        },
        drawerItemStyle: {
          borderRadius: BorderRadius.sm,
          marginHorizontal: Spacing.sm,
          paddingVertical: Spacing.xs,
        },
        drawerStyle: {
          backgroundColor: theme.backgroundRoot,
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Proposals"
        component={ProposalsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="file-text" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="trello" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Clients"
        component={ClientsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CRM"
        component={CRMScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="pie-chart" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="shopping-bag" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Developers"
        component={DevelopersScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="code" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Snippets"
        component={SnippetsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="clipboard" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  appName: {
    marginLeft: 0,
  },
});
