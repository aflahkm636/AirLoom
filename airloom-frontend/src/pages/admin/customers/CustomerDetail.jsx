import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tag, Spin, Typography, message, Result, Avatar, Flex } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { getCustomerById } from '../../../api/customers.api';
import { API_BASE_URL } from '../../../utils/constants';

const { Title } = Typography;

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        setLoading(true);
        const response = await getCustomerById(id);
        if (response && response.data) {
          setCustomer(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Fetch customer detail error:', err);
        message.error('Failed to fetch customer details');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <Result
        status="404"
        title="Customer Not Found"
        subTitle="Sorry, the customer you are looking for does not exist."
        extra={
          <Button type="primary" onClick={() => navigate('/admin/customers')}>
            Back to List
          </Button>
        }
      />
    );
  }

  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/customers')}
        style={{ marginBottom: '24px' }}
      >
        Back to Customers
      </Button>

      <Card styles={{ body: { padding: 'clamp(12px, 2vw, 24px)' } }}>
        <Flex gap="large" align="center" style={{ marginBottom: '24px' }}>
          <Avatar 
            size={80} 
            src={customer.profileImage ? (customer.profileImage.startsWith('http') ? customer.profileImage : `${API_BASE_URL}/${customer.profileImage}`) : null} 
            icon={<UserOutlined />} 
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>{customer.name}</Title>
            <Typography.Text type="secondary">{customer.email}</Typography.Text>
          </div>
        </Flex>

        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{customer.phone}</Descriptions.Item>
          <Descriptions.Item label="City">{customer.city || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {customer.address || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Pincode">{customer.pincode || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={customer.status ? 'green' : 'red'}>
              {customer.status ? 'Active' : 'Inactive'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="User ID">{customer.userId}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default CustomerDetail;
