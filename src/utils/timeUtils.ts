import { Timestamp } from "firebase/firestore"

export const formatTime = (timeInSeconds: number): string => {
    const date = new Date(0)
    date.setSeconds(timeInSeconds)
    return date.toISOString().slice(11, 19)
}

export const extractTime = (timestamp: any): string => {
    if (timestamp && typeof timestamp.getTime === 'function') {
        const date = new Date(timestamp.getTime());
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    return '';
}