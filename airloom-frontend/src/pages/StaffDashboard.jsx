import { useState, useEffect } from 'react';
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
  Alert,
  Avatar,
  Badge
} from 'antd';
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  ToolOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { 
  selectUserPermissions, 
  selectUserName, 
  selectUserDepartmentName,
  selectUserProfileImage,
  selectUserRole
} from '../features/auth/authSelectors';
import { getComplaints } from '../api/complaints.api';
import { getServiceTasks } from '../api/serviceTasks.api';
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

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complaintsAccessDenied, setComplaintsAccessDenied] = useState(false);
  const [tasksAccessDenied, setTasksAccessDenied] = useState(false);
  
  const permissions = useSelector(selectUserPermissions);
  const userName = useSelector(selectUserName);
  const departmentName = useSelector(selectUserDepartmentName);
  const profileImage = useSelector(selectUserProfileImage);
  const userRole = useSelector(selectUserRole);

  // Profile is fetched by Header component - no need to fetch here

  // Check permissions
  const hasComplaintView = permissions.includes('COMPLAINT_VIEW');
  const hasTaskView = permissions.includes('TASK_VIEW');
  const hasEmployeeView = permissions.includes('EMPLOYEE_VIEW');
  const hasInventoryView = permissions.includes('INVENTORY_VIEW');
  const hasBillingView = permissions.includes('BILLING_VIEW');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // Fetch complaints
      if (hasComplaintView) {
        try {
          const complaintsData = await getComplaints();
          setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
        } catch (err) {
          if (err.response?.status === 403) {
            setComplaintsAccessDenied(true);
          }
          setComplaints([]);
        }
      } else {
        setComplaintsAccessDenied(true);
      }

      // Fetch tasks
      if (hasTaskView) {
        try {
          const tasksData = await getServiceTasks();
          setServiceTasks(Array.isArray(tasksData) ? tasksData : []);
        } catch (err) {
          if (err.response?.status === 403) {
            setTasksAccessDenied(true);
          }
          setServiceTasks([]);
        }
      } else {
        setTasksAccessDenied(true);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [hasComplaintView, hasTaskView]);

  const pendingComplaintsCount = complaints.filter(c => c.Status === 'Pending').length;
  const pendingTasksCount = serviceTasks.filter(t => t.Status === 'Pending' || t.Status === 'Assigned').length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toDateString();
  const todaysTasksCount = serviceTasks.filter(t => new Date(t.TaskDate).toDateString() === todayStr).length;

  const recentComplaints = complaints.filter(c => c.Status === 'Pending').slice(0, 5);
  const activeTasks = serviceTasks.filter(t => t.Status !== 'Completed').slice(0, 10);

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
      title: 'Date',
      dataIndex: 'CreatedOn',
      key: 'CreatedOn',
      width: 100,
      render: (date) => <Text style={{ color: colors.textSecondary }}>{formatDate(date)}</Text>,
    },
  ];

  const tasksColumns = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
      width: 60,
      render: (id) => <Text style={{ color: colors.textPrimary }}>#{id}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'Pending' ? 'orange' : status === 'Assigned' ? 'blue' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'TaskDate',
      key: 'TaskDate',
      width: 100,
      render: (date) => <Text style={{ color: colors.textSecondary }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Notes',
      dataIndex: 'Notes',
      key: 'Notes',
      ellipsis: true,
      render: (notes) => <Text style={{ color: colors.textSecondary }}>{notes || '-'}</Text>,
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
        {hasTaskView && (
          <Col xs={12} sm={6}>
            <div style={styles.quickLink}>
              <CalendarOutlined style={{ fontSize: 20, color: colors.primary }} />
              <Text style={{ color: colors.textPrimary }}>Tasks</Text>
            </div>
          </Col>
        )}
        {hasComplaintView && (
          <Col xs={12} sm={6}>
            <div style={styles.quickLink}>
              <FileTextOutlined style={{ fontSize: 20, color: colors.orange }} />
              <Text style={{ color: colors.textPrimary }}>Complaints</Text>
            </div>
          </Col>
        )}
        {hasEmployeeView && (
          <Col xs={12} sm={6}>
            <div style={styles.quickLink}>
              <TeamOutlined style={{ fontSize: 20, color: colors.blue }} />
              <Text style={{ color: colors.textPrimary }}>Employees</Text>
            </div>
          </Col>
        )}
        {hasInventoryView && (
          <Col xs={12} sm={6}>
            <div style={styles.quickLink}>
              <ToolOutlined style={{ fontSize: 20, color: colors.green }} />
              <Text style={{ color: colors.textPrimary }}>Inventory</Text>
            </div>
          </Col>
        )}
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>Pending Complaints</Text>}
              value={complaintsAccessDenied ? '-' : pendingComplaintsCount}
              prefix={<ExclamationCircleOutlined style={{ color: colors.orange }} />}
              valueStyle={{ color: colors.orange }}
            />
            {complaintsAccessDenied && (
              <Text type="secondary" style={{ fontSize: 12 }}>No access</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>Pending Tasks</Text>}
              value={tasksAccessDenied ? '-' : pendingTasksCount}
              prefix={<ClockCircleOutlined style={{ color: colors.blue }} />}
              valueStyle={{ color: colors.blue }}
            />
            {tasksAccessDenied && (
              <Text type="secondary" style={{ fontSize: 12 }}>No access</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={styles.statCard} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: colors.textSecondary }}>Today's Tasks</Text>}
              value={tasksAccessDenied ? '-' : todaysTasksCount}
              prefix={<CalendarOutlined style={{ color: colors.primary }} />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
      </Row>

      {/* Complaints Section */}
      {hasComplaintView && (
        <Card style={styles.tableCard} styles={{ body: { padding: 0 } }}>
          <div style={styles.tableHeader}>
            <Title level={5} style={{ color: colors.textPrimary, margin: 0, fontSize: 16 }}>
              Recent Complaints
            </Title>
          </div>
          {complaintsAccessDenied ? (
            <div style={{ padding: 24 }}>
              <Alert
                message="Access Restricted"
                description="You don't have permission to view complaints."
                type="warning"
                showIcon
              />
            </div>
          ) : recentComplaints.length > 0 ? (
            <Table
              columns={complaintsColumns}
              dataSource={recentComplaints}
              rowKey="Id"
              pagination={false}
              size="small"
            />
          ) : (
            <Empty description="No pending complaints" style={{ padding: 48 }} />
          )}
        </Card>
      )}

      {/* Tasks Section */}
      {hasTaskView && (
        <Card style={styles.tableCard} styles={{ body: { padding: 0 } }}>
          <div style={styles.tableHeader}>
            <Title level={5} style={{ color: colors.textPrimary, margin: 0, fontSize: 16 }}>
              Active Tasks
            </Title>
          </div>
          {tasksAccessDenied ? (
            <div style={{ padding: 24 }}>
              <Alert
                message="Access Restricted"
                description="You don't have permission to view tasks."
                type="warning"
                showIcon
              />
            </div>
          ) : activeTasks.length > 0 ? (
            <Table
              columns={tasksColumns}
              dataSource={activeTasks}
              rowKey="Id"
              pagination={{ pageSize: 5, size: 'small' }}
              size="small"
            />
          ) : (
            <Empty description="No active tasks" style={{ padding: 48 }} />
          )}
        </Card>
      )}

      {/* No data sections message */}
      {!hasComplaintView && !hasTaskView && (
        <Card style={styles.tableCard}>
          <Empty 
            description={
              <Text style={{ color: colors.textSecondary }}>
                Your department doesn't have access to tasks or complaints. 
                Use the sidebar to navigate to your permitted modules.
              </Text>
            } 
            style={{ padding: 48 }} 
          />
        </Card>
      )}
    </div>
  );
};

export default StaffDashboard;
