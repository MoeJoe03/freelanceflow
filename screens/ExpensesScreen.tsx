import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FormInput } from "@/components/FormInput";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, Expense, ExpenseCategory } from "@/store/dataStore";

const expenseCategories: { key: ExpenseCategory; label: string; color: string }[] = [
  { key: "tools", label: "Tools", color: "#06B6D4" },
  { key: "software", label: "Software", color: "#16adc8" },
  { key: "outsourcing", label: "Outsourcing", color: "#ffa554" },
  { key: "marketing", label: "Marketing", color: "#f97316" },
  { key: "equipment", label: "Equipment", color: "#8b5cf6" },
  { key: "other", label: "Other", color: "#64748b" },
];

export default function ExpensesScreen() {
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const { expenses, projects, addExpense, deleteExpense } = useDataStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<ExpenseCategory>("tools");
  const [newDescription, setNewDescription] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");

  const expenseMetrics = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const byCategory: Record<ExpenseCategory, number> = {
      tools: 0,
      software: 0,
      outsourcing: 0,
      marketing: 0,
      equipment: 0,
      other: 0,
    };

    expenses.forEach((e) => {
      byCategory[e.category] += e.amount;
    });

    const monthlyExpenses = expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        const today = new Date();
        return (
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      totalExpenses,
      byCategory,
      monthlyExpenses,
      count: expenses.length,
    };
  }, [expenses]);

  const handleAddExpense = () => {
    if (newAmount.trim() && newDescription.trim()) {
      addExpense({
        amount: parseFloat(newAmount) || 0,
        category: newCategory,
        description: newDescription.trim(),
        date: new Date().toISOString(),
        projectTitle: newProjectTitle.trim() || undefined,
      });
      setNewAmount("");
      setNewDescription("");
      setNewProjectTitle("");
      setNewCategory("tools");
      setModalVisible(false);
    }
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    return expenseCategories.find((c) => c.key === category)?.color || "#64748b";
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    return expenseCategories.find((c) => c.key === category)?.label || category;
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.headerRow}>
        <ThemedText type="h2">Expenses</ThemedText>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.metricsRow}>
        <View style={[styles.metric, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Total Expenses
          </ThemedText>
          <ThemedText type="h3" style={{ color: theme.text }}>
            ${expenseMetrics.totalExpenses.toLocaleString()}
          </ThemedText>
        </View>
        <View style={[styles.metric, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            This Month
          </ThemedText>
          <ThemedText type="h3" style={{ color: "#ffa554" }}>
            ${expenseMetrics.monthlyExpenses.toLocaleString()}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderExpense = ({ item }: { item: Expense }) => (
    <Pressable
      onPress={() => deleteExpense(item.id)}
      style={[
        styles.expenseCard,
        { backgroundColor: theme.backgroundDefault },
      ]}
    >
      <View
        style={[
          styles.categoryBadge,
          { backgroundColor: getCategoryColor(item.category) },
        ]}
      >
        <Feather name="shopping-bag" size={14} color="#fff" />
      </View>
      <View style={styles.expenseInfo}>
        <ThemedText type="h4" numberOfLines={1}>
          {item.description}
        </ThemedText>
        {item.projectTitle ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Project: {item.projectTitle}
          </ThemedText>
        ) : null}
        <View style={styles.categoryLabel}>
          <ThemedText
            type="small"
            style={{
              color: getCategoryColor(item.category),
              fontSize: 11,
            }}
          >
            {getCategoryLabel(item.category)}
          </ThemedText>
        </View>
      </View>
      <ThemedText
        type="h4"
        style={{
          color: "#ef4444",
          fontWeight: "600",
        }}
      >
        ${item.amount.toLocaleString()}
      </ThemedText>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name="inbox" size={48} color={theme.textSecondary} />
      <ThemedText type="h4" style={{ color: theme.textSecondary }}>
        No expenses yet
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, textAlign: "center" }}
      >
        Log your project expenses and business costs
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop, paddingBottom },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setNewAmount("");
          setNewDescription("");
          setNewProjectTitle("");
          setNewCategory("tools");
        }}
        title="Log Expense"
      >
        <FormInput
          label="Amount"
          placeholder="0.00"
          value={newAmount}
          onChangeText={setNewAmount}
          keyboardType="decimal-pad"
        />
        <FormInput
          label="Description"
          placeholder="What was the expense for?"
          value={newDescription}
          onChangeText={setNewDescription}
        />
        <FormInput
          label="Project (Optional)"
          placeholder="Link to a project"
          value={newProjectTitle}
          onChangeText={setNewProjectTitle}
        />
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Category
        </ThemedText>
        <View style={styles.categoryGrid}>
          {expenseCategories.map((cat) => (
            <Chip
              key={cat.key}
              label={cat.label}
              selected={newCategory === cat.key}
              onPress={() => setNewCategory(cat.key)}
            />
          ))}
        </View>
        <Button onPress={handleAddExpense}>Log Expense</Button>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    padding: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  metricsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  metric: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  separator: {
    height: Spacing.sm,
  },
  expenseCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  expenseInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  categoryLabel: {
    marginTop: Spacing.xs,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
  },
});
