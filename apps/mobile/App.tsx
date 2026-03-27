import React, { useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider as JotaiProvider } from 'jotai';
import type { CanvasRef } from '@shopify/react-native-skia';
import ImageCanvas from './src/components/ImageCanvas';
import ImagePicker from './src/components/ImagePicker';
import SaveButton from './src/components/SaveButton';
import ThumbnailStrip from './src/components/ThumbnailStrip';
import NavigationBar from './src/components/NavigationBar';

export default function App() {
  const canvasRef = useRef<CanvasRef>(null);

  return (
    <JotaiProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Picture Drucker</Text>
        </View>

        {/* Canvas */}
        <View style={styles.canvasArea}>
          <ImageCanvas ref={canvasRef} />
        </View>

        {/* Thumbnail strip */}
        <ThumbnailStrip />

        {/* Action buttons */}
        <View style={styles.actions}>
          <ImagePicker />
          <SaveButton canvasRef={canvasRef} />
        </View>

        {/* Navigation panels */}
        <NavigationBar />
      </SafeAreaView>
    </JotaiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  canvasArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
