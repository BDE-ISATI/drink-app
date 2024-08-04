"use client"
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material"
import {useEffect, useState} from "react"
import QRCode from "react-qr-code"
import {send} from "@/app/globals";

type UserType = {
    ID: string,
    name: string,
    lastname: string,
}
type EventType = {
    ID: string,
    name: string,
    date: string,
}

type DrinkType = {
    userID: string,
    eventID: string,
    softs?: number,
    bieres?: number,
    forts?: number,
}

export default function Page({params}: { params: { slug: string } }) {
    type DrinkKeys = 'softs' | 'bieres' | 'forts';
    let boissons: DrinkKeys[] = ["softs","bieres","forts"]
    
    let [userData, setUserData] = useState<UserType>({ID: "", name: "", lastname: ""})
    let [drinksData, setDrinksData] = useState<{[eventID:string]:DrinkType}>({})
    let [eventsData, setEventsData] = useState<EventType[]>([])
    let [isLoaded, setIsLoaded] = useState<boolean>(false)

    let fetchUser = fetch("https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/users").then(async (req) => {
        let resp = await req.json()
        for (let val of resp.data) {
            if (val.ID === params.slug) {
                return val
            }
        }
    })

    let fetchDrinks = fetch("https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/drinks").then(async (req) => {
        let resp = await req.json()
        let temp:{[eventID:string]:DrinkType} = {}

        for (let val of resp.data) {
            if (val.userID === params.slug) {
                temp[val.eventID] = val
            }
        }

        return temp
    })

    let fetchEvents = fetch("https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/events").then(async (req) => {
        let resp = await req.json()
        return resp.data
    })

    useEffect(() => {
        

        Promise.all([fetchUser, fetchDrinks, fetchEvents]).then((values) => {


            let drinksDataTemp = values[1]
            let userDataTemp = values[0]
            let eventsDataTemp = values[2]


            for (let event of eventsDataTemp) {
                if (drinksDataTemp[event.ID] == undefined){
                    drinksDataTemp[event.ID] = {
                        userID: userDataTemp.ID,
                        eventID: event.ID
                    }
                }
            }

            setUserData(userDataTemp)
            setEventsData(eventsDataTemp)
            setDrinksData(drinksDataTemp)
            setIsLoaded(true)
        });

    }, [])
    
    if (isLoaded) return (
        <main >
            <QRCode value={userData.ID}/>

            <h1 className="text-2xl text-center m-8">Profil</h1>

            <Table>
                <TableBody>
                    <TableRow key="ID">
                        <TableCell>ID</TableCell>
                        <TableCell>{userData.ID}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow key="name">
                        <TableCell>Prénom</TableCell>
                        <TableCell>{userData.name}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow key="lastname">
                        <TableCell>Nom</TableCell>
                        <TableCell>{userData.lastname}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            
            {eventsData.map((e:EventType) => 
                <div key={e.ID}>
                    <h1 className="text-2xl text-center m-8">{e.name} du {e.date}</h1>
                    <Table>
                        <TableBody>
                            {boissons.map((boisson) => 
                                <TableRow key={boisson}>
                                    <TableCell>{boisson}</TableCell>
                                    <TableCell>{drinksData[e.ID][boisson]||0}</TableCell>
                                    <TableCell><Button onClick={() => {

                                        let temp:DrinkType = {
                                            userID:drinksData[e.ID].userID,
                                            eventID:drinksData[e.ID].eventID,
                                        };

                                        temp[boisson] = (drinksData[e.ID][boisson] as number || 0) + 1

                                        send("drinks",temp, "PATCH")
                                    }}>Ajouter</Button></TableCell>
                                    <TableCell><Button onClick={() => {

                                        let temp:DrinkType = {
                                            userID:drinksData[e.ID].userID,
                                            eventID:drinksData[e.ID].eventID,
                                        };

                                        temp[boisson] = 0

                                        send("drinks",temp, "PATCH")
                                    }}>Reset</Button></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}


        </main>
    )
    
    return <main></main>;
}