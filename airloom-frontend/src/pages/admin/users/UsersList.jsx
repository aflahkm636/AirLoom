import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Typography, Spin, Empty, message, Flex, Avatar } from 'antd';
import { EyeOutlined, EditOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { getAllUsers, getRoleName, getRoleValue } from '../../../api/users.api';
import { API_BASE_URL } from '../../../utils/constants';
import UserDetailDrawer from './UserDetailDrawer';
import UpdateRoleModal from './UpdateRoleModal';

const { Title } = Typography;

// Color mapping for role tags
const ROLE_COLORS = {
  Admin: 'purple',
  Staff: 'blue',
  Technician: 'cyan',
  Customer: 'green',
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response && response.data) {
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        setUsers(response);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      message.error(errorMessage);
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (record) => {
    setSelectedUser(record);
    setDetailDrawerVisible(true);
  };

  const handleUpdateRole = (record) => {
    setSelectedUser(record);
    setRoleModalVisible(true);
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'ProfileImage',
      key: 'ProfileImage',
      width: 60,
      responsive: ['sm'],
      render: (url) => {
        const fullUrl = url ? (url.startsWith('http') ? url : `${API_BASE_URL}/${url}`) : null;
        return <Avatar src={fullUrl} icon={<UserOutlined />} size="small" />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      sorter: (a, b) => (a.Name || '').localeCompare(b.Name || ''),
      width: 160,
      fixed: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      responsive: ['md'],
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'Phone',
      responsive: ['sm'],
      render: (phone) => phone || '-',
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
      width: 120,
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'Staff', value: 'Staff' },
        { text: 'Technician', value: 'Technician' },
        { text: 'Customer', value: 'Customer' },
      ],
      onFilter: (value, record) => record.Role === value,
      render: (role) => (
        <Tag color={ROLE_COLORS[role] || 'default'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      responsive: ['sm'],
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.Status === value,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: '#1890ff' }} />}
            onClick={() => handleView(record)}
            title="View Details"
            style={{ padding: '4px 8px' }}
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#faad14' }} />}
            onClick={() => handleUpdateRole(record)}
            title="Update Role"
            style={{ padding: '4px 8px' }}
          />
        </Space>
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
        <Flex align="center" gap="middle">
          <TeamOutlined style={{ fontSize: 28, color: '#a855f7' }} />
          <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>
            User Management
          </Title>
        </Flex>
      </Flex>

      <Card styles={{ body: { padding: 'clamp(0px, 1vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : users.length > 0 ? (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="Id"
            pagination={{
              responsive: true,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            }}
            scroll={{ x: 'max-content' }}
            size={window.innerWidth < 576 ? 'small' : 'middle'}
          />
        ) : (
          <Empty description="No users found" />
        )}
      </Card>

      {/* User Detail Drawer */}
      <UserDetailDrawer
        visible={detailDrawerVisible}
        user={selectedUser}
        onClose={() => {
          setDetailDrawerVisible(false);
          setSelectedUser(null);
        }}
      />

      {/* Update Role Modal */}
      <UpdateRoleModal
        visible={roleModalVisible}
        user={selectedUser}
        onCancel={() => {
          setRoleModalVisible(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          setRoleModalVisible(false);
          setSelectedUser(null);
          fetchUsers();
        }}
      />
    </div>
  );
};

export default UsersList;
