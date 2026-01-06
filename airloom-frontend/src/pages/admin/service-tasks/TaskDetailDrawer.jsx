import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Descriptions, Tag, Spin, Button, Typography, Divider, Space, Select, Input, message, List, Avatar, Popconfirm, Empty, Flex } from 'antd';
import { EditOutlined, CheckCircleOutlined, ClockCircleOutlined, PlayCircleOutlined, ExclamationCircleOutlined, UserOutlined, UserAddOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { updateTaskStatus, getTaskAssignments, removeTaskAssignment } from '../../../api/serviceTasks.api';
import { selectUserId, selectUserRole } from '../../../features/auth/authSelectors';
import AssignTechnicianModal from './AssignTechnicianModal';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const STATUS_COLORS = {
  Pending: 'orange',
  Assigned: 'blue',
  InProgress: 'processing',
  AwaitingApproval: 'purple',
  Completed: 'green',
};

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending', icon: <ClockCircleOutlined /> },
  { value: 'Assigned', label: 'Assigned', icon: <UserOutlined /> },
  { value: 'InProgress', label: 'In Progress', icon: <PlayCircleOutlined /> },
  { value: 'AwaitingApproval', label: 'Awaiting Approval', icon: <ExclamationCircleOutlined /> },
  { value: 'Completed', label: 'Completed', icon: <CheckCircleOutlined /> },
];

const ROLE_COLORS = {
  lead: 'purple',
  helper: 'blue',
};

/**
 * Get valid status transitions based on current status and user role
 */
const getValidTransitions = (currentStatus, userRole) => {
  const role = userRole?.toLowerCase();
  
  if (role === 'technician') {
    if (currentStatus === 'Pending') return ['InProgress'];
    if (currentStatus === 'InProgress') return ['AwaitingApproval'];
    return [];
  }
  
  if (role === 'admin' || role === 'staff') {
    switch (currentStatus) {
      case 'Pending':
        return ['Assigned', 'InProgress'];
      case 'Assigned':
        return ['Pending', 'InProgress'];
      case 'InProgress':
        return ['Pending', 'Assigned', 'AwaitingApproval'];
      case 'AwaitingApproval':
        return ['Completed', 'InProgress'];
      case 'Completed':
        return [];
      default:
        return [];
    }
  }
  
  return [];
};

