import React, { useState } from 'react';
import { 
  Drawer, 
  Descriptions, 
  Tag, 
  Button, 
  Typography, 
  Divider, 
  Space, 
  Select, 
  Input, 
  message 
} from 'antd';
import { useSelector } from 'react-redux';
import { selectUserPermissions } from '../../features/auth/authSelectors';
import api from '../../api/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const STATUS_COLORS = {
  Open: 'orange',
  Assigned: 'blue',
  InProgress: 'processing',
  Resolved: 'green',
  Closed: 'default',
};

const STATUS_ENUM = {
  Open: 1,
  Assigned: 2,
  InProgress: 3,
  Resolved: 4,
  Closed: 5,
};

/**
 * Get valid status transitions for technician
 * Technicians can only change:
 * - Open/Assigned → InProgress
 * - InProgress → Resolved
 */
const getValidTransitions = (currentStatus) => {
  if (currentStatus === 'Open' || currentStatus === 'Assigned') {
    return ['InProgress'];
  }
  if (currentStatus === 'InProgress') {
    return ['Resolved'];
  }
  return [];
};

const STATUS_OPTIONS = [
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

const updateComplaintStatus = async (id, data) => {
  const response = await api.put(`/api/Complaints/${id}/status`, data);
  return response.data;
};

const ComplaintDetailDrawer = ({ visible, onClose, complaint, onComplaintUpdated }) => {
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [statusNotes, setStatusNotes] = useState('');

  const permissions = useSelector(selectUserPermissions);
  const hasStatusUpdate = permissions.includes('COMPLAINT_UPDATE_STATUS');

  const handleStatusChange = async () => {
    if (!newStatus) {
      message.warning('Please select a status');
      return;
    }

    if (newStatus === 'Resolved' && !statusNotes.trim()) {
      message.warning('Please provide a resolution note');
      return;
    }

    const complaintId = complaint.ComplaintId || complaint.Id || complaint.id;

    if (!complaintId) {
      console.error('Complaint ID is missing:', complaint);
      message.error('Internal error: Complaint ID is missing');
      return;
    }

    try {
      setStatusLoading(true);
      await updateComplaintStatus(complaintId, {
        newStatus: STATUS_ENUM[newStatus],
        resolutionNote: statusNotes,
      });
      message.success(`Status updated to ${newStatus}`);
      setNewStatus(null);
      setStatusNotes('');
      if (onComplaintUpdated) onComplaintUpdated();
      onClose();
    } catch (error) {
      console.error('Status update error:', error);
      message.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const validTransitions = complaint ? getValidTransitions(complaint.Status) : [];
  const availableOptions = STATUS_OPTIONS.filter(opt => validTransitions.includes(opt.value));

  if (!complaint) return null;

  return (
    <Drawer
      title="Complaint Details"
      open={visible}
      onClose={onClose}
      width={480}
      destroyOnClose
    >
      <div>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>Complaint #{complaint.ComplaintId || complaint.Id || complaint.id}</Title>
          <Tag color={STATUS_COLORS[complaint.Status]} style={{ marginTop: 8, fontSize: 14, padding: '4px 12px' }}>
            {complaint.Status}
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
                placeholder="Add resolution note (required for Resolved)"
                rows={3}
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

        {/* Complaint Details */}
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Complaint ID">#{complaint.ComplaintId || complaint.Id || complaint.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLORS[complaint.Status]}>{complaint.Status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Customer">
            {complaint.CustomerName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            <Text style={{ whiteSpace: 'pre-wrap' }}>{complaint.Description || 'No description'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Subscription ID">
            {complaint.SubscriptionId ? `#${complaint.SubscriptionId}` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Created On">
            {complaint.CreatedOn ? dayjs(complaint.CreatedOn).format('DD MMM YYYY, hh:mm A') : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Drawer>
  );
};

export default ComplaintDetailDrawer;
