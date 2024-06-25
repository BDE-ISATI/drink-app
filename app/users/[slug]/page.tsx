"use client"
import { useEffect, useState } from "react"

type UserType = {
  ID:string,
  softs:number,
  bieres:number,
  forts:number
}

export default function Page({ params }: { params: { slug: string } }) {
  
  let [data,setData] = useState<UserType>({ID:"",softs:0,bieres:0,forts:0})

  useEffect(() =>{
    fetch("https://rnwlvwlnab.execute-api.eu-west-3.amazonaws.com/Prod/users").then((resp) => {
      return resp.json()
    }).then((resp)=>{
      for (let val of resp){
        if (val.ID === params.slug){
          setData(val)
          break
        }
      }
    })
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      ID: {data.ID}
      Softs: {data.softs}
      Bieres: {data.bieres}
      Forts: {data.forts}
    </main>
  );
}