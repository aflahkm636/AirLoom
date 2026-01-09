import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, message, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { loginAsync, fetchPermissionsAsync } from '../features/auth/authSlice';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from '../features/auth/authSelectors';
import { ROLE_ROUTES } from '../utils/constants';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const userRole = useSelector(selectUserRole);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userRole) {
      const route = ROLE_ROUTES[userRole] || '/admin';
      navigate(route, { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  // Show error message
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const onFinish = async (values) => {
    const result = await dispatch(
      loginAsync({
        email: values.email,
        password: values.password,
      })
    );

    if (loginAsync.fulfilled.match(result)) {
      // Fetch permissions from server after successful login
      dispatch(fetchPermissionsAsync());
      
      message.success('Login successful!');
      const role = result.payload.user.role;
      const route = ROLE_ROUTES[role] || '/admin';
      navigate(route, { replace: true });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c14 0%, #1a1525 50%, #0f0c14 100%)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(30, 26, 36, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(127, 19, 236, 0.2)',
          padding: '48px 40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #7f13ec 0%, #9333ea 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LoginOutlined style={{ fontSize: '32px', color: '#fff' }} />
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#fff' }}>
              Welcome Back
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              Sign in to Airloom Management System
            </Text>
          </div>

          {/* Login Form */}
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                placeholder="Email"
                style={{
                  background: 'rgba(42, 36, 51, 0.6)',
                  border: '1px solid rgba(60, 53, 71, 0.8)',
                  color: '#fff',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                placeholder="Password"
                style={{
                  background: 'rgba(42, 36, 51, 0.6)',
                  border: '1px solid rgba(60, 53, 71, 0.8)',
                  color: '#fff',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<LoginOutlined />}
                style={{
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #7f13ec 0%, #9333ea 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(127, 19, 236, 0.3)',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <a
                onClick={() => navigate('/forgot-password')}
                style={{
                  color: '#a855f7',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Forgot Password?
              </a>
            </div>
          </Form>

          {/* Footer */}
          <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid rgba(60, 53, 71, 0.5)' }}>
            <Text style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
              Airloom Field Service ERP © 2025
            </Text>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default Login;
