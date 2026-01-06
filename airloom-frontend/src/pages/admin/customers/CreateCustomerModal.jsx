import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { createCustomer } from '../../../api/customers.api';
import { selectUserId } from '../../../features/auth/authSelectors';

const CreateCustomerModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const userId = useSelector(selectUserId);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append('Name', values.Name);
      formData.append('Email', values.Email);
      formData.append('Phone', values.Phone);
      formData.append('Address', values.Address || '');
      formData.append('City', values.City || '');
      formData.append('Pincode', values.Pincode || '');
      if (values.Password) {
        formData.append('PasswordHash', values.Password);
      }
      formData.append('CreatedBy', userId);

      if (fileList.length > 0) {
        const fileToUpload = fileList[0].originFileObj || fileList[0];
        formData.append('ProfileImageFile', fileToUpload);
      }

      await createCustomer(formData);
      message.success('Customer created successfully');
      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error) {
      console.error('Create customer error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to create customer');
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title="Add New Customer"
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
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="Name"
          label="Name"
          rules={[{ required: true, message: 'Please enter customer name' }]}
        >
          <Input placeholder="Enter customer name" />
        </Form.Item>

        <Form.Item
          name="Email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="Phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item name="Address" label="Address">
          <Input.TextArea placeholder="Enter address" rows={3} />
        </Form.Item>

        <Form.Item name="City" label="City">
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item name="Pincode" label="Pincode">
          <Input placeholder="Enter pincode" />
        </Form.Item>

        <Form.Item
          name="Password"
          label="Password (Optional)"
        >
          <Input.Password placeholder="Enter password (optional)" />
        </Form.Item>

        <Form.Item label="Profile Image">
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCustomerModal;
