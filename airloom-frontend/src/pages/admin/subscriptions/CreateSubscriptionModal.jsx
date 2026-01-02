import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, DatePicker, message, Spin } from 'antd';
import { getCustomers } from '../../../api/customers.api';
import { getSubscriptionPlans, createSubscription } from '../../../api/subscriptions.api';
import { getProducts } from '../../../api/inventory.api';

const CreateSubscriptionModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    try {
      setInitialLoading(true);
      const [customersRes, plansRes, productsRes] = await Promise.all([
        getCustomers(),
        getSubscriptionPlans(),
        getProducts(1, 100) // Fetch machines
      ]);
      setCustomers(customersRes.data || customersRes || []);
      setPlans(plansRes.data || plansRes || []);
      // Filter only Machine type products
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
      
      // Use camelCase keys to match backend expectations
      const payload = {
        customerId: values.CustomerId,
        planId: values.PlanId,
        machineProductId: values.MachineProductId,
        startDate: values.StartDate.toISOString(),
      };

      await createSubscription(payload);
      message.success('Subscription created successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Subscription"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
    >
      <Spin spinning={initialLoading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="CustomerId"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer' }]}
          >
            <Select
              showSearch
              placeholder="Select a customer"
              optionFilterProp="children"
            >
              {customers.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.name || c.email} (ID: {c.id})</Select.Option>
              ))}
            </Select>
          </Form.Item>

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
            name="StartDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select a start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
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
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateSubscriptionModal;
