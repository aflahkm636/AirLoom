import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Typography, Spin, Empty, message, Flex, Popconfirm, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { getServiceTasks, getServiceTaskById, deleteServiceTask, getAwaitingApprovalTasks } from '../../../api/serviceTasks.api';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskDetailDrawer from './TaskDetailDrawer';
import dayjs from 'dayjs';

const { Title } = Typography;

const STATUS_COLORS = {
  Pending: 'orange',
  Assigned: 'blue',
  InProgress: 'processing',
  AwaitingApproval: 'purple',
  Completed: 'green',
};

const ServiceTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [awaitingTasks, setAwaitingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getServiceTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      message.error('Failed to fetch service tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchAwaitingTasks = async () => {
    try {
      const response = await getAwaitingApprovalTasks();
      if (response && response.data) {
        setAwaitingTasks(response.data);
      } else if (Array.isArray(response)) {
        setAwaitingTasks(response);
      }
    } catch (error) {
      console.error('Fetch awaiting tasks error:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAwaitingTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteServiceTask(id);
      message.success('Task deleted successfully');
      fetchTasks();
      fetchAwaitingTasks();
    } catch (error) {
      console.error('Delete task error:', error);
      message.error('Failed to delete task');
    }
  };

  const handleView = async (id) => {
    try {
      setDetailVisible(true);
      setDetailLoading(true);
      const response = await getServiceTaskById(id);
      if (response && response.data) {
        setSelectedTask(response.data);
      } else {
        setSelectedTask(response);
      }
    } catch (error) {
      console.error('Fetch task detail error:', error);
      message.error('Failed to load task details');
      setDetailVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // Refresh the current task data without affecting loading state
  const refreshCurrentTask = async (taskId) => {
    if (!taskId) return;
    try {
      const response = await getServiceTaskById(taskId);
      if (response && response.data) {
        setSelectedTask(response.data);
      } else {
        setSelectedTask(response);
      }
    } catch (error) {
      console.error('Refresh task error:', error);
    }
  };

  const handleEdit = (record) => {
    setDetailVisible(false);
    setSelectedTask(record);
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      key: 'Id',
      width: 70,
      sorter: (a, b) => (a.Id || a.TaskId) - (b.Id || b.TaskId),
      render: (_, record) => record.Id || record.TaskId,
    },
    {
      title: 'Task Date',
      dataIndex: 'TaskDate',
      key: 'TaskDate',
      width: 130,
      render: (date) => dayjs(date).format('DD MMM YYYY'),
      sorter: (a, b) => new Date(a.TaskDate) - new Date(b.TaskDate),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 130,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'purple'}>
          {status || 'AwaitingApproval'}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Assigned', value: 'Assigned' },
        { text: 'InProgress', value: 'InProgress' },
        { text: 'AwaitingApproval', value: 'AwaitingApproval' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value, record) => record.Status === value,
    },
    {
      title: 'Subscription',
      dataIndex: 'SubscriptionId',
      key: 'SubscriptionId',
      width: 110,
      responsive: ['sm'],
      render: (id) => `#${id}`,
    },
    {
      title: 'Notes',
      dataIndex: 'Notes',
      key: 'Notes',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 130,
      render: (_, record) => {
        const taskId = record.Id || record.TaskId;
        return (
          <Space size="small">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: '#1890ff' }} />}
              onClick={(e) => { e.stopPropagation(); handleView(taskId); }}
              title="View Details"
            />
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#faad14' }} />}
              onClick={(e) => { e.stopPropagation(); handleEdit(record); }}
              title="Edit"
            />
            <Popconfirm
              title="Delete Task"
              description="Are you sure?"
              onConfirm={() => handleDelete(taskId)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
                title="Delete"
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const tabItems = [
    {
      key: 'all',
      label: `All Tasks (${tasks.length})`,
      children: (
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="Id"
          pagination={{ responsive: true, pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          size="middle"
          onRow={(record) => ({
            onClick: () => handleView(record.Id),
            style: { cursor: 'pointer' }
          })}
        />
      ),
    },
    {
      key: 'awaiting',
      label: `Awaiting Approval (${awaitingTasks.length})`,
      children: (
        <Table
          columns={columns}
          dataSource={awaitingTasks}
          rowKey="TaskId"
          pagination={{ responsive: true, pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          size="middle"
          onRow={(record) => ({
            onClick: () => handleView(record.TaskId),
            style: { cursor: 'pointer' }
          })}
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
        <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>
          Service Tasks
        </Title>
        <Space>
          <Button
            icon={<SyncOutlined />}
            onClick={() => { fetchTasks(); fetchAwaitingTasks(); }}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Add Task
          </Button>
        </Space>
      </Flex>

      <Card styles={{ body: { padding: 'clamp(12px, 2vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            items={tabItems}
          />
        )}
      </Card>

      <CreateTaskModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          fetchTasks();
        }}
      />

      <EditTaskModal
        visible={editModalVisible}
        task={selectedTask}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedTask(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setSelectedTask(null);
          fetchTasks();
        }}
      />

      <TaskDetailDrawer
        visible={detailVisible}
        onClose={() => {
          setDetailVisible(false);
          setSelectedTask(null);
        }}
        loading={detailLoading}
        data={selectedTask}
        onEdit={handleEdit}
        onStatusChange={() => {
          fetchTasks();
          fetchAwaitingTasks();
        }}
        onRefreshTask={() => {
          if (selectedTask?.Id) {
            refreshCurrentTask(selectedTask.Id);
          }
        }}
      />
    </div>
  );
};

export default ServiceTasksPage;
