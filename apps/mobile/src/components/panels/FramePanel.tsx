import React from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import { frameTypeAtom, polaroidDateAtom } from '@resizer/shared/atoms';
import type { FrameType } from '@resizer/shared/atoms';
import { PanelContainer } from './shared';

const FRAME_OPTIONS: { label: string; value: FrameType }[] = [
  { label: '없음', value: 'none' },
  { label: '폴라로이드', value: 'polaroid' },
  { label: '얇은 프레임', value: 'thin' },
  { label: '필름', value: 'mediumFilm' },
];

export default function FramePanel() {
  const [frameType, setFrameType] = useAtom(frameTypeAtom);
  const [polaroidDate, setPolaroidDate] = useAtom(polaroidDateAtom);

  return (
    <PanelContainer>
      <View style={styles.frameRow}>
        {FRAME_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.frameButton,
              frameType === option.value && styles.frameButtonActive,
            ]}
            onPress={() => setFrameType(option.value)}
          >
            <Text
              style={[
                styles.frameText,
                frameType === option.value && styles.frameTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {frameType === 'polaroid' && (
        <TextInput
          style={styles.dateInput}
          placeholder="날짜 입력 (예: 2024.03.28)"
          placeholderTextColor="#9CA3AF"
          value={polaroidDate}
          onChangeText={setPolaroidDate}
        />
      )}
    </PanelContainer>
  );
}

const styles = StyleSheet.create({
  frameRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  frameButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  frameButtonActive: {
    backgroundColor: '#3B82F6',
  },
  frameText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  frameTextActive: {
    color: '#FFFFFF',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#374151',
  },
});
