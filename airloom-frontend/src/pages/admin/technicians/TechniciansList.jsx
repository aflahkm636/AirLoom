import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Typography, Spin, Empty, message, Flex, Avatar, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { getActiveTechnicians } from '../../../api/technicians.api';
import { API_BASE_URL } from '../../../utils/constants';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const TechniciansList = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const response = await getActiveTechnicians();
      if (response && response.data) {
        setTechnicians(response.data);
      } else if (Array.isArray(response)) {
        setTechnicians(response);
      }
    } catch (error) {
      console.error('Fetch technicians error:', error);
      message.error('Failed to fetch technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'ProfileImage',
      key: 'ProfileImage',
      width: 60,
      responsive: ['sm'],
      render: (url) => {
        const fullUrl = url && url !== 'string' ? (url.startsWith('http') ? url : `${API_BASE_URL}/${url}`) : null;
        return <Avatar src={fullUrl} icon={<UserOutlined />} size="small" />;
      },
    },
    {
      title: 'Technician',
      dataIndex: 'TechnicianName',
      key: 'TechnicianName',
      sorter: (a, b) => (a.TechnicianName || '').localeCompare(b.TechnicianName || ''),
      width: 160,
      fixed: 'left',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.Designation || 'Technician'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      responsive: ['md'],
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space size="small">
            <MailOutlined style={{ color: '#8c8c8c' }} />
            <Text style={{ fontSize: '13px' }}>{record.Email}</Text>
          </Space>
          <Space size="small">
            <PhoneOutlined style={{ color: '#8c8c8c' }} />
            <Text style={{ fontSize: '13px' }}>{record.Phone || 'N/A'}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'DepartmentName',
      key: 'DepartmentName',
      responsive: ['lg'],
      render: (dept) => (
        <Tag color="purple">{dept || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'JoiningDate',
      key: 'JoiningDate',
      responsive: ['xl'],
      render: (date) => date ? dayjs(date).format('DD MMM YYYY') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      responsive: ['sm'],
      width: 100,
      render: (status) => (
        <Badge 
          status={status ? 'success' : 'error'} 
          text={status ? 'Active' : 'Inactive'} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/technicians/${record.EmployeeId}`)}
          size="small"
        >
          View
        </Button>
      ),
    },
  ];

  // Responsive card view for mobile
  const renderMobileCard = (technician) => (
    <Card
      key={technician.EmployeeId}
      hoverable
      style={{ marginBottom: 12 }}
      onClick={() => navigate(`/admin/technicians/${technician.EmployeeId}`)}
    >
      <Flex gap="middle" align="center">
        <Avatar
          size={48}
          src={
            technician.ProfileImage && technician.ProfileImage !== 'string'
              ? technician.ProfileImage.startsWith('http')
                ? technician.ProfileImage
                : `${API_BASE_URL}/${technician.ProfileImage}`
              : null
          }
          icon={<UserOutlined />}
        />
        <Flex vertical flex={1}>
          <Text strong>{technician.TechnicianName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {technician.Designation || 'Technician'}
          </Text>
          <Flex gap="small" style={{ marginTop: 4 }}>
            <Tag color="purple" style={{ margin: 0 }}>{technician.DepartmentName || 'N/A'}</Tag>
            <Badge status={technician.Status ? 'success' : 'error'} text={technician.Status ? 'Active' : 'Inactive'} />
          </Flex>
        </Flex>
        <EyeOutlined style={{ fontSize: 18, color: '#7f13ec' }} />
      </Flex>
    </Card>
  );

  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <Flex 
        justify="space-between" 
        align="center" 
        style={{ marginBottom: '24px' }}
        wrap="wrap"
        gap="middle"
      >
        <div>
          <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>
            Technicians
          </Title>
          <Text type="secondary">
            {technicians.length} active technician{technicians.length !== 1 ? 's' : ''}
          </Text>
        </div>
      </Flex>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : technicians.length > 0 ? (
        <>
          {/* Desktop/Tablet Table View */}
          <Card 
            styles={{ body: { padding: 'clamp(0px, 1vw, 24px)' } }}
            className="hide-on-mobile"
          >
            <Table
              columns={columns}
              dataSource={technicians}
              rowKey="EmployeeId"
              pagination={{
                responsive: true,
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} technicians`,
              }}
              scroll={{ x: 'max-content' }}
              size={window.innerWidth < 768 ? 'small' : 'middle'}
              onRow={(record) => ({
                style: { cursor: 'pointer' },
                onClick: () => navigate(`/admin/technicians/${record.EmployeeId}`),
              })}
            />
          </Card>

          {/* Mobile Card View */}
          <div className="show-on-mobile">
            {technicians.map(renderMobileCard)}
          </div>
        </>
      ) : (
        <Card>
          <Empty 
            description="No active technicians found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}

      <style>{`
        .hide-on-mobile {
          display: block;
        }
        .show-on-mobile {
          display: none;
        }
        @media (max-width: 576px) {
          .hide-on-mobile {
            display: none;
          }
          .show-on-mobile {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default TechniciansList;
