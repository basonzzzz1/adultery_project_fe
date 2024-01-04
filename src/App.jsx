import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./components/User/Login";
import {ToastContainer} from "react-toastify";
import React, {Suspense} from "react";
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/Home";
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
        <BrowserRouter>
            <Suspense fallback={loading}>
                <Routes>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/home"} element={<Home/>}/>
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                </Routes>
                <ToastContainer/>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
