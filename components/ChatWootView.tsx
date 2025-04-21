import { RegisterRequest } from "@/types/register-request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const ChatWootView = () => {
  const webViewRef = useRef(null);
  const [userInfo, setUserInfo] = useState<RegisterRequest>();

  // Lấy thông tin user từ AsyncStorage khi component mount
  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
      }
    };
    fetchUser();
  }, []);
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
            g.onload = function () {
              window.chatwootSDK.run({
                websiteToken: '45zXi4fYRWCnYeo7NVJPAuDP',
                baseUrl: BASE_URL
              });

              window.addEventListener('chatwoot:ready', function () {
                window.$chatwoot.setUser('${userInfo?.id}', {
                    email: '${userInfo?.userName || ""}',
                    name: '${userInfo?.userFullName}',
                  });
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
        key={userInfo?.id}
        originWhitelist={["*"]}
        source={{ html: htmlContent, baseUrl: "https://app.chatwoot.com" }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        style={styles.webview}
        backgroundColor="transparent"
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: "box-none",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default ChatWootView;
