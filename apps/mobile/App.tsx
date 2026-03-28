import React, { useRef, useCallback } from 'react';
import { StyleSheet, SafeAreaView, BackHandler, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

const WEB_URL = 'https://picturedrucker.com';

export default function App() {
  const webViewRef = useRef<WebView>(null);

  // Android 뒤로가기 버튼으로 웹뷰 내 뒤로가기
  React.useEffect(() => {
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
          Alert.alert('권한 필요', '사진을 저장하려면 사진 라이브러리 접근 권한이 필요합니다.');
          return;
        }

        const dataUrls: string[] = message.data;
        for (let i = 0; i < dataUrls.length; i++) {
          const fileUri = await saveBase64ToFile(dataUrls[i], `photo-${Date.now()}-${i}.png`);
          await MediaLibrary.saveToLibraryAsync(fileUri);
        }

        Alert.alert('저장 완료', `${dataUrls.length}장의 사진이 앨범에 저장되었습니다.`);
      }

      if (message.type === 'share') {
        const fileUri = await saveBase64ToFile(message.data, `share-${Date.now()}.png`);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'image/png',
            UTI: 'public.png',
          });
        } else {
          Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
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
