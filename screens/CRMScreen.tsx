import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { StatCard } from "@/components/StatCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, DealStage } from "@/store/dataStore";

type DealStageSummary = {
  stage: DealStage;
  label: string;
  count: number;
  revenue: number;
  color: string;
};

export default function CRMScreen() {
  const { theme } = useTheme();
  const { clients, projects } = useDataStore();

  const crmMetrics = useMemo(() => {
    const dealStageLabels: Record<DealStage, string> = {
      lead: "Leads",
      proposal_sent: "Proposals Sent",
      negotiation: "Negotiation",
      won: "Won Deals",
      lost: "Lost Deals",
    };

    const dealStageColors: Record<DealStage, string> = {
      lead: "#06B6D4",
      proposal_sent: "#16adc8",
      negotiation: "#ffa554",
      won: "#21b15a",
      lost: "#ef4444",
    };

    // Calculate metrics by deal stage
    const stageMetrics: DealStageSummary[] = [];
    const stages: DealStage[] = [
      "lead",
      "proposal_sent",
      "negotiation",
      "won",
      "lost",
    ];

    stages.forEach((stage) => {
      const stageClients = clients.filter((c) => c.dealStage === stage);
      const stageRevenue = stageClients.reduce((sum, c) => sum + c.revenue, 0);

      stageMetrics.push({
        stage,
        label: dealStageLabels[stage],
        count: stageClients.length,
        revenue: stageRevenue,
        color: dealStageColors[stage],
      });
    });

    // Calculate pipeline value (won + negotiation deals)
    const pipelineValue = clients
      .filter((c) => c.dealStage === "won" || c.dealStage === "negotiation")
      .reduce((sum, c) => sum + c.revenue, 0);

    // Calculate won deals total
    const wonDealsValue = clients
      .filter((c) => c.dealStage === "won")
      .reduce((sum, c) => sum + c.revenue, 0);

    // Count active deals (everything except lead and lost)
    const activeDeals = clients.filter(
      (c) => c.dealStage !== "lead" && c.dealStage !== "lost"
    ).length;

    // Calculate conversion rate (won / (all - leads))
    const applicableDeals = clients.filter(
      (c) => c.dealStage !== "lead"
    ).length;
    const conversionRate =
      applicableDeals > 0
        ? Math.round((wonDealsValue / applicableDeals) * 100)
        : 0;

    return {
      stageMetrics,
      pipelineValue,
      wonDealsValue,
      activeDeals,
      conversionRate,
      totalClients: clients.length,
    };
  }, [clients]);

  return (
    <View style={styles.container}>
      <ScreenScrollView>
        <View style={styles.header}>
          <ThemedText type="h2">CRM Dashboard</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Revenue Pipeline & Client Deals
          </ThemedText>
        </View>

        {/* Revenue Metrics */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Pipeline Value"
              value={`$${crmMetrics.pipelineValue.toLocaleString()}`}
              icon="trending-up"
              color="#ffa554"
            />
            <StatCard
              title="Won Deals"
              value={`$${crmMetrics.wonDealsValue.toLocaleString()}`}
              icon="check-circle"
              color="#21b15a"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Active Deals"
              value={crmMetrics.activeDeals}
              icon="briefcase"
              color="#16adc8"
            />
            <StatCard
              title="Conversion Rate"
              value={`${crmMetrics.conversionRate}%`}
              icon="target"
              color="#ffa554"
            />
          </View>
        </View>

        {/* Deal Pipeline by Stage */}
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Deal Pipeline by Stage
          </ThemedText>
          {crmMetrics.stageMetrics.map((stage) => (
            <View
              key={stage.stage}
              style={[
                styles.stageCard,
                { backgroundColor: theme.backgroundDefault },
              ]}
            >
              <View style={styles.stageLeft}>
                <View
                  style={[styles.stageBadge, { backgroundColor: stage.color }]}
                >
                  <Feather name="users" size={14} color="#fff" />
                </View>
                <View>
                  <ThemedText type="h4">{stage.label}</ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {stage.count} {stage.count === 1 ? "client" : "clients"}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.stageRight}>
                <ThemedText
                  type="h4"
                  style={{
                    color: stage.color,
                    fontWeight: "600",
                  }}
                >
                  ${stage.revenue.toLocaleString()}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Key Metrics
          </ThemedText>
          <View
            style={[
              styles.metricsGrid,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <View style={styles.metricItem}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Total Clients
              </ThemedText>
              <ThemedText type="h2" style={{ color: theme.primary }}>
                {crmMetrics.totalClients}
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Avg Deal Value
              </ThemedText>
              <ThemedText type="h2" style={{ color: "#21b15a" }}>
                $
                {crmMetrics.activeDeals > 0
                  ? Math.round(
                      crmMetrics.pipelineValue / crmMetrics.activeDeals
                    ).toLocaleString()
                  : 0}
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Lead to Close
              </ThemedText>
              <ThemedText
                type="h2"
                style={{ color: "#16adc8", fontWeight: "600" }}
              >
                {crmMetrics.totalClients > 0
                  ? Math.round((crmMetrics.activeDeals / crmMetrics.totalClients) * 100)
                  : 0}
                %
              </ThemedText>
            </View>
          </View>
        </View>
      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
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
    fontWeight: "600",
  },
  stageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  stageLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  stageBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  stageRight: {
    alignItems: "flex-end",
  },
  metricsGrid: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 50,
    marginHorizontal: Spacing.md,
  },
});
