import firebase from 'firebase/compat/app'

export interface TimerData {
    startTime: firebase.firestore.Timestamp | null;
    endTime: firebase.firestore.Timestamp | null;
    startPause: firebase.firestore.Timestamp | null;
    endPause: firebase.firestore.Timestamp | null;
    workedTime: number;
    pausedTime: number;
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type CustomUser = User & { isCompany?: boolean }

type FormToShow = 'login' | 'signup' | 'none'