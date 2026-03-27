import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import { backgroundColorAtom } from '@resizer/shared/atoms';
import type { BackgroundColor } from '@resizer/shared/atoms';
import { PanelContainer } from './shared';

const BG_OPTIONS: { label: string; value: BackgroundColor; color: string }[] = [
  { label: '흰색', value: 'white', color: '#FFFFFF' },
  { label: '검정', value: 'black', color: '#000000' },
];

export default function BackgroundPanel() {
  const [bgColor, setBgColor] = useAtom(backgroundColorAtom);

  return (
    <PanelContainer>
      <View style={styles.row}>
        {BG_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              { backgroundColor: option.color },
              bgColor === option.value && styles.buttonActive,
            ]}
            onPress={() => setBgColor(option.value)}
          >
            <Text
              style={[
                styles.text,
                option.value === 'black' && styles.textLight,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </PanelContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  buttonActive: {
    borderColor: '#3B82F6',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  textLight: {
    color: '#FFFFFF',
  },
});
