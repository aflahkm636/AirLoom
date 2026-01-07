import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Spin, Empty, message, Flex, Tag, Button, Drawer, Descriptions, Divider } from 'antd';
import { EyeOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';
import { getMyBills, BILL_STATUS } from '../../api/billing.api';

const { Title } = Typography;

const MyBillsList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await getMyBills();
      if (response && response.data) {
        // Filter to only show completed/finalized bills
        const finalizedBills = response.data.filter(
          (bill) => bill.Status === BILL_STATUS.COMPLETED
        );
        setBills(finalizedBills);
      } else if (Array.isArray(response)) {
        const finalizedBills = response.filter(
          (bill) => bill.Status === BILL_STATUS.COMPLETED
        );
        setBills(finalizedBills);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch your bills';
      message.error(errorMessage);
      console.error('Fetch my bills error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleView = (record) => {
    setSelectedBill(record);
    setDrawerVisible(true);
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
      month: 'long',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'InvoiceNumber',
      key: 'InvoiceNumber',
      width: 140,
      render: (invoice) => (
        <Tag color="blue" icon={<FileTextOutlined />}>
          {invoice || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Bill Month',
      dataIndex: 'BillMonth',
      key: 'BillMonth',
      width: 120,
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
      title: 'Discount',
      dataIndex: 'DiscountAmount',
      key: 'DiscountAmount',
      width: 100,
      responsive: ['md'],
      render: (amount) => (
        <span style={{ color: '#52c41a' }}>-{formatCurrency(amount)}</span>
      ),
    },
    {
      title: 'Tax',
      dataIndex: 'TaxAmount',
      key: 'TaxAmount',
      width: 100,
      responsive: ['lg'],
      render: formatCurrency,
    },
    {
      title: 'Total',
      dataIndex: 'TotalAmount',
      key: 'TotalAmount',
      width: 130,
      render: (amount) => (
        <span style={{ fontWeight: 600, color: '#a855f7', fontSize: 15 }}>
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
        <Tag color="green">{status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined style={{ color: '#1890ff' }} />}
          onClick={() => handleView(record)}
          title="View Bill"
        />
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
            My Bills
          </Title>
        </Flex>
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
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bills`,
            }}
            scroll={{ x: 'max-content' }}
            size={window.innerWidth < 576 ? 'small' : 'middle'}
          />
        ) : (
          <Empty description="No bills found" />
        )}
      </Card>

      {/* Bill Detail Drawer (Read-Only) */}
      <Drawer
        title="Bill Details"
        placement="right"
        onClose={() => {
          setDrawerVisible(false);
          setSelectedBill(null);
        }}
        open={drawerVisible}
        width={450}
        styles={{
          header: {
            background: '#182430',
            borderBottom: '1px solid #2a3744',
          },
          body: {
            background: '#182430',
            padding: '24px',
          },
        }}
      >
        {selectedBill && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={4} style={{ margin: '0 0 8px', color: '#fff' }}>
                {selectedBill.InvoiceNumber || `Bill #${selectedBill.Id}`}
              </Title>
              <Tag color="green" style={{ fontSize: 14 }}>
                {selectedBill.Status}
              </Tag>
            </div>

            <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

            {/* Bill Info */}
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 140 }}
              contentStyle={{ color: '#fff' }}
            >
              <Descriptions.Item label="Bill Month">{formatMonth(selectedBill.BillMonth)}</Descriptions.Item>
              <Descriptions.Item label="Created On">{formatDate(selectedBill.CreatedOn)}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

            {/* Amount Breakdown */}
            <Title level={5} style={{ color: '#a855f7', marginBottom: 16 }}>
              Amount Breakdown
            </Title>
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 140 }}
              contentStyle={{ color: '#fff' }}
            >
              <Descriptions.Item label="Subscription">
                {formatCurrency(selectedBill.SubscriptionAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="Extra Usage">
                {formatCurrency(selectedBill.ExtraUsageAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="Discount ({selectedBill.DiscountPercent}%)">
                <span style={{ color: '#52c41a' }}>
                  -{formatCurrency(selectedBill.DiscountAmount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Tax ({selectedBill.TaxPercent}%)">
                {formatCurrency(selectedBill.TaxAmount)}
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

            {/* Total */}
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ color: '#fff', fontWeight: 600, width: 140 }}
              contentStyle={{ color: '#a855f7', fontWeight: 700, fontSize: 20 }}
            >
              <Descriptions.Item label="Total Amount">
                {formatCurrency(selectedBill.TotalAmount)}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default MyBillsList;
