import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./components/User/Login";
import {ToastContainer} from "react-toastify";
import React, {Suspense} from "react";
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/HomePage/Home";
import store from "./redux/store/store";
import {Provider} from "react-redux";
import Admin from "./components/Admin/Admin";
import ChatRoom from "./components/ChatRoom/ChatRoom";

const loading = (
    <div className="dot-spinner">
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
    </div>
)
const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Suspense fallback={loading}>
                    <Routes>
                        <Route path={"/login"} element={<Login/>}/>
                        <Route path={"/home"} element={<Home/>}/>
                        <Route path={"/admin"} element={<Admin/>}/>
                        <Route path={"/chatRoom"} element={<ChatRoom/>}/>
                        <Route path="/" element={<Navigate to="/login" replace/>}/>
                    </Routes>
                    <ToastContainer/>
                </Suspense>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
