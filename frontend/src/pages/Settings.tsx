import React from 'react';
import { Typography, Card, Form, Switch, Select, Button, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import type { SettingsFormValues } from '../types';

const { Title } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm<SettingsFormValues>();

  const onFinish = (values: SettingsFormValues) => {
    console.log('Settings saved:', values);
  };

  return (
    <div>
      <Title level={2}>Settings</Title>
      <Card>
        <Form<SettingsFormValues>
          form={form}
          layout="vertical"
          initialValues={{
            darkMode: false,
            fontSize: 'medium',
            autoSave: true,
            language: 'en',
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Dark Mode"
            name="darkMode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Font Size"
            name="fontSize"
          >
            <Select>
              <Option value="small">Small</Option>
              <Option value="medium">Medium</Option>
              <Option value="large">Large</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Auto Save"
            name="autoSave"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Language"
            name="language"
          >
            <Select>
              <Option value="en">English</Option>
              <Option value="es">Spanish</Option>
              <Option value="fr">French</Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
            >
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 