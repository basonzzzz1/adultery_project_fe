import axios from "axios";
import {
    CHECKCHATROOM,
    CREATECHATROOM, CREATEMESSAGE,
    FINDALLMESSGEINCHATROOMID,
    FINDBYCHATROOMID,
    GETALLCHATROOM,
    REQUESTALL,
    REQUESTCHATROOM
} from "../API/api";

const ManageService = {
    requestChatroom: (messageRequest) => {
        return new Promise((resolve, reject) => {
            axios.post(REQUESTCHATROOM,messageRequest,
                {headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('userToken')),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    getAllRequest: () => {
        return new Promise((resolve, reject) => {
            axios.get(REQUESTALL,
                {headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('userToken')),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    createChatRoom: (ChatRoomRequest) => {
        return new Promise((resolve, reject) => {
            axios.post(CREATECHATROOM,ChatRoomRequest,
                {headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('userToken')),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    getAllChatRoom: () => {
        return new Promise((resolve, reject) => {
            axios.get(GETALLCHATROOM,
                {headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('userToken')),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    findByChatRoomId: (id) => {
        return new Promise((resolve, reject) => {
            axios.post(FINDBYCHATROOMID,id,
                {headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('userToken')),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    checkChatRoom: (chatRoom) => {
        return new Promise((resolve, reject) => {
            axios.post(CHECKCHATROOM,chatRoom,
                {headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('userToken')),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    findAllMessageByChatRoomId: (id) => {
        return new Promise((resolve, reject) => {
            axios.post(FINDALLMESSGEINCHATROOMID,id,
                {headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('userToken')),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    createMessage: (message) => {
        return new Promise((resolve, reject) => {
            axios.post(CREATEMESSAGE,message,
                {headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('userToken')),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
}
export default ManageService;