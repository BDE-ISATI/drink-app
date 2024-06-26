"use client"
import "./globals.css"
import { useState } from "react";
import { Paper, BottomNavigation, Container, BottomNavigationAction } from "@mui/material";
import { QrCode, AccountCircle } from "@mui/icons-material";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [value, setValue] = useState(0);

  return (
    <html lang="en">
      <body>
        <Container maxWidth="md" className="my-16">
          {children}
        </Container>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.drawer + 2}} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction href="/" label="QrCode" icon={<QrCode />} />
          <BottomNavigationAction href="users" label="Users" icon={<AccountCircle />} />
        </BottomNavigation>
      </Paper>
      </body>
    </html>
  );
}
