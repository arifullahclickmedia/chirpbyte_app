import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

//const SOCKET_URL = 'https://socket.chirpbyte.com/';
const SOCKET_URL = 'https://socket.mychirpbyte.com';
const socketClient = io(SOCKET_URL, {
    autoConnect: false,
    reconnectionAttempts: 4,
    reconnectionDelay: 1000,
    auth: { token: "" },
});


const initializeConnection = (token) => {
    Object.assign(socketClient.auth, {
        token: `operatid_${token ?? 'guest'}`,
    });
    socketClient.connect();
};

const connectSocketClient = () => {
    socketClient.on("connect", () => {
        console.log('connectSocketClient-connect')
    })
    socketClient.on("connect_error", () => {
        console.log('connectSocketClient-connect_error')
    })
}
// useEffect(() => {
//     const State = AppState.addEventListener("change", _handleAppStateChange);
//     return State
// }, []);


// const _handleAppStateChange = (nextAppState) => {

//     if (nextAppState === "background") {
//       // Do something here on app backgroun
//       connectSocketClient();
//       console.log("APP STATE ===>", nextAppState);
//     }
  
//     if (nextAppState === "active") {
//       // Do something here on app active foreground mode.
     
  
//       console.log("APP STATE ===>", nextAppState);
//     }
//     if (nextAppState === "inactive") {
//       // Do something here on app inactive mode.
//       connectSocketClient();
//       console.log("APP STATE ===>", nextAppState);
//     }
//   };

const useSocket = () => {
    const [token, setToken] = useState(null)

    useEffect(() => {
        if (token) {
            initializeConnection(`${token}`);
            connectSocketClient();
        }

        return () => {
            socketClient.off("connect");
            socketClient.disconnect();
        };
    }, [token]);

    useEffect(() => {
        fetchToken();
    }, []);

    const fetchToken = async () => {
        try {
            const storedTokenString = await AsyncStorage.getItem('loginData');
            // console.log("storedToken-in-the-hook (raw):", storedTokenString);

            if (storedTokenString) {
                const storedToken = JSON.parse(storedTokenString);
                setToken(storedToken?.user?.id)
            } else {
                console.log("No token found in AsyncStorage");
            }
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
        }
    };

    const onMessage = (callback) => {
        if (socketClient) {
            socketClient?.on('', callback);

            // Cleanup listener when not needed
            return () => {
                socketClient?.off('message', callback);
            };
        }
    };

    const emitEvent = async (event, data) => {

        if (socketClient) {
            // console.log("EMIT-FUNCTION ====>",event,JSON.stringify(data,null,4));
            //  const res=await 
            socketClient?.emit(event, data);
            // console.log("FUNCTION ====>",res);
        }
    };

    const onEvent = (event, callback) => {
        if (socketClient) {
            socketClient.on(event, callback);

            // Cleanup listener when not needed
            return () => {
                socketClient?.off(event, callback);
            };
        }
    };

    return {
        socket: socketClient,
        onMessage,
        emitEvent,
        onEvent,
    };
};

export default useSocket;

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket not initialized. Call initSocket(url) first.');
    }
    return socket;
};
