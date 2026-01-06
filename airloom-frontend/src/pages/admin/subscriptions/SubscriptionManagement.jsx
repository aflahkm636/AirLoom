import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  message, 
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  EyeOutlined, 
  PauseCircleOutlined, 
  PlayCircleOutlined, 
  StopOutlined,
  SyncOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { 
  getSubscriptions, 
  getSubscriptionById, 
  pauseSubscription, 
  resumeSubscription, 
  cancelSubscription 
} from '../../../api/subscriptions.api';
import SubscriptionDetailDrawer from './SubscriptionDetailDrawer';
import CreateSubscriptionModal from './CreateSubscriptionModal';
import EditSubscriptionModal from './EditSubscriptionModal';

const { Title } = Typography;

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toISOString().split('T')[0];
};

// Helper to normalize status for comparison
const normalizeStatus = (status) => {
  if (!status) return '';
  const s = String(status).toLowerCase().trim();
  // Backend returns 'Suspended' for paused subscriptions
  if (s === 'suspended') return 'paused';
  return s;
};

const SubscriptionManagement = () => {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch all subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await getSubscriptions();
      // Ensure we extract data correctly based on standard response structure
      const data = response.data || response || [];
      console.log('Subscriptions loaded:', data.map(s => ({ Id: s.Id, Status: s.Status })));
      setSubscriptions(data);
    } catch (error) {
      message.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Summary logic
  const stats = useMemo(() => {
    return {
      total: subscriptions.length,
      active: subscriptions.filter(s => normalizeStatus(s.Status) === 'active').length,
      paused: subscriptions.filter(s => normalizeStatus(s.Status) === 'paused').length,
      cancelled: subscriptions.filter(s => normalizeStatus(s.Status) === 'cancelled').length,
    };
  }, [subscriptions]);

  // Action handlers
  const handleView = async (id) => {
    try {
      setDetailVisible(true);
      setDetailLoading(true);
      const response = await getSubscriptionById(id);
      setSelectedSub(response.data || response);
    } catch (error) {
      message.error('Failed to load subscription details');
      setDetailVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAction = async (id, actionFn, actionName) => {
    try {
      await actionFn(id);
      message.success(`Subscription ${actionName} successfully`);
      fetchSubscriptions(); // Refresh list and stats
    } catch (error) {
      message.error(`Failed to ${actionName} subscription`);
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'Sub ID',
      dataIndex: 'Id',
      key: 'Id',
      width: 100,
    },
    {
      title: 'Customer ID',
      dataIndex: 'CustomerId',
      key: 'CustomerId',
    },
    {
      title: 'Plan',
      dataIndex: 'PlanName',
      key: 'PlanName',
      render: (text, record) => text || `Plan #${record.PlanId}`,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (status) => {
        let color = 'default';
        if (status === 'Active') color = 'green';
        if (status === 'Paused') color = 'orange';
        if (status === 'Cancelled') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Paused', value: 'Paused' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value, record) => {
        const status = normalizeStatus(record.Status);
        return status === value.toLowerCase();
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'StartDate',
      key: 'StartDate',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime(),
    },
    {
      title: 'Next Service',
      dataIndex: 'NextServiceDate',
      key: 'NextServiceDate',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.NextServiceDate).getTime() - new Date(b.NextServiceDate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        const status = normalizeStatus(record.Status);
        const isActive = status === 'active';
        const isPaused = status === 'paused';
        const isCancelled = status === 'cancelled';
        
        return (
          <Space size="small">
            <Tooltip title="View Details">
              <Button 
                type="text" 
                icon={<EyeOutlined style={{ color: '#1890ff' }} />} 
                onClick={() => handleView(record.Id)} 
              />
            </Tooltip>

            {isActive && (
              <Popconfirm title="Pause this subscription?" onConfirm={() => handleAction(record.Id, pauseSubscription, 'paused')}>
                <Tooltip title="Pause">
                  <Button type="text" icon={<PauseCircleOutlined style={{ color: '#faad14' }} />} />
                </Tooltip>
              </Popconfirm>
            )}

            {isPaused && (
              <Popconfirm title="Resume this subscription?" onConfirm={() => handleAction(record.Id, resumeSubscription, 'resumed')}>
                <Tooltip title="Resume">
                  <Button type="text" icon={<PlayCircleOutlined style={{ color: '#52c41a' }} />} />
                </Tooltip>
              </Popconfirm>
            )}

            {!isCancelled && (
              <Popconfirm title="Cancel this subscription?" onConfirm={() => handleAction(record.Id, cancelSubscription, 'cancelled')}>
                <Tooltip title="Cancel">
                  <Button type="text" danger icon={<StopOutlined />} />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 24]} align="middle" style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Title level={2}>Subscription Management</Title>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>
              Add Subscription
            </Button>
            <Button icon={<SyncOutlined />} onClick={fetchSubscriptions}>Refresh</Button>
          </Space>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic title="Total Subscriptions" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic title="Active" value={stats.active} styles={{ content: { color: '#52c41a' } }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #faad14' }}>
            <Statistic title="Paused" value={stats.paused} styles={{ content: { color: '#faad14' } }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #f5222d' }}>
            <Statistic title="Cancelled" value={stats.cancelled} styles={{ content: { color: '#f5222d' } }} />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card title="All Subscriptions" style={{ borderRadius: '8px' }}>
        <Table 
          columns={columns} 
          dataSource={subscriptions} 
          rowKey="Id" 
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Detail View */}
      <SubscriptionDetailDrawer 
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        loading={detailLoading}
        data={selectedSub}
        onEdit={(sub) => {
          setDetailVisible(false);
          setEditVisible(true);
        }}
      />

      <CreateSubscriptionModal
        visible={createVisible}
        onCancel={() => setCreateVisible(false)}
        onSuccess={() => {
          setCreateVisible(false);
          fetchSubscriptions();
        }}
      />

      <EditSubscriptionModal
        visible={editVisible}
        subscription={selectedSub}
        onCancel={() => setEditVisible(false)}
        onSuccess={() => {
          setEditVisible(false);
          fetchSubscriptions();
        }}
      />
    </div>
  );
};

export default SubscriptionManagement;
