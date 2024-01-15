import React, {useEffect, useState} from 'react';
import {useWebSocket} from "../../context/WebSocketContext";
import ManageService from "../../service/ManageService";
import {Navigate} from "react-router-dom";
import "./ChatRoom.css"
import {toast} from "react-toastify";

const ChatRoom = () => {
    const webSocket = useWebSocket();
    const [isExit, setIsExit] = useState(false);
    const [load, setLoad] = useState(true);
    const [listMessage, setListMessage] = useState([]);
    const [user, setUser] = useState({});
    const [elapsedTime, setElapsedTime] = useState(0);
    useEffect(() => {
        if (webSocket) {
            webSocket.subscribe('/chat/user/queue/position-update', async (message) => {
                setLoad(true)
                scrollAuto()
            });
        }
    }, [webSocket,load]);
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("account")))
        console.log(JSON.parse(localStorage.getItem("account")))
    }, []);
    useEffect(() => {
        ManageService.findAllMessageByChatRoomId(localStorage.getItem('idChatRoom')).then((response) => {
            const sortedMessages = response.data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
            setListMessage(sortedMessages);
            scrollAuto()
        }).catch((err) => {
            console.log(err)
        })
    }, [localStorage.getItem('idChatRoom'), load]);
    useEffect(() => {
        if (load){
            scrollAuto()
        }
        setLoad(false)
    }, [load]);
    const createMessageUser = () => {
        let content = document.getElementById("messageInput").value
        let message = {
            content: content,
            seen: false,
            user: {username: user.username},
            chatRoom: {id: localStorage.getItem("idChatRoom")}
        }
        ManageService.createMessage(message).then((response) => {
            toast.success("Gửi Thành công !")
            document.getElementById("messageInput").value = "";
            setLoad(true)
        }).catch((err) => {
            toast.error("gửi không thành công !")
            console.log(err)
        })
    }
    const Exit = () => {
        setIsExit(true)
    }

    function calculateTimeChat(createdAt) {
        const currentTime = new Date();
        const postedTime = new Date(createdAt);
        const timeDiff = currentTime - postedTime;
        if (timeDiff < 60000) {
            return Math.floor(timeDiff / 1000) + " giây trước";
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

    const scrollAuto = () => {
        let objDiv = document.getElementById("bodyMessage");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    return (
        <div id={"div-body"}>
            <div style={{display: "flex", height: "100px" , backgroundColor : "#f72d7a"}}>
                <div id={"chatRoom-header-img"} style={{width: "95%"}}>

                </div>
                <div style={{width: "30px", marginTop: "10x", marginLeft: "20px"}}>
                    <div style={{width: "30px"}}>
                        <button onClick={() => Exit()}
                                style={{backgroundColor: "#f72d7a", border: "hidden", marginTop: "10px"}}>
                <span className="icon" style={{color: "black", textAlign: "center"}}>
                <i style={{color :"white", fontSize: "30px", border: "1px solid gray" ,backgroundColor: "#f72d7a"}} className='bx bxs-exit'></i>
                </span>
                        </button>
                    </div>
                </div>
            </div>
            <div  style={{
                width: "99%",
                height: "700px",
                marginLeft: "6px",
                marginTop: "10px",
            }}>
                <div id={"bodyMessage"}
                     style={{
                         width: '100%',
                         height: '85%',
                         display: 'block',
                         overflowY : "scroll"
                     }}
                >
                    {listMessage.map((m) => (
                        <div
                            key={m.id}
                            style={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: m.user.id == localStorage.getItem('idAccount') ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div
                                className={m.user.id == localStorage.getItem('idAccount') ? 'my-message' : 'other-message'}
                            >
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'block', float: m.user.id == localStorage.getItem('idAccount') ? 'right' : 'left' }}>
                                        <p style={{color : "#a2a2a2", fontSize: '10px', height: '5px', textAlign: m.user.id == localStorage.getItem('idAccount') ? 'right' : 'left' }}>
                                            {calculateTimeChat(m.createAt)}
                                        </p>
                                        <p style={{color : "#a2a2a2", height: '5px', textAlign: m.user.id == localStorage.getItem('idAccount') ? 'right' : 'left' }}>
                                            {m.user.username}
                                        </p>
                                    </div>
                                </div>
                                <br />
                                <div
                                    style={{
                                        backgroundColor: m.user.id == localStorage.getItem('idAccount') ? '#f72d7a':'white',
                                        marginTop: '28px',
                                        borderRadius: '8px',
                                        textAlign: m.user.id == localStorage.getItem('idAccount') ? 'right' : 'left',
                                    }}
                                >
                                    <p style={{
                                        color : m.user.id == localStorage.getItem('idAccount') ? "white" :"black",
                                        padding:"5px",
                                        paddingLeft: '5px',
                                        paddingRight: '5px',
                                        marginLeft: m.user.id != localStorage.getItem('idAccount') ? '0' : '10px',
                                        marginRight: m.user.id == localStorage.getItem('idAccount') ? '10px' : '0',
                                    }}>
                                        {m.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div id={"chatRoomSubmit"}
                     style={{width: "100%", height: "10%", display: "flex", border: "1px solid black"}}>
                    {/*<input id={"contentMessage"} type="text" placeholder={"Nhập văn bản ... !"} style={{*/}
                    {/*    width: "70%",*/}
                    {/*    height: "35px",*/}
                    {/*    borderRadius: "8px",*/}
                    {/*    marginTop: "23px",*/}
                    {/*    marginLeft: "150px",*/}
                    {/*    border :"hidden"*/}
                    {/*}}/>*/}
                    <div className="messageBox">
                        <div className="fileUploadWrapper">
                            <label htmlFor="file">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
                                    <circle
                                        stroke-width="20"
                                        stroke="#6c6c6c"
                                        fill="none"
                                        r="158.5"
                                        cy="168.5"
                                        cx="168.5"
                                    ></circle>
                                    <path
                                        stroke-linecap="round"
                                        stroke-width="25"
                                        stroke="#6c6c6c"
                                        d="M167.759 79V259"
                                    ></path>
                                    <path
                                        stroke-linecap="round"
                                        stroke-width="25"
                                        stroke="#6c6c6c"
                                        d="M79 167.138H259"
                                    ></path>
                                </svg>
                                <span className="tooltip">Add an image</span>
                            </label>
                            <input type="file" id="file" name="file" />
                        </div>
                        <input  required="" placeholder="Message..." type="text" id="messageInput" />
                        <button id="sendButton" onClick={() => createMessageUser()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                                <path
                                    fill="none"
                                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                ></path>
                                <path
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke-width="33.67"
                                    stroke="#6c6c6c"
                                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    {/*<button onClick={() => createMessageUser()}*/}
                    {/*        style={{height: "35px", marginLeft: "10px", marginTop: "25px" , borderRadius :"5px"}}>Gửi*/}
                    {/*</button>*/}
                </div>
            </div>
            {isExit && <Navigate to="/home"/>}
        </div>
    );
};

export default ChatRoom;