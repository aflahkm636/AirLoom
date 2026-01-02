import { Drawer, Descriptions, Tag, Divider, Typography, Space, Spin, Empty, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const SubscriptionDetailDrawer = ({ visible, onClose, loading, data, onEdit }) => {
  if (loading) {
    return (
      <Drawer
        title="Subscription Details"
        placement="right"
        onClose={onClose}
        open={visible}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Drawer>
    );
  }

  if (!data) {
    return (
      <Drawer
        title="Subscription Details"
        placement="right"
        onClose={onClose}
        open={visible}
        width={600}
      >
        <Empty description="No details found" />
      </Drawer>
    );
  }

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'active') return 'green';
    if (s === 'paused' || s === 'suspended') return 'orange';
    if (s === 'cancelled') return 'red';
    return 'default';
  };

  return (
    <Drawer
      title={
        <Space>
          <span>Subscription Details</span>
          <Tag color={getStatusColor(data.Status)}>{data.Status}</Tag>
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={640}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit && onEdit(data)}>
          Edit
        </Button>
      }
    >
      <Title level={4}>Plan Overview</Title>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Subscription ID">{data.Id}</Descriptions.Item>
        <Descriptions.Item label="Plan Name">{data.PlanName || data.PlanId}</Descriptions.Item>
        <Descriptions.Item label="Customer ID">{data.CustomerId}</Descriptions.Item>
        <Descriptions.Item label="Price Per Cycle">
          {data.PlanPricePerCycle ? `$${data.PlanPricePerCycle.toFixed(2)}` : 'N/A'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={4}>Frequency & Billing</Title>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Billing Cycle">{data.BillingCycleInMonths} Months</Descriptions.Item>
        <Descriptions.Item label="Service Frequency">{data.ServiceFrequencyInDays} Days</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={4}>Dates</Title>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Start Date">
          {formatDate(data.StartDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Last Service Date">
          {formatDate(data.LastServiceDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Next Service Date">
          {formatDate(data.NextServiceDate)}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={4}>Audit Info</Title>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Created On">
          {formatDateTime(data.CreatedOn)}
        </Descriptions.Item>
        <Descriptions.Item label="Modified At">
          {formatDateTime(data.ModifiedAt)}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default SubscriptionDetailDrawer;
