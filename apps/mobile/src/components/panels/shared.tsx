import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';

export function PanelContainer({ children }: { children: React.ReactNode }) {
  return <View style={styles.panelContainer}>{children}</View>;
}

export function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onValueChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (val: number) => void;
  unit?: string;
}) {
  return (
    <View style={styles.sliderRow}>
      <View style={styles.sliderHeader}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sliderValue}>
          {Math.round(value)}{unit ?? ''}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step ?? 1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#3B82F6"
        maximumTrackTintColor="#E5E7EB"
        thumbTintColor="#3B82F6"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    padding: 16,
    gap: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderRow: {
    gap: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 14,
    color: '#6B7280',
    minWidth: 40,
    textAlign: 'right',
  },
  slider: {
    width: '100%',
    height: 32,
  },
});
