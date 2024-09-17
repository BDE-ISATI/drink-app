"use client"
import {Box, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@mui/material"
import {Suspense, useEffect, useState} from "react"
import {send} from "@/app/globals";
import { useSearchParams } from "next/navigation";

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

let PageComponent = () => {

    const [open, setOpen] = useState(true);
    let [name, setName] = useState<string>("")
    let [lastname, setLastName] = useState<string>("")

    const searchParams = useSearchParams();


    let id = searchParams.get("id")

    if (id === null){
        window.location.pathname = "/users"
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (name != "" && lastname != "") {
            await send("users",{ID:id,name: name, lastname: lastname}, "PATCH")
            handleClose();
        }
    };

    type DrinkKeys = 'softs' | 'bieres' | 'forts';
    let boissons: DrinkKeys[] = ["softs","bieres","forts"]
    
    let [userData, setUserData] = useState<UserType>({ID: "", name: "", lastname: ""})
    let [drinksData, setDrinksData] = useState<{[eventID:string]:DrinkType}>({})
    let [eventsData, setEventsData] = useState<EventType[]>([])
    let [isLoaded, setIsLoaded] = useState<boolean>(false)
    useEffect(() => {
        let fetchUser = fetch("https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/users").then(async (req) => {
            let resp = await req.json()
            for (let val of resp.data) {
                if (val.ID === searchParams.get("id")) {
                    return val
                }
            }
        })

        let fetchDrinks = fetch("https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/drinks").then(async (req) => {
            let resp = await req.json()
            let temp:{[eventID:string]:DrinkType} = {}

            for (let val of resp.data) {
                if (val.userID === id) {
                    temp[val.eventID] = val
                }
            }

            return temp
        })

        let fetchEvents = fetch("https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/events").then(async (req) => {
            let resp = await req.json()
            return resp.data
        })


        Promise.all([fetchUser, fetchDrinks, fetchEvents]).then((values) => {
            let userDataTemp = values[0]


            if (userDataTemp !== undefined) {

                let drinksDataTemp = values[1]
                let eventsDataTemp = values[2]

                for (let event of eventsDataTemp) {
                    if (drinksDataTemp[event.ID] == undefined){
                        drinksDataTemp[event.ID] = {
                            userID: userDataTemp.ID,
                            eventID: event.ID
                        }
                    }
                }
    
                setEventsData(eventsDataTemp)
                setDrinksData(drinksDataTemp)
            }
            setUserData(userDataTemp)
            setIsLoaded(true)
        });

    }, [])
    
    if (isLoaded)
        if (userData === undefined){
            return (
                <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description" className="grid place-items-center h-full">
                    <Box sx={{}} className="w-96 bg-slate-50 p-4 flex flex-col shadow border gap-2">
                        <h2 className="text-xl font-bold">Attribuer {id} à</h2>
                        <TextField error={lastname == ""} value={lastname} onChange={e => setLastName(e.target.value)}
                                id="nom" label="Nom" variant="filled"/>
                        <TextField error={name == ""} value={name} onChange={e => setName(e.target.value)} id="prénom"
                                label="Prénom" variant="filled"/>
                        <div className="flex w-full">
                            <Button className="flex-1" onClick={handleSave}>Add</Button>
                        </div>
                    </Box>
                </Modal>
            )
        }
        else{


        
        return (
            <main >
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

                                            temp[boisson] = (drinksData[e.ID][boisson] as number || 0) - 1

                                            send("drinks",temp, "PATCH")
                                        }}>Diminuer</Button></TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>
        )
    }
    return <main></main>;
}

export default function Page() {
    return <Suspense><PageComponent></PageComponent></Suspense>
}