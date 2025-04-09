import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const ChatWootView = () => {
  const webViewRef = useRef(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: transparent;
            height: 100%;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script>
          window.chatwootSettings = {
            locale: 'vi',
            position: 'right',
            type: 'standard',
            showPopoutButton: false,
            launcherTitle: 'Hỗ trợ',
            open: true // Thêm dòng này để tự động mở chat
          };

          (function(d,t) {
            var BASE_URL = "https://app.chatwoot.com";
            var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
            g.src = BASE_URL + "/packs/js/sdk.js";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g,s);
            g.onload = function() {
              window.chatwootSDK.run({
                websiteToken: '45zXi4fYRWCnYeo7NVJPAuDP',
                baseUrl: BASE_URL
              });
              window.addEventListener('chatwoot:ready', function() {
                window.$chatwoot.toggle('open');
              });
            };
          })(document,"script");
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.fullscreen}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
        backgroundColor="transparent"
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default ChatWootView;