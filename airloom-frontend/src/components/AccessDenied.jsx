import { Result, Button, Typography } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

/**
 * Reusable Access Denied component for handling 403 Forbidden responses
 */
const AccessDenied = ({ 
  title = "Access Denied", 
  message = "You don't have permission to view this content.",
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 400,
      padding: 24 
    }}>
      <Result
        icon={<StopOutlined style={{ color: '#f87171' }} />}
        title={<span style={{ color: '#fff' }}>{title}</span>}
        subTitle={<Text style={{ color: '#94a3b8' }}>{message}</Text>}
        extra={
          showBackButton && (
            <Button type="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          )
        }
        style={{
          background: '#182430',
          borderRadius: 12,
          border: '1px solid #2a3744',
          padding: 32,
        }}
      />
    </div>
  );
};

export default AccessDenied;
