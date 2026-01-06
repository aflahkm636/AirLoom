import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Typography, Spin, Empty, message, Flex, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getSubscriptionPlans, getSubscriptionPlanById, deleteSubscriptionPlan } from '../../../api/subscriptionPlans.api';
import CreatePlanModal from './CreatePlanModal';
import EditPlanModal from './EditPlanModal';
import PlanDetailDrawer from './PlanDetailDrawer';

const { Title } = Typography;

const SubscriptionPlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getSubscriptionPlans();
      if (response && response.data) {
        setPlans(response.data);
      } else if (Array.isArray(response)) {
        setPlans(response);
      }
    } catch (error) {
      console.error('Fetch plans error:', error);
      message.error('Failed to fetch subscription plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteSubscriptionPlan(id);
      message.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Delete plan error:', error);
      message.error('Failed to delete plan');
    }
  };

  const handleView = async (id) => {
    try {
      setDetailVisible(true);
      setDetailLoading(true);
      const response = await getSubscriptionPlanById(id);
      if (response && response.data) {
        setSelectedPlan(response.data);
      } else {
        setSelectedPlan(response);
      }
    } catch (error) {
      console.error('Fetch plan detail error:', error);
      message.error('Failed to load plan details');
      setDetailVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = (record) => {
    setDetailVisible(false);
    setSelectedPlan(record);
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      sorter: (a, b) => (a.Name || '').localeCompare(b.Name || ''),
    },
    {
      title: 'Price',
      dataIndex: 'PricePerCycle',
      key: 'PricePerCycle',
      width: 120,
      render: (price) => (
        <span style={{ fontWeight: 600, color: '#52c41a' }}>
          ₹{price?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      title: 'Billing',
      dataIndex: 'BillingCycleInMonths',
      key: 'BillingCycleInMonths',
      width: 100,
      responsive: ['sm'],
      render: (months) => `${months} mo`,
    },
    {
      title: 'Status',
      dataIndex: 'IsActive',
      key: 'IsActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: '#1890ff' }} />}
            onClick={() => handleView(record.Id)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#faad14' }} />}
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Plan"
            description="Are you sure?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
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
        <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>
          Subscription Plans
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          Add Plan
        </Button>
      </Flex>

      <Card styles={{ body: { padding: 'clamp(0px, 1vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : plans.length > 0 ? (
          <Table
            columns={columns}
            dataSource={plans}
            rowKey="Id"
            pagination={{
              responsive: true,
              pageSize: 10,
              showSizeChanger: false
            }}
            scroll={{ x: 'max-content' }}
            size="middle"
            onRow={(record) => ({
              onClick: () => handleView(record.Id),
              style: { cursor: 'pointer' }
            })}
          />
        ) : (
          <Empty description="No subscription plans found" />
        )}
      </Card>

      <CreatePlanModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          fetchPlans();
        }}
      />

      <EditPlanModal
        visible={editModalVisible}
        plan={selectedPlan}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedPlan(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setSelectedPlan(null);
          fetchPlans();
        }}
      />

      <PlanDetailDrawer
        visible={detailVisible}
        onClose={() => {
          setDetailVisible(false);
          setSelectedPlan(null);
        }}
        loading={detailLoading}
        data={selectedPlan}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default SubscriptionPlansList;
