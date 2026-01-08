import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Table, 
  Tag, 
  Spin, 
  Empty, 
  Row, 
  Col, 
  Typography, 
  Space,
  Statistic,
  Avatar,
  Badge,
  Button
} from 'antd';
import {
  ClockCircleOutlined,
  PlayCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { 
  selectUserPermissions, 
  selectUserName, 
  selectUserDepartmentName,
  selectUserProfileImage,
  selectUserRole
} from '../features/auth/authSelectors';
import { getTechnicianTasks, getAssignedComplaints } from '../api/technicians.api';
import { API_BASE_URL } from '../utils/constants';

const { Title, Text } = Typography;

const colors = {
  surface: '#182430',
  border: '#2a3744',
  primary: '#a855f7',
  orange: '#fb923c',
  blue: '#60a5fa',
  green: '#4ade80',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
};

const STATUS_COLORS = {
  Pending: 'orange',
  Assigned: 'blue',
  InProgress: 'processing',
  AwaitingApproval: 'purple',
  Completed: 'green',
};

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const permissions = useSelector(selectUserPermissions);
  const userName = useSelector(selectUserName);
  const departmentName = useSelector(selectUserDepartmentName);
  const profileImage = useSelector(selectUserProfileImage);
  const userRole = useSelector(selectUserRole);

  const hasTaskViewOwn = permissions.includes('TASK_VIEW_OWN');
  const hasComplaintViewAssigned = permissions.includes('COMPLAINT_VIEW_ASSIGNED');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tasks
        if (hasTaskViewOwn) {
          const tasksResponse = await getTechnicianTasks();
          setTasks(tasksResponse?.data || []);
        }
        
        // Fetch complaints
        if (hasComplaintViewAssigned) {
          const complaintsResponse = await getAssignedComplaints();
          setComplaints(complaintsResponse?.data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasTaskViewOwn, hasComplaintViewAssigned]);

  // Calculate stats
  const pendingTasks = tasks.filter(t => t.Status === 'Pending' || t.Status === 'Assigned');
  const inProgressTasks = tasks.filter(t => t.Status === 'InProgress');
  const pendingComplaints = complaints.filter(c => c.Status === 'Pending' || c.Status === 'Open');

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const profileImageUrl = profileImage 
    ? (profileImage.startsWith('http') ? profileImage : `${API_BASE_URL}/${profileImage}`)
    : null;

  const styles = {
    profileCard: {
      background: 'linear-gradient(135deg, #7f13ec 0%, #a855f7 100%)',
      border: 'none',
      borderRadius: 12,
      marginBottom: 16,
    },
    statCard: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      minHeight: 100,
    },
    tableCard: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      marginTop: 16,
      overflow: 'hidden',
    },
    tableHeader: {
      padding: '12px 16px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    quickLink: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  };

  const pendingTasksColumns = [
    {
      title: 'Task',
      key: 'task',
      render: (_, record) => (
        <Text strong style={{ color: colors.textPrimary }}>
          #{record.TaskId || record.Id}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
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
      render: (date) => <Text style={{ color: colors.textSecondary }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
      render: (role) => (
        <Tag color={role === 'lead' ? 'purple' : 'blue'}>
          {role}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Text style={{ color: colors.textSecondary }}>Loading dashboard...</Text>
        </Space>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Card */}
      <Card style={styles.profileCard} styles={{ body: { padding: '24px' } }}>
        <Space size={16} align="start">
          <Badge 
            dot 
            status="success" 
            offset={[-6, 54]}
            style={{ width: 12, height: 12 }}
          >
            <Avatar 
              size={64} 
              src={profileImageUrl}
              icon={!profileImageUrl && <UserOutlined />}
              style={{ 
                border: '3px solid rgba(255,255,255,0.3)',
                background: profileImageUrl ? 'transparent' : 'rgba(255,255,255,0.2)',
              }}
            />
          </Badge>
          <div>
            <Title level={3} style={{ color: '#fff', margin: 0, marginBottom: 4 }}>
              Welcome back, {userName}!
            </Title>
            <Space size={8}>
              <Tag color="purple" style={{ margin: 0 }}>{userRole}</Tag>
              {departmentName && (
                <Tag color="geekblue" style={{ margin: 0 }}>{departmentName}</Tag>
              )}
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                {permissions.length} permissions active
              </Text>
            </div>
          </div>
        </Space>
      </Card>

      {/* Quick Access Links */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12}>
          <div 
            style={styles.quickLink} 
            onClick={() => navigate('/technician/my-tasks')}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: colors.primary }}>
              assignment
            </span>
            <Text style={{ color: colors.textPrimary }}>My Tasks</Text>
          </div>
        </Col>
        <Col xs={12}>
          <div 
            style={styles.quickLink}
            onClick={() => navigate('/technician/my-complaints')}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: colors.orange }}>
              report_problem
            </span>
            <Text style={{ color: colors.textPrimary }}>My Complaints</Text>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>Pending Tasks</Text>}
              value={pendingTasks.length}
              prefix={<ClockCircleOutlined style={{ color: colors.orange }} />}
              valueStyle={{ color: colors.orange }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>In Progress</Text>}
              value={inProgressTasks.length}
              prefix={<PlayCircleOutlined style={{ color: colors.blue }} />}
              valueStyle={{ color: colors.blue }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>Assigned Complaints</Text>}
              value={pendingComplaints.length}
              prefix={<ExclamationCircleOutlined style={{ color: colors.primary }} />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
      </Row>

      {/* Pending Tasks Section */}
      <Card style={styles.tableCard} styles={{ body: { padding: 0 } }}>
        <div style={styles.tableHeader}>
          <Title level={5} style={{ color: colors.textPrimary, margin: 0, fontSize: 16 }}>
            Pending Tasks
          </Title>
          <Button 
            type="link" 
            size="small"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/technician/my-tasks')}
          >
            View All
          </Button>
        </div>
        {pendingTasks.length > 0 ? (
          <Table
            columns={pendingTasksColumns}
            dataSource={pendingTasks.slice(0, 5)}
            rowKey={(record) => record.Id || record.TaskId}
            pagination={false}
            size="small"
            onRow={(record) => ({
              onClick: () => navigate('/technician/my-tasks'),
              style: { cursor: 'pointer' }
            })}
          />
        ) : (
          <Empty description="No pending tasks" style={{ padding: 48 }} />
        )}
      </Card>
    </div>
  );
};

export default TechnicianDashboard;
