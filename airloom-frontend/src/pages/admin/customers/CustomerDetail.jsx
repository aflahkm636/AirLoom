import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tag, Spin, Typography, message, Result } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getCustomerById } from '../../../api/customers.api';

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

      <Title level={2} style={{ marginBottom: '24px', fontSize: 'clamp(20px, 5vw, 30px)' }}>
        Customer Details
      </Title>

      <Card styles={{ body: { padding: 'clamp(12px, 2vw, 24px)' } }}>
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
