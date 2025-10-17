import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { apiService, ProductDetail } from '@/services/api';

export default function ProductDetailScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (barcode) {
      loadProduct(barcode);
    }
  }, [barcode]);

  const loadProduct = async (barcode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProductByBarcode(barcode);
      
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.error || 'Product not found');
      }
    } catch (err) {
      setError('Failed to load product information');
      console.error('Product loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score?: number) => {
    if (!score) return '#666666';
    if (score >= 8) return '#4CAF50'; // Green
    if (score >= 6) return '#FFC107'; // Yellow
    if (score >= 4) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const renderNutritionInfo = () => {
    if (!product?.nutritionInfo) return null;

    const { nutritionInfo } = product;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition Information</Text>
        <View style={styles.nutritionGrid}>
          {nutritionInfo.calories !== undefined && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{nutritionInfo.calories}</Text>
            </View>
          )}
          {nutritionInfo.protein !== undefined && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{nutritionInfo.protein}g</Text>
            </View>
          )}
          {nutritionInfo.carbs !== undefined && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>{nutritionInfo.carbs}g</Text>
            </View>
          )}
          {nutritionInfo.fat !== undefined && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>{nutritionInfo.fat}g</Text>
            </View>
          )}
          {nutritionInfo.sodium !== undefined && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Sodium</Text>
              <Text style={styles.nutritionValue}>{nutritionInfo.sodium}mg</Text>
            </View>
          )}
          {nutritionInfo.sugars !== undefined && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Sugars</Text>
              <Text style={styles.nutritionValue}>{nutritionInfo.sugars}g</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderWarnings = () => {
    if (!product?.warnings || product.warnings.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Warnings</Text>
        {product.warnings.map((warning, index) => (
          <View key={index} style={styles.warningItem}>
            <Text style={styles.warningText}>⚠️ {warning}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading product information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => barcode && loadProduct(barcode)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.productName}>{product.name}</Text>
          {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
          <Text style={styles.barcode}>{product.barcode}</Text>
          
          {product.healthScore && (
            <View style={styles.healthScoreContainer}>
              <Text style={styles.healthScoreLabel}>Health Score</Text>
              <View style={[styles.healthScore, { backgroundColor: getHealthScoreColor(product.healthScore) }]}>
                <Text style={styles.healthScoreText}>{product.healthScore}/10</Text>
              </View>
            </View>
          )}
        </View>

        {product.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {product.ingredients && product.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {product.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
            ))}
          </View>
        )}

        {renderNutritionInfo()}
        {renderWarnings()}

        <View style={styles.footer}>
          <Text style={styles.sourceText}>Source: {product.source}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  brand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  barcode: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  healthScoreLabel: {
    fontSize: 16,
    color: '#333',
  },
  healthScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthScoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  ingredient: {
    fontSize: 16,
    lineHeight: 22,
    color: '#666',
    marginBottom: 5,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  warningItem: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#E65100',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 12,
    color: '#999',
  },
});
