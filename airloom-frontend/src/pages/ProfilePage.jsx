import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Tabs,
  message,
  Spin,
  Typography,
  Divider,
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  LockOutlined,
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { selectUser } from '../features/auth/authSelectors';
import { fetchUserProfileAsync } from '../features/auth/authSlice';
import { updateUserProfile, changePassword } from '../api/users.api';
import { API_BASE_URL } from '../utils/constants';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  
  // Profile state
  const [profileLoading, setProfileLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Password state
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name || user.userName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      
      // Set existing profile image as preview if available
      if (user.profileImage) {
        const imageUrl = user.profileImage.startsWith('http') 
          ? user.profileImage 
          : `${API_BASE_URL}/${user.profileImage}`;
        setImagePreview(imageUrl);
      }
    }
  }, [user, profileForm]);

  // Handle image selection
  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (values) => {
    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append('Name', values.name || '');
      formData.append('Phone', values.phone || '');
      
      if (selectedFile) {
        formData.append('ProfileImageFile', selectedFile);
      } else if (user?.profileImage) {
        // Send existing image URL if no new image selected
        formData.append('ProfileImage', user.profileImage);
      }

      const response = await updateUserProfile(formData);
      
      if (response.statusCode === 200) {
        message.success('Profile updated successfully!');
        // Refresh profile data in Redux
        dispatch(fetchUserProfileAsync());
        setSelectedFile(null);
      } else {
        message.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      message.error(errorMessage);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New password and confirm password do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      
      if (response.statusCode === 200) {
        message.success('Password changed successfully!');
        passwordForm.resetFields();
      } else {
        message.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      // Show exact backend error message
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      message.error(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Current profile image URL
  const currentImageUrl = imagePreview || (user?.profileImage 
    ? (user.profileImage.startsWith('http') ? user.profileImage : `${API_BASE_URL}/${user.profileImage}`)
    : null);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          My Profile
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
          Manage your account settings and security
        </Text>
      </div>

      <Tabs
        defaultActiveKey="profile"
        style={{ color: '#fff' }}
        items={[
          {
            key: 'profile',
            label: (
              <span>
                <UserOutlined style={{ marginRight: 8 }} />
                Profile
              </span>
            ),
            children: (
              <Card
                style={{
                  background: '#182430',
                  border: '1px solid #2a3744',
                  borderRadius: 12,
                }}
              >
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileSubmit}
                  requiredMark={false}
                >
                  {/* Profile Image Upload */}
                  <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Upload
                      name="profileImage"
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={handleImageChange}
                      accept="image/*"
                    >
                      <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                        <Avatar
                          size={120}
                          src={currentImageUrl}
                          icon={!currentImageUrl && <UserOutlined />}
                          style={{
                            background: currentImageUrl ? 'transparent' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
                            border: '4px solid #2a3744',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7f13ec, #9333ea)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid #182430',
                          }}
                        >
                          <CameraOutlined style={{ color: '#fff', fontSize: 16 }} />
                        </div>
                      </div>
                    </Upload>
                    <div style={{ marginTop: 8 }}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 12 }}>
                        Click to upload new photo
                      </Text>
                    </div>
                  </div>

                  {/* Name Field */}
                  <Form.Item
                    name="name"
                    label={<span style={{ color: '#fff' }}>Name</span>}
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                      placeholder="Enter your name"
                      size="large"
                    />
                  </Form.Item>

                  {/* Email Field (Read-Only) */}
                  <Form.Item
                    name="email"
                    label={<span style={{ color: '#fff' }}>Email</span>}
                  >
                    <Input
                      prefix={<MailOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                      disabled
                      size="large"
                      style={{ 
                        background: 'rgba(42, 36, 51, 0.3)',
                        cursor: 'not-allowed',
                      }}
                    />
                  </Form.Item>

                  {/* Phone Field */}
                  <Form.Item
                    name="phone"
                    label={<span style={{ color: '#fff' }}>Phone</span>}
                  >
                    <Input
                      prefix={<PhoneOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                      placeholder="Enter your phone number"
                      size="large"
                    />
                  </Form.Item>

                  {/* Role Display (Read-Only) */}
                  <Form.Item
                    label={<span style={{ color: '#fff' }}>Role</span>}
                  >
                    <Input
                      value={user?.role || ''}
                      disabled
                      size="large"
                      style={{ 
                        background: 'rgba(42, 36, 51, 0.3)',
                        cursor: 'not-allowed',
                      }}
                      prefix={<SafetyOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                    />
                  </Form.Item>

                  <Divider style={{ borderColor: '#2a3744' }} />

                  {/* Submit Button */}
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={profileLoading}
                      disabled={profileLoading}
                      icon={<SaveOutlined />}
                      size="large"
                      style={{
                        background: 'linear-gradient(135deg, #7f13ec, #9333ea)',
                        border: 'none',
                        height: 48,
                        fontWeight: 600,
                      }}
                    >
                      {profileLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
          {
            key: 'security',
            label: (
              <span>
                <LockOutlined style={{ marginRight: 8 }} />
                Security
              </span>
            ),
            children: (
              <Card
                style={{
                  background: '#182430',
                  border: '1px solid #2a3744',
                  borderRadius: 12,
                }}
              >
                <div style={{ marginBottom: 24 }}>
                  <Title level={4} style={{ margin: 0, color: '#fff' }}>
                    Change Password
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                    Update your password to keep your account secure
                  </Text>
                </div>

                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordSubmit}
                  requiredMark={false}
                >
                  {/* Current Password */}
                  <Form.Item
                    name="currentPassword"
                    label={<span style={{ color: '#fff' }}>Current Password</span>}
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                      placeholder="Enter current password"
                      size="large"
                    />
                  </Form.Item>

                  {/* New Password */}
                  <Form.Item
                    name="newPassword"
                    label={<span style={{ color: '#fff' }}>New Password</span>}
                    rules={[
                      { required: true, message: 'Please enter a new password' },
                      { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                      placeholder="Enter new password"
                      size="large"
                    />
                  </Form.Item>

                  {/* Confirm New Password */}
                  <Form.Item
                    name="confirmPassword"
                    label={<span style={{ color: '#fff' }}>Confirm New Password</span>}
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Please confirm your new password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                      placeholder="Confirm new password"
                      size="large"
                    />
                  </Form.Item>

                  <Divider style={{ borderColor: '#2a3744' }} />

                  {/* Submit Button */}
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={passwordLoading}
                      disabled={passwordLoading}
                      icon={<LockOutlined />}
                      size="large"
                      style={{
                        background: 'linear-gradient(135deg, #7f13ec, #9333ea)',
                        border: 'none',
                        height: 48,
                        fontWeight: 600,
                      }}
                    >
                      {passwordLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ProfilePage;
