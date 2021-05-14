import {createStore , compose , applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';
import { orderDetailsReducer, orderMineListReducer, orderReducer } from './reducers/orderReducers';
import { productDetailsReducer, productListReducer } from './reducers/ProductReducer';
import { userDetailsReducer, userRegisterReducer, userSigninReducer, userUpdateProfileReducer } from './reducers/userReducers';

const initialState = {
    userSignin:{
        userInfo:localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")):null
    },
    cart:{
        cartItems:localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingAddress:localStorage.getItem('shippingAddress')? JSON.parse(localStorage.getItem('shippingAddress')):{},
        paymentMethod:'PayPal'
    },
    
} ;
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin:userSigninReducer,
    userRegister:userRegisterReducer,
    orderCreate:orderReducer,
    orderDetails:orderDetailsReducer,
    orderMineList:orderMineListReducer,
    userDetails:userDetailsReducer,
    userUpdateProfile:userUpdateProfileReducer
})
const composeEnhance = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer,initialState,composeEnhance(applyMiddleware(thunk)));

export default store;