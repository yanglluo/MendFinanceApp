
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import databaseService from '../services/database';
import { Transaction, Category } from '../types';

interface AddTransactionScreenProps {
  navigation: any;
}

export const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await databaseService.getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategory(cats[0].id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!merchant.trim()) {
      Alert.alert('Error', 'Please enter a merchant name');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const transaction: Transaction = {
        id: `txn_${Date.now()}`,
        amount: parseFloat(amount),
        merchant: merchant.trim(),
        categoryId: selectedCategory,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        note: note.trim() || undefined,
        isRecurring: false,
      };

      await databaseService.addTransaction(transaction);
      Alert.alert('Success', 'Transaction added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Transaction</Text>
          <View style={styles.placeholder} />
        </View>

        <GlassCard style={styles.formCard}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={COLORS.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.label}>Merchant</Text>
          <TextInput
            style={[styles.input, styles.textInput]}
            placeholder="e.g., Starbucks"
            placeholderTextColor={COLORS.textMuted}
            value={merchant}
            onChangeText={setMerchant}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryChip,
                  { backgroundColor: category.color },
                  selectedCategory === category.id && styles.selectedChip,
                ]}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textInput, styles.noteInput]}
            placeholder="Add a note..."
            placeholderTextColor={COLORS.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <Button
            title="Add Transaction"
            onPress={handleAddTransaction}
            loading={loading}
          />
        </GlassCard>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    fontSize: FONTS.sizes.md,
    color: COLORS.mint.main,
    fontWeight: '600',
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  placeholder: {
    width: 60,
  },
  formCard: {},
  label: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glassDark,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currencySymbol: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.mint.main,
    fontWeight: '700',
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.text,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: COLORS.glassDark,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.md,
    fontWeight: '400',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoriesScroll: {
    marginBottom: SPACING.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    opacity: 0.6,
  },
  selectedChip: {
    opacity: 1,
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  categoryName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
});
