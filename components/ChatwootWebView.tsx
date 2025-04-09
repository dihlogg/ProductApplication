import React, { useRef } from 'react';
import { View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import axios, { AxiosResponse } from 'axios';
import { API_ENDPOINTS } from '@/service/apiService';

type ChatwootMessageEvent = {
  event: string;
  message: string;
  messageType: 'incoming' | 'outgoing' | 'template';
  // Thêm các trường khác nếu cần
};

type ApiResponse = {
  content: string;
  // Thêm các trường phản hồi khác từ API của bạn
};

const ChatWootWidget = () => {
  const webViewRef = useRef<WebView>(null);

  // Hàm gửi message đến API backend với type rõ ràng
  const sendChatMessage = async (message: string): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        API_ENDPOINTS.POST_MESSAGE_CHATWOOT,
        {
          content: message,
          timestamp: new Date().toISOString(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      // Gửi thông báo lỗi về Chatwoot
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          window.$chatwoot.sendMessage({
            content: 'Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn',
            messageType: 'outgoing',
            private: false
          });
          true;
        `);
      }
      throw error;
    }
  };

  // Xử lý khi nhận message từ WebView với type rõ ràng
  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    try {
      const data: ChatwootMessageEvent = JSON.parse(event.nativeEvent.data);
      
      if (data.event === 'on-message' && data.messageType === 'incoming') {
        const apiResponse = await sendChatMessage(data.message);
        
        if (webViewRef.current && apiResponse) {
          const script = `
            window.$chatwoot.sendMessage({
              content: ${JSON.stringify(apiResponse.content)},
              messageType: 'outgoing',
              private: false
            });
            true;
          `;
          webViewRef.current.injectJavaScript(script);
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <script>
          window.chatwootSettings = { 
            locale: 'en', 
            position: 'right',
            type: 'standard',
            showPopoutButton: true
          };
          
          (function(d,t) {
            var BASE_URL="https://app.chatwoot.com";
            var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=BASE_URL+"/packs/js/sdk.js";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g,s);
            g.onload=function(){
              window.chatwootSDK.run({
                websiteToken: '45zXi4fYRWCnYeo7NVJPAuDP',
                baseUrl: BASE_URL
              });
              
              window.$chatwoot.on('on-message', function(event) {
                if (event.messageType === 'incoming') {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    event: 'on-message',
                    message: event.content,
                    messageType: event.messageType
                  }));
                }
              });
            };
          })(document,"script");
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
        mixedContentMode="compatibility"
      />
    </View>
  );
};

export default ChatWootWidget;