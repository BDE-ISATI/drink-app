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
import {useEffect, useState} from "react";
import {send} from "@/app/globals";

type UserType = {
    ID: string,
    name: string,
    lastname: string
}


export default function Home() {

    let [data, setData] = useState<UserType[]>([])
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        fetch("https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/users").then(async (req) => {
            let resp = await req.json()
            setData(resp.data)
        })
    }, [])

    const [open, setOpen] = useState(false);
    const [menuopen, setMenuOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSave = async () => {
        if (name != "" && lastname != "") {
            await send("users",{name: name, lastname: lastname}, "PUT")
            handleClose();
        }
    };

    const handleDownload = () => {

        let text = "ID,name,lastname\n"
        for (let item of data) {
            text += `${item.ID},${item.name},${item.lastname}\n`;
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

    let [name, setName] = useState<string>("")
    let [lastname, setLastName] = useState<string>("")
    let [selected, setSelected] = useState<string>("")

    return (
        <div>

            <SpeedDial className="fixed left-6 bottom-20" ariaLabel="menu" icon={<SpeedDialIcon/>}>
                <SpeedDialAction
                    onClick={handleOpen}
                    icon={<Add/>}
                />
                <SpeedDialAction
                    onClick={handleDownload}
                    icon={<Download/>}
                />
            </SpeedDial>
            <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title"
                   aria-describedby="parent-modal-description" className="grid place-items-center h-full">
                <Box sx={{}} className="w-96 bg-slate-50 p-4 flex flex-col shadow border gap-2">
                    <h2 className="text-xl font-bold">Ajouter une personne</h2>
                    <TextField error={lastname == ""} value={lastname} onChange={e => setLastName(e.target.value)}
                               id="nom" label="Nom" variant="filled"/>
                    <TextField error={name == ""} value={name} onChange={e => setName(e.target.value)} id="prénom"
                               label="Prénom" variant="filled"/>
                    <div className="flex w-full">
                        <Button className="flex-1" onClick={handleSave}>Add</Button>
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((user: UserType) =>
                        <TableRow key={user.ID}>
                            <TableCell>{user.ID}</TableCell>
                            <TableCell>{user.lastname}</TableCell>
                            <TableCell>{user.name}</TableCell>

                            <TableCell>
                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={e => {
                                        setAnchorEl(e.currentTarget);
                                        setSelected(user.ID);
                                        setMenuOpen(true);
                                    }}
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
                <MenuItem onClick={() => send("users",{ID: selected}, "DELETE")}>Delete</MenuItem>
            </Menu>

        </div>
    );

    //<TableCell><QRCode value={user.ID}/></TableCell>

}