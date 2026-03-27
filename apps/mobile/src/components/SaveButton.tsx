import React, { useCallback, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { File, Paths } from 'expo-file-system';
import { useAtomValue } from 'jotai';
import { uploadedImagesAtom } from '@resizer/shared/atoms';
import type { CanvasRef } from '@shopify/react-native-skia';

export default function SaveButton({
  canvasRef,
}: {
  canvasRef: React.RefObject<CanvasRef | null>;
}) {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const [saving, setSaving] = useState(false);

  const saveToGallery = useCallback(async () => {
    if (uploadedImages.length === 0 || !canvasRef.current) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 저장을 위해 갤러리 접근 권한이 필요합니다.');
      return;
    }

    setSaving(true);
    try {
      const snapshot = canvasRef.current.makeImageSnapshot();
      if (!snapshot) {
        Alert.alert('오류', '이미지 스냅샷을 생성할 수 없습니다.');
        return;
      }

      const base64 = snapshot.encodeToBase64();
      const fileName = `picture-drucker-${Date.now()}.png`;
      const file = new File(Paths.cache, fileName);

      // Write base64 PNG data via writable stream
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const stream = file.writableStream();
      const writer = stream.getWriter();
      await writer.write(bytes);
      await writer.close();

      await MediaLibrary.saveToLibraryAsync(file.uri);

      // Clean up temp file
      file.delete();

      Alert.alert('저장 완료', '갤러리에 저장되었습니다.');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('오류', '이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }, [uploadedImages, canvasRef]);

  const disabled = uploadedImages.length === 0 || saving;

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={saveToGallery}
      disabled={disabled}
    >
      {saving ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>저장</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
