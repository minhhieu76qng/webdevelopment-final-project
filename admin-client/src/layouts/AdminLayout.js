import React from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import HeaderPage from '../components/Header/Header';
import routes from '../routes';

const { Header, Sider, Content } = Layout;
// {{ height: window.innerHeight }}
const AdminLayout = () => {
  const getRoutes = () => {
    return routes.map(route => {
      if (route.layout === '/admin') {
        return (
          <Route
            path={route.layout + route.path}
            component={route.component}
            key={route.path}
          />
        );
      }

      return null;
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={260}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Sidebar routes={routes} theme='dark' mode='vertical' />
      </Sider>
      <Layout style={{ marginLeft: 260 }}>
        <Header
          style={{
            overflow: 'auto',
            position: 'fixed',
            width: 'calc(100% - 260px)',
            top: 0,
            height: 64,
          }}
        >
          <HeaderPage />
        </Header>
        <Content style={{ padding: '20px 30px', marginTop: 64 }}>
          <div style={{ minHeight: '100%', padding: 24, background: '#fff' }}>
            <Switch>{getRoutes()}</Switch>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
