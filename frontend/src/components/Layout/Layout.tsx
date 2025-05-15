import React from 'react';
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, FileTextOutlined, SettingOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import type { LayoutProps } from '../../types';

const { Header, Sider, Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const LogoIcon = styled(FileTextOutlined)`
  font-size: 24px;
`;

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/notes',
      icon: <FileTextOutlined />,
      label: 'Notes',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        // TODO: Navigate to profile page
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        // TODO: Handle logout
        break;
    }
  };

  return (
    <StyledLayout>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <Logo>
          <LogoIcon />
          {!collapsed && 'Smart Notepad'}
        </Logo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <UserSection>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Button type="text" style={{ padding: 0 }}>
                <Avatar icon={<UserOutlined />} />
              </Button>
            </Dropdown>
          </UserSection>
        </StyledHeader>
        <StyledContent>{children}</StyledContent>
      </AntLayout>
    </StyledLayout>
  );
};

export default Layout; 