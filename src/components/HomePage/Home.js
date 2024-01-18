import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import {useWebSocket} from "../../context/WebSocketContext";
import ManageService from "../../service/ManageService";
import {toast} from "react-toastify";
import Modal from "react-modal";
import "./Home.css"
import * as winwheel from "@evshiron/winwheel.js";
import spinOffImage from "./spin_off.png";

const Home = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isChatRoom, setIsChatRoom] = useState(false);
    const [load, setLoad] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isDivChatAdmin, setIsDivChatAdmin] = useState(false);

    const [timeRemainingVisible, setTimeRemainingVisible] = useState(true);
    const [wheel, setWheel] = useState(null);
    const [listCskh, setListCskh] = useState()
    const [wheelPower, setWheelPower] = useState(0);
    const [wheelSpinning, setWheelSpinning] = useState(false);
    const [lastSpinTime, setLastSpinTime] = useState(null);

    const [user, setUser] = useState({});
    const [chatRoom, setChatRoom] = useState({});
    const webSocket = useWebSocket();

    useEffect(() => {
        if (webSocket) {
            webSocket.subscribe('/chat/user/queue/notification', async (message) => {
                setLoad(true)
            });
            webSocket.subscribe("/user/queue/extraPoints", async (response) => {
                setLoad(true)
            })
            webSocket.subscribe("/user/queue/minusPoints", async (response) => {
                setLoad(true)
            })
            webSocket.subscribe('/chat/user/queue/cskh', async (message) => {
                const msg = JSON.parse(message.body);
                setLoad(true)
            });
        }
    }, [webSocket]);
    useEffect(() => {
        ManageService.getAllCskhUser().then((response) => {
            const uniqueContents = [];
            let prevContent = null;

            response.data.forEach((cskh) => {
                // Kiểm tra xem nội dung hiện tại có giống với nội dung trước đó không
                if (cskh.content !== prevContent) {
                    uniqueContents.push(cskh);
                }

                // Gán nội dung hiện tại cho prevContent để so sánh ở lần lặp tiếp theo
                prevContent = cskh.content;
            });

            setListCskh(uniqueContents);
        }).catch((err) => {
            console.log(err);
        });
    }, [load]);

    useEffect(() => {
        ManageService.loggedInUser().then((response) => {
            setUser(response.data)
            setLoad(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [load]);

    useEffect(() => {

        setWheel(theWheel);
        updateRemainingTime();

        return () => {
        };
    }, []);
    const setDivChatAdmin = () => {
        if (isDivChatAdmin) {
            setIsDivChatAdmin(false)
        } else {
            setIsDivChatAdmin(true)
        }
    }
    // const handleBeforeUnload = (event) => {
    //     logout();
    // };
    // window.addEventListener('beforeunload', handleBeforeUnload);
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
    const createCskh = () => {
        let CskhRepuest = {
            content: document.getElementById("content-cskh-123").value
        }
        if (document.getElementById("content-cskh-123").value != "") {
            ManageService.createCskh(CskhRepuest).then((response) => {
                toast.success("gửi tin nhắn thành công !")
            }).catch((err) => {
                console.log(err)
            })
        } else {
            toast.warning("chưa nhập văn bản !")
        }

    }
    const checkChatRoom = () => {
        if (document.getElementById("passwordChatRoom").value == '') {
            toast.warning("chưa nhập mật khẩu vào phòng !")
        } else {
            let chatRoomCheck = {
                id: chatRoom.id, password: document.getElementById("passwordChatRoom").value
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
    const closeModal = () => {
        setModalIsOpen(false);
    };
    const openModal = () => {
        setModalIsOpen(true);
    }
    // -------------------------------------------------------------------------- code anh đạt
    const theWheel = new winwheel.Winwheel({
        'numSegments': 8,
        'outerRadius': 212,
        'textFontSize': 28,
        'segments': [
            {
                'fillStyle': '#eae56f',
                'text': '100'
            }, {
                'fillStyle': '#89f26e',
                'text': '200'
            }, {
                'fillStyle': '#7de6ef',
                'text': '300'
            }, {
                'fillStyle': '#e7706f',
                'text': '400'
            }, {
                'fillStyle': '#eae56f',
                'text': '500'
            }, {
                'fillStyle': '#89f26e',
                'text': '600'
            }, {
                'fillStyle': '#7de6ef',
                'text': '700'
            }, {
                'fillStyle': '#e7706f',
                'text': '800'
            }],
        'animation': {
            'type': 'spinToStop', 'duration': 5, 'spins': 8, 'callbackFinished': alertPrize
        }
    });


    const canSpinToday = () => {
        let lastSpinTime = localStorage.getItem('lastSpinTime');
        if (!lastSpinTime) return true; // No last spin time, allow spin
        let oneDayInMillis = 10 * 1000;
        let currentTime = new Date().getTime();
        let lastSpinDate = new Date(parseInt(lastSpinTime));
        let timeSinceLastSpin = currentTime - lastSpinDate.getTime();

        if (timeSinceLastSpin >= oneDayInMillis) {
            localStorage.removeItem('lastSpinTime');
            return true; // Allow spin
        }

        return false;

    };

    const updateRemainingTime = () => {
        let lastSpinTime = localStorage.getItem('lastSpinTime');
        let timeRemainingElement = document.getElementById('time_remaining');

        if (!lastSpinTime || canSpinToday()) {
            timeRemainingElement.style.display = "none";
            return;
        }
        let oneDayInMillis = 10 * 1000;
        let currentTime = new Date().getTime();
        let lastSpinDate = new Date(parseInt(lastSpinTime));
        let timeSinceLastSpin = currentTime - lastSpinDate.getTime();

        let remainingTime = oneDayInMillis - timeSinceLastSpin;

        if (remainingTime > 0) {
            let remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
            let remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
            let remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

            timeRemainingElement.innerHTML = "Next spin in: " + remainingHours + "h " + remainingMinutes + "m " + remainingSeconds + "s";
            timeRemainingElement.style.display = "block";
        } else {
            timeRemainingElement.style.display = "none";
        }
    };
    useEffect(() => {
        // Kiểm tra xem người dùng đã quay trong ngày chưa
        const hasSpunToday = localStorage.getItem('hasSpunToday');
        if (hasSpunToday) {
            // Nếu đã quay trong ngày, ẩn nút quay
            document.getElementById('spin_button').style.display = 'none';
            // Hiển thị thông báo hoặc thay đổi giao diện nếu cần
        } else {
            // Nếu chưa quay trong ngày, hiển thị nút quay
            document.getElementById('spin_button').style.display = 'block';
        }
    }, []);
    const trySpin = () => {
        const hasSpunToday = localStorage.getItem('hasSpunToday');
        if (!hasSpunToday) {
            startSpin();
            localStorage.setItem('lastSpinTime', new Date().getTime());
            localStorage.setItem('hasSpunToday', true);
            updateRemainingTime();
        } else {
            alert("Bạn chỉ có thể quay một lần mỗi ngày!");
        }
    };

    const calculatePrize = () => {
        const angleRanges = [{start: 0, end: 90, ratio: 0.95}, {start: 90, end: 180, ratio: 0.03}, {
            start: 180,
            end: 270,
            ratio: 0.02
        }, {start: 270, end: 360, ratio: 0}];

        let randomValue = Math.random();
        let stopAt;

        for (const range of angleRanges) {
            if (randomValue < range.ratio) {
                stopAt = Math.random() * (range.end - range.start) + range.start;
                break;
            } else {
                randomValue -= range.ratio;
            }
        }

        theWheel.animation.stopAngle = stopAt;
        theWheel.startAnimation();
    };

    const powerSelected = (powerLevel) => {
        if (wheelSpinning == false) {
            document.getElementById('pw1').className = "";
            document.getElementById('pw2').className = "";
            document.getElementById('pw3').className = "";
            if (powerLevel >= 1) {
                document.getElementById('pw1').className = "pw1";
            }

            if (powerLevel >= 2) {
                document.getElementById('pw2').className = "pw2";
            }

            if (powerLevel >= 3) {
                document.getElementById('pw3').className = "pw3";
            }
            setWheelPower(powerLevel)

            document.getElementById('spin_button').src = "spin_on.png";
            document.getElementById('spin_button').className = "clickable";
        }
    };

    const startSpin = () => {
        if (wheelSpinning == false) {
            if (wheelPower == 1) {
                theWheel.animation.spins = 3;
            } else if (wheelPower == 2) {
                theWheel.animation.spins = 8;
            } else if (wheelPower == 3) {
                theWheel.animation.spins = 15;
            }
            document.getElementById('spin_button').src = "spin_off.png";
            document.getElementById('spin_button').className = "";

            calculatePrize();
            theWheel.startAnimation();
            setWheelSpinning(true)
        }
    };

    const resetWheel = () => {
        theWheel.stopAnimation(false);
        theWheel.rotationAngle = 0;
        theWheel.draw();
        setWheelSpinning(false)
    };

    function alertPrize(indicatedSegment) {
         extraPointsInUser(indicatedSegment.text)
        resetWheel();
    }
   const extraPointsInUser = (point) => {
        let PointRequest = {
            username :"",
            point : point
        }
     ManageService.extraPointsInUser(PointRequest).then((response)=>{
            toast.success("bạn đã nhận được :"+point +" điểm thưởng !")
            setLoad(true)
     }).catch((err)=>{
         console.log(err)
     })
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

    return (<div>
        <div style={{display: "flex", backgroundColor: "#f72d7a", height: "100px"}}>
            <div style={{width: "80%", display: "flex"}}>
                <div id={"div-header-img"} style={{width: "80%"}}>

                </div>
                <div style={{width: "300px", height: "50px", marginTop: "30px", display: "flex"}}>
                    <h3 style={{marginTop: "0px"}}>{user.username}|</h3>
                    <p style={{marginTop: "0px", marginLeft: "5px"}}>point :{user.point}</p>
                </div>
            </div>
            <div className="group" style={{display: "flex", height: "25px", marginTop: "30px"}}>
                <svg onClick={() => findByChatRoomId()}
                     style={{position: "absolute", left: "1rem", fill: "#9e9ea7", width: "1rem", height: "1trem"}}
                     aria-hidden="true" viewBox="0 0 24 24">
                    <g>
                        <path
                            d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                    </g>
                </svg>
                <input id={"idChatRoom"} placeholder="Search" type="search" className="idChatRoom"/>
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
            <div id={"div-luckySpin-body"}>

            </div>
            <div style={{width: "40%", textAlign: "center"}}>
                <div id={"div-lucky-spin-header"}>
                    <h1 style={{color: '#ef6f6f', width: "100%"}}>Vòng quay may mắn</h1>
                    <p>Mỗi ngày bạn sẽ có một lượt quay để kiếm về điểm thưởng.</p>
                </div>
                <div className="power_controls">
                    <div id="time_remaining"
                        // style={{ display: timeRemainingVisible ? setTimeRemainingVisible('block') : setTimeRemainingVisible('none')}}
                    ></div>
                </div>
                <table style={{border: "hidden", marginTop: "80px", width: "400px", marginLeft: "25px"}}>
                    <tbody>
                    <tr>
                        <td
                            className="the_wheel"
                            align="center"
                            valign="center"
                            style={{border: "hidden", height: "500px"}}
                        >
                            <canvas id="canvas" width="434" height="434">
                                <p style={{color: 'white'}} align="center">
                                    Sorry, your browser doesn't support canvas. Please try another.
                                </p>
                            </canvas>
                            <button
                                id="spin_button"
                                style={{border: "hidden", width: "100px", height: "50px"}}
                                onClick={() => trySpin()}
                            ><span>Quay</span>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{
                content: {
                    width: "300px",
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
            <div style={{display: "flex"}}>
                <div className="group">
                    <input id={"passwordChatRoom"} style={{height: "30px"}} placeholder="password ... !"
                           type="password" className="idChatRoom"/>
                </div>
                {/*<button onClick={()=>checkChatRoom()} style={{marginLeft :"10px"}}>Vào</button>*/}
                <button id={"button-svg-123"} style={{height: "35px", marginLeft: "10px"}}
                        onClick={() => checkChatRoom()}>
                    Vào
                    <div className="arrow-wrapper">
                        <div className="arrow"></div>
                    </div>
                </button>
            </div>
        </Modal>
        {isDivChatAdmin ?
            <div id={"div-chat-admin-user"}>
                <div style={{
                    width: "100%",
                    height: "40px",
                    backgroundColor: "#f72d7a",
                    borderTopRightRadius: "8px",
                    borderTopLeftRadius: "8px",
                    display: "flex"
                }}>
                    <div style={{width: "93%", textAlign: "center", color: "white"}}>
                        <h3 style={{marginBottom: "5px"}}>tìm bạn bốn phương </h3>
                    </div>
                    <div style={{color: "white", fontSize: "20px", fontWeight: "bold"}}
                         onClick={() => setDivChatAdmin()}>_
                    </div>
                </div>
                <div style={{
                    width: "100%",
                    height: "480px",
                    borderBottomLeftRadius: "5px",
                    borderBottomRightRadius: "8px",
                    backgroundColor :"white"
                }}>
                    <div style={{overflow: "scroll", height: "430px"}}>
                        {listCskh.map((c) => (
                            <div key={c.id}>
                                {c.fromUser.username !== user.username ? (
                                    <div className="incoming_msg" style={{display: "block"}}>
                                        <div className="received_msg">
                                            <div className="received_withd_msg">
                                                <p>{c.content}</p>
                                                <span
                                                    className="time_date">{calculateTimeChat(c.createAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="outgoing_msg">
                                        <div className="sent_msg">
                                            <p>{c.content}</p>
                                            <span
                                                className="time_date">{calculateTimeChat(c.createAt)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="type_msg">
                        <div className="input_msg_write">
                            <input id={"content-cskh-123"} type="text" className="write_msg"
                                   placeholder="Nhập văn bản !"
                                   style={{borderBottomRightRadius: "5px", borderBottomLeftRadius: "5px" ,border:"1px solid grey"}}/>
                            <button className="msg_send_btn" type="button" onClick={() => createCskh()}>
                                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div> : <></>}

        <button className="button-cskh" onClick={() => setDivChatAdmin()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="46" viewBox="0 0 46 46" height="46" fill="none"
                 className="svg-icon">
                <path strokeWidth="2" strokeLinecap="round" stroke="#fff" fill-rule="evenodd"
                      d="m14.5037 27.0715c.819-.634 1.7094-1.1699 2.653-1.597.7621-.3521 1.2557-1.1094 1.2699-1.9488-.0073-1.1346.7466-2.1517 1.8673-2.3279 1.7701-.2782 3.5728-.2785 5.3429-.0005 1.1206.1759 1.8744 1.193 1.8669 2.3274.0206.8307.5066 1.5791 1.257 1.9359.981.4173 1.9093.9489 2.7657 1.5838.8765.5876 2.0467.4715 2.791-.2769l2.2507-2.2507c.4294-.4283.6617-1.0157.6414-1.6219-.0308-.5985-.314-1.1559-.7793-1.5337-2.5842-2.0976-5.6309-3.5496-8.888-4.2357-2.9976-.6659-6.1047-.6655-9.1023.0009-3.2453.7041-6.2835 2.1503-8.87655 4.2253l-.12568.1256c-.38501.38-.60996.8929-.62872 1.4334-.02687.6011.20148 1.1854.62847 1.6092l2.25008 2.2501c.7307.7914 1.9343.9202 2.8162.3015z"
                      clip-rule="evenodd"></path>
            </svg>
        </button>
        {isLogin && <Navigate to="/login"/>}
        {isChatRoom && <Navigate to="/chatRoom"/>}
    </div>);
};

export default Home;