import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, DatePicker, InputNumber, Row, Col } from 'antd';
import { createServiceTask } from '../../../api/serviceTasks.api';

const { TextArea } = Input;

const CreateTaskModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const taskData = {
        subscriptionId: values.subscriptionId,
        complaintId: values.complaintId || null,
        taskDate: values.taskDate ? values.taskDate.toISOString() : new Date().toISOString(),
        notes: values.notes || '',
      };

      await createServiceTask(taskData);
      message.success('Service task created successfully');
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

  return (
    <Modal
      title="Create New Service Task"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Create
        </Button>,
      ]}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="subscriptionId"
              label="Subscription ID"
              rules={[{ required: true, message: 'Please enter subscription ID' }]}
            >
              <InputNumber 
                placeholder="Enter subscription ID" 
                style={{ width: '100%' }} 
                min={1}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="complaintId"
              label="Complaint ID (Optional)"
            >
              <InputNumber 
                placeholder="Enter complaint ID" 
                style={{ width: '100%' }} 
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="taskDate"
          label="Task Date"
          rules={[{ required: true, message: 'Please select task date' }]}
        >
          <DatePicker 
            showTime 
            style={{ width: '100%' }} 
            placeholder="Select task date and time"
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={3} placeholder="Enter task notes" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
