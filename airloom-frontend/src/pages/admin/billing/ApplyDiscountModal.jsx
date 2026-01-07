import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button, message, Typography, Descriptions, Divider } from 'antd';
import { PercentageOutlined } from '@ant-design/icons';
import { updateDiscount, BILL_STATUS } from '../../../api/billing.api';

const { Text, Title } = Typography;

const ApplyDiscountModal = ({ visible, bill, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Set form values when bill changes
  useEffect(() => {
    if (bill && visible) {
      form.setFieldsValue({
        discountPercent: bill.DiscountPercent || 0,
      });
    }
  }, [bill, visible, form]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Check if bill is still pending
      if (bill.Status !== BILL_STATUS.PENDING) {
        message.error('Only pending bills can have discount applied');
        return;
      }

      setLoading(true);

      const response = await updateDiscount({
        BillingId: bill.Id,
        DiscountPercent: values.discountPercent,
      });

      if (response.statusCode === 200) {
        message.success('Discount applied successfully!');
        onSuccess();
      } else {
        message.error(response.message || 'Failed to apply discount');
      }
    } catch (error) {
      // Show exact backend error message
      const errorMessage = error.response?.data?.message || 'Failed to apply discount';
      message.error(errorMessage);
      console.error('Apply discount error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onCancel();
  };

  if (!bill) return null;

  return (
    <Modal
      title="Apply Discount"
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          disabled={loading || bill.Status !== BILL_STATUS.PENDING}
          onClick={handleSubmit}
          icon={<PercentageOutlined />}
          style={{
            background: 'linear-gradient(135deg, #7f13ec, #9333ea)',
            border: 'none',
          }}
        >
          {loading ? 'Applying...' : 'Apply Discount'}
        </Button>,
      ]}
      styles={{
        header: {
          background: '#182430',
          borderBottom: '1px solid #2a3744',
        },
        body: {
          background: '#182430',
          padding: '24px',
        },
        footer: {
          background: '#182430',
          borderTop: '1px solid #2a3744',
        },
      }}
    >
      {/* Bill Summary */}
      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: 'rgba(255, 255, 255, 0.65)', width: 120 }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="Bill ID">{bill.Id}</Descriptions.Item>
        <Descriptions.Item label="Customer ID">{bill.CustomerId}</Descriptions.Item>
        <Descriptions.Item label="Current Total">{formatCurrency(bill.TotalAmount)}</Descriptions.Item>
      </Descriptions>

      <Divider style={{ borderColor: '#2a3744', margin: '16px 0' }} />

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="discountPercent"
          label={<span style={{ color: '#fff' }}>Discount Percentage</span>}
          rules={[
            { required: true, message: 'Please enter discount percentage' },
            { type: 'number', min: 0, max: 100, message: 'Discount must be between 0 and 100%' },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            step={0.5}
            addonAfter="%"
            style={{ width: '100%' }}
            placeholder="Enter discount percentage (0-100)"
          />
        </Form.Item>

        <Text type="secondary" style={{ fontSize: 12 }}>
          The discount will be applied to the bill subtotal before tax calculation.
        </Text>
      </Form>
    </Modal>
  );
};

export default ApplyDiscountModal;
