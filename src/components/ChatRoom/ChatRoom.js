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
            });
        }
    }, [webSocket]);
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("account")))
        console.log(JSON.parse(localStorage.getItem("account")))
    }, []);
    useEffect(() => {
        ManageService.findAllMessageByChatRoomId(localStorage.getItem('idChatRoom')).then((response) => {
            const sortedMessages = response.data.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
            setListMessage(sortedMessages);
        }).catch((err)=>{
            console.log(err)
        })
    }, [localStorage.getItem('idChatRoom'), load]);
    useEffect(() => {
        setLoad(false)
    }, [load]);
    const createMessageUser = () => {
        let message = {
            content: document.getElementById("contentMessage").value,
            seen: false,
            user: {username: user.username},
            chatRoom: {id: localStorage.getItem("idChatRoom")}
        }
        ManageService.createMessage(message).then((response) => {
            toast.success("Gửi Thành công !")
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

    return (
        <div>
            <div style={{display: "flex", height: "30px"}}>
                <div style={{width: "95%"}}>

                </div>
                <div style={{width: "30px"}}>
                    <div style={{width: "30px"}}>
                        <button onClick={() => Exit()}
                                style={{backgroundColor: "white", border: "hidden", marginTop: "10px"}}>
                <span className="icon" style={{color: "black", textAlign: "center"}}>
                <i style={{fontSize: "30px", border: "1px solid gray"}} className='bx bxs-exit'></i>
                </span>
                        </button>
                    </div>
                </div>
            </div>
            <div style={{
                width: "70%",
                height: "690px",
                border: "1px solid black",
                marginLeft: "15%",
                marginTop: "100px"
            }}>
                <div
                    style={{
                        width: '100%',
                        height: '85%',
                        display: 'block',
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
                                <div style={{display: 'block'}}>
                                    <p style={{fontSize: '10px', height: '5px'}}>{calculateTimeChat(m.createAt)}</p>
                                    <p style={{height: '5px'}}>{m.user.username}</p>
                                </div>
                                <div
                                    style={{
                                        maxWidth: '80%',
                                        backgroundColor: '#f72d7a',
                                        marginTop: '28px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <p style={{paddingLeft: '5px', paddingRight: '5px'}}>{m.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div id={"chatRoomSubmit"}
                     style={{width: "100%", height: "10%", display: "flex", border: "1px solid black"}}>
                    <input id={"contentMessage"} type="text" placeholder={"Nhập văn bản ... !"} style={{
                        width: "70%",
                        height: "35px",
                        borderRadius: "8px",
                        marginTop: "23px",
                        marginLeft: "100px"
                    }}/>
                    <button onClick={() => createMessageUser()}
                            style={{height: "35px", marginLeft: "10px", marginTop: "25px"}}>Gửi
                    </button>
                </div>
            </div>
            {isExit && <Navigate to="/home"/>}
        </div>
    );
};

export default ChatRoom;