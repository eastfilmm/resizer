import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import { useAtom, useAtomValue } from 'jotai';
import {
  uploadedImagesAtom,
  selectedImageIdAtom,
  selectedImageAtom,
} from '@resizer/shared/atoms';

export default function ThumbnailStrip() {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const [, setSelectedImageId] = useAtom(selectedImageIdAtom);

  if (uploadedImages.length <= 1) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{uploadedImages.length}장</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {uploadedImages.map((image) => (
          <TouchableOpacity
            key={image.id}
            style={[
              styles.thumbnail,
              selectedImage?.id === image.id && styles.selected,
            ]}
            onPress={() => setSelectedImageId(image.id)}
          >
            <Image source={{ uri: image.objectUrl }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  count: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#3B82F6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
