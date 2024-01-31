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
    const [listExchangePoints, setListExchangePoints] = useState([]);
    const [nameCskhUser, setNameCskhUser] = useState("");
    const [listCskh, setListCskh] = useState([])
    const [listCskhInUser, setListCskhInUser] = useState([])
    const [spinValue, setSpinValue] = useState(0)
    const [user, setUser] = useState({});
    const [load, setLoad] = useState(true);
    const [listValueSpin, setListValueSpin] = useState([])
    const [isLogin, setIsLogin] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        // Đăng ký sự kiện lắng nghe khi kích thước cửa sổ thay đổi
        window.addEventListener('resize', handleResize);

        // Làm sạch sự kiện khi component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
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
        ManageService.getListValueSpin().then((response) => {
            setListValueSpin(response.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [load]);
    useEffect(() => {
        if (webSocket) {
            webSocket.subscribe('/chat/user/queue/notification', async (message) => {
                setLoad(true)
            });
            webSocket.subscribe('/chat/user/queue/cskh', async (message) => {
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
        ManageService.getAllCskhInUserAdmin()
            .then((response) => {
                const sortedListCskh = response.data.sort((a, b) => {
                    const timeA = new Date(a.createAt).getTime();
                    const timeB = new Date(b.createAt).getTime();
                    return timeB - timeA;
                });
                setListCskh(sortedListCskh);
            })
            .catch((err) => {
                console.log(err);
            });

        ManageService.getAllExchangePoints().then((response) => {
            setListExchangePoints(response.data)
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
    }, [load]);
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
                setLoad(true)
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
        let cskhAdminRequest = {
            username: nameCskhUser,
            content: document.getElementById("cskh-content").value
        }
        if (nameCskhUser != "" && document.getElementById("cskh-content").value != "") {
            ManageService.createCskhAdmin(cskhAdminRequest).then((response) => {
                toast.success("gửi tin nhắn thành công !")
            }).catch((err) => {
                console.log(err)
            })
        } else {
            toast.warning("chưa chọn người dùng hoặc tin nhắn rỗng !")
        }

    }
    const deleteChatRoom = (id) => {
        let chatRoomRequest = {
            idChatRoom: id
        }
        ManageService.deleteChatRoom(chatRoomRequest).then((response) => {
            setLoad(true)
        }).catch((err) => {
            console.log(err)
        })
    }
    const scrollAuto = () => {
        let objDiv = document.getElementById("msg_history");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    const editSpin = (u) => {
        let spinRequest = {
            username: u.username,
            point: spinValue
        }
        ManageService.SpinRequest(spinRequest).then((res) => {
            toast.success("sửa thành công !")
        }).catch((err) => {
            console.log(err)
            toast.warning("lỗi !")
        })
    }
    const setListSpinValue = () => {
        ManageService.setListValueSpin(listValueSpin).then((response) => {
            setListValueSpin(response.data)
            toast.success("thành công !")
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleSpinInputChange = (e) => {
        setSpinValue(e.target.value);
    };
    const pSpin = (id) => {
        document.getElementById("p-spin" + id).style.display = "none"
    }
    const handleInputChange = (event, index) => {
        const updatedList = [...listValueSpin];
        updatedList[index].val = event.target.value;
        setListValueSpin(updatedList);
    };
    const deleteExchangePoints = (id) => {
        let ExchangePoints = {
            id: id,
        }
        ManageService.deleteExchangePoints(ExchangePoints).then((response) => {
            setLoad(true)
        }).catch((err) => {
            console.log(err)
        })
    }
    const responsiveStyles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f72d7a',
            padding: '10px',
        },
        body: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
        },
        adminButtons: {
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '10px',
        },
        spinInput: {
            display: 'flex',
            marginBottom: '10px',
        },
        chatRooms: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '10px',
        },
        chatBox: {
            display: 'flex',
            flexDirection: 'column',
        },
        exchangePoints: {
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid black',
            marginBottom: '10px',
        },
        modalContent: {
            width: '27%',
            height: '27%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f72d7a',
            border: '1px solid black',
            overflow: 'hidden',
        },
    };

    return (
        <div style={responsiveStyles.container}>
            <div id={"body-admin-template"} style={{
                display: 'flex',
                width: "100%",
                backgroundColor: '#f72d7a',
                padding: '10px',
                position: "fixed",
                top: "0",
                zIndex: "130",
                marginBottom: '10px'
            }}>
                <div id={"body-admin-1"}
                     style={{width: "95%", marginTop: "20px", display: windowWidth > 800 ? "flex" : "block"}}>
                    <button className={"button-header-admin"} onClick={() => openModal()}
                            style={{
                                marginLeft: "10px",
                                height: "30px",
                                color: "white",
                                backgroundColor: "#f72d7a",
                                marginTop: "3px"
                            }}
                    >Tạo Phòng
                    </button>
                    <div style={{marginTop: "5px"}}>
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
                        <div style={{width: "100%", display: "flex"}}>
                            <input className={"inputCreateRoom"} id={"input-username-point"}
                                   style={{marginLeft: "10px", width: "23%", height: "25px"}} type="text"
                                   placeholder={"nhập tên người dùng ...!"}/>
                            <input className={"inputCreateRoom"} id={"input-point"}
                                   style={{marginLeft: "10px", width: "30%", height: "25px"}} type="number"
                                   placeholder={"nhập số điểm ...!"}/>
                        </div>
                    </div>
                    <div style={{display: "block", marginTop: "5px", marginLeft: "10px"}}>
                        <div style={{width: "100%", display: "flex"}}>
                            <div style={{display: "block"}}>
                                <div style={{display: "flex"}}>
                                    {listValueSpin.map((value, index) => (
                                        <input
                                            key={index}
                                            type="number"
                                            style={{width: "50px"}}
                                            value={value.val}  // Set the value from listValueSpin
                                            onChange={(e) => handleInputChange(e, index)}  // Add an onChange handler if needed
                                        />
                                    ))}
                                </div>
                                <div>
                                    1-2 : tỉ lệ 80%,3-4 : tỉ lệ 10%,5-6 : tỉ lệ 7%,7-8 : tỉ lệ 3%
                                </div>
                            </div>
                            <button style={{height: "30px"}} onClick={() => setListSpinValue()}>Lưu</button>
                        </div>
                        <div style={{width: "100%"}}>

                        </div>
                    </div>
                </div>
                <div style={{width: "30px", marginBottom: "50px"}}>
                    <button onClick={() => logout()}
                            style={{backgroundColor: "#f72d7a", border: "hidden", marginTop: "25px"}}>
                <span className="icon" style={{color: "white", textAlign: "center", backgroundColor: "#f72d7a"}}>
                <i style={{fontSize: "30px", border: "1px solid gray"}} className='bx bxs-exit'></i>
                </span>
                    </button>
                </div>
            </div>
            <div id={"body-admin-999"}
                 style={{marginTop: "200px", width: "100%", display: "block", justifyContent: "center"}}>
                <div style={{width: "100%", height: "350px"}}>
                    <div id={"management-user-h2"}
                         style={{width: "100%", marginLeft: windowWidth > 800 ? "40%" : "20%"}}>
                        <h2>Quản lý tài khoản</h2>
                        <p>Độ rộng của màn hình: {windowWidth}</p>
                    </div>
                    <div id={"management-user-table"}
                         style={{
                             height: "300px",
                             marginLeft: windowWidth > 800 ? "25%" : "0%",
                             overflowY: "scroll",
                             display: "inline-block",
                             width: "auto",
                             overflowX: "hidden"
                         }}>
                        <table>
                            <thead>
                            <tr>
                                <th>Id Tài khoản</th>
                                <th>Tên Tài khoản</th>
                                <th>Trạng thái</th>
                                <th>Banner</th>
                                <th>Điểm</th>
                                <th>Quyền hạn</th>
                                <th>Vòng quay</th>
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
                                <td style={{display: "flex"}}>
                                    <p id={"p-spin" + u.id} style={{position: ""}}>{u.spin}</p>
                                    <input id={"inputSpin" + u.id} style={{width: "50px", textAlign: "center"}}
                                           onChange={handleSpinInputChange} onClick={() => pSpin(u.id)}/>
                                    <button className="edit-button" style={{
                                        backgroundColor: "yellow",
                                        marginLeft: "5px",
                                        borderRadius: "5px",
                                        border: "2px solid gray"
                                    }} onClick={() => editSpin(u)}>
                                        <i className="fa fa-save"></i>
                                    </button>
                                </td>
                            </tr>))}
                            </tbody>
                        </table>

                    </div>
                </div>

                <div style={{
                    width: "99%",
                    height: "380px",
                    marginTop: "30px",
                    marginLeft: windowWidth > 800 ? "20%" : "0%"
                }}>
                    <div style={{width: "100%", marginLeft: windowWidth > 800 ? "20%" : "25%"}}>
                        <h2>Quản lý phòng chat</h2>
                    </div>
                    <table>

                    </table>
                    <thead>
                    <tr>
                        <th>Id Phòng</th>
                        <th>Mật Khẩu</th>
                        <th>Ngày Tạo</th>
                        <th>Người dùng 1</th>
                        <th>Người dùng 2</th>
                        <th>xóa phòng</th>
                    </tr>
                    </thead>
                    <tbody style={{overflowY: "scroll"}}>
                    {ChatRoom.map((c) => (
                        <tr>
                            <td>{c.id}</td>
                            <td>{c.password}</td>
                            <td>{calculateTimeChat(c.createAt)}</td>
                            {c.user1 == null ? <td>
                                Trống
                            </td> : <td>{c.user1.username}</td>}
                            {c.user2 == null ? <td>
                                Trống
                            </td> : <td>{c.user2.username}</td>}
                            <td style={{textAlign: "center"}}>
                                <button className="btn-1" onClick={() => deleteChatRoom(c.id)}>
                                    <svg viewBox="0 0 15 17.5" height="17.5" width="15"
                                         xmlns="http://www.w3.org/2000/svg" className="icon">
                                        <path transform="translate(-2.5 -1.25)"
                                              d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                                              id="Fill"></path>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </div>
                <div style={{width: "100%", height: "800px",marginTop:"150px"}}>
                    <div className="container-chat-box" style={{width: windowWidth > 800 ? "100%":"160%", margin: "0 auto",}}>
                        <h3 className="text-center">Cskh</h3>
                        <div className="messaging">
                            <div className="inbox_msg">
                                <div className="inbox_people">
                                    <div className="headind_srch">
                                        <div className="srch_bar">
                                            <div className="stylish-input-group"
                                                 style={{width: "100%", display: "flex"}}>
                                                <input type="text" style={{width: "100%"}}
                                                       className="search-bar"
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
                                                <h4 style={{marginTop: "150px", color: "gray"}}>Hãy chọn người
                                                    dùng
                                                    muốn
                                                    nhắn tin!</h4>
                                            </div>
                                        ) : (
                                            listCskhInUser.map((m, index) => (
                                                <div key={index}>
                                                    {m.fromUser.username !== user.username ? (
                                                        <div className="incoming_msg"
                                                             style={{display: "block"}}>
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
                                            <input type="text" id={"cskh-content"} className="write_msg"
                                                   placeholder="Nhập văn bản !"/>
                                            <button className="msg_send_btn" type="button"
                                                    onClick={() => createCskhAdmin()}>
                                                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: windowWidth > 800 ? "100%":"160%", border: "1px solid black"}}>
                    <div style={{textAlign: "center"}}>
                        <h3>đổi tiền !</h3>
                    </div>
                    <div style={{overflowY: "scroll", maxHeight: "600px"}}>
                        {listExchangePoints.map((e) => (
                            e.id % 2 !== 0 ?
                                <div style={{backgroundColor: "grey", paddingBottom: "5px"}}>
                                    <p style={{marginLeft: "10px"}}>
                                        {e.username} muốn đổi :{e.point} điểm đến ngân hàng : {e.bankName} có số tài
                                        khoản là :{e.bankCode} với nội dung là : {e.content}
                                    </p>
                                    <button onClick={() => deleteExchangePoints(e.id)}
                                            style={{marginLeft: "10px", borderRadius: "4px"}}>
                                        xóa
                                    </button>
                                </div>
                                :
                                <div style={{paddingBottom: "5px"}}>
                                    <p style={{marginLeft: "10px"}}>
                                        {e.username} muốn đổi :{e.point} điểm đến ngân hàng : {e.bankName} có số tài
                                        khoản là :{e.bankCode} với nội dung là : {e.content}
                                    </p>
                                    <button onClick={() => deleteExchangePoints(e.id)}
                                            style={{marginLeft: "10px", borderRadius: "4px"}}>
                                        xóa
                                    </button>
                                </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        width: windowWidth > 800 ? "27%" : "100%",
                        height: "27%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        overlay: {
                            backgroundColor: "rgba(0,0,0,0)",
                        },
                        border: "1px solid black",
                        scroll: "none",
                        overflowY: "hidden",
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