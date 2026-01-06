import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tag, Spin, Typography, message, Result, Avatar, Flex } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { getEmployeeById } from '../../../api/employees.api';
import { API_BASE_URL } from '../../../utils/constants';
import dayjs from 'dayjs';

const { Title } = Typography;

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        setLoading(true);
        const response = await getEmployeeById(id);
        if (response && response.data) {
          setEmployee(response.data);
        } else if (response) {
          setEmployee(response);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Fetch employee detail error:', err);
        message.error('Failed to fetch employee details');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployeeDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <Result
        status="404"
        title="Employee Not Found"
        subTitle="Sorry, the employee you are looking for does not exist."
        extra={
          <Button type="primary" onClick={() => navigate('/admin/employees')}>
            Back to List
          </Button>
        }
      />
    );
  }


  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/employees')}
        style={{ marginBottom: '24px' }}
      >
        Back to Employees
      </Button>

      <Card styles={{ body: { padding: 'clamp(12px, 2vw, 24px)' } }}>
        <Flex gap="large" align="center" style={{ marginBottom: '24px' }} wrap="wrap">
          <Avatar 
            size={80} 
            src={employee.ProfileImage ? (employee.ProfileImage.startsWith('http') ? employee.ProfileImage : `${API_BASE_URL}/${employee.ProfileImage}`) : null} 
            icon={<UserOutlined />} 
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>{employee.UserName}</Title>
            <Typography.Text type="secondary">{employee.Email}</Typography.Text>
            <br />
            <Tag color="blue" style={{ marginTop: 8 }}>{employee.Designation || 'No Designation'}</Tag>
          </div>
        </Flex>

        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{employee.UserName}</Descriptions.Item>
          <Descriptions.Item label="Email">{employee.Email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{employee.Phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Designation">{employee.Designation || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Department">{employee.DepartmentName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Joining Date">
            {employee.JoiningDate ? dayjs(employee.JoiningDate).format('DD MMM YYYY') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Salary">
            {employee.Salary ? `₹${employee.Salary.toLocaleString()}` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={employee.Status ? 'green' : 'red'}>
              {employee.Status ? 'Active' : 'Inactive'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="User ID">{employee.UserId || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Created On">
            {employee.CreatedOn ? dayjs(employee.CreatedOn).format('DD MMM YYYY, hh:mm A') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Modified At">
            {employee.ModifiedAt ? dayjs(employee.ModifiedAt).format('DD MMM YYYY, hh:mm A') : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default EmployeeDetail;
