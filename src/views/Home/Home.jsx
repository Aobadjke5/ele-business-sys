import style from "./Home.module.scss"
import { Button, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import logo from "../../assets/images/cartLogo.svg"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined, TeamOutlined,
  HomeOutlined, UserOutlined, ProductOutlined, SolutionOutlined,
  LogoutOutlined, AccountBookOutlined, TruckOutlined, ShoppingOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/JwtUtils";
import { useSelector } from "react-redux";

export default function Home() {
  const MenuItems0 = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: "/user",
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        { key: "/user/list", label: '用户列表' },
        { key: "/user/check", label: '用户审核' }
      ]
    },
    {
      key: "/admin",
      icon: <TeamOutlined />,
      label: '管理员管理',
      children: [
        { key: "/admin/create", label: '新增管理员' },
      ]
    },
    {
      key: "/product",
      icon: <ProductOutlined />,
      label: '商品列表',
    },
    {
      key: "/productManage",
      icon: <ShoppingOutlined />,
      label: '商品管理',
      children: [
        { key: "/productManage/list", label: '我的商品' },
        { key: "/productManage/create", label: '新增商品' }
      ]
    },
    {
      key: "/warehouseManage",
      icon: <TruckOutlined />,
      label: '仓库管理',
      children: [
        { key: "/warehouseManage/list", label: '我的仓库' },
        { key: "/warehouseManage/create", label: '新增仓库' }
      ]
    },
    {
      key: "/order",
      icon: <AccountBookOutlined />,
      label: '我的订单',
    },
    {
      key: "/center",
      icon: <SolutionOutlined />,
      label: '个人中心',
      children: [
        { key: "/center/info", label: '账户信息' },
        { key: "/center/password", label: '修改密码' }
      ]
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: '退出登录',
    }
  ]
  const specialMenu = {
    "Dealer": {"/center": {value: {key: "/center/address", label: '收货地址'}, index: 1}}
  }
  const AdminMenuKey = ["/", "/user", "/admin", "/center", "logout"]
  const DealerMenuKey = ["/", "/product", "/order", "/center", "logout"]
  const SupplierMenuKey = ["/", "/productManage", "/order", "/center", "logout"]
  const WarehouserMenuKey = ["/", "/warehouseManage", "/order", "/center", "logout"]

  const [collapsed, setCollapsed] = useState(false);
  const [menuSelectedKey, setMenuSelectedKey] = useState();
  const [menuOpenedKey, setMenuOpenedKey] = useState();
  const [menuItems, setMenuItems] = useState()
  const userRole = useSelector(state => state.userInfo.role)

  useEffect(() => {
    console.log(MenuItems0,"--------------")
    if(userRole === "Admin") {
      setMenuItems(MenuItems0.filter(item => AdminMenuKey.includes(item.key)))
    } else if(userRole === "Dealer") {
      let menu = MenuItems0.filter(item => DealerMenuKey.includes(item.key)).map(item => {
        let newItem = { ...item }
        if (specialMenu["Dealer"][item.key]) {
          let newChildren = [...newItem.children]
          newChildren.splice(specialMenu["Dealer"][item.key].index, 0, specialMenu["Dealer"][item.key].value)
          newItem.children = newChildren
        }
        return newItem;
      });
      setMenuItems(menu);
    } else if(userRole === "Supplier") {
      setMenuItems(MenuItems0.filter(item => SupplierMenuKey.includes(item.key)))
    } else if(userRole === "Warehouser") {
      setMenuItems(MenuItems0.filter(item => WarehouserMenuKey.includes(item.key)))
    }
  }, [userRole])

  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuSelectedKey(pathname)
    if (pathname.split("/").length === 3) setMenuOpenedKey(["/" + pathname.split("/")[1]])
  }, [pathname])

  const onMenuClick = (e) => {
    if (e.key === "logout") {
      removeToken()
      navigate("/login")
    }
    else navigate(e.key)
  }
  const onMenuOpenChange = (keys) => {
    setMenuOpenedKey(keys)
  }

  return (
    <Layout>
      <Layout.Sider trigger={null} collapsible collapsed={collapsed} className={style.siderBar}>
        <div className={style.title}>
          {
            collapsed ? <img src={logo} alt="logo" /> : <h1>跨境电商服务平台</h1>
          }
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={((e) => { onMenuClick(e) })}
          onOpenChange={(keys) => { onMenuOpenChange(keys) }}
          selectedKeys={menuSelectedKey}
          openKeys={menuOpenedKey}
        />
      </Layout.Sider>

      <Layout>
        <Layout.Header className={style.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={style.openBtn}
            style={{ width: 64, height: 64 }}
          />
        </Layout.Header>

        <Layout.Content className={style.content}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
