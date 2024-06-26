"use client"
import { Add, More, MoreVert } from "@mui/icons-material";
import { Box, Button, Fab, Link, Menu, MenuItem, Modal, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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
    location.reload();
    return req
}

  const [open, setOpen] = useState(false);
  const [menuopen, setMenuOpen] = useState(false);
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
  let [selected,setSelected] = useState<string>("")

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



              <TableCell>
              <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={e => {setAnchorEl(e.currentTarget);setSelected(user.ID);setMenuOpen(true);    }}
    >
        <MoreVert></MoreVert>
    </Button>
                  </TableCell>





            </TableRow>
          )}
        </TableBody>
    </Table>
    <Menu
        id="basic-menu"
        open={menuopen}
        onClose={() => setMenuOpen(false)}
        anchorEl={anchorEl}
        MenuListProps={{
        'aria-labelledby': 'basic-button',
        }}
    >
      <Link href={`/users/${selected}`}><MenuItem>Show Profile</MenuItem></Link>
      <MenuItem onClick={() => {}}>Show QRCODE</MenuItem>
      <MenuItem onClick={() => send({ID:selected},"DELETE")}>Delete</MenuItem>
    </Menu>

    </div>
  );

    //<TableCell><QRCode value={user.ID}/></TableCell>

}