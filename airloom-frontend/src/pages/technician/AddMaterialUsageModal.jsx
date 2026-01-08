import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, message, Spin } from 'antd';
import { getProducts } from '../../api/inventory.api';
import { createMaterialUsage } from '../../api/materialUsage.api';

const USAGE_TYPES = [
  { value: 'Included', label: 'Included' },
  { value: 'Extra', label: 'Extra' },
];

const AddMaterialUsageModal = ({ visible, taskId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchProducts();
      form.resetFields();
    }
  }, [visible, form]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await getProducts(1, 100);
      // Handle nested response structure: response.data.items or response.data or response.items
      let productList = [];
      if (response?.data?.items) {
        productList = response.data.items;
      } else if (response?.data && Array.isArray(response.data)) {
        productList = response.data;
      } else if (response?.items) {
        productList = response.items;
      } else if (Array.isArray(response)) {
        productList = response;
      }
      console.log('[DEBUG] Products loaded:', productList.length, productList);
      setProducts(productList);
    } catch (error) {
      console.error('Fetch products error:', error);
      message.error('Failed to load products');
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await createMaterialUsage({
        taskId: taskId,
        productId: values.productId,
        quantityUsed: values.quantityUsed,
        usageType: values.usageType,
      });

      message.success('Material usage added successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      if (error.errorFields) {
        return; // Validation error
      }
      console.error('Create material usage error:', error);
      message.error(error.response?.data?.message || 'Failed to add material usage');
    } finally {
      setLoading(false);
    }
  };

  const productOptions = products.map(p => ({
    value: p.Id,
    label: `${p.Name} (Stock: ${p.QuantityInStock || p.Quantity || 0})`,
  }));

  return (
    <Modal
      title="Add Material Usage"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Add"
      destroyOnClose
    >
      {productsLoading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: 'Please select a product' }]}
          >
            <Select
              placeholder="Select product"
              options={productOptions}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="quantityUsed"
            label="Quantity"
            rules={[
              { required: true, message: 'Please enter quantity' },
              { type: 'number', min: 1, message: 'Quantity must be at least 1' },
            ]}
          >
            <InputNumber
              placeholder="Enter quantity"
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="usageType"
            label="Usage Type"
            rules={[{ required: true, message: 'Please select usage type' }]}
          >
            <Select
              placeholder="Select usage type"
              options={USAGE_TYPES}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddMaterialUsageModal;
