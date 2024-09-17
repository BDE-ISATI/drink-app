"use client"

import React from 'react';
import {useRouter} from 'next/navigation'

import {IDetectedBarcode, IScannerStyles, Scanner} from '@yudiel/react-qr-scanner';


export default function HomePage() {
    const router = useRouter()

    function handleScan(detectedCodes: IDetectedBarcode[]) {
        router.push(`/user?id=${detectedCodes.at(0)?.rawValue}`, {scroll: false})
    }

    let style : IScannerStyles = {
        container:{
            "maxWidth":"500px"
        }
    }
    
    return (

        <div className="grid place-items-center">
            <Scanner

                styles={style}
                formats={[
                    'qr_code',
                ]}

                onScan={handleScan}

                components={{
                    audio: false,
                    onOff: false,
                    torch: false,
                    zoom: false,
                    finder: true,
                }}
                scanDelay={500}
            />
        </div>
    );
};

/*
            constraints={{
              deviceId: deviceId
            }}
      <select onChange={(e) => setDeviceId(e.target.value)}>
            <option value={undefined}>Select a device</option>
            {devices.map((device, index) => (
                <option key={index} value={device.deviceId}>
                    {device.label}
                </option>
            ))}
        </select>*/