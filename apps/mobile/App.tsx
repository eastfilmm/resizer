import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  BackHandler,
  Platform,
  Alert,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

const WEB_URL = 'https://picturedrucker.com';

type ModalInfo = {
  title: string;
  message: string;
  type: 'success' | 'error';
};

function CustomModal({ info, onClose }: { info: ModalInfo; onClose: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 8, tension: 100, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.9, duration: 150, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  return (
    <Animated.View style={[modalStyles.overlay, { opacity }]}>
      <Animated.View style={[modalStyles.card, { transform: [{ scale }] }]}>
        <View style={modalStyles.iconCircle}>
          <Text style={modalStyles.iconText}>
            {info.type === 'success' ? '✓' : '!'}
          </Text>
        </View>
        <Text style={modalStyles.title}>{info.title}</Text>
        <Text style={modalStyles.message}>{info.message}</Text>
        <TouchableOpacity
          style={[
            modalStyles.button,
            info.type === 'success' ? modalStyles.buttonSuccess : modalStyles.buttonError,
          ]}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <Text style={modalStyles.buttonText}>확인</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#007bff',
  },
  buttonError: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [modal, setModal] = useState<ModalInfo | null>(null);

  // Android 뒤로가기 버튼으로 웹뷰 내 뒤로가기
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  const saveBase64ToFile = async (dataUrl: string, fileName: string) => {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const file = new File(Paths.cache, fileName);
    file.write(base64Data, { encoding: 'base64' });
    return file.uri;
  };

  const handleMessage = useCallback(async (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type === 'download') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          setModal({
            title: '권한 필요',
            message: '사진을 저장하려면 사진 라이브러리\n접근 권한이 필요합니다.',
            type: 'error',
          });
          return;
        }

        const dataUrls: string[] = message.data;
        for (let i = 0; i < dataUrls.length; i++) {
          const fileUri = await saveBase64ToFile(dataUrls[i], `photo-${Date.now()}-${i}.png`);
          await MediaLibrary.saveToLibraryAsync(fileUri);
        }

        setModal({
          title: '저장 완료',
          message: `${dataUrls.length}장의 사진이 앨범에 저장되었습니다.`,
          type: 'success',
        });
      }

      if (message.type === 'share') {
        const fileUri = await saveBase64ToFile(message.data, `share-${Date.now()}.png`);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'image/png',
            UTI: 'public.png',
          });
        } else {
          setModal({
            title: '공유 불가',
            message: '이 기기에서는 공유 기능을\n사용할 수 없습니다.',
            type: 'error',
          });
        }
      }
    } catch {
      // Invalid message format — ignore
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        allowsInlineMediaPlayback
        allowFileAccess
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit={false}
        allowsBackForwardNavigationGestures
        onMessage={handleMessage}
      />
      {modal && <CustomModal info={modal} onClose={() => setModal(null)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 28,
  },
  webview: {
    flex: 1,
  },
});
