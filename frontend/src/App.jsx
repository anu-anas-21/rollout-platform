import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Cafe from './pages/Cafe.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import Events from './pages/Events.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cafe" element={<Cafe />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/events" element={<Events />} />
      </Route>
    </Routes>
  );
}
