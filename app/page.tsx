"use client"

import React,{useState,useEffect} from 'react';


import { Scanner , useDevices } from '@yudiel/react-qr-scanner';

export default function HomePage() {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>(useDevices());

  return (
    
    <div>
      <select onChange={(e) => setDeviceId(e.target.value)}>
            <option value={undefined}>Select a device</option>
            {devices.map((device, index) => (
                <option key={index} value={device.deviceId}>
                    {device.label}
                </option>
            ))}
        </select>
        <Scanner
            formats={[
                'qr_code',
            ]}
            constraints={{
                deviceId: deviceId
            }}
            onScan={(detectedCodes) => {
                alert(detectedCodes);
            }}
            components={{
                audio: true,
                onOff: true,
                torch: true,
                zoom: true,
                finder: true,
            }}
            scanDelay={2000}
        />
    </div>
);
};
