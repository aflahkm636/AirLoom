import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Spin, 
  Empty, 
  Avatar, 
  message,
  Input,
  Tag,
  Button,
  Space,
  Row,
  Col
} from 'antd';
import { 
  InboxOutlined, 
  SearchOutlined,
  SyncOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { getProducts, getProductById, filterProducts } from '../../api/inventory.api';
import { API_BASE_URL } from '../../utils/constants';
import ProductDetailDrawer from '../admin/inventory/ProductDetailDrawer';

const { Title, Text } = Typography;

const TechnicianProductsPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = useCallback(async (page = 1, pSize = 10, query = '') => {
    try {
      setLoading(true);
      
      let response;
      if (query) {
        const filters = {
          Name: query,
          PageNumber: page,
          PageSize: pSize
        };
        response = await filterProducts(filters);
      } else {
        response = await getProducts(page, pSize);
      }

      if (response && response.data) {
        const items = response.data.items || response.data || [];
        const pagination = response.data.pagination;
        
        setProducts(items);
        setTotalCount(pagination?.totalCount || items.length);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, pageSize, searchQuery);
  }, [fetchData, currentPage, pageSize]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    fetchData(1, pageSize, value);
  };

  const handleViewProduct = async (productId) => {
    try {
      setDetailVisible(true);
      setDetailLoading(true);
      const response = await getProductById(productId);
      setDetailProduct(response.data || response);
    } catch (error) {
      message.error('Failed to load product details');
      setDetailVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'ProductImage',
      key: 'ProductImage',
      render: (url) => {
        const fullUrl = url ? (url.startsWith('http') ? url : `${API_BASE_URL}/${url}`) : null;
        return <Avatar shape="square" size={48} src={fullUrl} icon={<InboxOutlined />} />;
      },
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
      responsive: ['md'],
      render: (type) => (
        <Tag color={type === 'Machine' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'Category',
      responsive: ['lg'],
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: 'In Stock',
      dataIndex: 'QuantityInStock',
      key: 'QuantityInStock',
      render: (qty, record) => (
        <Text 
          strong 
          style={{ color: qty <= record.ReorderLevel ? '#ff4d4f' : '#52c41a' }}
        >
          {qty}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewProduct(record.Id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container" style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }} gutter={[16, 16]}>
        <Col>
          <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>
            Products
          </Title>
        </Col>
        <Col>
          <Space wrap>
            <Input.Search
              placeholder="Search products..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 'clamp(180px, 30vw, 300px)' }}
              prefix={<SearchOutlined />}
            />
            <Button
              icon={<SyncOutlined />}
              onClick={() => fetchData(currentPage, pageSize, searchQuery)}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>

      <Card styles={{ body: { padding: 'clamp(12px, 2vw, 24px)' } }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : products.length > 0 ? (
          <Table
            columns={columns}
            dataSource={products}
            rowKey="Id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalCount,
              onChange: (page, pSize) => {
                setCurrentPage(page);
                setPageSize(pSize);
              },
              showSizeChanger: true,
              responsive: true,
            }}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        ) : (
          <Empty description="No products found" style={{ padding: 48 }} />
        )}
      </Card>

      <ProductDetailDrawer
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        loading={detailLoading}
        data={detailProduct}
        // No edit button for technicians - read-only
      />
    </div>
  );
};

export default TechnicianProductsPage;
