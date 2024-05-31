import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../views/Home/Home";
import Login from "../views/Login/Login";
import Register from "../views/Register/Register";
import NotFound from "../views/NotFound/NotFound";
import UserList from "../views/User/UserList";
import UserCheck from "../views/User/UserCheck";
import Product from "../views/Product/Product";
import UserInfo from "../views/Center/UserInfo";
import UserPassword from "../views/Center/UserPassword";
import Index from "../views/Home/Index";
import Order from "../views/Order/Order";
import ProductManageList from "../views/ProductManage/ProductManageList";
import ProductManageAdd from "../views/ProductManage/ProductManageAdd";
import WarehouseManageList from "../views/WarehouseManage/WarehouseManageList";
import WarehouseManageAdd from "../views/WarehouseManage/WarehouseManageAdd";
import ProtectedRouter from "./ProtectedRouter";
import UserAddress from "../views/Center/UserAddress";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<ProtectedRouter><Home /></ProtectedRouter>}>
        <Route index element={<Index />} />
        <Route path="/user/list" element={<UserList />} />
        <Route path="/user/check" element={<UserCheck />} />
        <Route path="/product" element={<Product />} />
        <Route path="/productManage/list" element={<ProductManageList />} />
        <Route path="/productManage/create" element={<ProductManageAdd />} />
        <Route path="/warehouseManage/list" element={<WarehouseManageList />} />
        <Route path="/warehouseManage/create" element={<WarehouseManageAdd />} />
        <Route path="/order" element={<Order />} />
        <Route path="/center/info" element={<UserInfo />} />
        <Route path="/center/address" element={<UserAddress />} />
        <Route path="/center/password" element={<UserPassword />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
)

export default router
