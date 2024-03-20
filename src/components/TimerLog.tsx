import React, { useEffect, useState } from 'react'
import {Accordion, AccordionSummary, AccordionDetails, Typography} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TimerData } from '../types'
import { formatTime, extractTime } from '../utils/timeUtils'

interface TimerLogProps {
    rows: TimerData[];
}

interface FormattedTimerData {
    startTime: string;
    endTime: string;
    startPause: string;
    endPause: string;
    workedTime: string;
    pausedTime: string;
}

const TimerLog: React.FC<TimerLogProps> = ({ rows }) => {
    
    const [data, setData] = useState<FormattedTimerData[]>([])

    useEffect(() => {
        if (rows.length > 0) {
            const formattedRows = rows.map(row => ({
                ...row,
                startTime: row.startTime ? extractTime(row.startTime) : '',
                endTime: extractTime(row.endTime),
                startPause: extractTime(row.startPause),
                endPause: extractTime(row.endPause),
                workedTime: formatTime(row.workedTime),
                pausedTime: formatTime(row.pausedTime),
            }))
            setData(formattedRows)
        }
    }, [rows])

    return (
        <Accordion sx={{ maxWidth: "100%" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Timer Data</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <DataGrid
                    rows={data}
                    columns={[
                        { field: 'date', headerName: 'Date', width: 150 },
                        { field: 'startTime', headerName: 'Start Time', width: 130 },
                        { field: 'endTime', headerName: 'End Time', width: 130 },
                        { field: 'startPause', headerName: 'Start Pause', width: 130 },
                        { field: 'endPause', headerName: 'End Pause', width: 130 },
                        { field: 'workedTime', headerName: 'Worked Time', width: 130 },
                        { field: 'pausedTime', headerName: 'Paused Time', width: 130 },
                    ]}
                    checkboxSelection
                />
            </AccordionDetails>
        </Accordion>
    )
}

export default TimerLog