const TaskDetailDrawer = ({ visible, onClose, loading, data, onEdit, onStatusChange, onRefreshTask }) => {
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [removingAssignmentId, setRemovingAssignmentId] = useState(null);
  
  const userId = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);

  const STATUS_ENUM = {
    Pending: 1,
    Assigned: 2,
    InProgress: 3,
    AwaitingApproval: 4,
    Completed: 5,
  };

  const fetchAssignments = useCallback(async () => {
    if (!data?.Id) return;
    try {
      setAssignmentsLoading(true);
      const response = await getTaskAssignments(data.Id);
      setAssignments(response?.data || response || []);
    } catch (error) {
      console.error('Fetch assignments error:', error);
      // Don't show error message, just set empty assignments
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  }, [data?.Id]);

  useEffect(() => {
    if (visible && data?.Id) {
      fetchAssignments();
    }
  }, [visible, data?.Id, fetchAssignments]);

  useEffect(() => {
    if (!visible) {
      setNewStatus(null);
      setStatusNotes('');
      setAssignments([]);
    }
  }, [visible]);

  const handleStatusChange = async () => {
    if (!newStatus) {
      message.warning('Please select a status');
      return;
    }

    try {
      setStatusLoading(true);
      const statusEnumValue = STATUS_ENUM[newStatus];
      
      await updateTaskStatus(data.Id, {
        id: data.Id,
        status: statusEnumValue,
        notes: statusNotes || '',
        employeeId: parseInt(userId, 10) || 0,
      });
      message.success(`Status updated to ${newStatus}`);
      setNewStatus(null);
      setStatusNotes('');
      if (onStatusChange) onStatusChange();
      if (onRefreshTask) onRefreshTask();
    } catch (error) {
      console.error('Status update error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update status';
      message.error(errorMsg);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    try {
      setRemovingAssignmentId(assignmentId);
      await removeTaskAssignment(assignmentId);
      message.success('Technician removed from task');
      fetchAssignments();
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error('Remove assignment error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to remove assignment';
      message.error(errorMsg);
    } finally {
      setRemovingAssignmentId(null);
      if (onRefreshTask) onRefreshTask();
    }
  };

  const handleAssignSuccess = () => {
    setAssignModalVisible(false);
    fetchAssignments();
    if (onStatusChange) onStatusChange();
    if (onRefreshTask) onRefreshTask();
  };

  const validTransitions = data ? getValidTransitions(data.Status, userRole) : [];
  const availableOptions = STATUS_OPTIONS.filter(opt => validTransitions.includes(opt.value));
  const assignedEmployeeIds = assignments.map(a => a.EmployeeId);
  const isAdmin = userRole?.toLowerCase() === 'admin' || userRole?.toLowerCase() === 'staff';

  if (!data && !loading) {
    return null;
  }

  return (
    <>
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Task Details</span>
            {data && (
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => onEdit(data)}
                size="small"
              >
                Edit
              </Button>
            )}
          </div>
        }
        open={visible}
        onClose={onClose}
        width={560}
        destroyOnClose
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : data ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={4} style={{ margin: 0 }}>Task #{data.Id}</Title>
              <Tag color={STATUS_COLORS[data.Status]} style={{ marginTop: 8, fontSize: 14, padding: '4px 12px' }}>
                {data.Status}
              </Tag>
            </div>

            <Divider />

            {/* Assigned Technicians Section */}
            <StatusCard style={{ marginBottom: 24 }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
                <Space>
                  <TeamOutlined style={{ color: '#7f13ec' }} />
                  <Text strong>Assigned Technicians</Text>
                  <Tag>{assignments.length}</Tag>
                </Space>
                {isAdmin && data.Status !== 'Completed' && (
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<UserAddOutlined />}
                    onClick={() => setAssignModalVisible(true)}
                  >
                    Assign
                  </Button>
                )}
              </Flex>

              {assignmentsLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Spin size="small" />
                </div>
              ) : assignments.length > 0 ? (
                <List
                  size="small"
                  dataSource={assignments}
                  renderItem={(item) => (
                    <List.Item
                      style={{ padding: '8px 0' }}
                      actions={
                        isAdmin && data.Status !== 'Completed'
                          ? [
                              <Popconfirm
                                key="remove"
                                title="Remove Assignment"
                                description="Remove this technician from the task?"
                                onConfirm={() => handleRemoveAssignment(item.Id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  loading={removingAssignmentId === item.Id}
                                />
                              </Popconfirm>,
                            ]
                          : []
                      }
                    >
                      <List.Item.Meta
                        avatar={<Avatar size="small" icon={<UserOutlined />} />}
                        title={
                          <Space>
                            <span>{item.EmployeeName}</span>
                            <Tag color={ROLE_COLORS[item.Role] || 'default'} style={{ margin: 0 }}>
                              {item.Role}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Assigned: {dayjs(item.AssignedOn).format('DD MMM YYYY, hh:mm A')}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No technicians assigned"
                  style={{ margin: '16px 0' }}
                />
              )}
            </StatusCard>

            {/* Status Change Section */}
            {availableOptions.length > 0 ? (
              <StatusCard style={{ marginBottom: 24, background: '#fafafa' }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Change Status</Text>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Select
                    placeholder="Select new status"
                    style={{ width: '100%' }}
                    value={newStatus}
                    onChange={setNewStatus}
                    options={availableOptions}
                  />
                  <TextArea
                    placeholder="Add notes (optional)"
                    rows={2}
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                  />
                  <Button
                    type="primary"
                    block
                    loading={statusLoading}
                    onClick={handleStatusChange}
                    disabled={!newStatus}
                  >
                    Update Status
                  </Button>
                </Space>
              </StatusCard>
            ) : (
              <StatusCard style={{ marginBottom: 24, background: '#f5f5f5' }}>
                <Text type="secondary">
                  {data.Status === 'Completed' 
                    ? 'This task is completed.' 
                    : 'No status changes available for your role.'}
                </Text>
              </StatusCard>
            )}

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Task ID">
                #{data.Id}
              </Descriptions.Item>
              <Descriptions.Item label="Task Date">
                {data.TaskDate ? dayjs(data.TaskDate).format('DD MMM YYYY, hh:mm A') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={STATUS_COLORS[data.Status]}>
                  {data.Status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Subscription ID">
                #{data.SubscriptionId}
              </Descriptions.Item>
              <Descriptions.Item label="Complaint ID">
                {data.ComplaintId ? `#${data.ComplaintId}` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Notes">
                <Text style={{ whiteSpace: 'pre-wrap' }}>{data.Notes || 'No notes'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Requires Material">
                <Tag color={data.RequiresMaterialUsage ? 'blue' : 'default'}>
                  {data.RequiresMaterialUsage ? 'Yes' : 'No'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {data.CreatedBy || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Created On">
                {data.CreatedOn ? dayjs(data.CreatedOn).format('DD MMM YYYY, hh:mm A') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Modified">
                {data.ModifiedAt ? dayjs(data.ModifiedAt).format('DD MMM YYYY, hh:mm A') : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : null}
      </Drawer>

      <AssignTechnicianModal
        visible={assignModalVisible}
        taskId={data?.Id}
        onCancel={() => setAssignModalVisible(false)}
        onSuccess={handleAssignSuccess}
        assignedEmployeeIds={assignedEmployeeIds}
      />
    </>
  );
};

// Card component for status section
const StatusCard = ({ children, style }) => (
  <div style={{ padding: 16, borderRadius: 8, border: '1px solid #d9d9d9', ...style }}>
    {children}
  </div>
);

export default TaskDetailDrawer;
