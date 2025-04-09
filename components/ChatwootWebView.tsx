import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { WebView } from "react-native-webview";

interface ChatWootWidgetProps {
  visible: boolean;
}

const ChatWootWidget = ({ visible }: ChatWootWidgetProps) => {
  const webViewRef = useRef<WebView>(null);

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
          #chatwoot-container {
            display: ${visible ? "block" : "none"};
          }
        </style>
      </head>
      <body>
        <div id="chatwoot-container"></div>
        <script>
          window.chatwootSettings = {
            locale: 'vi',
            position: 'right',
            type: 'standard',
            showPopoutButton: false,
            launcherTitle: 'Hỗ trợ'
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
            };
          })(document,"script");
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (webViewRef.current) {
      const script = `
        document.getElementById('chatwoot-container').style.display = '${
          visible ? "block" : "none"
        }';
        if (window.$chatwoot) {
          ${
            visible
              ? 'window.$chatwoot.toggle("open");'
              : 'window.$chatwoot.toggle("close");'
          }
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [visible]);

  if (Platform.OS === "web") {
    return null;
  }

  return (
    <View style={[styles.container, !visible && styles.hidden]}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
        scrollEnabled={false}
        pointerEvents={visible ? "auto" : "none"}
      />
    </View>
  );
};

export default ChatWootWidget;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 350,
    height: 500,
    zIndex: 1000,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hidden: {
    display: "none",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

