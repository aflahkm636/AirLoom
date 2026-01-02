import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { createProduct, updateProduct } from '../../../api/inventory.api';
import { selectUser } from '../../../features/auth/authSelectors';

const ProductFormModal = ({ visible, onCancel, onSuccess, product }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        Name: product.Name,
        Type: product.Type,
        Category: product.Category,
        Price: product.Price,
        QuantityInStock: product.QuantityInStock,
        ReorderLevel: product.ReorderLevel,
      });
      // Note: We don't set the image file list from existing image URL here 
      // as the backend expects a file object for updates in multipart/form-data
    } else {
      form.resetFields();
    }
    setFileList([]);
  }, [product, form, visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append('Name', (values.Name || '').trim());
      formData.append('Type', values.Type);
      formData.append('Category', (values.Category || '').trim());
      formData.append('Price', values.Price);
      formData.append('QuantityInStock', values.QuantityInStock);
      formData.append('ReorderLevel', values.ReorderLevel);
      formData.append('ActionUserId', user?.id || 1);

      // Only append the file if a new one was selected
      if (fileList.length > 0) {
        const fileToUpload = fileList[0].originFileObj || fileList[0];
        formData.append('ProductImageFile', fileToUpload);
      }

      if (product) {
        formData.append('Id', product.Id);
        await updateProduct(formData);
        message.success('Product updated successfully');
      } else {
        await createProduct(formData);
        message.success('Product created successfully');
      }

      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error) {
      console.error('Product save error:', error);
      message.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title={product ? 'Edit Product' : 'Add New Product'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="Name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="Type"
          label="Type"
          rules={[{ required: true, message: 'Please select product type' }]}
        >
          <Select placeholder="Select product type">
            <Select.Option value="Machine">Machine</Select.Option>
            <Select.Option value="Refill">Refill</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Category"
          label="Category"
          rules={[{ required: true, message: 'Please enter category' }]}
        >
          <Input placeholder="Enter category (e.g. Fragrance, Dispenser)" />
        </Form.Item>

        <Form.Item
          name="Price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" precision={2} />
        </Form.Item>

        <Form.Item
          name="QuantityInStock"
          label="Quantity In Stock"
          rules={[{ required: true, message: 'Please enter initial quantity' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
        </Form.Item>

        <Form.Item
          name="ReorderLevel"
          label="Reorder Level"
          rules={[{ required: true, message: 'Please enter reorder level' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
        </Form.Item>

        <Form.Item label="Product Image">
          <Upload {...uploadProps} listType="picture" maxCount={1}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
