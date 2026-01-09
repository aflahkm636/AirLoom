import React, { useState } from 'react';
import { 
  Drawer, 
  Descriptions, 
  Tag, 
  Button, 
  Typography, 
  Divider, 
  Spin,
  Space,
  Select,
  Input,
  message
} from 'antd';
import { useSelector } from 'react-redux';
import { selectUserPermissions } from '../../../features/auth/authSelectors';
import api from '../../../api/api';
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
 * Get valid status transitions for Admin
 * Admins can change to any status
 */
const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Closed', label: 'Closed' },
];

const updateComplaintStatus = async (id, data) => {
  const response = await api.put(`/api/Complaints/${id}/status`, data);
  return response.data;
};

const ComplaintDetailDrawer = ({ visible, onClose, loading, complaint, onComplaintUpdated }) => {
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
      message.error('Complaint ID is missing');
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

  if (!visible) return null;

  return (
    <Drawer
      title="Complaint Details"
      open={visible}
      onClose={onClose}
      width={500}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : complaint ? (
        <div>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0 }}>Complaint #{complaint.ComplaintId || complaint.Id || complaint.id}</Title>
            <Tag 
              color={STATUS_COLORS[complaint.Status]} 
              style={{ marginTop: 8, fontSize: 14, padding: '4px 12px' }}
            >
              {complaint.Status}
            </Tag>
          </div>

          <Divider />

          {/* Status Update Section */}
          {hasStatusUpdate && (
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid #d9d9d9', marginBottom: 24, background: '#fafafa' }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>Update Status</Text>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Select
                  placeholder="Select new status"
                  style={{ width: '100%' }}
                  value={newStatus}
                  onChange={setNewStatus}
                  options={STATUS_OPTIONS.filter(opt => opt.value !== complaint.Status)}
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
            {complaint.UpdatedOn && (
              <Descriptions.Item label="Last Updated">
                {dayjs(complaint.UpdatedOn).format('DD MMM YYYY, hh:mm A')}
              </Descriptions.Item>
            )}
            {complaint.ResolvedOn && (
              <Descriptions.Item label="Resolved On">
                {dayjs(complaint.ResolvedOn).format('DD MMM YYYY, hh:mm A')}
              </Descriptions.Item>
            )}
            {complaint.ResolutionNote && (
              <Descriptions.Item label="Resolution Note">
                <Text type="secondary">{complaint.ResolutionNote}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Text type="secondary">No complaint data available</Text>
        </div>
      )}
    </Drawer>
  );
};

export default ComplaintDetailDrawer;
