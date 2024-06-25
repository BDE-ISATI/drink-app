"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";


import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, useForm } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type UserType = {
  ID:string,
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

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
  
  async function send(body:Object,method:string): Promise<Response> {      

    let req = await fetch("https://rnwlvwlnab.execute-api.eu-west-3.amazonaws.com/Prod/users/update", {
        method: method,
        body: JSON.stringify(body),
    })
    
    let resp = await req.json()

    alert(resp.message)

    return req
}

  return (
    <div>

    <Button onClick={
      async() => { await send({softs:0,bieres:0,forts:0},"PUT")}
    }>Ajouter un user</Button>

    <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Softs</TableHead>
            <TableHead>Bières</TableHead>
            <TableHead>Forts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {data.data.map((user:UserType) =>
          <TableRow key={user.ID}>
            <TableCell>{user.ID}</TableCell>
            <TableCell>{user.softs}</TableCell>
            <TableCell>{user.bieres}</TableCell>
            <TableCell>{user.forts}</TableCell>
          </TableRow>
        )}
        </TableBody>

    </Table>
    </div>
  );
}

/*
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un user</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onSubmit={(event) => {
            alert("ok")
            event.preventDefault();
          }}>

        <DialogHeader>
          <DialogTitle>Ajouter un user</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">ID</Label>
            <Input id="username" defaultValue={Date.now()} className="col-span-3"/>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    */