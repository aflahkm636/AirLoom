import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Input, Button, message, Space, Typography } from 'antd';
import { LockOutlined, MailOutlined, KeyOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { resetPassword } from '../api/users.api';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Get email from navigation state
  const emailFromState = location.state?.email || '';

  // Redirect if no email is provided
  useEffect(() => {
    if (!emailFromState) {
      message.warning('Please request an OTP first');
      navigate('/forgot-password');
    }
  }, [emailFromState, navigate]);

  const onFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({
        email: emailFromState,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      
      if (response.statusCode === 200) {
        message.success('Password reset successfully! Please login with your new password.');
        navigate('/login');
      } else {
        message.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      // Show exact backend error message
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
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
              <KeyOutlined style={{ fontSize: '32px', color: '#fff' }} />
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#fff' }}>
              Reset Password
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              Enter the OTP sent to your email and set a new password
            </Text>
          </div>

          {/* Form */}
          <Form
            name="reset-password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
            initialValues={{ email: emailFromState }}
          >
            {/* Email (Read-only) */}
            <Form.Item
              name="email"
              label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Email</span>}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                disabled
                value={emailFromState}
                style={{
                  background: 'rgba(42, 36, 51, 0.3)',
                  border: '1px solid rgba(60, 53, 71, 0.8)',
                  color: '#fff',
                  cursor: 'not-allowed',
                }}
              />
            </Form.Item>

            {/* OTP */}
            <Form.Item
              name="otp"
              label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>OTP</span>}
              rules={[
                { required: true, message: 'Please enter the OTP' },
              ]}
            >
              <Input
                prefix={<KeyOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                placeholder="Enter OTP"
                style={{
                  background: 'rgba(42, 36, 51, 0.6)',
                  border: '1px solid rgba(60, 53, 71, 0.8)',
                  color: '#fff',
                }}
              />
            </Form.Item>

            {/* New Password */}
            <Form.Item
              name="newPassword"
              label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>New Password</span>}
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                placeholder="Enter new password"
                style={{
                  background: 'rgba(42, 36, 51, 0.6)',
                  border: '1px solid rgba(60, 53, 71, 0.8)',
                  color: '#fff',
                }}
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Confirm New Password</span>}
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                placeholder="Confirm new password"
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
                icon={<CheckCircleOutlined />}
                style={{
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #7f13ec 0%, #9333ea 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(127, 19, 236, 0.3)',
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordPage;
