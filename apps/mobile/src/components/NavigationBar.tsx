import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useAtomValue } from 'jotai';
import {
  frameTypeAtom,
  glassBlurAtom,
  shadowEnabledAtom,
  paddingAtom,
  canvasAspectRatioAtom,
} from '@resizer/shared/atoms';
import type { NavPanelType } from '@resizer/shared/atoms';
import LayoutPanel from './panels/LayoutPanel';
import FramePanel from './panels/FramePanel';
import BackgroundPanel from './panels/BackgroundPanel';
import GlassBlurPanel from './panels/GlassBlurPanel';
import ShadowPanel from './panels/ShadowPanel';

const NAV_ITEMS: { key: NavPanelType; label: string }[] = [
  { key: 'layout', label: '레이아웃' },
  { key: 'frame', label: '프레임' },
  { key: 'background', label: '배경' },
  { key: 'glassblur', label: '블러' },
  { key: 'shadow', label: '그림자' },
];

export default function NavigationBar() {
  const [activePanel, setActivePanel] = useState<NavPanelType>('layout');
  const frameType = useAtomValue(frameTypeAtom);
  const glassBlur = useAtomValue(glassBlurAtom);
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const padding = useAtomValue(paddingAtom);
  const aspectRatio = useAtomValue(canvasAspectRatioAtom);

  const hasIndicator = (key: NavPanelType) => {
    switch (key) {
      case 'layout':
        return padding > 0 || aspectRatio !== '1:1';
      case 'frame':
        return frameType !== 'none';
      case 'glassblur':
        return glassBlur;
      case 'shadow':
        return shadowEnabled;
      default:
        return false;
    }
  };

  const togglePanel = (key: NavPanelType) => {
    setActivePanel((prev) => (prev === key ? null : key));
  };

  return (
    <View style={styles.container}>
      {/* Panel content */}
      {activePanel && (
        <ScrollView style={styles.panelContent}>
          {activePanel === 'layout' && <LayoutPanel />}
          {activePanel === 'frame' && <FramePanel />}
          {activePanel === 'background' && <BackgroundPanel />}
          {activePanel === 'glassblur' && <GlassBlurPanel />}
          {activePanel === 'shadow' && <ShadowPanel />}
        </ScrollView>
      )}

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.tab,
              activePanel === item.key && styles.tabActive,
            ]}
            onPress={() => togglePanel(item.key)}
          >
            <Text
              style={[
                styles.tabText,
                activePanel === item.key && styles.tabTextActive,
              ]}
            >
              {item.label}
            </Text>
            {hasIndicator(item.key) && <View style={styles.indicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  panelContent: {
    maxHeight: 200,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    right: '30%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
});
