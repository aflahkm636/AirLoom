import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Tag,
  Spin,
  Typography,
  message,
  Result,
  Avatar,
  Flex,
  Table,
  Select,
  Badge,
  Divider,
  Statistic,
  Row,
  Col,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  SafetyOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { getTechnicianById, getTechnicianTasks } from '../../../api/technicians.api';
import { API_BASE_URL } from '../../../utils/constants';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const statusOptions = [
  { value: '', label: 'All Tasks' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'awaitingapproval', label: 'Awaiting Approval' },
  { value: 'completed', label: 'Completed' },
];

const getStatusConfig = (status) => {
  const statusLower = (status || '').toLowerCase().replace(/[\s-]/g, '');
  switch (statusLower) {
    case 'completed':
      return { color: 'success', icon: <CheckCircleOutlined /> };
    case 'inprogress':
      return { color: 'processing', icon: <SyncOutlined spin /> };
    case 'pending':
      return { color: 'warning', icon: <ClockCircleOutlined /> };
    case 'assigned':
      return { color: 'blue', icon: <UserSwitchOutlined /> };
    case 'awaitingapproval':
      return { color: 'gold', icon: <SafetyOutlined /> };
    default:
      return { color: 'default', icon: null };
  }
};

const TechnicianDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // Task statistics
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    awaitingApproval: 0,
  });

  const fetchTechnicianDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTechnicianById(id);
      if (response && response.data) {
        setTechnician(response.data);
      } else if (response) {
        setTechnician(response);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Fetch technician detail error:', err);
      message.error('Failed to fetch technician details');
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchTasks = useCallback(async (employeeId, status = '') => {
    try {
      setTasksLoading(true);
      const response = await getTechnicianTasks(employeeId, status);
      const taskData = response?.data || response || [];
      setTasks(taskData);

      // Calculate stats only when fetching all tasks
      if (!status) {
        const normalize = (s) => (s || '').toLowerCase().replace(/[\s-]/g, '');
        const stats = {
          total: taskData.length,
          completed: taskData.filter(t => normalize(t.Status) === 'completed').length,
          pending: taskData.filter(t => normalize(t.Status) === 'pending').length,
          assigned: taskData.filter(t => normalize(t.Status) === 'assigned').length,
          inProgress: taskData.filter(t => normalize(t.Status) === 'inprogress').length,
          awaitingApproval: taskData.filter(t => normalize(t.Status) === 'awaitingapproval').length,
        };
        setTaskStats(stats);
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      message.error('Failed to fetch technician tasks');
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchTechnicianDetail();
    }
  }, [id, fetchTechnicianDetail]);

  useEffect(() => {
    if (technician?.EmployeeId) {
      fetchTasks(technician.EmployeeId, statusFilter);
    }
  }, [technician, statusFilter, fetchTasks]);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const taskColumns = [
    {
      title: 'Task ID',
      dataIndex: 'TaskId',
      key: 'TaskId',
      width: 80,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Type',
      key: 'type',
      width: 120,
      render: (_, record) => (
        <Tag color={record.SubscriptionId ? 'blue' : 'orange'}>
          {record.SubscriptionId ? 'Subscription' : 'Complaint'}
        </Tag>
      ),
    },
    {
      title: 'Task Date',
      dataIndex: 'TaskDate',
      key: 'TaskDate',
      width: 140,
      sorter: (a, b) => new Date(a.TaskDate) - new Date(b.TaskDate),
      render: (date) => date ? dayjs(date).format('DD MMM YYYY') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag icon={config.icon} color={config.color}>
            {status || 'Unknown'}
          </Tag>
        );
      },
    },
    {
      title: 'Notes',
      dataIndex: 'Notes',
      key: 'Notes',
      ellipsis: true,
      responsive: ['lg'],
      render: (notes) => notes || <Text type="secondary">No notes</Text>,
    },
    {
      title: 'Assigned On',
      dataIndex: 'AssignedOn',
      key: 'AssignedOn',
      width: 160,
      responsive: ['md'],
      render: (date) => date ? dayjs(date).format('DD MMM YYYY, hh:mm A') : 'N/A',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !technician) {
    return (
      <Result
        status="404"
        title="Technician Not Found"
        subTitle="Sorry, the technician you are looking for does not exist."
        extra={
          <Button type="primary" onClick={() => navigate('/admin/technicians')}>
            Back to List
          </Button>
        }
      />
    );
  }

  const profileImageUrl = technician.ProfileImage && technician.ProfileImage !== 'string'
    ? (technician.ProfileImage.startsWith('http') ? technician.ProfileImage : `${API_BASE_URL}/${technician.ProfileImage}`)
    : null;

  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/technicians')}
        style={{ marginBottom: '24px' }}
      >
        Back to Technicians
      </Button>

      {/* Technician Info Card */}
      <Card styles={{ body: { padding: 'clamp(16px, 3vw, 24px)' } }} style={{ marginBottom: 24 }}>
        <Flex gap="large" align="flex-start" wrap="wrap">
          <Avatar
            size={100}
            src={profileImageUrl}
            icon={<UserOutlined />}
            style={{ 
              border: '3px solid #7f13ec',
              boxShadow: '0 4px 12px rgba(127, 19, 236, 0.3)'
            }}
          />
          <Flex vertical flex={1} style={{ minWidth: 250 }}>
            <Title level={3} style={{ margin: 0 }}>{technician.TechnicianName}</Title>
            <Text type="secondary" style={{ marginTop: 4 }}>{technician.Email}</Text>
            <Flex gap="small" style={{ marginTop: 8 }} wrap="wrap">
              <Tag color="purple">{technician.DepartmentName || 'N/A'}</Tag>
              <Tag color="blue">{technician.Designation || 'Technician'}</Tag>
              <Badge
                status={technician.Status ? 'success' : 'error'}
                text={technician.Status ? 'Active' : 'Inactive'}
              />
            </Flex>
          </Flex>
        </Flex>

        <Divider />

        <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }} size="small">
          <Descriptions.Item label="Employee ID">{technician.EmployeeId}</Descriptions.Item>
          <Descriptions.Item label="User ID">{technician.UserId || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{technician.Phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Department">{technician.DepartmentName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Designation">{technician.Designation || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Salary">
            {technician.Salary ? `₹${technician.Salary.toLocaleString()}` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Joining Date">
            {technician.JoiningDate ? dayjs(technician.JoiningDate).format('DD MMM YYYY') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Created On">
            {technician.CreatedOn ? dayjs(technician.CreatedOn).format('DD MMM YYYY, hh:mm A') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Created By">{technician.CreatedByName || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Task Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} md={4}>
          <Card hoverable size="small">
            <Statistic
              title="Total"
              value={taskStats.total}
              valueStyle={{ color: '#7f13ec', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card hoverable size="small">
            <Statistic
              title="Pending"
              value={taskStats.pending}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card hoverable size="small">
            <Statistic
              title="Assigned"
              value={taskStats.assigned}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card hoverable size="small">
            <Statistic
              title="In Progress"
              value={taskStats.inProgress}
              valueStyle={{ color: '#13c2c2', fontSize: '24px' }}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card hoverable size="small">
            <Statistic
              title="Awaiting"
              value={taskStats.awaitingApproval}
              valueStyle={{ color: '#d48806', fontSize: '24px' }}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card hoverable size="small">
            <Statistic
              title="Completed"
              value={taskStats.completed}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Tasks Table */}
      <Card
        title={
          <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
            <Title level={4} style={{ margin: 0 }}>Assigned Tasks</Title>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: 160 }}
              placeholder="Filter by Status"
            >
              {statusOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Flex>
        }
        styles={{ body: { padding: 'clamp(8px, 2vw, 24px)' } }}
      >
        {tasksLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : tasks.length > 0 ? (
          <Table
            columns={taskColumns}
            dataSource={tasks}
            rowKey="TaskId"
            pagination={{
              responsive: true,
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`,
            }}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        ) : (
          <Empty
            description={statusFilter ? `No ${statusFilter} tasks found` : 'No tasks assigned'}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default TechnicianDetail;
