import { Card, Typography, Empty } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CustomerDashboard = () => {
  return (
    <div className="placeholder-page">
      <Card className="placeholder-card">
        <Empty
          image={
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
          }
          description={null}
        />
        <Title level={3} className="placeholder-title">
          Customer Dashboard
        </Title>
        <Text className="placeholder-description">
          Your personalized dashboard is coming soon. Here you'll be able to view your subscriptions, 
          service history, and upcoming maintenance schedules.
        </Text>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
