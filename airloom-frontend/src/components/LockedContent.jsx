import { Result, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * LockedContent - Displays a locked/blurred overlay for restricted content
 * Used when user doesn't have permission to view a module
 */
const LockedContent = ({ 
  title = "Access Restricted",
  message = "You don't have permission to access this module. Contact your administrator for access."
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)',
      background: 'linear-gradient(135deg, rgba(24,36,48,0.95) 0%, rgba(16,25,34,0.98) 100%)',
      borderRadius: 12,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Blur overlay pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(127,19,236,0.03) 10px, rgba(127,19,236,0.03) 20px)',
        pointerEvents: 'none',
      }} />
      
      <Result
        icon={
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #4b5563',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <LockOutlined style={{ fontSize: 48, color: '#9ca3af' }} />
          </div>
        }
        title={<span style={{ color: '#f3f4f6', fontSize: 24 }}>{title}</span>}
        subTitle={
          <Text style={{ color: '#9ca3af', fontSize: 14, maxWidth: 400, display: 'block' }}>
            {message}
          </Text>
        }
        style={{ position: 'relative', zIndex: 1 }}
      />
    </div>
  );
};

export default LockedContent;
