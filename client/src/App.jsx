import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar         from './components/Navbar.jsx'
import Home           from './pages/Home.jsx'
import Product        from './pages/Product.jsx'
import Cart           from './pages/Cart.jsx'
import Checkout       from './pages/Checkout.jsx'
import Login          from './pages/Login.jsx'
import Register       from './pages/Register.jsx'
import Profile        from './pages/Profile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute     from './components/AdminRoute.jsx'
import AdminCreate    from './pages/AdminCreate.jsx';
import AdminEdit from './pages/AdminEdit.jsx'
import Order from './pages/Order.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import AffiliateRequest from './pages/AffiliateRequest.jsx'
import AdminAffiliateRequests from './pages/AdminAffiliateRequests.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import TrackOrderForm from './pages/TrackOrderForm.jsx'
import AdminCustomers from './pages/AdminCustomers.jsx';
import ReviewForm from './pages/ReviewForm.jsx';
import AdminReviews from './pages/AdminReviews.jsx';
import BlogPage from './pages/blog.jsx'
import ShoppingPage from './pages/shopping.jsx'
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Home/>} />
        <Route path="/blog"           element={<BlogPage/>} />
        <Route path="/product/:id"    element={<Product/>} />
        <Route path="/cart"           element={<Cart/>} />
        <Route path="/shopping"           element={<ShoppingPage/>} />
        <Route path="/checkout"       element={
          <ProtectedRoute><Checkout/></ProtectedRoute>
        }/>
        <Route path="/login"          element={<Login/>} />
        <Route path="/register"       element={<Register/>} />
        <Route path="/profile"        element={
          <ProtectedRoute><Profile/></ProtectedRoute>
        }/>
        <Route path="/admin"          element={
          <AdminRoute><AdminDashboard/></AdminRoute>
        }/>
        <Route path="/admin/create" element={
        <AdminRoute><AdminCreate/></AdminRoute>
        }/>
        <Route path="/admin/edit/:id" element={
        <AdminRoute><AdminEdit/></AdminRoute>
        }/>
          <Route 
    path="/order/:id" 
    element={
      <ProtectedRoute>
        <Order/>
      </ProtectedRoute>
    }/>
    <Route path="/affiliate/request" element={
  <ProtectedRoute><AffiliateRequest/></ProtectedRoute>
}/>
<Route path="/admin/affiliates" element={
  <AdminRoute><AdminAffiliateRequests/></AdminRoute>
}/>
  <Route
    path="/track/:id"
    element={
      <ProtectedRoute>
        <TrackOrder/>
      </ProtectedRoute>
    }
  />
   <Route 
   path="/review" 
   element={
     <ProtectedRoute><ReviewForm/></ProtectedRoute>
   } 
 />
  <Route path="/track" element={<ProtectedRoute><TrackOrderForm/></ProtectedRoute>} />
  <Route
    path="/admin/customers"
    element={
      <AdminRoute>
        <AdminCustomers/>
      </AdminRoute>
    }
  />
    <Route
    path="/admin/reviews"
    element={
      <AdminRoute><AdminReviews/></AdminRoute>
    }
  />
    <Route
    path="/admin/orders"
    element={<AdminRoute><AdminOrders/></AdminRoute>}
    />
      </Routes>
    </BrowserRouter>
  )
}
