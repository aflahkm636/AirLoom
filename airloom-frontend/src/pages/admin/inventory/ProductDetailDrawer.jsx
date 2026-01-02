import { Drawer, Descriptions, Tag, Divider, Typography, Space, Spin, Empty, Avatar, Button } from 'antd';
import { EditOutlined, InboxOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '../../../utils/constants';

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

const ProductDetailDrawer = ({ visible, onClose, loading, data, onEdit }) => {
  if (loading) {
    return (
      <Drawer
        title="Product Details"
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
        title="Product Details"
        placement="right"
        onClose={onClose}
        open={visible}
        width={600}
      >
        <Empty description="No details found" />
      </Drawer>
    );
  }

  const imageUrl = data.ProductImage 
    ? (data.ProductImage.startsWith('http') ? data.ProductImage : `${API_BASE_URL}/${data.ProductImage}`)
    : null;

  const isLowStock = data.QuantityInStock <= data.ReorderLevel;

  return (
    <Drawer
      title="Product Details"
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
      {/* Product Header with Image */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', alignItems: 'center' }}>
        <Avatar 
          shape="square" 
          size={120} 
          src={imageUrl} 
          icon={<InboxOutlined />}
          style={{ flexShrink: 0 }}
        />
        <div>
          <Title level={3} style={{ margin: 0 }}>{data.Name}</Title>
          <Space style={{ marginTop: '8px' }}>
            <Tag color="blue">{data.Type}</Tag>
            <Tag color="purple">{data.Category}</Tag>
            {isLowStock && <Tag color="error">Low Stock</Tag>}
          </Space>
        </div>
      </div>

      <Divider />

      <Title level={4}>Product Information</Title>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Product ID">{data.Id}</Descriptions.Item>
        <Descriptions.Item label="Type">{data.Type}</Descriptions.Item>
        <Descriptions.Item label="Category">{data.Category}</Descriptions.Item>
        <Descriptions.Item label="Price">
          <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
            ${parseFloat(data.Price).toFixed(2)}
          </Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={4}>Stock Information</Title>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Quantity In Stock">
          <Text strong style={{ color: isLowStock ? '#ff4d4f' : 'inherit' }}>
            {data.QuantityInStock}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Reorder Level">{data.ReorderLevel}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={4}>Audit Information</Title>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Created On">
          {formatDateTime(data.CreatedOn)}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          User ID: {data.CreatedBy || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Last Modified">
          {formatDateTime(data.ModifiedAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Modified By">
          {data.ModifiedBy ? `User ID: ${data.ModifiedBy}` : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default ProductDetailDrawer;
