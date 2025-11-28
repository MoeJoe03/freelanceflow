import React, { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { StatCard } from "@/components/StatCard";
import { FAB } from "@/components/FAB";
import { Modal } from "@/components/Modal";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, Bid } from "@/store/dataStore";
import { DrawerParamList } from "@/navigation/DrawerNavigator";

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { bids, clients, projects, addBid } = useDataStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newBidClient, setNewBidClient] = useState("");
  const [newBidAmount, setNewBidAmount] = useState("");

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailyBids = bids.filter(
      (b) => new Date(b.date) >= today
    ).length;

    const monthlyBids = bids.filter(
      (b) => new Date(b.date) >= thisMonth
    ).length;

    const allTimeBids = bids.length;

    const wonBids = bids.filter((b) => b.won);
    const monthlyRevenue = wonBids
      .filter((b) => new Date(b.date) >= thisMonth)
      .reduce((sum, b) => sum + b.amount, 0);

    const allTimeRevenue = wonBids.reduce((sum, b) => sum + b.amount, 0);

    const winRate = allTimeBids > 0
      ? Math.round((wonBids.length / allTimeBids) * 100)
      : 0;

    return {
      dailyBids,
      monthlyBids,
      allTimeBids,
      monthlyRevenue,
      allTimeRevenue,
      winRate,
    };
  }, [bids]);

  const recentProjects = useMemo(() => {
    return projects
      .filter((p) => p.column !== "completed")
      .slice(0, 3);
  }, [projects]);

  const handleAddBid = () => {
    if (newBidClient.trim() && newBidAmount.trim()) {
      addBid({
        clientName: newBidClient.trim(),
        amount: parseFloat(newBidAmount) || 0,
        date: new Date().toISOString(),
        won: false,
      });
      setNewBidClient("");
      setNewBidAmount("");
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenScrollView>
        <View style={styles.header}>
          <ThemedText type="h2">Overview</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </ThemedText>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Daily Bids"
              value={stats.dailyBids}
              icon="send"
              color="#16adc8"
            />
            <StatCard
              title="Monthly Bids"
              value={stats.monthlyBids}
              icon="calendar"
              color="#16adc8"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="All-Time Bids"
              value={stats.allTimeBids}
              icon="archive"
              color="#ffa554"
            />
            <StatCard
              title="Win Rate"
              value={`${stats.winRate}%`}
              icon="trending-up"
              color="#ffa554"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Monthly Revenue"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              icon="dollar-sign"
              color="#21b15a"
            />
            <StatCard
              title="All-Time Revenue"
              value={`$${stats.allTimeRevenue.toLocaleString()}`}
              icon="bar-chart-2"
              color="#21b15a"
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Active Projects
          </ThemedText>
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <View
                key={project.id}
                style={[
                  styles.projectItem,
                  { backgroundColor: theme.backgroundDefault },
                ]}
              >
                <View style={styles.projectInfo}>
                  <ThemedText type="h4" numberOfLines={1}>
                    {project.title}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {project.clientName}
                  </ThemedText>
                </View>
                <ThemedText
                  type="small"
                  style={{ color: "#21b15a", fontWeight: "600" }}
                >
                  ${project.revenue.toLocaleString()}
                </ThemedText>
              </View>
            ))
          ) : (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: theme.backgroundDefault },
              ]}
            >
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary, textAlign: "center" }}
              >
                No active projects. Add a project to get started.
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Quick Stats
          </ThemedText>
          <View
            style={[
              styles.quickStats,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <View style={styles.quickStatItem}>
              <ThemedText type="h2" style={{ color: theme.primary }}>
                {clients.length}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                Total Clients
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.quickStatItem}>
              <ThemedText type="h2" style={{ color: theme.success }}>
                {projects.filter((p) => p.column === "completed").length}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                Completed
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.quickStatItem}>
              <ThemedText type="h2" style={{ color: theme.warning }}>
                {projects.filter((p) => p.column !== "completed").length}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                In Progress
              </ThemedText>
            </View>
          </View>
        </View>
      </ScreenScrollView>

      <FAB icon="plus" onPress={() => setModalVisible(true)} />

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="New Bid"
      >
        <FormInput
          label="Client Name"
          placeholder="Enter client name"
          value={newBidClient}
          onChangeText={setNewBidClient}
        />
        <FormInput
          label="Bid Amount"
          placeholder="Enter amount"
          value={newBidAmount}
          onChangeText={setNewBidAmount}
          keyboardType="numeric"
        />
        <Button onPress={handleAddBid}>Add Bid</Button>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  statsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  projectItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  projectInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  emptyState: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  quickStats: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    justifyContent: "space-around",
  },
  quickStatItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  divider: {
    width: 1,
    height: "100%",
  },
});
