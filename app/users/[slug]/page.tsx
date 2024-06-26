"use client"
import {Button, Table, TableBody, TableCell, TableRow} from "@mui/material"
import {useEffect, useState} from "react"
import QRCode from "react-qr-code"
import {send} from "@/app/globals";

type UserType = {
    ID: string,
    name: string,
    lastname: string,
    softs: number,
    bieres: number,
    forts: number
}

export default function Page({params}: { params: { slug: string } }) {

    let [data, setData] = useState<UserType>({ID: "", name: "", lastname: "", softs: 0, bieres: 0, forts: 0})

    useEffect(() => {
        fetch("https://rnwlvwlnab.execute-api.eu-west-3.amazonaws.com/Prod/users").then((resp) => {
            return resp.json()
        }).then((resp) => {
            console.log(resp)
            for (let val of resp.data) {
                if (val.ID === params.slug) {
                    setData(val)
                    break
                }
            }
        })
    }, [])

    return (
        <main>
            <QRCode value={data.ID}/>

            <Table>
                <TableBody>
                    <TableRow key="ID">
                        <TableCell>ID</TableCell>
                        <TableCell>{data.ID}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow key="name">
                        <TableCell>Prénom</TableCell>
                        <TableCell>{data.name}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow key="lastname">
                        <TableCell>Nom</TableCell>
                        <TableCell>{data.lastname}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow key="softs">
                        <TableCell>Softs</TableCell>
                        <TableCell>{data.softs}</TableCell>
                        <TableCell><Button onClick={() => {
                            send({ID: data.ID, softs: data.softs + 1}, "PATCH")
                        }}>Ajouter</Button></TableCell>
                    </TableRow>
                    <TableRow key="bieres">
                        <TableCell>Bières</TableCell>
                        <TableCell>{data.bieres}</TableCell>
                        <TableCell><Button onClick={() => {
                            send({ID: data.ID, bieres: data.bieres + 1}, "PATCH")
                        }}>Ajouter</Button></TableCell>
                    </TableRow>
                    <TableRow key="forts">
                        <TableCell>Forts</TableCell>
                        <TableCell>{data.forts}</TableCell>
                        <TableCell><Button onClick={() => {
                            send({ID: data.ID, forts: data.forts + 1}, "PATCH")
                        }}>Ajouter</Button></TableCell>
                    </TableRow>

                </TableBody>
            </Table>


        </main>
    );
}