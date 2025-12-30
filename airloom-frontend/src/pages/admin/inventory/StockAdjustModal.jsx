import React, { useState } from 'react';
import { Modal, Form, InputNumber, message } from 'antd';
import { increaseStock, decreaseStock } from '../../../api/inventory.api';

const StockAdjustModal = ({ visible, onCancel, onSuccess, product, type }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (type === 'increase') {
        await increaseStock(product.Id, values.quantity);
      } else {
        await decreaseStock(product.Id, values.quantity);
      }

      message.success(`Stock ${type === 'increase' ? 'increased' : 'decreased'} successfully`);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Stock adjustment error:', error);
      message.error(error.response?.data?.message || `Failed to ${type} stock`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${type === 'increase' ? 'Increase' : 'Decrease'} Stock - ${product?.Name}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[
            { required: true, message: 'Please enter quantity' },
            { type: 'number', min: 1, message: 'Quantity must be at least 1' }
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Enter quantity" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StockAdjustModal;
