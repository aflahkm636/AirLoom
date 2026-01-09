import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Typography, Spin, Empty, message, Flex, Input } from 'antd';
import { EyeOutlined, SyncOutlined, SearchOutlined } from '@ant-design/icons';
import { getComplaints, getComplaintById } from '../../../api/complaints.api';
import ComplaintDetailDrawer from './ComplaintDetailDrawer';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;

const STATUS_COLORS = {
  Pending: 'orange',
  Open: 'blue',
  InProgress: 'processing',
  Resolved: 'green',
  Closed: 'default',
};

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getComplaints();
      setComplaints(Array.isArray(data) ? data : []);
      setFilteredComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch complaints error:', error);
      message.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter complaints based on search text
  useEffect(() => {
    if (!searchText) {
      setFilteredComplaints(complaints);
    } else {
      const lower = searchText.toLowerCase();
      const filtered = complaints.filter(c => 
        c.CustomerName?.toLowerCase().includes(lower) ||
        c.Description?.toLowerCase().includes(lower) ||
        (c.ComplaintId || c.Id || c.id)?.toString().includes(lower) ||
        c.Status?.toLowerCase().includes(lower)
      );
      setFilteredComplaints(filtered);
    }
  }, [searchText, complaints]);

  const handleView = async (id) => {
    try {
      setDetailVisible(true);
      setDetailLoading(true);
      const response = await getComplaintById(id);
      if (response && response.data) {
        setSelectedComplaint(response.data);
      } else {
        setSelectedComplaint(response);
      }
    } catch (error) {
      console.error('Fetch complaint detail error:', error);
      message.error('Failed to load complaint details');
      setDetailVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      key: 'Id',
      width: 70,
      sorter: (a, b) => (a.ComplaintId || a.Id || a.id) - (b.ComplaintId || b.Id || b.id),
      render: (_, record) => <Text strong>#{record.ComplaintId || record.Id || record.id}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 120,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Open', value: 'Open' },
        { text: 'Assigned', value: 'Assigned' },
        { text: 'In Progress', value: 'InProgress' },
        { text: 'Resolved', value: 'Resolved' },
        { text: 'Closed', value: 'Closed' },
      ],
      onFilter: (value, record) => record.Status === value,
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
      responsive: ['md'],
    },
    {
      title: 'Subscription',
      dataIndex: 'SubscriptionId',
      key: 'SubscriptionId',
      width: 110,
      responsive: ['sm'],
      render: (id) => id ? `#${id}` : 'N/A',
    },
    {
      title: 'Created',
      dataIndex: 'CreatedOn',
      key: 'CreatedOn',
      width: 120,
      responsive: ['sm'],
      render: (date) => date ? dayjs(date).format('DD MMM YYYY') : 'N/A',
      sorter: (a, b) => new Date(a.CreatedOn) - new Date(b.CreatedOn),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: '#1890ff' }} />}
            onClick={(e) => { e.stopPropagation(); handleView(record.ComplaintId || record.Id || record.id); }}
            title="View Details"
          />
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
          Complaints
        </Title>
        <Space wrap>
          <Search
            placeholder="Search complaints..."
            allowClear
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <Button
            icon={<SyncOutlined />}
            onClick={fetchComplaints}
          >
            Refresh
          </Button>
        </Space>
      </Flex>

      <Card styles={{ body: { padding: 'clamp(12px, 2vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : filteredComplaints.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredComplaints}
            rowKey={(record) => record.ComplaintId || record.Id || record.id || Math.random()}
            pagination={{ responsive: true, pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            size="middle"
            onRow={(record) => ({
              onClick: () => handleView(record.ComplaintId || record.Id || record.id),
              style: { cursor: 'pointer' }
            })}
          />
        ) : (
          <Empty description="No complaints found" style={{ padding: 48 }} />
        )}
      </Card>

      <ComplaintDetailDrawer
        visible={detailVisible}
        onClose={() => {
          setDetailVisible(false);
          setSelectedComplaint(null);
        }}
        loading={detailLoading}
        complaint={selectedComplaint}
        onComplaintUpdated={fetchComplaints}
      />
    </div>
  );
};

export default ComplaintsPage;
