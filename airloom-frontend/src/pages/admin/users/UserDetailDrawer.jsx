import React from 'react';
import { Drawer, Descriptions, Avatar, Tag, Divider, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '../../../utils/constants';

const { Title } = Typography;

// Color mapping for role tags
const ROLE_COLORS = {
  Admin: 'purple',
  Staff: 'blue',
  Technician: 'cyan',
  Customer: 'green',
};

const UserDetailDrawer = ({ visible, user, onClose }) => {
  if (!user) return null;

  const profileImageUrl = user.ProfileImage
    ? (user.ProfileImage.startsWith('http') ? user.ProfileImage : `${API_BASE_URL}/${user.ProfileImage}`)
    : null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Drawer
      title="User Details"
      placement="right"
      onClose={onClose}
      open={visible}
      width={450}
      styles={{
        header: {
          background: '#182430',
          borderBottom: '1px solid #2a3744',
        },
        body: {
          background: '#182430',
          padding: '24px',
        },
      }}
    >
      {/* Profile Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar
          size={96}
          src={profileImageUrl}
          icon={!profileImageUrl && <UserOutlined />}
          style={{
            background: profileImageUrl ? 'transparent' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
            border: '4px solid #2a3744',
          }}
        />
        <Title level={4} style={{ margin: '16px 0 4px', color: '#fff' }}>
          {user.Name}
        </Title>
        <Tag color={ROLE_COLORS[user.Role] || 'default'} style={{ fontSize: 14 }}>
          {user.Role}
        </Tag>
      </div>

      <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

      {/* User Information */}
      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 120 }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="User ID">{user.Id}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.Email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.Phone || '-'}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={user.Status ? 'green' : 'red'}>
            {user.Status ? 'Active' : 'Inactive'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

      {/* Timestamps */}
      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 120 }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="Created On">{formatDate(user.CreatedOn)}</Descriptions.Item>
        <Descriptions.Item label="Modified At">{formatDate(user.ModifiedAt)}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default UserDetailDrawer;
