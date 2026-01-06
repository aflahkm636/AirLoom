import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Spin, 
  Empty, 
  Modal, 
  Descriptions, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Space,
  Statistic 
} from 'antd';
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { getComplaints } from '../api/complaints.api';
import { getServiceTasks } from '../api/serviceTasks.api';

const { Title, Text } = Typography;

// Theme colors - Vibrant
const colors = {
  background: '#101922',
  surface: '#182430',
  border: '#2a3744',
  primary: '#a855f7',
  orange: '#fb923c',
  blue: '#60a5fa',
  green: '#4ade80',
  red: '#f87171',
  cyan: '#22d3ee',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
};

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [complaintsData, serviceTasksData] = await Promise.all([
          getComplaints(),
          getServiceTasks(),
        ]);

        setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
        setServiceTasks(Array.isArray(serviceTasksData) ? serviceTasksData : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculations
  const pendingComplaintsCount = complaints.filter(c => c.Status === 'Pending').length;
  const pendingServiceTasksCount = serviceTasks.filter(t => t.Status === 'Pending' || t.Status === 'Assigned').length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toDateString();
  const todaysTasksCount = serviceTasks.filter(t => new Date(t.TaskDate).toDateString() === todayStr).length;

  // All active tasks sorted in DESCENDING order (latest first), today's tasks at top
  const allActiveTasks = serviceTasks
    .filter(t => t.Status !== 'Completed')
    .sort((a, b) => {
      const dateA = new Date(a.TaskDate);
      const dateB = new Date(b.TaskDate);
      
      const isAToday = dateA.toDateString() === todayStr;
      const isBToday = dateB.toDateString() === todayStr;
      
      // Today's tasks come first
      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;
      
      // Then sort by status priority (Assigned > Pending)
      const statusPriority = { 'Assigned': 1, 'Pending': 2 };
      const priorityA = statusPriority[a.Status] || 3;
      const priorityB = statusPriority[b.Status] || 3;
      if (priorityA !== priorityB) return priorityA - priorityB;
      
      // Then sort by date DESCENDING (latest first)
      return dateB - dateA;
    });

  const pendingComplaints = complaints.filter(c => c.Status === 'Pending').slice(0, 5);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskModalVisible(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isToday = (dateStr) => new Date(dateStr).toDateString() === todayStr;

  const getStatusTag = (status) => {
    const config = {
      Pending: { color: '#fb923c', bg: '#fb923c20' },
      Assigned: { color: '#60a5fa', bg: '#60a5fa20' },
      Completed: { color: '#4ade80', bg: '#4ade8020' },
    };
    const cfg = config[status] || { color: '#94a3b8', bg: '#94a3b820' };
    return (
      <Tag 
        style={{ 
          color: cfg.color, 
          background: cfg.bg, 
          border: `1px solid ${cfg.color}40`,
          fontWeight: 600,
        }}
      >
        {status}
      </Tag>
    );
  };

  const taskColumns = [
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      render: getStatusTag,
    },
    {
      title: 'Task ID',
      dataIndex: 'Id',
      key: 'Id',
      width: 80,
      render: (id) => <Text strong style={{ color: colors.textPrimary }}>#{id}</Text>,
    },
    {
      title: 'Task Date',
      dataIndex: 'TaskDate',
      key: 'TaskDate',
      width: 160,
      render: (date) => (
        <Space>
          <Text style={{ color: isToday(date) ? colors.primary : colors.textPrimary }}>
            {formatDate(date)}
          </Text>
          {isToday(date) && <Tag color="purple">Today</Tag>}
        </Space>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'Notes',
      key: 'Notes',
      ellipsis: true,
      render: (notes) => <Text style={{ color: colors.textSecondary }}>{notes || '-'}</Text>,
    },
    {
      title: 'Subscription',
      dataIndex: 'SubscriptionId',
      key: 'SubscriptionId',
      width: 100,
      render: (id) => <Text style={{ color: colors.textSecondary }}>#{id}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => handleTaskClick(record)}>
          View
        </Button>
      ),
    },
  ];

  const complaintsColumns = [
    {
      title: 'Customer',
      dataIndex: 'CustomerName',
      key: 'CustomerName',
      render: (name) => <Text strong style={{ color: colors.textPrimary }}>{name}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
      ellipsis: true,
      render: (desc) => <Text style={{ color: colors.textSecondary }}>{desc}</Text>,
    },
    {
      title: 'Created',
      dataIndex: 'CreatedOn',
      key: 'CreatedOn',
      width: 120,
      render: (date) => <Text style={{ color: colors.textSecondary }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      render: () => <Tag color="orange">Pending</Tag>,
    },
  ];

  // Styles
  const styles = {
    card: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
    },
    statCard: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      height: 'auto',
      minHeight: 100,
    },
    tableCard: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      marginTop: 16,
      overflow: 'hidden',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    tableHeader: {
      padding: '12px 16px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Space orientation="vertical" align="center">
          <Spin size="large" />
          <Text style={{ color: colors.textSecondary }}>Loading dashboard...</Text>
        </Space>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Empty description={<Text style={{ color: colors.textSecondary }}>{error}</Text>} />
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>Pending Complaints</Text>}
              value={pendingComplaintsCount}
              prefix={<ExclamationCircleOutlined style={{ color: colors.orange }} />}
              styles={{ content: { color: colors.orange, fontSize: 32 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>Pending Service Tasks</Text>}
              value={pendingServiceTasksCount}
              prefix={<ClockCircleOutlined style={{ color: colors.blue }} />}
              styles={{ content: { color: colors.blue, fontSize: 32 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>Today's Tasks</Text>}
              value={todaysTasksCount}
              prefix={<CalendarOutlined style={{ color: colors.primary }} />}
              styles={{ content: { color: colors.primary, fontSize: 32 } }}
            />
          </Card>
        </Col>
      </Row>

      {/* All Active Tasks */}
      <Card style={styles.tableCard} styles={{ body: { padding: 0 } }}>
        <div style={styles.tableHeader}>
          <Title level={5} style={{ color: colors.textPrimary, margin: 0, fontSize: 16 }}>
            All Active Tasks
          </Title>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{allActiveTasks.length} tasks</Text>
        </div>
        <div style={styles.tableWrapper}>
          {allActiveTasks.length > 0 ? (
            <Table
              columns={taskColumns}
              dataSource={allActiveTasks}
              rowKey="Id"
              pagination={{ pageSize: 10, size: 'small' }}
              scroll={{ x: 700 }}
              size="small"
              onRow={(record) => ({
                onClick: () => handleTaskClick(record),
                style: { cursor: 'pointer' },
              })}
            />
          ) : (
            <Empty description="No active tasks" style={{ padding: 48 }} />
          )}
        </div>
      </Card>

      {/* Pending Complaints */}
      <Card style={styles.tableCard} styles={{ body: { padding: 0 } }}>
        <div style={styles.tableHeader}>
          <Title level={5} style={{ color: colors.textPrimary, margin: 0, fontSize: 16 }}>
            Pending Complaints
          </Title>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{pendingComplaintsCount} complaints</Text>
        </div>
        <div style={styles.tableWrapper}>
          {pendingComplaints.length > 0 ? (
            <Table
              columns={complaintsColumns}
              dataSource={pendingComplaints}
              rowKey="Id"
              pagination={false}
              scroll={{ x: 500 }}
              size="small"
            />
          ) : (
            <Empty description="No pending complaints" style={{ padding: 48 }} />
          )}
        </div>
      </Card>

      {/* Task Detail Modal */}
      <Modal
        title={<Space><FileTextOutlined style={{ color: colors.primary }} /><span>Task Details</span></Space>}
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={<Button onClick={() => setTaskModalVisible(false)}>Close</Button>}
        width={600}
        styles={{
          content: { background: colors.surface, border: `1px solid ${colors.border}` },
          header: { background: colors.surface, borderBottom: `1px solid ${colors.border}` },
        }}
      >
        {selectedTask && (
          <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Task ID">#{selectedTask.Id}</Descriptions.Item>
            <Descriptions.Item label="Status">{getStatusTag(selectedTask.Status)}</Descriptions.Item>
            <Descriptions.Item label="Task Date">
              <Space>
                {formatDate(selectedTask.TaskDate)}
                {isToday(selectedTask.TaskDate) && <Tag color="purple">Today</Tag>}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Subscription ID">#{selectedTask.SubscriptionId}</Descriptions.Item>
            <Descriptions.Item label="Complaint ID">{selectedTask.ComplaintId || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Notes">{selectedTask.Notes || 'No notes'}</Descriptions.Item>
            <Descriptions.Item label="Requires Material">{selectedTask.RequiresMaterialUsage ? 'Yes' : 'No'}</Descriptions.Item>
            <Descriptions.Item label="Created On">{formatDate(selectedTask.CreatedOn)}</Descriptions.Item>
            {selectedTask.ModifiedAt && (
              <Descriptions.Item label="Modified At">{formatDate(selectedTask.ModifiedAt)}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
