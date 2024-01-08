import React, {useEffect, useState} from 'react';
import {useWebSocket} from "../../context/WebSocketContext";
import ManageService from "../../service/ManageService";
import {toast} from "react-toastify";
import Modal from "react-modal";
import "./Admin.css"
import {Navigate} from "react-router-dom";
const Admin = () => {
    const [contentMessage, setContentMessage] = useState([]);
    const [ChatRoom, setChatRoom] = useState([]);
    const [load, setLoad] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const webSocket = useWebSocket();
    useEffect(() => {
        if (webSocket) {
            webSocket.subscribe('/chat/user/queue/notification', async (message) => {
                setLoad(true)
            });
        }
    }, [webSocket]);

    useEffect(() => {

    }, [modalIsOpen]);
    useEffect(() => {
        ManageService.getAllChatRoom().then((response) => {
            console.log(response.data);
            const sortedChatRoom = response.data.sort((a, b) => {
                return new Date(b.createAt) - new Date(a.createAt);
            });
            setChatRoom(sortedChatRoom);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        ManageService.getAllRequest().then((response) => {
            console.log(response.data)
            setContentMessage(response.data)
        }).catch((err) => {
            toast.warning("Gửi Yêu cầu không thành công !")
        })
        setLoad(false)
    }, [load]);
    const createChatRoom = () => {
        if(document.getElementById("usernameCreate").value == ''){
            toast.warning("Chưa nhập đủ thông tin")
        } else if(document.getElementById("passwordCreate").value == ''){
            toast.warning("Chưa nhập đủ thông tin")
        }else if(document.getElementById("passwordCreate").value == ''){
            toast.warning("Chưa nhập đủ thông tin")
        } else{
            let ChatRoomRequest = {
                username : document.getElementById("usernameCreate").value,
                password : document.getElementById("passwordCreate").value,
                point : document.getElementById("passwordCreate").value
            }
            ManageService.createChatRoom(ChatRoomRequest).then((response)=>{
                  toast.success("Tạo phòng thành công")
                console.log(response)
            }).catch((err) =>{
                  toast.warning("Tên người dùng không tồn tại")
            })
        }

    }
    const check = () => {
      console.log(contentMessage)
    }
    const closeModal = () => {
        setModalIsOpen(false);
    };
    const openModal = () => {
        setModalIsOpen(true);
    }
    function calculateTimeChat(createdAt) {
        const currentTime = new Date();
        const postedTime = new Date(createdAt);
        const timeDiff = currentTime - postedTime;
        if (timeDiff < 60000) {
            return Math.floor(timeDiff / 1000) + " seconds ago";
        } else if (timeDiff < 3600000) {
            return Math.floor(timeDiff / 60000) + " minutes ago";
        } else if (timeDiff < 86400000) {
            return Math.floor(timeDiff / 3600000) + " hours ago";
        } else if (timeDiff < 2592000000) {
            return Math.floor(timeDiff / 86400000) + " days ago";
        } else if (timeDiff < 31536000000) {
            return Math.floor(timeDiff / 2592000000) + " months ago";
        } else {
            return Math.floor(timeDiff / 31536000000) + " years ago";
        }
    }
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
            <div style={{display : "flex" , width : "100%"}}>
                <div style={{width :"95%"}}>
                    <button style={{marginLeft :"200px"}}
                            onClick={()=>check()}>kiểm tra tin nhắn</button>
                    <button onClick={()=>openModal()}
                            style={{marginLeft : "10px"}}
                    >Tạo Phòng</button>
                </div>
                <div style={{width :"30px"}}>
                    <div style={{width: "30px"}}>
                        <button onClick={() => logout()}
                                style={{backgroundColor: "white", border: "hidden", marginTop: "10px"}}>
                <span className="icon" style={{color: "black", textAlign: "center"}}>
                <i style={{fontSize: "30px", border: "1px solid gray"}} className='bx bxs-exit'></i>
                </span>
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ width : "1000px" , height :"600px",marginLeft :"200px" }}>
                    <div style={{width : "99%"}}>
                        <div style={{width : "100%" , textAlign :"center"}}>
                            <h2>Quản lý phòng chat</h2>
                        </div>
                        <thead>
                        <tr>
                            <th>Id Phòng</th>
                            <th>Mật Khẩu</th>
                            <th>Ngày Tạo</th>
                            <th>Người dùng 1</th>
                            <th>Người dùng 2</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ChatRoom.map((c) => (
                        <tr>
                            <td>{c.id}</td>
                            <td>{c.password}</td>
                            <td>{calculateTimeChat(c.createAt)}</td>
                            {c.user1 == null ? <td>
                                Trống
                                </td>:
                                <td>{c.user1.username}</td>
                            }
                            {c.user2 == null ? <td>
                                    Trống
                                </td> :
                                <td>{c.user2.username}</td>
                            }
                        </tr>
                        ))}
                        </tbody>
                    </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        width: "27%",
                        height: "27%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        overlay: {
                            backgroundColor: "rgba(0,0,0,0)",
                        },
                        border : "1px solid black",
                        scroll : "none",
                        overflow : "hidden",
                        backgroundColor: "#f72d7a"
                    },
                }}
                id="id"
            >
                <div id={"headerModal"} style={{width : "100%" , height :"20%", textAlign : "center", color :"black"}}>
                       <h1>Tạo Phòng</h1>
                </div>
                <div id={"bodyModal"} style={{width : "100%" , height : "80%"}}>
                    <div style={{width : "100%" , height :"80%"}}>
                        <input id={"usernameCreate"} className={"inputCreateRoom"} type="text" placeholder={"Nhập tên người dùng !"}/>
                        <input id={"passwordCreate"} className={"inputCreateRoom"}  type="password" placeholder={"Đặt Password Phòng !"}/>
                        <input id={"pointCreate"} className={"inputCreateRoom"}  type="number" placeholder={"Số điểm cần trừ !"}/>
                    </div>
                    <div style={{width : "100%" , height : "20%"}}>
                          <button onClick={()=>createChatRoom()}>
                              Tạo Phòng
                          </button>
                        <button style={{marginLeft : "10px"}} onClick={()=>closeModal()}>
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
            {isLogin && <Navigate to="/login"/>}
        </div>
    );
};

export default Admin;