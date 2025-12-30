import { Card, Typography, Empty } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TechnicianDashboard = () => {
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
              <ToolOutlined style={{ fontSize: '40px', color: '#fff' }} />
            </div>
          }
          description={null}
        />
        <Title level={3} className="placeholder-title">
          Technician Dashboard
        </Title>
        <Text className="placeholder-description">
          Technician dashboard is under construction. Soon you'll be able to view your assigned tasks, 
          update job status, and log material usage.
        </Text>
      </Card>
    </div>
  );
};

export default TechnicianDashboard;
