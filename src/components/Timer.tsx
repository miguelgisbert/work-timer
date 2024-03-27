import React, { useEffect, useState } from 'react'
import { Button, Grid, Typography } from '@mui/material'
import { TimerData } from '../types'
import { formatTime } from '../utils/timeUtils'
import 'firebase/compat/firestore'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { getDoc, doc, setDoc, Timestamp, collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "../firebaseConfig"
import TimerLog from './TimerLog'
import { startOfWeek, endOfWeek } from 'date-fns'


const Timer: React.FC = () => {
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [endTime, setEndTime] = useState<Date | null>(null)
    const [startPause, setStartPause] = useState<Date | null>(null)
    const [endPause, setEndPause] = useState<Date | null>(null)
    const [workedTime, setWorkedTime] = useState<number>(0)
    const [pausedTime, setPausedTime] = useState<number>(0)
    const [isWorking, setIsWorking] = useState<boolean>(false)
    const [isResting, setIsResting] = useState<boolean>(false)
    const [weekData, setWeekData] = useState<TimerData[]>([])
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout> | null = null
        if (isWorking) {
            interval = setInterval(() => {
            const now: Date = new Date()    
            if (startTime) {
                const workDiff: number = Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedTime
                setWorkedTime(workDiff)
            }
            }, 1000)
        } else if (interval) {
            clearInterval(interval)
        }
        return () => {
            if(interval) {
                clearInterval(interval)
            }
        }
    }, [startTime, isWorking])

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout> | null = null
        if (isResting) {
            interval = setInterval(() => {
                const now: Date = new Date()    
                if (startPause) {
                    const pauseDiff: number = Math.floor((now.getTime() - startPause.getTime()) / 1000)
                    setPausedTime(pauseDiff)
                }
            }, 1000)
        } else if (interval) {
            clearInterval(interval)
        }
        return () => {
            if(interval) {
                clearInterval(interval)
            }
        }
    }, [startPause, isResting])

    useEffect(() => {
        if (startTime) {
            saveDataToFirestore();
        }
    }, [startTime, endTime, startPause, endPause, workedTime, pausedTime])
    
    
    const saveDataToFirestore = async () => {
        
        const auth = getAuth();
        let userId = '';
        if (auth.currentUser) {
            userId = auth.currentUser.uid
        }

        const timerData = {
            date: startTime ? Timestamp.fromDate(startTime) : null, 
            startTime: startTime ? Timestamp.fromDate(startTime) : null,
            endTime: endTime ? Timestamp.fromDate(endTime) : null,
            startPause: startPause ? Timestamp.fromDate(startPause) : null,
            endPause: endPause ? Timestamp.fromDate(endPause) : null,
            workedTime,
            pausedTime
        }
    
        const docId = startTime ? startTime.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        const docRef = doc(db, "users", userId, "timerData", docId)
        await setDoc(docRef, timerData, { merge: true })
    }

    
    const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 })
    const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 })
    const startOfWeekDateUTC = new Date(Date.UTC(startOfWeekDate.getUTCFullYear(), startOfWeekDate.getUTCMonth(), startOfWeekDate.getUTCDate()));
    const endOfWeekDateUTC = new Date(Date.UTC(endOfWeekDate.getUTCFullYear(), endOfWeekDate.getUTCMonth(), endOfWeekDate.getUTCDate(), 23, 59, 59));

    useEffect(() => {
        const fetchData = async (userId: string) => {
            const docId = new Date().toISOString().split('T')[0]
            const docRef = doc(db, "users", userId, "timerData", docId)
            const docSnap = await getDoc(docRef)
            console.log(docSnap)
            if (docSnap.exists()) {
                const data = docSnap.data()
                setStartTime(data.startTime?.toDate() || null)
                setEndTime(data.endTime?.toDate() || null)
                setStartPause(data.startPause?.toDate() || null)
                setEndPause(data.endPause?.toDate() || null)
                setWorkedTime(data.workedTime || 0)
                setPausedTime(data.pausedTime || 0)

                // Check if the user is working or resting
                if (data.startTime && !data.endTime && (!data.startPause || data.endPause)) {
                    setIsWorking(true);
                }
                if (data.startPause && !data.endPause) {
                    setIsResting(true);
                }
                setWorkedTime(data.workedTime)
                setPausedTime(data.pausedTime)
            }
        }

        const fetchDataForWeek = async (userId: string) => {
            const q = query(
                collection(db, "users", userId, "timerData"),
                where("date", ">=", startOfWeekDateUTC),
                where("date", "<=", endOfWeekDateUTC),
                orderBy("date")
            );

            try {
                const querySnapshot = await getDocs(q)
                const weekData = querySnapshot.docs.map((doc, index) => {
                    const data = doc.data();
                    return {
                        id: index,
                        date: data.date.toDate(),
                        startTime: data.startTime?.toDate(),
                        endTime: data.endTime?.toDate(),
                        startPause: data.startPause?.toDate(),
                        endPause: data.endPause?.toDate(),
                        workedTime: data.workedTime,
                        pausedTime: data.pausedTime
                    } as TimerData;
                })
                setWeekData(weekData)
            } catch (error) {
                console.error("Error fetching data for week:", error)
            }
        }
    
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                fetchData(user.uid)
                fetchDataForWeek(user.uid)
            }
        })
        return () => unsubscribe()
    }, []);

    return (
        <Grid container justifyContent="center" textAlign="center" padding={5} >
            <Grid xs={12} sm={6} container item spacing={2} direction={'column'}>
                <Grid item>
                    <Typography>{formatTime(workedTime)}</Typography>
                </Grid>
                <Grid item>
                    {!startTime ? (
                        <Button variant="contained" onClick={() => {
                            setStartTime(new Date())
                            setIsWorking(true)
                        }}>Start day</Button>
                    ) : (
                        <Button onClick={() => {
                            setIsWorking(false)
                            setIsResting(false)
                            setEndTime(new Date())
                            {!endPause ? setEndPause(new Date()) : null}
                        }}>End day</Button>
                    )}
                </Grid>
                <Grid item>
                    {startTime && <Typography>start time: {startTime?.toLocaleTimeString()}</Typography>}
                </Grid>
                <Grid item>
                    {endTime && <Typography>end time: {endTime?.toLocaleTimeString()}</Typography>}
                </Grid> 
            </Grid>
            <Grid xs={12} sm={6} container item spacing={2} direction={'column'}>
                <Grid item>{pausedTime ? formatTime(pausedTime): '00:00:00'}</Grid>
                <Grid item>
                    {!startPause ? (
                        <Button variant="contained" onClick={() => {
                            setStartPause(new Date())
                            setIsWorking(false)
                            setIsResting(true)
                        }}>Start pause</Button>
                    ) : (
                        <Button onClick={() => {
                            setIsWorking(true)
                            setIsResting(false)
                            setEndPause(new Date())
                        }}>End pause</Button>
                    )}
                </Grid>
                <Grid item>
                    {startPause && <Typography>start pause: {startPause?.toLocaleTimeString()}</Typography>}
                </Grid>
                <Grid item>
                    {endPause && <Typography>end pause: {endPause?.toLocaleTimeString()}</Typography>}
                </Grid>
            </Grid>
            <Grid container direction={"column"} xs={12} item padding={5} marginTop={5} spacing={1}>
                <Grid item>
                    <Typography>worked time: {formatTime(workedTime)}</Typography>
                </Grid>
                <Grid item>
                    <Typography>paused time: {formatTime(pausedTime)}</Typography>
                </Grid>
            </Grid>
            {user && <TimerLog rows={weekData} />}
        </Grid>
    )
}

export default Timer
