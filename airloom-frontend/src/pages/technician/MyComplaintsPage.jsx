import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, Spin, Empty, Button, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { getAssignedComplaints } from '../../api/technicians.api';
import ComplaintDetailDrawer from './ComplaintDetailDrawer';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const STATUS_COLORS = {
  Pending: 'orange',
  Open: 'blue',
  InProgress: 'processing',
  Resolved: 'green',
  Closed: 'default',
};

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getAssignedComplaints();
      setComplaints(response?.data || []);
    } catch (error) {
      console.error('Fetch complaints error:', error);
      message.error('Failed to fetch complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRowClick = (record) => {
    setSelectedComplaint(record);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedComplaint(null);
  };

  const handleComplaintUpdated = () => {
    fetchComplaints();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
      width: 70,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 110,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'CustomerName',
      key: 'CustomerName',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
      ellipsis: true,
    },
    {
      title: 'Created',
      dataIndex: 'CreatedOn',
      key: 'CreatedOn',
      width: 110,
      render: (date) => dayjs(date).format('DD MMM YYYY'),
    },
  ];

  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>
          My Complaints
        </Title>
        <Button
          icon={<SyncOutlined />}
          onClick={fetchComplaints}
        >
          Refresh
        </Button>
      </div>

      <Card styles={{ body: { padding: 'clamp(12px, 2vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : complaints.length > 0 ? (
          <Table
            columns={columns}
            dataSource={complaints}
            rowKey="Id"
            pagination={{ pageSize: 10, responsive: true }}
            scroll={{ x: 'max-content' }}
            size="middle"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' }
            })}
          />
        ) : (
          <Empty description="No complaints assigned to you" style={{ padding: 48 }} />
        )}
      </Card>

      <ComplaintDetailDrawer
        visible={drawerVisible}
        onClose={handleDrawerClose}
        complaint={selectedComplaint}
        onComplaintUpdated={handleComplaintUpdated}
      />
    </div>
  );
};

export default MyComplaintsPage;
