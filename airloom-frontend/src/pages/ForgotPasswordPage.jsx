import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Space, Typography } from 'antd';
import { MailOutlined, ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { sendOtp } from '../api/users.api';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await sendOtp({ email: values.email });
      
      if (response.statusCode === 200) {
        message.success('OTP sent to your email!');
        // Navigate to reset password page with email
        navigate('/reset-password', { state: { email: values.email } });
      } else {
        message.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      // Show exact backend error message
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      message.error(errorMessage);
    } finally {
      setLoading(false);
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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
              <MailOutlined style={{ fontSize: '32px', color: '#fff' }} />
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#fff' }}>
              Forgot Password?
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              Enter your email and we'll send you an OTP to reset your password
            </Text>
          </div>

          {/* Form */}
          <Form
            name="forgot-password"
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
                prefix={<MailOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                placeholder="Email"
                style={{
                  background: 'rgba(42, 36, 51, 0.6)',
                  border: '1px solid rgba(60, 53, 71, 0.8)',
                  color: '#fff',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                block
                size="large"
                icon={<SendOutlined />}
                style={{
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #7f13ec 0%, #9333ea 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(127, 19, 236, 0.3)',
                }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Form.Item>
          </Form>

          {/* Back to Login Link */}
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/login"
              style={{
                color: '#a855f7',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
              }}
            >
              <ArrowLeftOutlined /> Back to Login
            </Link>
          </div>

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

export default ForgotPasswordPage;
