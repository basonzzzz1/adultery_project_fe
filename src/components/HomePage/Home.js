import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import {useWebSocket} from "../../context/WebSocketContext";
import ManageService from "../../service/ManageService";
import {toast} from "react-toastify";
import Modal from "react-modal";

const Home = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isChatRoom, setIsChatRoom] = useState(false);
    const [load, setLoad] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [canRequest, setCanRequest] = useState(true);
    const [user, setUser] = useState({});
    const [chatRoom, setChatRoom] = useState({});
    const webSocket = useWebSocket();

    useEffect(() => {
        if (webSocket) {
            webSocket.subscribe('/chat/user/queue/notification', async (message) => {

            });
        }
    }, [webSocket]);
    useEffect(() => {
        const accountString = localStorage.getItem("account");
        const accountObject = JSON.parse(accountString);
        setUser(accountObject);
        setLoad(false)
    }, [load]);
    // const requestChatRoom = () => {
    //     if (!canRequest) {
    //         toast.warning("Bạn chỉ có thể yêu cầu một lần mỗi giờ.");
    //         return;
    //     }
    //     const messageRequest = {
    //         username: user.username,
    //         content: "yêu cầu tạo phòng chat !",
    //         status: true
    //     };
    //     ManageService.requestChatroom(messageRequest).then((response) => {
    //         toast.success("Gửi Yêu Cầu Thành công !");
    //         setCanRequest(false);
    //         setTimeout(() => {
    //             setCanRequest(true);
    //         }, 3600000);
    //     }).catch((err) => {
    //         toast.warning("Gửi Yêu cầu không thành công !");
    //     });
    // };
    const findByChatRoomId = () => {
        let id = document.getElementById("idChatRoom").value;
        localStorage.setItem("idChatRoom", id)
        console.log(id)
        ManageService.findByChatRoomId(id).then((response) => {
            console.log(response.data)
            setChatRoom(response.data)
            openModal()
        }).catch((err) => {
            toast.warning("Id Phòng không tồn tại")
            console.log(err)
        })
    }
    const checkChatRoom = () => {
        if (document.getElementById("passwordChatRoom").value == '') {
            toast.warning("chưa nhập mật khẩu vào phòng !")
        } else {
            let chatRoomCheck = {
                id: chatRoom.id,
                password: document.getElementById("passwordChatRoom").value
            }
            ManageService.checkChatRoom(chatRoomCheck).then((response) => {
                setIsChatRoom(true)
            }).catch((err) => {
                toast.warning("Mật khẩu không đúng !")
                console.log(err)
            })
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
    const closeModal = () => {
        setModalIsOpen(false);
    };
    const openModal = () => {
        setModalIsOpen(true);
    }
    return (
        <div>
            <div style={{display: "flex", backgroundColor: "#f72d7a", height: "100px"}}>
                <div style={{width: "80%"}}>
                </div>
                {/*<div>*/}
                {/*    <div style={{width: "6%", marginTop: "12px", float: "left", marginRight: "10px"}}>*/}
                {/*    </div>*/}
                {/*    <button style={{*/}
                {/*        height: "30px",*/}
                {/*        borderRight: "hidden",*/}
                {/*        borderTop: "hidden",*/}
                {/*        backgroundColor: "orange",*/}
                {/*        color: "white",*/}
                {/*        borderRadius: "5px"*/}
                {/*    }} onClick={()=>requestChatRoom()}>Tạo Phòng chat*/}
                {/*    </button>*/}
                {/*</div>*/}
                <div style={{display: "flex", height: "25px", marginTop: "14px"}}>
                    <input type="text" id={"idChatRoom"} placeholder={"Tìm Kiếm ..."}/>
                    <button style={{marginLeft: "10px"}} onClick={() => findByChatRoomId()}>Tìm</button>
                </div>
                <div style={{width: "30px", marginTop: "10x", marginLeft: "20px"}}>
                    <button onClick={() => logout()}
                            style={{backgroundColor: "#f72d7a", border: "hidden", marginTop: "10px"}}>
                <span className="icon" style={{color: "white", textAlign: "center", backgroundColor: "#f72d7a "}}>
                <i style={{fontSize: "30px", border: "1px solid gray"}} className='bx bxs-exit'></i>
                </span>
                    </button>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        width: "230px",
                        height: "40px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        overlay: {
                            backgroundColor: "rgba(0,0,0,0)",
                        },
                        border: "1px solid black",
                        scroll: "none",
                        overflow: "hidden",
                        backgroundColor: "#f72d7a"
                    },
                }}
                id="id"
            >
                <div style={{display : "flex"}}>
                    <input id={"passwordChatRoom"} type="text" placeholder={"nhập mật khẩu ... !"}/>
                    <button onClick={()=>checkChatRoom()} style={{marginLeft :"10px"}}>Vào</button>
                </div>
            </Modal>
            {isLogin && <Navigate to="/login"/>}
            {isChatRoom && <Navigate to="/chatRoom"/>}
        </div>
    );
};

export default Home;