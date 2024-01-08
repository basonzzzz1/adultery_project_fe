// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

import Stomp from 'stompjs';
import {WEBSOCKETURL} from "../API/api";
const WebSocketContext = createContext();

export function useWebSocket() {
    return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
    const [webSocket, setWebSocket] = useState(null);

    useEffect(options => {
        let socket = new WebSocket(WEBSOCKETURL);
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            setWebSocket(stompClient);
            if (stompClient.connected) {
                stompClient.subscribe('/chat/user/queue/position-update', function (message) {
                    // Xử lý tin nhắn ở đây và gửi thông tin thông qua Context
                });
            }
        });

        return () => {
            // Đóng kết nối WebSocket khi component unmounts
            if (webSocket) {
                webSocket.disconnect();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={webSocket}>
            {children}
        </WebSocketContext.Provider>
    );
}
