import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Upload, Button, message, Select, DatePicker, InputNumber, Switch, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { createEmployee, getDepartments } from '../../../api/employees.api';
import { selectUserId } from '../../../features/auth/authSelectors';
import dayjs from 'dayjs';

const { Option } = Select;

const CreateEmployeeModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    if (visible) {
      fetchDepartments();
    }
  }, [visible]);

  const fetchDepartments = async () => {
    try {
      setDeptLoading(true);
      const response = await getDepartments();
      if (response && response.data) {
        setDepartments(response.data);
      } else if (Array.isArray(response)) {
        setDepartments(response);
      }
    } catch (error) {
      console.error('Fetch departments error:', error);
      message.error('Failed to fetch departments');
    } finally {
      setDeptLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append('Name', values.Name);
      formData.append('Email', values.Email);
      formData.append('Phone', values.Phone);
      formData.append('Designation', values.Designation || '');
      formData.append('DepartmentId', values.DepartmentId || 0);
      formData.append('Role', values.Role || 'Staff');
      formData.append('Salary', values.Salary || 0);
      formData.append('Status', values.Status !== undefined ? values.Status : true);
      formData.append('JoiningDate', values.JoiningDate ? values.JoiningDate.toISOString() : new Date().toISOString());
      formData.append('CreatedBy', userId);
      
      if (values.Password) {
        formData.append('Password', values.Password);
      }

      if (fileList.length > 0) {
        const fileToUpload = fileList[0].originFileObj || fileList[0];
        formData.append('ProfileImageFile', fileToUpload);
      }

      await createEmployee(formData);
      message.success('Employee created successfully');
      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error) {
      console.error('Create employee error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to create employee');
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
      title="Add New Employee"
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
      width={700}
    >
      <Form form={form} layout="vertical" preserve={false} initialValues={{ Status: true }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="Name"
              label="Name"
              rules={[{ required: true, message: 'Please enter employee name' }]}
            >
              <Input placeholder="Enter employee name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="Phone"
              label="Phone"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="Password"
              label="Password (Optional)"
            >
              <Input.Password placeholder="Enter password (optional)" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="Designation" label="Designation">
              <Input placeholder="Enter designation" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              name="DepartmentId" 
              label="Department"
              rules={[{ required: true, message: 'Please select a department' }]}
            >
              <Select 
                placeholder="Select department" 
                loading={deptLoading}
              >
                {departments.map(dept => (
                  <Option key={dept.Id} value={dept.Id}>{dept.Name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item 
              name="Role" 
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
              initialValue="Staff"
            >
              <Select placeholder="Select role">
                <Option value="Staff">Staff</Option>
                <Option value="Technician">Technician</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="Salary" label="Salary">
              <InputNumber 
                placeholder="Enter salary" 
                style={{ width: '100%' }} 
                min={0}
                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₹\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="JoiningDate" label="Joining Date">
              <DatePicker style={{ width: '100%' }} placeholder="Select joining date" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="Status" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Profile Image">
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEmployeeModal;
