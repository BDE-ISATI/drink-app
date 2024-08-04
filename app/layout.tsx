"use client"
import "./globals.css"
import {useEffect, useState} from "react";
import {BottomNavigation, BottomNavigationAction, Container, Paper} from "@mui/material";
import {AccountCircle, Event, QrCode} from "@mui/icons-material";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const [value, setValue] = useState<string>("");

    useEffect(() => {
        setValue(window.location.pathname);
    }, []);

    return (
        <html lang="fr">
        <body>
        <Container maxWidth="md" className="overflow-auto min-h-dvh py-16">
            {children}
        </Container>
        <Paper sx={{position: "fixed", bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.drawer + 2}}
               elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
            >
                <BottomNavigationAction value="/" href="/" label="QrCode" icon={<QrCode/>}/>
                <BottomNavigationAction value="/users" href="/users" label="Users" icon={<AccountCircle/>}/>
                <BottomNavigationAction value="/events" href="/events" label="Events" icon={<Event/>}/>
            </BottomNavigation>
        </Paper>
        </body>
        </html>
    );
}
