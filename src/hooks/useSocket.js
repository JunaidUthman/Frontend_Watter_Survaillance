import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://wattersurveillanceapp-cjcmatdsevbre7bd.spaincentral-01.azurewebsites.net';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastReading, setLastReading] = useState(null);

    useEffect(() => {
        const socketInstance = io(SOCKET_URL);

        socketInstance.on('connect', () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
            setSocket(socketInstance);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
        });

        socketInstance.on('new_sensor_reading', (data) => {
            console.log('New sensor reading received:', data);
            setLastReading(data);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return { socket, isConnected, lastReading };
};
