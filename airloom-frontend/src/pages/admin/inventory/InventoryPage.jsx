import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Tag, 
  Space, 
  Card, 
  Typography, 
  Spin, 
  Empty, 
  Row, 
  Col, 
  Statistic, 
  Avatar, 
  Popconfirm, 
  message,
  List,
  Badge,
  Flex,
  Input,
  Select,
  InputNumber,
  Collapse,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  WarningOutlined,
  DollarOutlined,
  InboxOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { 
  getProducts, 
  getProductById,
  deleteProduct, 
  getLowStockProducts, 
  getInventoryValue,
  filterProducts,
  increaseStock,
  decreaseStock
} from '../../../api/inventory.api';
import { API_BASE_URL } from '../../../utils/constants';
import Swal from 'sweetalert2';
import ProductFormModal from './ProductFormModal';
import ProductDetailDrawer from './ProductDetailDrawer';

const { Title, Text } = Typography;

const InventoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  
  const [inventoryValue, setInventoryValue] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = useCallback(async (page = 1, pSize = 10, query = '', type = null, minP = null, maxP = null) => {
    try {
      setLoading(true);
      
      // Construct filter object with PascalCase keys for .NET backend compatibility
      const filters = {
        Name: query || null,
        Type: type || null,
        MinPrice: minP || null,
        MaxPrice: maxP || null,
        PageNumber: page,
        PageSize: pSize
      };

      // Use filter endpoint if any filter is active
      const isFiltered = query || type || minP || maxP;
      let response;
      
      if (isFiltered) {
        response = await filterProducts(filters);
      } else {
        response = await getProducts(page, pSize);
      }

      if (response && response.data) {
        // Handle both standard and filtered response structures
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearch = (value) => {
    setCurrentPage(1);
    fetchData(1, pageSize, value, filterType, minPrice, maxPrice);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchData(1, pageSize, searchQuery, filterType, minPrice, maxPrice);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType(null);
    setMinPrice(null);
    setMaxPrice(null);
    setCurrentPage(1);
    fetchData(1, pageSize, '', null, null, null);
  };

  const fetchSummaries = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const [valueRes, lowStockRes] = await Promise.all([
        getInventoryValue(),
        getLowStockProducts()
      ]);
      setInventoryValue(valueRes?.data || 0);
      setLowStockProducts(lowStockRes?.data || []);
    } catch (error) {
      console.error('Fetch summaries error:', error);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, pageSize, searchQuery, filterType, minPrice, maxPrice);
  }, [fetchData, currentPage, pageSize, searchQuery, filterType, minPrice, maxPrice]);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4f',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e1a24',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted.',
          icon: 'success',
          background: '#1e1a24',
          color: '#fff'
        });
        fetchData(currentPage, pageSize, searchQuery);
        fetchSummaries();
      } catch (error) {
        message.error('Failed to delete product');
      }
    }
  };

  const handleStockAdjust = async (product, type) => {
    const { value: quantity } = await Swal.fire({
      title: `${type === 'increase' ? 'Increase' : 'Decrease'} Stock`,
      text: `Enter quantity to ${type} for ${product.Name}`,
      input: 'number',
      inputLabel: 'Quantity',
      inputPlaceholder: 'Enter quantity',
      showCancelButton: true,
      inputAttributes: {
        min: 1,
        step: 1
      },
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return 'Please enter a valid quantity!';
        }
      },
      confirmButtonColor: type === 'increase' ? '#52c41a' : '#faad14',
      background: '#1e1a24',
      color: '#fff'
    });

    if (quantity) {
      try {
        if (type === 'increase') {
          await increaseStock(product.Id, quantity);
        } else {
          await decreaseStock(product.Id, quantity);
        }
        
        Swal.fire({
          title: 'Success!',
          text: `Stock ${type === 'increase' ? 'increased' : 'decreased'} by ${quantity}`,
          icon: 'success',
          background: '#1e1a24',
          color: '#fff'
        });
        
        fetchData(currentPage, pageSize, searchQuery);
        fetchSummaries();
      } catch (error) {
        message.error(`Failed to ${type} stock`);
      }
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
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'Category',
      responsive: ['md'],
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'QuantityInStock',
      key: 'QuantityInStock',
      render: (qty, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong style={{ color: qty <= record.ReorderLevel ? '#ff4d4f' : 'inherit' }}>
            {qty}
          </Text>
          {qty <= record.ReorderLevel && (
            <Tag color="error" style={{ margin: 0 }}>Low Stock</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => handleViewProduct(record.Id)}
            title="View Details"
          />
          <Button 
            type="text" 
            icon={<ArrowUpOutlined style={{ color: '#52c41a' }} />} 
            onClick={() => handleStockAdjust(record, 'increase')}
            title="Increase Stock"
          />
          <Button 
            type="text" 
            icon={<ArrowDownOutlined style={{ color: '#faad14' }} />} 
            onClick={() => handleStockAdjust(record, 'decrease')}
            title="Decrease Stock"
          />
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => openFormModal(record)}
            title="Edit"
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.Id)}
            title="Delete" 
          />
        </Space>
      ),
    },
  ];

  const openFormModal = (product = null) => {
    setSelectedProduct(product);
    setFormModalVisible(true);
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

  return (
    <div style={{ padding: 'clamp(12px, 4vw, 24px)' }}>
      <Flex 
        justify="space-between" 
        align="center" 
        style={{ marginBottom: '24px' }}
        wrap="wrap"
        gap="middle"
      >
        <Flex align="center" gap="middle" wrap="wrap">
          <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 28px)' }}>Inventory</Title>
          <Input.Search
            placeholder="Search products..."
            allowClear
            value={searchQuery}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            style={{ width: 'clamp(200px, 30vw, 350px)' }}
          />
        </Flex>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openFormModal()}
          size={window.innerWidth < 576 ? 'middle' : 'large'}
        >
          Add Product
        </Button>
      </Flex>

      {/* Advanced Filters */}
      <Card 
        styles={{ body: { padding: 'clamp(12px, 3vw, 20px)' } }} 
        style={{ marginBottom: '24px', borderRadius: '12px', border: '1px solid #303030' }}
      >
        <Row gutter={[24, 24]} align="bottom">
          <Col xs={24} sm={12} md={7}>
            <Text strong type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Type</Text>
            <Select
              placeholder="All Types"
              style={{ width: '100%' }}
              allowClear
              size="large"
              value={filterType}
              onChange={setFilterType}
            >
              <Select.Option value="Machine">Machine</Select.Option>
              <Select.Option value="Refill">Refill</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={10}>
            <Text strong type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Price Range</Text>
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber
                placeholder="Min"
                style={{ width: '50%' }}
                size="large"
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                value={minPrice}
                onChange={setMinPrice}
              />
              <InputNumber
                placeholder="Max"
                style={{ width: '50%' }}
                size="large"
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                value={maxPrice}
                onChange={setMaxPrice}
              />
            </Space.Compact>
          </Col>
          <Col xs={24} sm={24} md={7}>
            <Flex gap="small" wrap="wrap">
              <Button 
                type="primary" 
                icon={<FilterOutlined />} 
                onClick={handleApplyFilters}
                size="large"
                style={{ flex: 1 }}
              >
                Apply
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleResetFilters}
                size="large"
                style={{ flex: 1 }}
              >
                Reset
              </Button>
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="Total Products"
              value={totalCount}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} loading={summaryLoading}>
            <Statistic
              title="Total Inventory Value"
              value={inventoryValue}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false} loading={summaryLoading}>
            <Statistic
              title="Low Stock Products"
              value={lowStockProducts.length}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              styles={{ content: { color: lowStockProducts.length > 0 ? '#ff4d4f' : 'inherit' } }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Main Product Table */}
        <Col xs={24} lg={18}>
          <Card 
            title="Product Inventory" 
            styles={{ body: { padding: 0 } }}
          >
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
                size: window.innerWidth < 576 ? 'small' : 'default'
              }}
              scroll={{ x: 800 }}
              size={window.innerWidth < 576 ? 'small' : 'middle'}
            />
          </Card>
        </Col>

        {/* Low Stock Side Panel */}
        <Col xs={24} lg={6}>
          <Card 
            title={
              <Space>
                <WarningOutlined style={{ color: '#ff4d4f' }} />
                <span>Critical Stock Alerts</span>
              </Space>
            }
            styles={{ body: { padding: '0 12px 12px 12px', maxHeight: '600px', overflowY: 'auto' } }}
          >
            {summaryLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
              </div>
            ) : lowStockProducts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={lowStockProducts}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          shape="square" 
                          src={item.ProductImage ? (item.ProductImage.startsWith('http') ? item.ProductImage : `${API_BASE_URL}/${item.ProductImage}`) : null} 
                          icon={<InboxOutlined />} 
                        />
                      }
                      title={item.Name}
                      description={
                        <Space orientation="vertical" size={0}>
                          <Text type="secondary">In Stock: <Text strong color="error">{item.QuantityInStock}</Text></Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>Level: {item.ReorderLevel}</Text>
                        </Space>
                      }
                    />
                    <Badge color="red" />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No low stock alerts" />
            )}
          </Card>
        </Col>
      </Row>

      <ProductFormModal
        visible={formModalVisible}
        product={selectedProduct}
        onCancel={() => setFormModalVisible(false)}
        onSuccess={() => {
          setFormModalVisible(false);
          fetchData(currentPage, pageSize, searchQuery);
          fetchSummaries();
        }}
      />

      <ProductDetailDrawer
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        loading={detailLoading}
        data={detailProduct}
        onEdit={(product) => {
          setDetailVisible(false);
          openFormModal(product);
        }}
      />
    </div>
  );
};

export default InventoryPage;
