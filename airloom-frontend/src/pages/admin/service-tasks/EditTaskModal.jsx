import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, DatePicker, Switch, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { updateServiceTask } from '../../../api/serviceTasks.api';
import { selectUserId } from '../../../features/auth/authSelectors';
import dayjs from 'dayjs';

const { TextArea } = Input;

const EditTaskModal = ({ visible, task, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    if (task && visible) {
      form.setFieldsValue({
        taskDate: task.TaskDate ? dayjs(task.TaskDate) : null,
        notes: task.Notes,
        requiresMaterialUsage: task.RequiresMaterialUsage !== undefined ? task.RequiresMaterialUsage : true,
      });
    }
  }, [task, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updateData = {
        id: task.Id,
        taskDate: values.taskDate ? values.taskDate.toISOString() : task.TaskDate,
        notes: values.notes !== undefined ? values.notes : task.Notes,
        requiresMaterialUsage: values.requiresMaterialUsage !== undefined ? values.requiresMaterialUsage : task.RequiresMaterialUsage,
        actionUserId: parseInt(userId, 10) || 0,
      };

      await updateServiceTask(task.Id, updateData);
      message.success('Service task updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Update task error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to update service task');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Service Task"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Update
        </Button>,
      ]}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <div style={{ marginBottom: 16, padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Task #{task?.Id}</strong>
          <br />
          <span style={{ color: '#666' }}>Subscription #{task?.SubscriptionId}</span>
        </div>

        <Form.Item
          name="taskDate"
          label="Task Date (Optional)"
        >
          <DatePicker 
            showTime 
            style={{ width: '100%' }} 
            placeholder="Select task date and time"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={3} placeholder="Enter task notes" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item 
              name="requiresMaterialUsage" 
              label="Requires Material" 
              valuePropName="checked"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditTaskModal;
