import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar/Navbar'
import Footer from './components/Layout/Footer/Footer'
import Home from './pages/Home/Home'
import Books from './pages/Books/Books'
import BookDetail from './pages/Books/BookDetail'
import Cart from './pages/Cart/Cart'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import AdminDashboard from './pages/Admin/Dashboard/Dashboard'
import AdminBooks from './pages/Admin/Books/Books'
import AdminUsers from './pages/Admin/Users/Users'
import AdminOrders from './pages/Admin/Orders/Orders'
import ProtectedRoute from './components/Auth/ProtectedRoutes'
import AdminRoute from './components/Auth/AdminRoute'
import OrderSuccess from './pages/OrderSuccess/orderSuccess'
import MyOrders from './pages/MyOrders/myOrders'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App