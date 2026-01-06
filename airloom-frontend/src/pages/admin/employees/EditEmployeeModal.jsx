import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, InputNumber, Switch, Row, Col, Select } from 'antd';
import { updateEmployee, getDepartments } from '../../../api/employees.api';

const { Option } = Select;

const EditEmployeeModal = ({ visible, employee, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);

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

  useEffect(() => {
    if (employee && visible) {
      form.setFieldsValue({
        Designation: employee.Designation,
        DepartmentId: employee.DepartmentId,
        Salary: employee.Salary,
        Status: employee.Status,
        Role: employee.Role,
      });
    }
  }, [employee, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updateData = {
        id: employee.Id,
        designation: values.Designation !== undefined ? values.Designation : employee.Designation || '',
        departmentId: values.DepartmentId !== undefined ? values.DepartmentId : employee.DepartmentId || 0,
        salary: values.Salary !== undefined ? values.Salary : employee.Salary || 0,
        status: values.Status !== undefined ? values.Status : employee.Status,
        role: values.Role || employee.Role || 'Staff',
      };

      await updateEmployee(updateData);
      message.success('Employee updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Update employee error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to update employee');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Employee"
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
      width={500}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <div style={{ marginBottom: 16, padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
          <strong>{employee?.UserName}</strong>
          <br />
          <span style={{ color: '#666' }}>{employee?.Email}</span>
        </div>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="Designation" label="Designation">
              <Input placeholder="Enter designation" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              name="DepartmentId" 
              label="Department (Optional)"
            >
              <Select 
                placeholder="Select department" 
                loading={deptLoading}
                allowClear
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
          <Col xs={24} sm={12}>
            <Form.Item name="Role" label="Role">
              <Select placeholder="Select role">
                <Option value="Staff">Staff</Option>
                <Option value="Technician">Technician</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="Status" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditEmployeeModal;
