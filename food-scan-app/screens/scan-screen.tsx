import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@navigation/root-navigator';

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export function ScanScreen({ navigation }: ScanScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Screen Placeholder</Text>
      <Button
        title="View Product"
        onPress={() => navigation.navigate('ProductDetail', { productId: 'demo-product' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});
