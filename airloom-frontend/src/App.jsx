import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ConfigProvider, theme } from 'antd';
import { store } from './app/store';
import { initializeAuth } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';

// Component to initialize auth
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#7f13ec',
            colorBgContainer: '#1e1a24',
            colorBgElevated: '#2a2433',
            colorBorder: '#3c3547',
            colorText: '#ffffff',
            colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
            colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
            borderRadius: 8,
            fontFamily: 'Inter, sans-serif',
          },
          components: {
            Input: {
              colorBgContainer: 'rgba(42, 36, 51, 0.6)',
              colorBorder: 'rgba(60, 53, 71, 0.8)',
              colorText: '#ffffff',
              colorTextPlaceholder: 'rgba(255, 255, 255, 0.45)',
              controlHeight: 44,
            },
            Button: {
              controlHeight: 44,
              fontWeight: 600,
            },
            Card: {
              colorBgContainer: 'rgba(30, 26, 36, 0.8)',
              colorBorderSecondary: 'rgba(127, 19, 236, 0.2)',
            },
          },
        }}
      >
        <BrowserRouter>
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
