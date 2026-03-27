import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Canvas,
  Image as SkiaImage,
  Rect,
  RoundedRect,
  Shadow,
  Blur,
  Group,
  Text as SkiaText,
  useFont,
  useImage,
  Fill,
  type CanvasRef,
} from '@shopify/react-native-skia';
import { useAtomValue } from 'jotai';
import {
  imageSettingsAtom,
  selectedImageAtom,
} from '@resizer/shared/atoms';
import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
} from '@resizer/shared/constants';
import type { AspectRatio } from '@resizer/shared/atoms';
import {
  calculateImageLayout,
  calculatePolaroidLayout,
  calculateThinFrameLayout,
  calculateMediumFilmLayout,
} from '../canvas/drawImage';

const DISPLAY_HEIGHT = 400;

function getActualDimensions(aspectRatio: AspectRatio) {
  if (aspectRatio === '4:5') {
    return { width: CANVAS_ACTUAL_SIZE_4_5_WIDTH, height: CANVAS_ACTUAL_SIZE_4_5_HEIGHT };
  }
  if (aspectRatio === '9:16') {
    return { width: CANVAS_ACTUAL_SIZE_9_16_WIDTH, height: CANVAS_ACTUAL_SIZE_9_16_HEIGHT };
  }
  return { width: CANVAS_ACTUAL_SIZE, height: CANVAS_ACTUAL_SIZE };
}

function getDisplayDimensions(aspectRatio: AspectRatio) {
  const actual = getActualDimensions(aspectRatio);
  const scale = DISPLAY_HEIGHT / actual.height;
  return {
    width: Math.round(actual.width * scale),
    height: DISPLAY_HEIGHT,
  };
}

