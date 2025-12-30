import { Card, Typography, Empty } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StaffDashboard = () => {
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
              <TeamOutlined style={{ fontSize: '40px', color: '#fff' }} />
            </div>
          }
          description={null}
        />
        <Title level={3} className="placeholder-title">
          Staff Dashboard
        </Title>
        <Text className="placeholder-description">
          Staff dashboard is under construction. Soon you'll be able to manage customer requests, 
          assign tasks, and track service operations.
        </Text>
      </Card>
    </div>
  );
};

export default StaffDashboard;
