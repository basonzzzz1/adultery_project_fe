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
    const [listUser, setListUser] = useState([]);
    const [nameCskhUser, setNameCskhUser] = useState("");
    const [listCskh, setListCskh] = useState([])
    const [listCskhInUser, setListCskhInUser] = useState([])
    const [user, setUser] = useState({});
    const [load, setLoad] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const webSocket = useWebSocket();
    useEffect(() => {
        ManageService.loggedInUser().then((response) => {
            setUser(response.data)
            setLoad(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [load]);

    useEffect(() => {
        if (webSocket) {
            webSocket.subscribe('/chat/user/queue/notification', async (message) => {
                setLoad(true)
            });
            webSocket.subscribe('/chat/user/queue/cskh',async (message) => {
                const msg = JSON.parse(message.body);
                let name = msg.toUser.username;
                let cskhRequest = {
                    username: name,
                    content: ""
                }
                ManageService.getAllCskhInUserDetail(cskhRequest).then((response) => {
                    setListCskhInUser(response.data);
                    console.log(response.data)
                }).catch((err) => {
                    console.log(err)
                })
            });
        }
    }, [webSocket]);
    useEffect(() => {
        ManageService.findAllUser().then((response) => {
            setListUser(response.data)
            console.log(response.data)

        }).catch((err) => {
            console.log(err)
        })
        ManageService.getAllCskhInUserAdmin().then((response) => {
            setListCskh(response.data)

        }).catch((err) => {
            console.log(err)
        })
        setLoad(false)
    }, [load]);

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
    const cskhInUser = (c) => {
        let name;
        if (c.fromUser.username == user.username) {
            name = c.toUser.username;
        } else {
            name = c.fromUser.username;
        }
        setNameCskhUser(name);
        let cskhRequest = {
            username: name,
            content: ""
        }
        ManageService.getAllCskhInUserDetail(cskhRequest).then((response) => {
            setListCskhInUser(response.data);
            console.log(response.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const extraPointInUser = () => {
        if (document.getElementById("input-username-point").value != "" && document.getElementById("input-point").value != "") {
            let pointRequest = {
                username: document.getElementById("input-username-point").value,
                point: document.getElementById("input-point").value
            }
            ManageService.extraPoints(pointRequest).then((response) => {
                document.getElementById("input-username-point").value = "";
                document.getElementById("input-point").value = "";
                toast.success("thêm điểm thành công !")
                setLoad(true)
            }).catch((err) => {
                toast.warning("tên người dùng không đúng !")
                console.log(err)
            })
        } else {
            toast.warning("chưa nhập tên tài khoản hoặc điểm !")
        }
    }
    const minusPointsInUser = () => {
        if (document.getElementById("input-username-point").value != "" && document.getElementById("input-point").value != "") {
            let pointRequest = {
                username: document.getElementById("input-username-point").value,
                point: document.getElementById("input-point").value
            }
            ManageService.minusPoints(pointRequest).then((response) => {
                document.getElementById("input-username-point").value = "";
                document.getElementById("input-point").value = "";
                toast.success("trừ điểm thành công !")
                setLoad(true)
            }).catch((err) => {
                toast.warning("tên người dùng không đúng !")
                console.log(err)
            })
        } else {
            toast.warning("chưa nhập tên tài khoản hoặc điểm !")
        }
    }
    const createChatRoom = () => {
        if (document.getElementById("usernameCreate").value == '') {
            toast.warning("Chưa nhập đủ thông tin")
        } else if (document.getElementById("passwordCreate").value == '') {
            toast.warning("Chưa nhập đủ thông tin")
        } else if (document.getElementById("passwordCreate").value == '') {
            toast.warning("Chưa nhập đủ thông tin")
        } else {
            let ChatRoomRequest = {
                username: document.getElementById("usernameCreate").value,
                password: document.getElementById("passwordCreate").value,
                point: document.getElementById("passwordCreate").value
            }
            ManageService.createChatRoom(ChatRoomRequest).then((response) => {
                toast.success("Tạo phòng thành công")
                console.log(response)
            }).catch((err) => {
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
            return Math.floor(timeDiff / 1000) + " giây trươc";
        } else if (timeDiff < 3600000) {
            return Math.floor(timeDiff / 60000) + " phút trước";
        } else if (timeDiff < 86400000) {
            return Math.floor(timeDiff / 3600000) + " giờ trước";
        } else if (timeDiff < 2592000000) {
            return Math.floor(timeDiff / 86400000) + " ngày trước";
        } else if (timeDiff < 31536000000) {
            return Math.floor(timeDiff / 2592000000) + " tháng trước";
        } else {
            return Math.floor(timeDiff / 31536000000) + " năm trước";
        }
    }

    const logout = () => {
        ManageService.logOut(user.username).then((response) => {
            localStorage.removeItem("userToken")
            localStorage.removeItem("limit")
            localStorage.removeItem("idAccount")
            localStorage.removeItem("account")
            localStorage.removeItem("load")
            setIsLogin(true)
        }).catch((err) => {
            toast.warning("không thể đăng xuất !")
        })
    }
    const banner = (u) => {
        let bannerRequest = {username: u.username}
        if (u.banned) {
            ManageService.unBanner(bannerRequest).then((response) => {
                setLoad(true)
                toast.success(" mở khóa tài khoản thành công !")
            }).catch((err) => {
                setLoad(true)
                toast.warning("mở khóa tài khoản không thành công !")
            })
        } else {
            ManageService.banner(bannerRequest).then((response) => {
                setLoad(true)
                toast.success(" khóa tài khoản thành công !")
            }).catch((err) => {
                setLoad(true)
                toast.warning(" khóa tài khoản không thành công !")
            })
        }
    }
    const createCskhAdmin = () => {
        let cskhAdminRequest ={
            username : nameCskhUser,
            content : document.getElementById("cskh-content").value
        }
        if(nameCskhUser != "" && document.getElementById("cskh-content").value != ""){
            ManageService.createCskhAdmin(cskhAdminRequest).then((response)=>{
                toast.success("gửi tin nhắn thành công !")
            }).catch((err)=>{
                console.log(err)
            })
        }else {
            toast.warning("chưa chọn người dùng hoặc tin nhắn rỗng !")
        }

    }
    const scrollAuto = () => {
        let objDiv = document.getElementById("msg_history");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    return (<div>
        <div style={{display: "flex", width: "100%", height: "100px", backgroundColor: "#f72d7a"}}>
            <div style={{width: "95%", marginTop: "20px", display: "flex"}}>
                <button className={"button-header-admin"} onClick={() => openModal()}
                        style={{
                            marginLeft: "10px",
                            height: "30px",
                            color: "white",
                            backgroundColor: "#f72d7a",
                            marginTop: "5px"
                        }}
                >Tạo Phòng
                </button>
                <div>
                    <button className={"button-header-admin"}
                            style={{marginLeft: "10px", height: "30px", color: "white", backgroundColor: "#f72d7a"}}
                            onClick={() => extraPointInUser()}>
                        thêm điểm
                    </button>
                    <button className={"button-header-admin"}
                            style={{marginLeft: "10px", height: "30px", color: "white", backgroundColor: "#f72d7a"}}
                            onClick={() => minusPointsInUser()}>
                        trừ điểm
                    </button>
                    <input className={"inputCreateRoom"} id={"input-username-point"}
                           style={{marginLeft: "10px", width: "23%", height: "25px"}} type="text"
                           placeholder={"nhập tên người dùng ...!"}/>
                    <input className={"inputCreateRoom"} id={"input-point"}
                           style={{marginLeft: "10px", width: "23%", height: "25px"}} type="number"
                           placeholder={"nhập số điểm ...!"}/>
                </div>
            </div>
            <div style={{width: "30px", marginTop: "10x", marginLeft: "20px"}}>
                <button onClick={() => logout()}
                        style={{backgroundColor: "#f72d7a", border: "hidden", marginTop: "25px"}}>
                <span className="icon" style={{color: "white", textAlign: "center", backgroundColor: "#f72d7a"}}>
                <i style={{fontSize: "30px", border: "1px solid gray"}} className='bx bxs-exit'></i>
                </span>
                </button>
            </div>
        </div>
        <div style={{width: "100%", display: "flex"}}>
            <div style={{width: "50%", height: "600px", marginLeft: "50px"}}>
                <div style={{width: "99%"}}>
                    <div style={{width: "100%", marginLeft: "30%"}}>
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
                    {ChatRoom.map((c) => (<tr>
                        <td>{c.id}</td>
                        <td>{c.password}</td>
                        <td>{calculateTimeChat(c.createAt)}</td>
                        {c.user1 == null ? <td>
                            Trống
                        </td> : <td>{c.user1.username}</td>}
                        {c.user2 == null ? <td>
                            Trống
                        </td> : <td>{c.user2.username}</td>}
                    </tr>))}
                    </tbody>
                </div>
            </div>
            <div style={{width: "50%", height: "600px", marginLeft: "50px"}}>
                <div style={{width: "99%"}}>
                    <div style={{width: "100%", marginLeft: "30%"}}>
                        <h2>Quản lý tài khoản</h2>
                    </div>
                    <div style={{width: "100%", height: "300px", overflow: "scroll"}}>
                        <thead>
                        <tr>
                            <th>Id Tài khoản</th>
                            <th>Tên Tài khoản</th>
                            <th>Trạng thái</th>
                            <th>Banner</th>
                            <th>Điểm</th>
                            <th>Quyền hạn</th>
                        </tr>
                        </thead>
                        <tbody>
                        {listUser.map((u) => (<tr>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            {u.online ? <td style={{textAlign: "center"}}>
                                <div style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: "#7cff5e",
                                    borderRadius: "50%",
                                    marginLeft: "30px"
                                }}></div>
                            </td> : <td>
                                <div style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: "gray",
                                    borderRadius: "50%",
                                    marginLeft: "30px"
                                }}></div>
                            </td>}
                            <td>
                                <label className="switch">
                                    <input id={"checkbox-value" + u.id} checked={u.banned} type="checkbox"
                                           onClick={() => banner(u)}/>
                                    <span className="slider"></span>
                                </label>
                            </td>
                            <td>{u.point}</td>
                            <td>
                                {u.roles.map((role) => (role.name === "ROLE_ADMIN" ?
                                    <p key={role.name}>Quản lý</p> : <p key={role.name}>Người dùng</p>))}
                            </td>
                        </tr>))}
                        </tbody>
                    </div>
                </div>
                <div>
                    <div className="container-chat-box">
                        <h3 className="text-center">Cskh</h3>
                        <div className="messaging">
                            <div className="inbox_msg">
                                <div className="inbox_people">
                                    <div className="headind_srch">
                                        <div className="srch_bar">
                                            <div className="stylish-input-group"
                                                 style={{width: "100%", display: "flex"}}>
                                                <input type="text" style={{width: "100%"}} className="search-bar"
                                                       placeholder="Tìm kiếm "/>
                                                <span className="input-group-addon">
                                                      <button type="button" style={{marginTop: "10px"}}>
                                                          <i className="fa fa-search" aria-hidden="true"></i>
                                                      </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inbox_chat">
                                        {listCskh.map((c) => (
                                            <div key={c.id} className="chat_list" onClick={() => cskhInUser(c)}>
                                                <div className="chat_people">
                                                    <div className="chat_ib">
                                                        <h5>
                                                            {c.fromUser.username == user.username ? (
                                                                <>
                                                                    {c.toUser.username}
                                                                    <span
                                                                        className="chat_date">{calculateTimeChat(c.createAt)}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {c.fromUser.username}
                                                                    <span
                                                                        className="chat_date">{calculateTimeChat(c.createAt)}</span>
                                                                </>
                                                            )}
                                                        </h5>
                                                        <p>{c.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="mesgs">
                                    <div className="msg_history">
                                        {listCskhInUser.length == 0 ? (
                                            <div style={{width: "100%", height: "100%", textAlign: "center"}}>
                                                <h4 style={{marginTop: "150px", color: "gray"}}>Hãy chọn người dùng muốn
                                                    nhắn tin!</h4>
                                            </div>
                                        ) : (
                                            listCskhInUser.map((m, index) => (
                                                <div key={index}>
                                                    {m.fromUser.username !== user.username ? (
                                                        <div className="incoming_msg" style={{display: "block"}}>
                                                            <p>{m.fromUser.username}</p>
                                                            <div className="received_msg">
                                                                <div className="received_withd_msg">
                                                                    <p>{m.content}</p>
                                                                    <span
                                                                        className="time_date">{calculateTimeChat(m.createAt)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="outgoing_msg">
                                                            <div className="sent_msg">
                                                                <p>{m.content}</p>
                                                                <span
                                                                    className="time_date">{calculateTimeChat(m.createAt)}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                        {/*{listCskhInUser.length == 0 ? <></>:scrollAuto()}*/}
                                    </div>
                                    <div className="type_msg">
                                        <div className="input_msg_write">
                                            <input type="text" id={"cskh-content"} className="write_msg" placeholder="Nhập văn bản !"/>
                                            <button className="msg_send_btn" type="button" onClick={()=>createCskhAdmin()}>
                                                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                    border: "1px solid black",
                    scroll: "none",
                    overflow: "hidden",
                    backgroundColor: "#f72d7a"
                },
            }}
            id="id"
        >
            <div id={"headerModal"} style={{width: "100%", height: "20%", textAlign: "center", color: "black"}}>
                <h1>Tạo Phòng</h1>
            </div>
            <div id={"bodyModal"} style={{width: "100%", height: "80%"}}>
                <div style={{width: "100%", height: "80%"}}>
                    <input id={"usernameCreate"} className={"inputCreateRoom"} type="text"
                           placeholder={"Nhập tên người dùng !"}/>
                    <input id={"passwordCreate"} className={"inputCreateRoom"} type="password"
                           placeholder={"Đặt Password Phòng !"}/>
                    <input id={"pointCreate"} className={"inputCreateRoom"} type="number"
                           placeholder={"Số điểm cần trừ !"}/>
                </div>
                <div style={{width: "100%", height: "20%"}}>
                    <button style={{height: "30px", color: "white", backgroundColor: "#f72d7a"}}
                            className={"button-header-admin"} onClick={() => createChatRoom()}>
                        Tạo Phòng
                    </button>
                    <button className={"button-header-admin"}
                            style={{marginLeft: "10px", height: "30px", color: "white", backgroundColor: "#f72d7a"}}
                            onClick={() => closeModal()}>
                        Hủy
                    </button>
                </div>
            </div>
        </Modal>

        {isLogin && <Navigate to="/login"/>}
    </div>);
};

export default Admin;