import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import { canvasAspectRatioAtom, paddingAtom } from '@resizer/shared/atoms';
import type { AspectRatio } from '@resizer/shared/atoms';
import { PanelContainer, SliderRow } from './shared';

const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: '1:1', value: '1:1' },
  { label: '4:5', value: '4:5' },
  { label: '9:16', value: '9:16' },
];

export default function LayoutPanel() {
  const [aspectRatio, setAspectRatio] = useAtom(canvasAspectRatioAtom);
  const [padding, setPadding] = useAtom(paddingAtom);

  return (
    <PanelContainer>
      <View style={styles.ratioRow}>
        {ASPECT_RATIOS.map((ratio) => (
          <TouchableOpacity
            key={ratio.value}
            style={[
              styles.ratioButton,
              aspectRatio === ratio.value && styles.ratioButtonActive,
            ]}
            onPress={() => setAspectRatio(ratio.value)}
          >
            <Text
              style={[
                styles.ratioText,
                aspectRatio === ratio.value && styles.ratioTextActive,
              ]}
            >
              {ratio.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <SliderRow
        label="여백"
        value={padding}
        min={0}
        max={200}
        onValueChange={setPadding}
        unit="px"
      />
    </PanelContainer>
  );
}

const styles = StyleSheet.create({
  ratioRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratioButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  ratioButtonActive: {
    backgroundColor: '#3B82F6',
  },
  ratioText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  ratioTextActive: {
    color: '#FFFFFF',
  },
});