const ImageCanvas = forwardRef<CanvasRef>(function ImageCanvas(_props, ref) {
  const settings = useAtomValue(imageSettingsAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const font = useFont(require('@expo-google-fonts/courier-prime/700Bold/CourierPrime_700Bold.ttf'), 48);

  const skImage = useImage(selectedImage?.objectUrl ?? null);

  const actual = getActualDimensions(settings.canvasAspectRatio);
  const display = getDisplayDimensions(settings.canvasAspectRatio);

  const bgColor = settings.backgroundColor === 'white' ? '#FFFFFF' : '#000000';

  const imageLayout = useMemo(() => {
    if (!skImage) return null;

    const imgWidth = skImage.width();
    const imgHeight = skImage.height();
    const scaleFactor = actual.width / CANVAS_ACTUAL_SIZE;

    const padding = settings.padding * (actual.width / 1000);

    if (settings.frameType === 'polaroid') {
      return {
        type: 'polaroid' as const,
        ...calculatePolaroidLayout(imgWidth, imgHeight, actual.width, actual.height, scaleFactor, padding),
      };
    }
    if (settings.frameType === 'thin') {
      return {
        type: 'thin' as const,
        ...calculateThinFrameLayout(imgWidth, imgHeight, actual.width, actual.height, scaleFactor, padding),
      };
    }
    if (settings.frameType === 'mediumFilm') {
      return {
        type: 'mediumFilm' as const,
        ...calculateMediumFilmLayout(imgWidth, imgHeight, actual.width, actual.height, scaleFactor, padding),
      };
    }

    const imageAreaWidth = actual.width - padding * 2;
    const imageAreaHeight = actual.height - padding * 2;

    return {
      type: 'none' as const,
      ...calculateImageLayout(imgWidth, imgHeight, {
        actualCanvasWidth: actual.width,
        actualCanvasHeight: actual.height,
        imageAreaWidth,
        imageAreaHeight,
        padding: settings.padding,
        bgColor,
        useGlassBlur: settings.glassBlurEnabled,
        blurIntensity: settings.blurIntensity,
        overlayOpacity: settings.overlayOpacity,
        useShadow: settings.shadowEnabled,
        shadowIntensity: settings.shadowIntensity,
        shadowOffset: settings.shadowOffset,
        frameType: settings.frameType,
      }),
    };
  }, [skImage, settings, actual, bgColor]);

  return (
    <View style={styles.container}>
      <Canvas ref={ref} style={{ width: display.width, height: display.height }}>
        {/* Background */}
        <Fill color={bgColor} />

        {skImage && imageLayout && (
          <>
            {/* Glass blur background */}
            {settings.glassBlurEnabled && imageLayout.type === 'none' && (
              <Group>
                <SkiaImage
                  image={skImage}
                  x={0}
                  y={0}
                  width={actual.width}
                  height={actual.height}
                  fit="cover"
                />
                <Blur blur={settings.blurIntensity} />
                <Rect
                  x={0}
                  y={0}
                  width={actual.width}
                  height={actual.height}
                  color={settings.backgroundColor === 'white'
                    ? `rgba(255,255,255,${settings.overlayOpacity})`
                    : `rgba(0,0,0,${settings.overlayOpacity})`
                  }
                />
              </Group>
            )}

            {/* Polaroid frame */}
            {imageLayout.type === 'polaroid' && (
              <Group>
                <RoundedRect
                  x={imageLayout.frameX}
                  y={imageLayout.frameY}
                  width={imageLayout.frameWidth}
                  height={imageLayout.frameHeight}
                  r={imageLayout.borderRadius}
                  color="#FFFFFF"
                >
                  <Shadow dx={10} dy={10} blur={30} color="rgba(0,0,0,0.2)" />
                </RoundedRect>
                <SkiaImage
                  image={skImage}
                  x={imageLayout.imageX}
                  y={imageLayout.imageY}
                  width={imageLayout.imageWidth}
                  height={imageLayout.imageHeight}
                  fit="fill"
                />
                {settings.polaroidDate && font && (
                  <SkiaText
                    x={imageLayout.imageX + imageLayout.imageWidth - 12}
                    y={imageLayout.imageY + imageLayout.imageHeight - 12}
                    text={settings.polaroidDate}
                    font={font}
                    color="#FF6B00"
                  />
                )}
              </Group>
            )}

            {/* Thin frame */}
            {imageLayout.type === 'thin' && (
              <Group>
                <Rect
                  x={imageLayout.frameX}
                  y={imageLayout.frameY}
                  width={imageLayout.frameWidth}
                  height={imageLayout.frameHeight}
                  color="#000000"
                />
                <SkiaImage
                  image={skImage}
                  x={imageLayout.imageX}
                  y={imageLayout.imageY}
                  width={imageLayout.imageWidth}
                  height={imageLayout.imageHeight}
                  fit="fill"
                />
              </Group>
            )}

            {/* Medium film frame */}
            {imageLayout.type === 'mediumFilm' && (
              <Group>
                <Rect
                  x={imageLayout.frameX}
                  y={imageLayout.frameY}
                  width={imageLayout.frameWidth}
                  height={imageLayout.frameHeight}
                  color="#000000"
                />
                <SkiaImage
                  image={skImage}
                  x={imageLayout.imageX}
                  y={imageLayout.imageY}
                  width={imageLayout.imageWidth}
                  height={imageLayout.imageHeight}
                  fit="fill"
                />
              </Group>
            )}

            {/* No frame - plain image */}
            {imageLayout.type === 'none' && (
              <Group>
                {settings.shadowEnabled && (
                  <Rect
                    x={imageLayout.x}
                    y={imageLayout.y}
                    width={imageLayout.width}
                    height={imageLayout.height}
                    color="rgba(0,0,0,1)"
                  >
                    <Shadow
                      dx={settings.shadowOffset}
                      dy={settings.shadowOffset}
                      blur={settings.shadowIntensity}
                      color="rgba(0,0,0,0.5)"
                    />
                  </Rect>
                )}
                <SkiaImage
                  image={skImage}
                  x={imageLayout.x}
                  y={imageLayout.y}
                  width={imageLayout.width}
                  height={imageLayout.height}
                  fit="fill"
                />
              </Group>
            )}
          </>
        )}
      </Canvas>
    </View>
  );
});

export default ImageCanvas;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});
