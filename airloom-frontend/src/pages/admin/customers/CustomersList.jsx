import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Typography, Spin, Empty, message, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { getCustomers } from '../../../api/customers.api';
import CreateCustomerModal from './CreateCustomerModal';

const { Title } = Typography;

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomers();
      if (response && response.data) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Fetch customers error:', error);
      message.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      responsive: ['sm'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/customers/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <Flex 
        justify="space-between" 
        align="center" 
        style={{ marginBottom: '24px' }}
        wrap="wrap"
        gap="middle"
      >
        <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>Customers</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          block={false}
          className="responsive-btn"
        >
          Add Customer
        </Button>
      </Flex>

      <Card styles={{ body: { padding: 'clamp(0px, 1vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : customers.length > 0 ? (
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            pagination={{
              responsive: true,
              pageSize: 10,
              showSizeChanger: false
            }}
            scroll={{ x: 800 }}
            size="middle"
          />
        ) : (
          <Empty description="No customers found" />
        )}
      </Card>

      <CreateCustomerModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          fetchCustomers();
        }}
      />
    </div>
  );
};

export default CustomersList;
