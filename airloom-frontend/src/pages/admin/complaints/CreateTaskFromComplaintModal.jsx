import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, DatePicker, Typography, Descriptions, Tag, Alert } from 'antd';
import { createServiceTask } from '../../../api/serviceTasks.api';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

const STATUS_COLORS = {
  Pending: 'orange',
  Open: 'blue',
  InProgress: 'processing',
  Resolved: 'green',
  Closed: 'default',
};

const CreateTaskFromComplaintModal = ({ visible, onCancel, onSuccess, complaint }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens with a new complaint
  useEffect(() => {
    if (visible && complaint) {
      form.resetFields();
      form.setFieldsValue({
        taskDate: dayjs(),
        notes: `Task created for complaint #${complaint.Id}: ${complaint.Description || ''}`.substring(0, 200),
      });
    }
  }, [visible, complaint, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const taskData = {
        subscriptionId: null, // For complaint tasks, don't pass subscriptionId
        complaintId: complaint.Id,
        taskDate: values.taskDate ? values.taskDate.toISOString() : new Date().toISOString(),
        notes: values.notes || '',
      };

      await createServiceTask(taskData);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Create task error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to create service task');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!complaint) return null;

  return (
    <Modal
      title="Create Service Task for Complaint"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Create Task
        </Button>,
      ]}
      destroyOnClose
      width={550}
    >
      {/* Complaint Summary */}
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
        message="Task will be linked to this complaint"
        description={
          <Descriptions size="small" column={1} style={{ marginTop: 8 }}>
            <Descriptions.Item label="Complaint ID">
              <Text strong>#{complaint.Id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={STATUS_COLORS[complaint.Status]}>{complaint.Status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Customer">
              {complaint.CustomerName || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Subscription ID">
              {complaint.SubscriptionId ? `#${complaint.SubscriptionId}` : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        }
      />

      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="taskDate"
          label="Task Date"
          rules={[{ required: true, message: 'Please select task date' }]}
        >
          <DatePicker 
            showTime 
            style={{ width: '100%' }} 
            placeholder="Select task date and time"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
          rules={[{ required: false }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Enter task notes..."
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskFromComplaintModal;
