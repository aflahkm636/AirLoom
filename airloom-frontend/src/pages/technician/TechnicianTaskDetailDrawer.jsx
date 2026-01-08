import React, { useState, useEffect, useCallback } from 'react';
import { 
  Drawer, 
  Descriptions, 
  Tag, 
  Spin, 
  Button, 
  Typography, 
  Divider, 
  Space, 
  Select, 
  Input, 
  message, 
  List, 
  Empty, 
  Popconfirm,
  Flex 
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  PlayCircleOutlined, 
  ExclamationCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { updateTaskStatus } from '../../api/serviceTasks.api';
import { getMaterialUsageByTask, deleteMaterialUsage } from '../../api/materialUsage.api';
import { selectUserId, selectUserPermissions } from '../../features/auth/authSelectors';
import AddMaterialUsageModal from './AddMaterialUsageModal';
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

const STATUS_ENUM = {
  Pending: 1,
  Assigned: 2,
  InProgress: 3,
  AwaitingApproval: 4,
  Completed: 5,
};

/**
 * Get valid status transitions for technician
 * Technician can only: Pending/Assigned -> InProgress -> AwaitingApproval
 */
const getValidTransitions = (currentStatus) => {
  if (currentStatus === 'Pending' || currentStatus === 'Assigned') {
    return ['InProgress'];
  }
  if (currentStatus === 'InProgress') {
    return ['AwaitingApproval'];
  }
  return [];
};

const STATUS_OPTIONS = [
  { value: 'InProgress', label: 'In Progress', icon: <PlayCircleOutlined /> },
  { value: 'AwaitingApproval', label: 'Awaiting Approval', icon: <ExclamationCircleOutlined /> },
];

const TechnicianTaskDetailDrawer = ({ visible, onClose, task, onTaskUpdated }) => {
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [addMaterialVisible, setAddMaterialVisible] = useState(false);
  const [deletingMaterialId, setDeletingMaterialId] = useState(null);

  const userId = useSelector(selectUserId);
  const permissions = useSelector(selectUserPermissions);

  const hasMaterialCreate = permissions.includes('MATERIAL_USAGE_CREATE');
  const hasMaterialDelete = permissions.includes('MATERIAL_USAGE_DELETE');
  const hasStatusUpdate = permissions.includes('TASK_UPDATE_STATUS');

  // Use TaskId explicitly - the API returns TaskId, not Id
  const taskId = task?.TaskId;
  
  // Debug log to catch any issues
  if (visible && task && !taskId) {
    console.warn('Task object missing TaskId:', task);
  }

  const fetchMaterials = useCallback(async () => {
    if (!taskId) return;
    try {
      setMaterialsLoading(true);
      const response = await getMaterialUsageByTask(taskId);
      setMaterials(response?.data || []);
    } catch (error) {
      console.error('Fetch materials error:', error);
      setMaterials([]);
    } finally {
      setMaterialsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (visible && taskId) {
      fetchMaterials();
    }
  }, [visible, taskId, fetchMaterials]);

  useEffect(() => {
    if (!visible) {
      setNewStatus(null);
      setStatusNotes('');
      setMaterials([]);
    }
  }, [visible]);

  const handleStatusChange = async () => {
    if (!newStatus) {
      message.warning('Please select a status');
      return;
    }

    try {
      setStatusLoading(true);
      await updateTaskStatus(taskId, {
        id: taskId,
        status: STATUS_ENUM[newStatus],
        notes: statusNotes || '',
        employeeId: 0,  // Let SP auto-resolve from ActionUserId
      });
      message.success(`Status updated to ${newStatus}`);
      setNewStatus(null);
      setStatusNotes('');
      if (onTaskUpdated) onTaskUpdated();
    } catch (error) {
      console.error('Status update error:', error);
      message.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      setDeletingMaterialId(id);
      await deleteMaterialUsage(id);
      message.success('Material usage deleted');
      fetchMaterials();
    } catch (error) {
      console.error('Delete material error:', error);
      message.error('Failed to delete material usage');
    } finally {
      setDeletingMaterialId(null);
    }
  };

  const handleMaterialAdded = () => {
    setAddMaterialVisible(false);
    fetchMaterials();
  };

  const validTransitions = task ? getValidTransitions(task.Status) : [];
  const availableOptions = STATUS_OPTIONS.filter(opt => validTransitions.includes(opt.value));

  if (!task && !visible) return null;

  return (
    <>
      <Drawer
        title="Task Details"
        open={visible}
        onClose={onClose}
        width={520}
        destroyOnClose
      >
        {!task ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={4} style={{ margin: 0 }}>Task #{taskId}</Title>
              <Tag color={STATUS_COLORS[task.Status]} style={{ marginTop: 8, fontSize: 14, padding: '4px 12px' }}>
                {task.Status}
              </Tag>
            </div>

            <Divider />

            {/* Status Update Section */}
            {hasStatusUpdate && availableOptions.length > 0 && (
              <div style={{ padding: 16, borderRadius: 8, border: '1px solid #d9d9d9', marginBottom: 24, background: '#fafafa' }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Update Status</Text>
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
              </div>
            )}

            {/* Material Usage Section */}
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid #d9d9d9', marginBottom: 24 }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
                <Space>
                  <InboxOutlined style={{ color: '#7f13ec' }} />
                  <Text strong>Material Usage</Text>
                  <Tag>{materials.length}</Tag>
                </Space>
                {hasMaterialCreate && task.Status !== 'Completed' && (
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => setAddMaterialVisible(true)}
                  >
                    Add
                  </Button>
                )}
              </Flex>

              {materialsLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Spin size="small" />
                </div>
              ) : materials.length > 0 ? (
                <List
                  size="small"
                  dataSource={materials}
                  renderItem={(item) => (
                    <List.Item
                      style={{ padding: '8px 0' }}
                      actions={
                        hasMaterialDelete && task.Status !== 'Completed'
                          ? [
                              <Popconfirm
                                key="delete"
                                title="Delete this material usage?"
                                onConfirm={() => handleDeleteMaterial(item.Id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  loading={deletingMaterialId === item.Id}
                                />
                              </Popconfirm>,
                            ]
                          : []
                      }
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <span>{item.ProductName}</span>
                            <Tag color={item.UsageType === 'Included' ? 'green' : 'orange'}>
                              {item.UsageType}
                            </Tag>
                          </Space>
                        }
                        description={`Qty: ${item.QuantityUsed}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No materials added"
                  style={{ margin: '16px 0' }}
                />
              )}
            </div>

            {/* Task Details */}
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Task ID">#{taskId}</Descriptions.Item>
              <Descriptions.Item label="Task Date">
                {task.TaskDate ? dayjs(task.TaskDate).format('DD MMM YYYY, hh:mm A') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={STATUS_COLORS[task.Status]}>{task.Status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Your Role">
                <Tag color={task.Role === 'lead' ? 'purple' : 'blue'}>{task.Role}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Subscription ID">
                #{task.SubscriptionId}
              </Descriptions.Item>
              <Descriptions.Item label="Notes">
                <Text style={{ whiteSpace: 'pre-wrap' }}>{task.Notes || 'No notes'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Assigned On">
                {task.AssignedOn ? dayjs(task.AssignedOn).format('DD MMM YYYY, hh:mm A') : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      <AddMaterialUsageModal
        visible={addMaterialVisible}
        taskId={taskId}
        onCancel={() => setAddMaterialVisible(false)}
        onSuccess={handleMaterialAdded}
      />
    </>
  );
};

export default TechnicianTaskDetailDrawer;
