import React, { useEffect, useState } from 'react'
import { Button, Grid, Typography } from '@mui/material'

const Timer: React.FC = () => {
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [endTime, setEndTime] = useState<Date | null>(null)
    const [startPause, setStartPause] = useState<Date | null>(null)
    const [endPause, setEndPause] = useState<Date | null>(null)
    const [workedTime, setWorkedTime] = useState<number>(0)
    const [pausedTime, setPausedTime] = useState<number>(0)
    const [isWorking, setIsWorking] = useState<boolean>(false)
    const [isResting, setIsResting] = useState<boolean>(false)

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

    const formatTime = (timeInSeconds: number): string => {
        const date = new Date(0)
        date.setSeconds(timeInSeconds)
        return date.toISOString().slice(11, 19)
    }

    return (
        <Grid container spacing={2} justifyContent="center" textAlign="center" padding={5}>
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
                            setEndTime(new Date())
                        }}>End day</Button>
                    )}
                </Grid>
            </Grid>
            <Grid xs={12} sm={6} container item spacing={2} direction={'column'}>
                <Grid item>{formatTime(pausedTime)}</Grid>
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
            </Grid>
            <Grid container direction={"column"} xs={12} item padding={5} marginTop={5} spacing={1}>
                <Grid item>
                    <Typography>start time: {startTime?.toLocaleTimeString()}</Typography>
                </Grid>
                <Grid item>
                    <Typography>end time: {endTime?.toLocaleTimeString()}</Typography>
                </Grid> 
                <Grid item>
                    <Typography>start pause: {startPause?.toLocaleTimeString()}</Typography>
                </Grid>
                <Grid item>
                    <Typography>end pause: {endPause?.toLocaleTimeString()}</Typography>
                </Grid>
                <Grid item>
                    <Typography>worked time: {formatTime(workedTime)}</Typography>
                </Grid>
                <Grid item>
                    <Typography>paused time: {formatTime(pausedTime)}</Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Timer
