import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { useAtom } from 'jotai';
import {
  uploadedImagesAtom,
  selectedImageIdAtom,
  MAX_UPLOADED_IMAGES,
} from '@resizer/shared/atoms';

export default function ImagePicker() {
  const [uploadedImages, setUploadedImages] = useAtom(uploadedImagesAtom);
  const [, setSelectedImageId] = useAtom(selectedImageIdAtom);

  const pickImage = async () => {
    const remaining = MAX_UPLOADED_IMAGES - uploadedImages.length;
    if (remaining <= 0) {
      Alert.alert('알림', `최대 ${MAX_UPLOADED_IMAGES}장까지 업로드 가능합니다.`);
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) return;

    const newImages = result.assets.map((asset) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      fileName: asset.fileName ?? `image-${Date.now()}.jpg`,
      objectUrl: asset.uri,
    }));

    const updated = [...uploadedImages, ...newImages].slice(0, MAX_UPLOADED_IMAGES);
    setUploadedImages(updated);

    if (uploadedImages.length === 0 && newImages.length > 0) {
      setSelectedImageId(newImages[0].id);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={pickImage}>
      <Text style={styles.buttonText}>사진 선택</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
