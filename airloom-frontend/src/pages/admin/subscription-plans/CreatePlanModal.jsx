import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, InputNumber, Switch, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { createSubscriptionPlan } from '../../../api/subscriptionPlans.api';
import { selectUserId } from '../../../features/auth/authSelectors';

const { TextArea } = Input;

const CreatePlanModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = useSelector(selectUserId);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const planData = {
        name: values.name,
        description: values.description || '',
        serviceFrequencyInDays: values.serviceFrequencyInDays || 30,
        billingCycleInMonths: values.billingCycleInMonths || 1,
        pricePerCycle: values.pricePerCycle || 0,
        isActive: values.isActive !== undefined ? values.isActive : true,
        createdBy: parseInt(userId, 10) || 0,
      };

      await createSubscriptionPlan(planData);
      message.success('Subscription plan created successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Create plan error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to create subscription plan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Subscription Plan"
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
      width={600}
    >
      <Form 
        form={form} 
        layout="vertical" 
        preserve={false} 
        initialValues={{ isActive: true, serviceFrequencyInDays: 30, billingCycleInMonths: 1 }}
      >
        <Form.Item
          name="name"
          label="Plan Name"
          rules={[{ required: true, message: 'Please enter plan name' }]}
        >
          <Input placeholder="Enter plan name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={3} placeholder="Enter plan description" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="serviceFrequencyInDays"
              label="Service Frequency (Days)"
              rules={[{ required: true, message: 'Please enter service frequency' }]}
            >
              <InputNumber 
                placeholder="e.g., 30" 
                style={{ width: '100%' }} 
                min={1}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="billingCycleInMonths"
              label="Billing Cycle (Months)"
              rules={[{ required: true, message: 'Please enter billing cycle' }]}
            >
              <InputNumber 
                placeholder="e.g., 1" 
                style={{ width: '100%' }} 
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="pricePerCycle"
              label="Price Per Cycle"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber 
                placeholder="Enter price" 
                style={{ width: '100%' }} 
                min={0}
                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₹\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="isActive" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreatePlanModal;
