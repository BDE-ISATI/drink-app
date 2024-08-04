"use client"
import {Add, Clear, Download, MoreVert} from "@mui/icons-material";
import {
  Box,
  Button,
  Link,
  Menu,
  MenuItem,
  Modal,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import {ChangeEvent, useEffect, useState} from "react";
import {send} from "@/app/globals";

type EventType = {
    ID: string,
    name: string,
    date: string,
}


export default function Home() {

    let [data, setData] = useState<EventType[]>([])

    useEffect(() => {
        fetch("https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/events").then((resp) => {
            return resp.json()
        }).then((resp) => {
            setData(resp.data)
        })
    }, [])

    function changeData(event:EventType, e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) {
        event[e.target.id] = e.target.value;
        setData([...data]);
    }

    const handleAdd = () => {
        data.push({date:"",name:"",ID:""})
        setData([...data])
    }
    const handleDownload = () => {

        let text = "ID,name,date\n"
        for (let item of data) {
            text += `${item.ID},${item.name},${item.date}\n`;
        }

        var element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:csv/plain;charset=utf-8," + encodeURIComponent(text)
        );
        element.setAttribute("download", "export.csv");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <div>

            <SpeedDial className="fixed left-6 bottom-20" ariaLabel="menu" icon={<SpeedDialIcon/>}>
                <SpeedDialAction
                    onClick={handleAdd}
                    icon={<Add/>}
                />
                <SpeedDialAction
                    onClick={handleDownload}
                    icon={<Download/>}
                />
            </SpeedDial>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nom</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((event: EventType) =>
                        <TableRow key={event.ID}>
                            <TableCell>{event.ID}</TableCell>
                            <TableCell>
                                <TextField error={event.name == ""} value={event.name} onChange={e => changeData(event,e)} id="name" type="string" variant="outlined"/>
                            </TableCell>
                            <TableCell>
                                <TextField error={event.date == ""} value={event.date} onChange={e => changeData(event,e)} id="date" type="date" variant="outlined"/>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => send("events",event, event.ID==="" ? "PUT" : "PATCH")}>Save</Button>
                            </TableCell>

                            <TableCell>
                                <Button onClick={() => send("events",event, "DELETE")}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    //<TableCell><QRCode value={event.ID}/></TableCell>

}