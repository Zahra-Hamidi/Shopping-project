import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { signout } from './actions/userActions';
import CartScreen from './Screens/CartScreen';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import SignInScreen from './Screens/SignInScreen';
import RegisterScreen from './Screens/RegisterScreen';
import ShippingAddressScreen from './Screens/ShippingAddressScreen';
import PaymentMethodScreen from './Screens/PaymentMethodScreen';
import PlaceOrderScreen from './Screens/PlaceOrderScreen';
import OrderScreen from './Screens/OrderScreen';
import OrderHistoryScreen from './Screens/OrderHistoryScreen';
import ProfileScreen from './Screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';


function App() {
  const cart = useSelector(state=>state.cart);
  const {cartItems} = cart;
  const userSignin = useSelector(state => state.userSignin);
  const {userInfo} = userSignin;
  const dispatch = useDispatch()
  const signoutHandler =()=>{
      dispatch(signout())
  }
  return (
    <Router>
    <div className="grid-container">
    <header className="row">
        <div>
            <Link className="brand" to="/">amazona</Link>
        </div>
        <div>
            <Link to="/cart">Cart
            {cartItems.length > 0 && (
              <span className="badge">{cartItems.length}</span>
            )}
            </Link>
            {
              userInfo ? (
                <div className="dropdown">
                <Link to="#">{userInfo.name}<i class="fas fa-caret-down"></i> {' '}</Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">User Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Order History</Link>
                  </li>
                  <Link to="#signout" onClick={signoutHandler}>Sign Out</Link>
                </ul>
                </div>
              ):
              (
                <Link to="/signin">Sign In</Link>
              )
              
            }
            
        </div>
    </header>
    <main>
      <Route path="/cart/:id?" component={CartScreen}></Route>
      <Route path="/product/:id" component={ProductScreen}></Route>
      <Route path="/signin" component={SignInScreen}></Route>
      <Route path="/register" component={RegisterScreen}></Route>
      <Route path="/shipping" component={ShippingAddressScreen}></Route>
      <Route path="/payment" component={PaymentMethodScreen}></Route>
      <Route path="/placeorder" component={PlaceOrderScreen}></Route>
      <Route path="/order/:id" component={OrderScreen}></Route>
      <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
      <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
      <Route path="/" component={HomeScreen} exact></Route>
       
    </main>
    <footer className="row center">
        All right reserveds
    </footer>
  </div>
</Router>
  );
}

export default App;
