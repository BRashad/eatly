import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

export default function ProductDetailScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const router = useRouter();
  
  return (
    <>
      <Stack.Screen options={{ title: "PRODUCT DETAIL - NEW" }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6B6B', padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>🔥 NEW COMPONENT WORKS!</Text>
        <Text style={{ fontSize: 20, color: 'white', marginBottom: 10 }}>Barcode: {barcode || 'NO BARCODE'}</Text>
        <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 30 }}>
          If you see this RED screen, the route is working correctly!
        </Text>
        
        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Debug Info:</Text>
          <Text style={{ fontSize: 14 }}>• File: app/product/[barcode].tsx</Text>
          <Text style={{ fontSize: 14 }}>• Route: /product/[barcode]</Text>
          <Text style={{ fontSize: 14 }}>• Barcode: {barcode}</Text>
        </View>
        
        <TouchableOpacity 
          style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}


