import React, {useState} from 'react';
import {Navigate} from "react-router-dom";

const Home = () => {
    const [isLogin, setIsLogin] = useState(false);
    const logout = () => {
      localStorage.removeItem("userToken")
      localStorage.removeItem("limit")
      localStorage.removeItem("idAccount")
      localStorage.removeItem("account")
      localStorage.removeItem("load")
        setIsLogin(true)
    }
    return (
        <div>
            <button onClick={()=>logout()}>logout</button>
            {isLogin && <Navigate to="/login"/>}
        </div>
    );
};

export default Home;