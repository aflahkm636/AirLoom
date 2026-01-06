import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Button, message, Space, Tag, Typography, Spin, Avatar } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { getActiveTechnicians } from '../../../api/technicians.api';
import { assignTechnicianToTask } from '../../../api/serviceTasks.api';
import { API_BASE_URL } from '../../../utils/constants';

const { Text } = Typography;
const { Option } = Select;

const ROLE_OPTIONS = [
  { value: 'lead', label: 'Lead Technician', color: 'purple' },
  { value: 'helper', label: 'Helper', color: 'blue' },
];

const AssignTechnicianModal = ({ visible, taskId, onCancel, onSuccess, assignedEmployeeIds = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [fetchingTechnicians, setFetchingTechnicians] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchTechnicians();
      form.resetFields();
    }
  }, [visible, form]);

  const fetchTechnicians = async () => {
    try {
      setFetchingTechnicians(true);
      const response = await getActiveTechnicians();
      const techData = response?.data || response || [];
      // Filter out already assigned technicians
      const availableTechnicians = techData.filter(
        t => !assignedEmployeeIds.includes(t.EmployeeId)
      );
      setTechnicians(availableTechnicians);
    } catch (error) {
      console.error('Fetch technicians error:', error);
      message.error('Failed to fetch technicians');
    } finally {
      setFetchingTechnicians(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await assignTechnicianToTask({
        taskId: taskId,
        employeeId: values.employeeId,
        role: values.role,
      });
      message.success('Technician assigned successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Assign technician error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to assign technician';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Custom option render for technicians
  const renderTechnicianOption = (tech) => {
    const imageUrl = tech.ProfileImage && tech.ProfileImage !== 'string'
      ? (tech.ProfileImage.startsWith('http') ? tech.ProfileImage : `${API_BASE_URL}/${tech.ProfileImage}`)
      : null;

    return (
      <Space>
        <Avatar size="small" src={imageUrl} icon={<UserOutlined />} />
        <span>{tech.TechnicianName}</span>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          - {tech.Designation || 'Technician'}
        </Text>
      </Space>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <UserAddOutlined style={{ color: '#7f13ec' }} />
          <span>Assign Technician to Task #{taskId}</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={500}
    >
      {fetchingTechnicians ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Loading technicians...</Text>
          </div>
        </div>
      ) : technicians.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">
            {assignedEmployeeIds.length > 0
              ? 'All active technicians are already assigned to this task.'
              : 'No active technicians available.'}
          </Text>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ role: 'helper' }}
        >
          <Form.Item
            name="employeeId"
            label="Select Technician"
            rules={[{ required: true, message: 'Please select a technician' }]}
          >
            <Select
              placeholder="Choose a technician"
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              optionLabelProp="label"
            >
              {technicians.map((tech) => (
                <Option
                  key={tech.EmployeeId}
                  value={tech.EmployeeId}
                  label={tech.TechnicianName}
                >
                  {renderTechnicianOption(tech)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              {ROLE_OPTIONS.map((role) => (
                <Option key={role.value} value={role.value}>
                  <Tag color={role.color} style={{ marginRight: 8 }}>
                    {role.label}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Assign Technician
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AssignTechnicianModal;
