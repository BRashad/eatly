import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BarcodeScanner from '@/components/BarcodeScanner';
import { apiService } from '@/services/api';

export default function HomeScreen() {
  const [showScanner, setShowScanner] = useState(false);

  const handleBarcodeScanned = async (barcode: string) => {
    try {
      console.log('🔍 Barcode scanned:', barcode);
      console.log('🔍 Barcode type:', typeof barcode);
      console.log('🔍 Barcode length:', barcode?.length);
      
      // Try to get product info
      const response = await apiService.getProductByBarcode(barcode);
      
      if (response.success && response.data) {
        // Navigate to product detail page
        router.push(`/product/${barcode}`);
      } else {
        // Product not found, show error
        Alert.alert(
          'Product Not Found',
          'This barcode is not in our database. Would you like to try scanning again?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setShowScanner(false),
            },
            {
              text: 'Scan Again',
              onPress: () => setShowScanner(true),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch product information. Please check your connection and try again.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setShowScanner(false),
          },
          {
            text: 'Retry',
            onPress: () => setShowScanner(true),
          },
        ]
      );
    }
  };

  const testKnownBarcodes = async () => {
    const barcodes = [
      '3228857000906', // Harry's Bread
      '5449000000996', // Coca-Cola
      '5449000131805', // Coca-Cola Zero
    ];
    
    Alert.alert(
      'Test Barcodes',
      'Choose a barcode to test:',
      [
        ...barcodes.map((barcode) => ({
          text: `${barcode} - ${barcode === '3228857000906' ? 'Harry\'s Bread' : barcode === '5449000000996' ? 'Coca-Cola' : 'Coca-Cola Zero'}`,
          onPress: () => {
            console.log('🧪 Testing with barcode:', barcode);
            handleBarcodeScanned(barcode);
          }
        })),
        {
          text: 'Cancel',
          style: 'cancel',
        }
      ]
    );
  };

  if (showScanner) {
    return (
      <BarcodeScanner 
        onBarcodeScanned={handleBarcodeScanned}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Food Scanner</ThemedText>
        <ThemedText style={styles.subtitle}>
          Scan barcodes to get nutritional information and health scores
        </ThemedText>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => setShowScanner(true)}
        >
          <ThemedText style={styles.scanButtonText}>Start Scanning</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => testKnownBarcodes()}
        >
          <ThemedText style={styles.scanButtonText}>Test with Known Barcodes</ThemedText>
        </TouchableOpacity>

        <View style={styles.features}>
          <ThemedText type="subtitle" style={styles.featuresTitle}>Features</ThemedText>
          
          <View style={styles.feature}>
            <ThemedText style={styles.featureText}>📱 Instant barcode scanning</ThemedText>
          </View>
          
          <View style={styles.feature}>
            <ThemedText style={styles.featureText}>🥗 Nutritional information</ThemedText>
          </View>
          
          <View style={styles.feature}>
            <ThemedText style={styles.featureText}>⭐ Health scoring system</ThemedText>
          </View>
          
          <View style={styles.feature}>
            <ThemedText style={styles.featureText}>⚠️ Ingredient warnings</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  features: {
    flex: 1,
  },
  featuresTitle: {
    marginBottom: 20,
  },
  feature: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
  },
});
