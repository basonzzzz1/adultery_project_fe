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
    const [canRequest, setCanRequest] = useState(true);

    // const [timeRemainingVisible, setTimeRemainingVisible] = useState(true);
    const [wheel, setWheel] = useState(null);
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
            webSocket.subscribe("/user/queue/extraPoints",async (response)=>{
               setLoad(true)
            })
            webSocket.subscribe("/user/queue/minusPoints",async (response)=>{
               setLoad(true)
            })
        }
    }, [webSocket]);
    useEffect(() => {
        ManageService.loggedInUser().then((response)=>{
            setUser(response.data)
            setLoad(false)
        }).catch((err)=>{
            console.log(err)
        })
    }, [load]);

    useEffect(() => {

        setWheel(theWheel);
        updateRemainingTime();

        return () => {
        };
    }, []);
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
        ManageService.logOut(user.username).then((response) =>{
            localStorage.removeItem("userToken")
            localStorage.removeItem("limit")
            localStorage.removeItem("idAccount")
            localStorage.removeItem("account")
            localStorage.removeItem("load")
            setIsLogin(true)
        }).catch((err)=>{
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
            { 'fillStyle': '#eae56f', 'text': 'Prize 1' },
            { 'fillStyle': '#89f26e', 'text': 'Prize 2' },
            { 'fillStyle': '#7de6ef', 'text': 'Prize 3' },
            { 'fillStyle': '#e7706f', 'text': 'Prize 4' },
            { 'fillStyle': '#eae56f', 'text': 'Prize 5' },
            { 'fillStyle': '#89f26e', 'text': 'Prize 6' },
            { 'fillStyle': '#7de6ef', 'text': 'Prize 7' },
            { 'fillStyle': '#e7706f', 'text': 'Prize 8' }
        ],
        'animation': {
            'type': 'spinToStop',
            'duration': 5,
            'spins': 8,
            'callbackFinished': alertPrize
        }
    });




    const canSpinToday = () => {
        let lastSpinTime = localStorage.getItem('lastSpinTime');
        if (!lastSpinTime) return true; // No last spin time, allow spin
        let oneDayInMillis =  10 * 1000;
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
        let oneDayInMillis =  10 * 1000;
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
    const trySpin = () => {
        if (canSpinToday()) {
            startSpin();
            localStorage.setItem('lastSpinTime', new Date().getTime());
            updateRemainingTime();
        } else {
            alert("You can spin only once per day!");
        }
    };
    //
    const calculatePrize = () => {
        const angleRanges = [
            { start: 0, end: 90, ratio: 0.95 },
            { start: 90, end: 180, ratio: 0.03 },
            { start: 180, end: 270, ratio: 0.02 },
            { start: 270, end: 360, ratio: 0 }
        ];

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
            }
            else if (wheelPower == 2) {
                theWheel.animation.spins = 8;
            }
            else if (wheelPower == 3) {
                theWheel.animation.spins = 15;
            }

            document.getElementById('spin_button').src       = "spin_off.png";
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
        setWheelSpinning(false)    };

    function alertPrize(indicatedSegment) {
        alert("Bạn kiếm được " + indicatedSegment.text);
        resetWheel();
    }

    return (
        <div>
            <div style={{display: "flex", backgroundColor: "#f72d7a", height: "100px"}}>
                <div style={{width: "80%" , display :"flex"}}>
                    <div id={"div-header-img"} style={{width :"80%"}}>

                    </div>
                    <div style={{width :"300px",height : "50px" , marginTop :"30px" , display :"flex"}}>
                        <h3 style={{marginTop :"0px"}}>{user.username}|</h3>
                        <p style={{marginTop :"0px" , marginLeft :"5px"}}>point :{user.point}</p>
                    </div>
                </div>
                {/*<div style={{display: "flex", height: "25px", marginTop: "14px"}}>*/}
                {/*    <input type="text" id={"idChatRoom"} placeholder={"Tìm Kiếm ..."}/>*/}
                {/*    <button style={{marginLeft: "10px"}} onClick={() => findByChatRoomId()}>Tìm</button>*/}
                {/*</div>*/}
                    <div className="group" style={{display: "flex", height: "25px", marginTop: "30px"}}>
                        <svg onClick={() => findByChatRoomId()} style={{position :"absolute" , left :"1rem" , fill :"#9e9ea7",width:"1rem" , height:"1trem"}} aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
                        <input  id={"idChatRoom"}  placeholder="Search" type="search" className="idChatRoom" />
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
            <div style={{width :"100%",display :"flex"}}>
                <div style={{width:"58%"}}>
                      null
                </div>
                <div align="center" style={{width:"40%"}}>
                    <h1 style={{ color: '#ef6f6f' }}>Vòng quay may mắn</h1>
                    <p>Mỗi ngày bạn sẽ có một lượt quay để kiếm về điểm thưởng.</p>
                    <table style={{border :"hidden"}}>
                        <tbody>
                        <tr>
                            <td>
                                <div className="power_controls">
                                    <img
                                        id="spin_button"
                                        src={spinOffImage}
                                        alt="Spin"
                                        style={{border :"hidden"}}
                                        onClick={()=>trySpin()}
                                    />
                                    {/*<button  onClick={()=>trySpin()}>Quay</button>*/}
                                    <br />
                                    <br />
                                    <div
                                        id="time_remaining"
                                        // style={{ display: timeRemainingVisible ? setTimeRemainingVisible('block') : setTimeRemainingVisible('none') }}
                                        // style={{display :"none"}}
                                    ></div>
                                </div>
                            </td>
                            <td
                                className="the_wheel"
                                align="center"
                                valign="center"
                                style={{border :"hidden" , height :"500px"}}
                            >
                                <canvas  id="canvas" width="434" height="434">
                                    <p style={{ color: 'white' }} align="center">
                                        Sorry, your browser doesn't support canvas. Please try another.
                                    </p>
                                </canvas>
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
                <div style={{display : "flex"}}>
                    <div className="group" >
                        <input id={"passwordChatRoom"} style={{height:"30px"}} placeholder="password ... !" type="password" className="idChatRoom" />
                    </div>
                    {/*<button onClick={()=>checkChatRoom()} style={{marginLeft :"10px"}}>Vào</button>*/}
                    <button id={"button-svg-123"} style={{height :"35px",marginLeft:"10px" }} onClick={()=>checkChatRoom()}>
                        Vào
                        <div className="arrow-wrapper">
                            <div className="arrow"></div>
                        </div>
                    </button>
                </div>
            </Modal>
            {isLogin && <Navigate to="/login"/>}
            {isChatRoom && <Navigate to="/chatRoom"/>}
        </div>
    );
};

export default Home;