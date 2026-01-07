import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Typography, Spin, Empty, message, Flex, Popconfirm } from 'antd';
import {
  EyeOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { getPendingBills, finalizeBill, regenerateBill, BILL_STATUS } from '../../../api/billing.api';
import BillDetailDrawer from './BillDetailDrawer';
import ApplyDiscountModal from './ApplyDiscountModal';

const { Title } = Typography;

const PendingBillsList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track which bill action is loading
  const [selectedBill, setSelectedBill] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [discountModalVisible, setDiscountModalVisible] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await getPendingBills();
      if (response && response.data) {
        setBills(response.data);
      } else if (Array.isArray(response)) {
        setBills(response);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch pending bills';
      message.error(errorMessage);
      console.error('Fetch pending bills error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleView = (record) => {
    setSelectedBill(record);
    setDetailDrawerVisible(true);
  };

  const handleApplyDiscount = (record) => {
    setSelectedBill(record);
    setDiscountModalVisible(true);
  };

  const handleFinalize = async (record) => {
    setActionLoading(record.Id);
    try {
      const response = await finalizeBill(record.Id);
      if (response.statusCode === 200) {
        message.success('Bill finalized successfully!');
        fetchBills(); // Refresh list
      } else {
        message.error(response.message || 'Failed to finalize bill');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to finalize bill';
      message.error(errorMessage);
      console.error('Finalize bill error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (record) => {
    setActionLoading(record.Id);
    try {
      const response = await regenerateBill(record.Id);
      if (response.statusCode === 200) {
        message.success('Bill regenerated successfully!');
        fetchBills(); // Refresh list
      } else {
        message.error(response.message || 'Failed to regenerate bill');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to regenerate bill';
      message.error(errorMessage);
      console.error('Regenerate bill error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  const formatMonth = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const columns = [
    {
      title: 'Bill ID',
      dataIndex: 'Id',
      key: 'Id',
      width: 80,
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: 'Customer ID',
      dataIndex: 'CustomerId',
      key: 'CustomerId',
      width: 100,
      responsive: ['md'],
    },
    {
      title: 'Subscription ID',
      dataIndex: 'SubscriptionId',
      key: 'SubscriptionId',
      width: 120,
      responsive: ['lg'],
    },
    {
      title: 'Bill Month',
      dataIndex: 'BillMonth',
      key: 'BillMonth',
      width: 100,
      render: formatMonth,
      sorter: (a, b) => new Date(a.BillMonth) - new Date(b.BillMonth),
    },
    {
      title: 'Subscription',
      dataIndex: 'SubscriptionAmount',
      key: 'SubscriptionAmount',
      width: 120,
      responsive: ['sm'],
      render: formatCurrency,
    },
    {
      title: 'Extra Usage',
      dataIndex: 'ExtraUsageAmount',
      key: 'ExtraUsageAmount',
      width: 110,
      responsive: ['lg'],
      render: formatCurrency,
    },
    {
      title: 'Discount %',
      dataIndex: 'DiscountPercent',
      key: 'DiscountPercent',
      width: 100,
      responsive: ['md'],
      render: (percent) => `${percent || 0}%`,
    },
    {
      title: 'Tax %',
      dataIndex: 'TaxPercent',
      key: 'TaxPercent',
      width: 80,
      responsive: ['lg'],
      render: (percent) => `${percent || 0}%`,
    },
    {
      title: 'Total',
      dataIndex: 'TotalAmount',
      key: 'TotalAmount',
      width: 120,
      render: (amount) => (
        <span style={{ fontWeight: 600, color: '#a855f7' }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      render: (status) => (
        <Tag color={status === BILL_STATUS.PENDING ? 'orange' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: '#1890ff' }} />}
            onClick={() => handleView(record)}
            title="View Details"
            size="small"
          />
          <Button
            type="text"
            icon={<PercentageOutlined style={{ color: '#faad14' }} />}
            onClick={() => handleApplyDiscount(record)}
            title="Apply Discount"
            size="small"
            disabled={record.Status !== BILL_STATUS.PENDING}
          />
          <Popconfirm
            title="Finalize this bill?"
            description="This will mark the bill as completed and generate an invoice."
            onConfirm={() => handleFinalize(record)}
            okText="Yes, Finalize"
            cancelText="Cancel"
            disabled={record.Status !== BILL_STATUS.PENDING}
          >
            <Button
              type="text"
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              title="Finalize Bill"
              size="small"
              loading={actionLoading === record.Id}
              disabled={record.Status !== BILL_STATUS.PENDING || actionLoading === record.Id}
            />
          </Popconfirm>
          <Popconfirm
            title="Regenerate this bill?"
            description="This will reset the bill calculations. Only for pending bills."
            onConfirm={() => handleRegenerate(record)}
            okText="Yes, Regenerate"
            cancelText="Cancel"
            disabled={record.Status !== BILL_STATUS.PENDING}
          >
            <Button
              type="text"
              icon={<ReloadOutlined style={{ color: '#ff4d4f' }} />}
              title="Regenerate Bill"
              size="small"
              loading={actionLoading === record.Id}
              disabled={record.Status !== BILL_STATUS.PENDING || actionLoading === record.Id}
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
        <Flex align="center" gap="middle">
          <DollarOutlined style={{ fontSize: 28, color: '#a855f7' }} />
          <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>
            Pending Bills
          </Title>
        </Flex>
        <Button onClick={fetchBills} icon={<ReloadOutlined />} loading={loading}>
          Refresh
        </Button>
      </Flex>

      <Card styles={{ body: { padding: 'clamp(0px, 1vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : bills.length > 0 ? (
          <Table
            columns={columns}
            dataSource={bills}
            rowKey="Id"
            pagination={{
              responsive: true,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bills`,
            }}
            scroll={{ x: 'max-content' }}
            size={window.innerWidth < 576 ? 'small' : 'middle'}
          />
        ) : (
          <Empty description="No pending bills found" />
        )}
      </Card>

      {/* Bill Detail Drawer */}
      <BillDetailDrawer
        visible={detailDrawerVisible}
        bill={selectedBill}
        onClose={() => {
          setDetailDrawerVisible(false);
          setSelectedBill(null);
        }}
      />

      {/* Apply Discount Modal */}
      <ApplyDiscountModal
        visible={discountModalVisible}
        bill={selectedBill}
        onCancel={() => {
          setDiscountModalVisible(false);
          setSelectedBill(null);
        }}
        onSuccess={() => {
          setDiscountModalVisible(false);
          setSelectedBill(null);
          fetchBills();
        }}
      />
    </div>
  );
};

export default PendingBillsList;
