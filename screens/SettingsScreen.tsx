import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image, Switch, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { FormInput } from "@/components/FormInput";
import { Toast } from "@/components/Toast";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore } from "@/store/dataStore";

// Import avatars directly to ensure they're bundled
import avatarGeometric from "../assets/images/avatars/avatar-geometric.png";
import avatarWorkspace from "../assets/images/avatars/avatar-workspace.png";
import avatarDeveloper from "../assets/images/avatars/avatar-developer.png";

const avatarImages = [
  avatarGeometric,
  avatarWorkspace,
  avatarDeveloper,
];

export default function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const { userProfile, updateUserProfile, bids, clients, projects, developers, snippets } = useDataStore();
  const [displayName, setDisplayName] = useState(userProfile.name);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSaveName = () => {
    if (displayName.trim()) {
      updateUserProfile({ name: displayName.trim() });
      setToastMessage("Profile updated");
      setToastVisible(true);
    }
  };

  const handleSelectAvatar = (index: number) => {
    updateUserProfile({ avatarIndex: index });
    setToastMessage("Avatar updated");
    setToastVisible(true);
  };

  const dataStats = {
    bids: bids.length,
    clients: clients.length,
    projects: projects.length,
    developers: developers.length,
    snippets: snippets.length,
  };

  return (
    <View style={styles.container}>
      <ScreenScrollView>
        <ThemedText type="h2" style={styles.title}>
          Settings
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Profile
          </ThemedText>
          <View
            style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }]}
          >
            <View style={styles.avatarSection}>
              <Image
                source={avatarImages[userProfile.avatarIndex]}
                style={styles.currentAvatar}
                resizeMode="cover"
              />
              <View style={styles.avatarOptions}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Choose avatar:
                </ThemedText>
                <View style={styles.avatarRow}>
                  {avatarImages.map((img, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectAvatar(index)}
                      style={({ pressed }) => [
                        styles.avatarOption,
                        userProfile.avatarIndex === index && {
                          borderColor: theme.primary,
                          borderWidth: 2,
                        },
                        { opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <Image source={img} style={styles.avatarThumb} resizeMode="cover" />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.nameSection}>
              <FormInput
                label="Display Name"
                placeholder="Enter your name"
                value={displayName}
                onChangeText={setDisplayName}
                onBlur={handleSaveName}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Appearance
          </ThemedText>
          <View
            style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather
                  name={isDark ? "moon" : "sun"}
                  size={20}
                  color={theme.text}
                />
                <View>
                  <ThemedText type="body">Theme</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {isDark ? "Dark mode active" : "Light mode active"}
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Auto
              </ThemedText>
            </View>
          </View>
          <ThemedText type="small" style={[styles.hint, { color: theme.textSecondary }]}>
            Theme follows your device settings automatically
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Data Summary
          </ThemedText>
          <View
            style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }]}
          >
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <ThemedText type="h3" style={{ color: theme.primary }}>
                  {dataStats.bids}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Bids
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText type="h3" style={{ color: theme.success }}>
                  {dataStats.clients}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Clients
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText type="h3" style={{ color: theme.warning }}>
                  {dataStats.projects}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Projects
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText type="h3" style={{ color: theme.info }}>
                  {dataStats.developers}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Developers
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText type="h3" style={{ color: theme.secondary }}>
                  {dataStats.snippets}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Snippets
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            About
          </ThemedText>
          <View
            style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }]}
          >
            <View style={styles.aboutRow}>
              <ThemedText type="body">FreelanceHub</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Version 1.0.0
              </ThemedText>
            </View>
            <ThemedText
              type="small"
              style={[styles.aboutDescription, { color: theme.textSecondary }]}
            >
              A personal dashboard for managing your freelance business - track bids,
              proposals, projects, clients, and more all in one place.
            </ThemedText>
          </View>
        </View>
      </ScreenScrollView>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
        type="success"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  sectionContent: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  currentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarOptions: {
    flex: 1,
    gap: Spacing.sm,
  },
  avatarRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  avatarOption: {
    borderRadius: 24,
    overflow: "hidden",
  },
  avatarThumb: {
    width: 48,
    height: 48,
  },
  nameSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
    paddingTop: Spacing.lg,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  hint: {
    marginTop: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: "30%",
    marginBottom: Spacing.md,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  aboutDescription: {
    lineHeight: 20,
  },
});
