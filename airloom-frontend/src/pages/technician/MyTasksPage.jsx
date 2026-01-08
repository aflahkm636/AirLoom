import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, Spin, Empty, Tabs, Button, Space, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { getTechnicianTasks } from '../../api/technicians.api';
import TechnicianTaskDetailDrawer from './TechnicianTaskDetailDrawer';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const STATUS_COLORS = {
  Pending: 'orange',
  Assigned: 'blue',
  InProgress: 'processing',
  AwaitingApproval: 'purple',
  Completed: 'green',
};

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchTasks = async (status = '') => {
    try {
      setLoading(true);
      const response = await getTechnicianTasks(status);
      setTasks(response?.data || []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      message.error('Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const statusMap = {
      'all': '',
      'assigned': 'assigned',
      'inprogress': 'inprogress',
      'awaitingapproval': 'awaitingapproval',
      'completed': 'completed',
    };
    fetchTasks(statusMap[activeTab] || '');
  }, [activeTab]);

  const handleRowClick = (record) => {
    setSelectedTask(record);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    const statusMap = {
      'all': '',
      'assigned': 'assigned',
      'inprogress': 'inprogress',
      'awaitingapproval': 'awaitingapproval',
      'completed': 'completed',
    };
    fetchTasks(statusMap[activeTab] || '');
  };

  const columns = [
    {
      title: 'Task ID',
      key: 'TaskId',
      width: 80,
      render: (_, record) => <Text strong>#{record.TaskId || record.Id}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 130,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'TaskDate',
      key: 'TaskDate',
      width: 120,
      render: (date) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
      width: 100,
      render: (role) => (
        <Tag color={role === 'lead' ? 'purple' : 'blue'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'Notes',
      key: 'Notes',
      ellipsis: true,
      render: (notes) => notes || '-',
    },
  ];

  const getFilteredTasks = () => {
    return tasks;
  };

  const tabItems = [
    { key: 'all', label: `All (${tasks.length})` },
    { key: 'assigned', label: 'Assigned' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'awaitingapproval', label: 'Awaiting Approval' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>
          My Tasks
        </Title>
        <Button
          icon={<SyncOutlined />}
          onClick={() => handleTaskUpdated()}
        >
          Refresh
        </Button>
      </div>

      <Card styles={{ body: { padding: 'clamp(12px, 2vw, 24px)' } }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : getFilteredTasks().length > 0 ? (
          <Table
            columns={columns}
            dataSource={getFilteredTasks()}
            rowKey={(record) => record.Id || record.TaskId}
            pagination={{ pageSize: 10, responsive: true }}
            scroll={{ x: 'max-content' }}
            size="middle"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' }
            })}
          />
        ) : (
          <Empty description="No tasks found" style={{ padding: 48 }} />
        )}
      </Card>

      <TechnicianTaskDetailDrawer
        visible={drawerVisible}
        onClose={handleDrawerClose}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  );
};

export default MyTasksPage;
