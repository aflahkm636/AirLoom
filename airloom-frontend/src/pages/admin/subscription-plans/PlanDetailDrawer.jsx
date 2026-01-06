import React from 'react';
import { Drawer, Descriptions, Tag, Spin, Button, Typography, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const PlanDetailDrawer = ({ visible, onClose, loading, data, onEdit }) => {
  if (!data && !loading) {
    return null;
  }

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Plan Details</span>
          {data && (
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(data)}
              size="small"
            >
              Edit
            </Button>
          )}
        </div>
      }
      open={visible}
      onClose={onClose}
      width={500}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : data ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0 }}>{data.Name}</Title>
            <Tag color={data.IsActive ? 'green' : 'red'} style={{ marginTop: 8 }}>
              {data.IsActive ? 'Active' : 'Inactive'}
            </Tag>
          </div>

          <Divider />

          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Plan Name">
              {data.Name}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              <Text style={{ whiteSpace: 'pre-wrap' }}>{data.Description || 'N/A'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Service Frequency">
              {data.ServiceFrequencyInDays} days
            </Descriptions.Item>
            <Descriptions.Item label="Billing Cycle">
              {data.BillingCycleInMonths} month{data.BillingCycleInMonths > 1 ? 's' : ''}
            </Descriptions.Item>
            <Descriptions.Item label="Price Per Cycle">
              <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                ₹{data.PricePerCycle?.toLocaleString() || 0}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={data.IsActive ? 'green' : 'red'}>
                {data.IsActive ? 'Active' : 'Inactive'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created On">
              {data.CreatedOn ? dayjs(data.CreatedOn).format('DD MMM YYYY, hh:mm A') : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Last Modified">
              {data.ModifiedAt ? dayjs(data.ModifiedAt).format('DD MMM YYYY, hh:mm A') : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : null}
    </Drawer>
  );
};

export default PlanDetailDrawer;
