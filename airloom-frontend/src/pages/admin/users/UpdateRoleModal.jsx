import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { updateUserRole, ROLE_OPTIONS, getRoleValue } from '../../../api/users.api';

const { Text } = Typography;

const UpdateRoleModal = ({ visible, user, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Set form values when user changes
  useEffect(() => {
    if (user && visible) {
      const currentRoleValue = getRoleValue(user.Role);
      form.setFieldsValue({
        name: user.Name,
        email: user.Email,
        currentRole: user.Role,
        newRole: currentRoleValue,
      });
    }
  }, [user, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Check if role actually changed
      const currentRoleValue = getRoleValue(user.Role);
      if (values.newRole === currentRoleValue) {
        message.info('No changes made to the role');
        onCancel();
        return;
      }

      setLoading(true);
      
      const response = await updateUserRole({
        Id: user.Id,
        Role: values.newRole, // Send integer: 0=Staff, 1=Customer, 2=Technician, 3=Admin
      });

      if (response.statusCode === 200) {
        message.success('User role updated successfully!');
        onSuccess();
      } else {
        message.error(response.message || 'Failed to update role');
      }
    } catch (error) {
      // Show exact backend error message
      const errorMessage = error.response?.data?.message || 'Failed to update role';
      message.error(errorMessage);
      console.error('Update role error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Update User Role"
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={handleSubmit}
          style={{
            background: 'linear-gradient(135deg, #7f13ec, #9333ea)',
            border: 'none',
          }}
        >
          {loading ? 'Updating...' : 'Update Role'}
        </Button>,
      ]}
      styles={{
        header: {
          background: '#182430',
          borderBottom: '1px solid #2a3744',
        },
        body: {
          background: '#182430',
          padding: '24px',
        },
        footer: {
          background: '#182430',
          borderTop: '1px solid #2a3744',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        {/* Name (Read-only) */}
        <Form.Item
          name="name"
          label={<span style={{ color: '#fff' }}>Name</span>}
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
            disabled
            style={{ 
              background: 'rgba(42, 36, 51, 0.3)',
              cursor: 'not-allowed',
            }}
          />
        </Form.Item>

        {/* Email (Read-only) */}
        <Form.Item
          name="email"
          label={<span style={{ color: '#fff' }}>Email</span>}
        >
          <Input
            prefix={<MailOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
            disabled
            style={{ 
              background: 'rgba(42, 36, 51, 0.3)',
              cursor: 'not-allowed',
            }}
          />
        </Form.Item>

        {/* Current Role (Read-only) */}
        <Form.Item
          name="currentRole"
          label={<span style={{ color: '#fff' }}>Current Role</span>}
        >
          <Input
            prefix={<SafetyOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
            disabled
            style={{ 
              background: 'rgba(42, 36, 51, 0.3)',
              cursor: 'not-allowed',
            }}
          />
        </Form.Item>

        <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

        {/* New Role Dropdown */}
        <Form.Item
          name="newRole"
          label={<span style={{ color: '#fff' }}>New Role</span>}
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select
            placeholder="Select new role"
            options={ROLE_OPTIONS}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Text type="secondary" style={{ fontSize: 12 }}>
          Changing a user's role will affect their access permissions throughout the system.
        </Text>
      </Form>
    </Modal>
  );
};

export default UpdateRoleModal;
