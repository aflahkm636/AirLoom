import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Typography, Space, Divider } from 'antd';
import { LogoutOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';
import { logout } from '../features/auth/authSlice';
import { selectUser } from '../features/auth/authSelectors';

const { Title, Text } = Typography;

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c14 0%, #1a1525 50%, #0f0c14 100%)',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card
          style={{
            background: 'rgba(30, 26, 36, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(127, 19, 236, 0.2)',
            borderRadius: '16px',
          }}
          bodyStyle={{ padding: '48px' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto',
                background: 'linear-gradient(135deg, #7f13ec 0%, #9333ea 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingOutlined style={{ fontSize: '40px', color: '#fff' }} />
            </div>

            <div>
              <Title level={2} style={{ margin: '0 0 8px 0', color: '#fff' }}>
                Customer Dashboard
              </Title>
              <Text style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.65)' }}>
                Coming Soon
              </Text>
            </div>

            <Divider style={{ borderColor: 'rgba(60, 53, 71, 0.5)' }} />

            <Card
              style={{
                background: 'rgba(42, 36, 51, 0.4)',
                border: '1px solid rgba(60, 53, 71, 0.5)',
                borderRadius: '12px',
                display: 'inline-block',
              }}
              bodyStyle={{ padding: '24px 32px' }}
            >
              <Space direction="vertical" size="small" align="center">
                <UserOutlined style={{ fontSize: '24px', color: '#7f13ec' }} />
                <Text style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                  Logged in as
                </Text>
                <Title level={4} style={{ margin: '4px 0', color: '#fff' }}>
                  {user?.userName || 'Customer'}
                </Title>
                <Text style={{ fontSize: '14px', color: '#7f13ec', fontWeight: 500 }}>
                  Role: {user?.role}
                </Text>
              </Space>
            </Card>

            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="large"
              style={{
                height: '44px',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
