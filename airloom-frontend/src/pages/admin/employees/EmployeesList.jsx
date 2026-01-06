import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Typography, Spin, Empty, message, Flex, Avatar, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { getEmployees, deleteEmployee } from '../../../api/employees.api';
import CreateEmployeeModal from './CreateEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import { API_BASE_URL } from '../../../utils/constants';

const { Title } = Typography;

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      if (response && response.data) {
        setEmployees(response.data);
      } else if (Array.isArray(response)) {
        setEmployees(response);
      }
    } catch (error) {
      console.error('Fetch employees error:', error);
      message.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      console.error('Delete employee error:', error);
      message.error('Failed to delete employee');
    }
  };

  const handleEdit = (record) => {
    setSelectedEmployee(record);
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'ProfileImage',
      key: 'ProfileImage',
      width: 60,
      responsive: ['sm'],
      render: (url) => {
        const fullUrl = url ? (url.startsWith('http') ? url : `${API_BASE_URL}/${url}`) : null;
        return <Avatar src={fullUrl} icon={<UserOutlined />} size="small" />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'UserName',
      key: 'UserName',
      sorter: (a, b) => (a.UserName || '').localeCompare(b.UserName || ''),
      width: 140,
      fixed: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      responsive: ['md'],
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'Phone',
      responsive: ['sm'],
    },
    {
      title: 'Designation',
      dataIndex: 'Designation',
      key: 'Designation',
      responsive: ['md'],
    },
    {
      title: 'Department',
      dataIndex: 'DepartmentName',
      key: 'DepartmentName',
      responsive: ['lg'],
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      responsive: ['sm'],
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: '#1890ff' }} />}
            onClick={() => navigate(`/admin/employees/${record.Id}`)}
            title="View"
            style={{ padding: '4px 8px' }}
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#faad14' }} />}
            onClick={() => handleEdit(record)}
            title="Edit"
            style={{ padding: '4px 8px' }}
          />
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
              style={{ padding: '4px 8px' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <Flex 
        justify="space-between" 
        align="center" 
        style={{ marginBottom: '24px' }}
        wrap="wrap"
        gap="middle"
      >
        <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>Employees</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
          block={false}
          className="responsive-btn"
        >
          Add Employee
        </Button>
      </Flex>

      <Card styles={{ body: { padding: 'clamp(0px, 1vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : employees.length > 0 ? (
          <Table
            columns={columns}
            dataSource={employees}
            rowKey="Id"
            pagination={{
              responsive: true,
              pageSize: 10,
              showSizeChanger: false
            }}
            scroll={{ x: 'max-content' }}
            size={window.innerWidth < 576 ? 'small' : 'middle'}
          />
        ) : (
          <Empty description="No employees found" />
        )}
      </Card>

      <CreateEmployeeModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          fetchEmployees();
        }}
      />

      <EditEmployeeModal
        visible={editModalVisible}
        employee={selectedEmployee}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedEmployee(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setSelectedEmployee(null);
          fetchEmployees();
        }}
      />
    </div>
  );
};

export default EmployeesList;
