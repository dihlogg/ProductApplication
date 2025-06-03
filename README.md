# E-commerce Mobile Application (React Native)

This is the mobile frontend of an intelligent E-commerce system. The app is developed with React Native + Expo, supporting a complete shopping experience for customers, from product discovery to checkout, enhanced with AI-powered recommendation, real-time cart updates, and automated order processing.

## Technologies
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)

---

## 🔑 Key Features

### 👤 Customer Functions
- **Registration & Login**: Secure user authentication system.  
- **Product Search & Filtering**: Search products with multi-filter support.  
- **Purchasing**: Add-to-cart, checkout, and order placement.  
- **AI Chatbot**: Real-time chatbot integrated into the app using WebView (Chatwoot or custom).  
- **Real-Time Cart Management**: Sync cart between mobile and web using SignalR.  
- **Order History**: View past orders and details.  
- **Order Confirmation via Email**: Automated email using n8n.  
- **Product Recommendation**: AI-powered recommendations using K-Means clustering (ML.NET).  

### 🛠️ Admin Functions (via Backend API)
- CRUD for Products & Categories  
- User Management  
- Order Management  

_Admin features are managed via the backend API and are not exposed in this mobile client._

---

📲 Getting Started
1. 📦 Clone the repository
git clone https://github.com/dihlogg/ProductApplication.git
2. ▶️ Start development server
 ```bash
   npm install
   ```
 ```bash
   npx expo start
   ```
🎬 Watch this live demo video to better understand the product’s features and usage.
[[Watch Video Demo]](https://drive.google.com/file/d/1AqpAQcwJ9f73i0__EHJVG2ljsTfw0Ayv/view)
