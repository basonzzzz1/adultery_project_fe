import axios from "axios";
import {
    BANNER,
    CHECKCHATROOM,
    CountSpin,
    CREATECHATROOM,
    createCskh,
    createCskhAdmin, createExchangePoints,
    CREATEMESSAGE,
    deleteChatRoom, deleteExchangePoints,
    extraPoints,
    extraPointsInUser,
    FINDALLMESSGEINCHATROOMID,
    FINDALLUSER,
    FINDBYCHATROOMID,
    GETALLCHATROOM,
    getAllCskhInUserAdmin,
    getAllCskhInUserDetail,
    getAllCskhUser, getAllExchangePoints,
    getListValueSpin,
    loggedInUser,
    LOGOUT,
    minusPoints,
    REQUESTALL,
    REQUESTCHATROOM, setListValueSpin,
    SpinRequest,
    UNBANNER
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
    logOut: (username) => {
        return new Promise((resolve, reject) => {
            axios.post(LOGOUT,username,
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
    minusPoints: (pointRequest) => {
        return new Promise((resolve, reject) => {
            axios.post(minusPoints,pointRequest,
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
    extraPoints: (pointRequest) => {
        return new Promise((resolve, reject) => {
            axios.post(extraPoints,pointRequest,
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
    loggedInUser: () => {
        return new Promise((resolve, reject) => {
            axios.get(loggedInUser,
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
    banner: (u) => {
        return new Promise((resolve, reject) => {
            axios.post(BANNER,u,
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
    unBanner: (u) => {
        return new Promise((resolve, reject) => {
            axios.post(UNBANNER,u,
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
    getAllCskhInUserAdmin: () => {
        return new Promise((resolve, reject) => {
            axios.get(getAllCskhInUserAdmin,
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
    getAllCskhUser: () => {
        return new Promise((resolve, reject) => {
            axios.get(getAllCskhUser,
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
    createCskh: (CskhRepuest) => {
        return new Promise((resolve, reject) => {
            axios.post(createCskh,CskhRepuest,
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
    extraPointsInUser: (point) => {
        return new Promise((resolve, reject) => {
            axios.post(extraPointsInUser,point,
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
    CountSpin: () => {
        return new Promise((resolve, reject) => {
            axios.get(CountSpin,
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
    SpinRequest: (SpinRequestEdit) => {
        return new Promise((resolve, reject) => {
            axios.post(SpinRequest,SpinRequestEdit,
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
    deleteChatRoom: (chatRoomRequest) => {
        return new Promise((resolve, reject) => {
            axios.post(deleteChatRoom,chatRoomRequest,
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
    getAllCskhInUserDetail: (cskhRequest) => {
        return new Promise((resolve, reject) => {
            axios.post(getAllCskhInUserDetail,cskhRequest,
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
    findAllUser: () => {
        return new Promise((resolve, reject) => {
            axios.get(FINDALLUSER,
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
    createCskhAdmin: (cskhAdminReuest) => {
        return new Promise((resolve, reject) => {
            axios.post(createCskhAdmin,cskhAdminReuest,
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
    getListValueSpin: () => {
        return new Promise((resolve, reject) => {
            axios.get(getListValueSpin,
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
    setListValueSpin: (listSpinValue) => {
        return new Promise((resolve, reject) => {
            axios.post(setListValueSpin,listSpinValue,
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
    getAllExchangePoints: () => {
        return new Promise((resolve, reject) => {
            axios.get(getAllExchangePoints,
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
    createExchangePoints: (ExchangePoints) => {
        return new Promise((resolve, reject) => {
            axios.post(createExchangePoints,ExchangePoints,
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
    deleteExchangePoints: (ExchangePoints) => {
        return new Promise((resolve, reject) => {
            axios.post(deleteExchangePoints,ExchangePoints,
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