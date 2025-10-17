import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Vibration } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import {BarCodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import { router } from 'expo-router';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export default function BarcodeScanner({ onBarcodeScanned }: BarcodeScannerProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    (async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status === 'authorized') {
        setHasPermission(true);
      } else {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'authorized');
      }
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (!isScanning) return;

    const detectedBarcodes = scanBarcodes(frame, [BarCodeFormat.QR_CODE, BarCodeFormat.EAN_13, BarCodeFormat.EAN_8, BarCodeFormat.UPC_A, BarCodeFormat.UPC_E]);
    
    if (detectedBarcodes.length > 0) {
      const barcode = detectedBarcodes[0].displayValue;
      if (barcode) {
        setIsScanning(false);
        Vibration.vibrate(100);
        runOnJS(onBarcodeScanned)(barcode);
      }
    }
  }, [isScanning, onBarcodeScanned]);

  const resetScanner = () => {
    setIsScanning(true);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required to scan barcodes</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No camera device available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <View style={styles.overlay}>
        <View style={styles.targetBox}>
          <View style={styles.corner} />
          <View style={[styles.corner, { top: 0, right: 0 }]} />
          <View style={[styles.corner, { bottom: 0, left: 0 }]} />
          <View style={[styles.corner, { bottom: 0, right: 0 }]} />
        </View>
        <Text style={styles.instructionText}>
          Position barcode within the frame
        </Text>
        {!isScanning && (
          <Text style={styles.resetText} onPress={resetScanner}>
            Tap to scan again
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetBox: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF00',
    borderWidth: 3,
    top: 0,
    left: 0,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetText: {
    color: '#00FF00',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
