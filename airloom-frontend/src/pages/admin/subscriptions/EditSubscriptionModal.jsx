import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, DatePicker, message, Spin } from 'antd';
import { getSubscriptionPlans, updateSubscription } from '../../../api/subscriptions.api';
import { getProducts } from '../../../api/inventory.api';

const EditSubscriptionModal = ({ visible, onCancel, onSuccess, subscription }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  useEffect(() => {
    if (subscription && visible) {
      form.setFieldsValue({
        PlanId: subscription.PlanId,
        MachineProductId: subscription.MachineProductId,
        Status: subscription.Status,
      });
    }
  }, [subscription, visible, form]);

  const loadData = async () => {
    try {
      setInitialLoading(true);
      const [plansRes, productsRes] = await Promise.all([
        getSubscriptionPlans(),
        getProducts(1, 100)
      ]);
      setPlans(plansRes.data || plansRes || []);
      const allProducts = productsRes.data?.items || productsRes.data || productsRes || [];
      setMachines(allProducts.filter(p => p.Type === 'Machine'));
    } catch (error) {
      message.error('Failed to load required data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const payload = {
        id: subscription.Id,
        planId: values.PlanId,
        machineProductId: values.MachineProductId,
        startDate: values.StartDate ? values.StartDate.toISOString() : subscription.StartDate,
        endDate: values.EndDate ? values.EndDate.toISOString() : null,
        status: values.Status,
        lastServiceDate: values.LastServiceDate ? values.LastServiceDate.toISOString() : null,
      };

      await updateSubscription(payload);
      message.success('Subscription updated successfully');
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Suspended', value: 'Suspended' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  return (
    <Modal
      title={`Edit Subscription #${subscription?.Id}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Spin spinning={initialLoading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="PlanId"
            label="Plan"
            rules={[{ required: true, message: 'Please select a plan' }]}
          >
            <Select placeholder="Select a plan">
              {plans.map(p => (
                <Select.Option key={p.Id} value={p.Id}>{p.Name} - ${p.Price}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="MachineProductId"
            label="Machine"
            rules={[{ required: true, message: 'Please select a machine product' }]}
          >
            <Select placeholder="Select machine product">
              {machines.map(m => (
                <Select.Option key={m.Id} value={m.Id}>{m.Name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="Status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status" options={statusOptions} />
          </Form.Item>

          <Form.Item
            name="StartDate"
            label="Start Date"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Select start date" />
          </Form.Item>

          <Form.Item
            name="EndDate"
            label="End Date"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Select end date (optional)" />
          </Form.Item>

          <Form.Item
            name="LastServiceDate"
            label="Last Service Date"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Select last service date (optional)" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditSubscriptionModal;

