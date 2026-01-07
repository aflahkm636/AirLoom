import React from 'react';
import { Drawer, Descriptions, Tag, Divider, Typography } from 'antd';
import { BILL_STATUS } from '../../../api/billing.api';

const { Title } = Typography;

const BillDetailDrawer = ({ visible, bill, onClose }) => {
  if (!bill) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMonth = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <Drawer
      title="Bill Details"
      placement="right"
      onClose={onClose}
      open={visible}
      width={480}
      styles={{
        header: {
          background: '#182430',
          borderBottom: '1px solid #2a3744',
        },
        body: {
          background: '#182430',
          padding: '24px',
        },
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: '0 0 8px', color: '#fff' }}>
          Bill #{bill.Id}
        </Title>
        <Tag
          color={bill.Status === BILL_STATUS.PENDING ? 'orange' : 'green'}
          style={{ fontSize: 14 }}
        >
          {bill.Status}
        </Tag>
      </div>

      <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

      {/* Bill Information */}
      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 140 }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="Bill Month">{formatMonth(bill.BillMonth)}</Descriptions.Item>
        <Descriptions.Item label="Customer ID">{bill.CustomerId}</Descriptions.Item>
        <Descriptions.Item label="Subscription ID">{bill.SubscriptionId}</Descriptions.Item>
      </Descriptions>

      <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

      {/* Amount Breakdown */}
      <Title level={5} style={{ color: '#a855f7', marginBottom: 16 }}>
        Amount Breakdown
      </Title>
      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 140 }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="Subscription Amount">
          {formatCurrency(bill.SubscriptionAmount)}
        </Descriptions.Item>
        <Descriptions.Item label="Extra Usage Amount">
          {formatCurrency(bill.ExtraUsageAmount)}
        </Descriptions.Item>
        <Descriptions.Item label="Subtotal">
          {formatCurrency(bill.Amount)}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

      {/* Discount & Tax */}
      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 140 }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="Discount %">{bill.DiscountPercent || 0}%</Descriptions.Item>
        <Descriptions.Item label="Discount Amount">
          <span style={{ color: '#52c41a' }}>-{formatCurrency(bill.DiscountAmount)}</span>
        </Descriptions.Item>
        <Descriptions.Item label="Tax %">{bill.TaxPercent || 0}%</Descriptions.Item>
        <Descriptions.Item label="Tax Amount">
          {formatCurrency(bill.TaxAmount)}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

      {/* Total */}
      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 140, fontWeight: 600 }}
        contentStyle={{ color: '#a855f7', fontWeight: 700, fontSize: 18 }}
      >
        <Descriptions.Item label="Total Amount">
          {formatCurrency(bill.TotalAmount)}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

      {/* Invoice & Timestamps */}
      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 140 }}
        contentStyle={{ color: '#fff' }}
      >
        {bill.InvoiceNumber && (
          <Descriptions.Item label="Invoice Number">
            <Tag color="blue">{bill.InvoiceNumber}</Tag>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Created On">{formatDate(bill.CreatedOn)}</Descriptions.Item>
        <Descriptions.Item label="Modified At">{formatDate(bill.ModifiedAt)}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default BillDetailDrawer;
