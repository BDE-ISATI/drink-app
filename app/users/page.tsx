"use client"
import { Add } from "@mui/icons-material";
import { Box, Button, Fab, Modal, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import QRCode from "react-qr-code";

type UserType = {
  ID:string,
  name:string,
  lastname:string,
  softs:number,
  bieres:number,
  forts:number
}



export default function Home() {

  let [data,setData] = useState({data:[]})
  
  useEffect(() =>{
    fetch("https://rnwlvwlnab.execute-api.eu-west-3.amazonaws.com/Prod/users").then((resp) => {
      return resp.json()
    }).then((resp)=>{
      setData(resp)
    })
  }, [])
  
  async function send(body:Object,method:string): Promise<Response> {      

    let req = await fetch("https://rnwlvwlnab.execute-api.eu-west-3.amazonaws.com/Prod/users/update", {
        method: method,
        body: JSON.stringify(body),
    })
    
    let resp = await req.json()

    alert(resp.message)

    return req
}

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = async() => {
    if (name != "" && lastname != ""){
      await send({name:name,lastname:lastname,softs:0,bieres:0,forts:0},"PUT")
      handleClose();
    }
  };

  let [name,setName] = useState<string>("")
  let [lastname,setLastName] = useState<string>("")

  return (
    <div>

    <Fab onClick={handleOpen} className="fixed left-6 bottom-20" color="primary" aria-label="add">
      <Add />
    </Fab>

    <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description" className="grid place-items-center h-full">
      <Box sx={{}} className="w-96 bg-slate-50 p-4 flex flex-col shadow border gap-2">
        <h2 className="text-xl font-bold">Ajouter une personne</h2>
        <TextField error={lastname==""} value={lastname} onChange={e => setLastName(e.target.value)} id="nom" label="Nom" variant="filled" />
        <TextField error={name==""} value={name} onChange={e => setName(e.target.value)}  id="prénom" label="Prénom" variant="filled" />
        <div className="flex w-full">
          <Button  className="flex-1" onClick={handleSave}>Add</Button>
          <Button className="flex-1" onClick={handleClose}>Cancel</Button>
        </div>
      </Box>
    </Modal>

    <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Softs</TableCell>
            <TableCell>Bières</TableCell>
            <TableCell>Forts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data.map((user:UserType) =>
            <TableRow key={user.ID}>
              <TableCell>{user.ID}</TableCell>
              <TableCell>{user.lastname}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.softs}</TableCell>
              <TableCell>{user.bieres}</TableCell>
              <TableCell>{user.forts}</TableCell>
              <TableCell><QRCode value={user.ID}/></TableCell>
            </TableRow>
          )}
        </TableBody>
    </Table>


    </div>
  );
}