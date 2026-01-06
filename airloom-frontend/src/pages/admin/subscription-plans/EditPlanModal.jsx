import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, InputNumber, Switch, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { updateSubscriptionPlan } from '../../../api/subscriptionPlans.api';
import { selectUserId } from '../../../features/auth/authSelectors';

const { TextArea } = Input;

const EditPlanModal = ({ visible, plan, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    if (plan && visible) {
      form.setFieldsValue({
        name: plan.Name,
        description: plan.Description,
        serviceFrequencyInDays: plan.ServiceFrequencyInDays,
        billingCycleInMonths: plan.BillingCycleInMonths,
        pricePerCycle: plan.PricePerCycle,
        isActive: plan.IsActive,
      });
    }
  }, [plan, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updateData = {
        id: plan.Id,
        description: values.description !== undefined ? values.description : plan.Description,
        serviceFrequencyInDays: values.serviceFrequencyInDays !== undefined ? values.serviceFrequencyInDays : plan.ServiceFrequencyInDays,
        billingCycleInMonths: values.billingCycleInMonths !== undefined ? values.billingCycleInMonths : plan.BillingCycleInMonths,
        pricePerCycle: values.pricePerCycle !== undefined ? values.pricePerCycle : plan.PricePerCycle,
        isActive: values.isActive !== undefined ? values.isActive : plan.IsActive,
        modifiedBy: parseInt(userId, 10) || 0,
      };

      await updateSubscriptionPlan(plan.Id, updateData);
      message.success('Subscription plan updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Update plan error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to update subscription plan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Subscription Plan"
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
      width={600}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <div style={{ marginBottom: 16, padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
          <strong>{plan?.Name}</strong>
        </div>

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

export default EditPlanModal;
