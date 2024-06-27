"use client"

import React from 'react';
import {useRouter} from 'next/navigation'


import {IDetectedBarcode, Scanner} from '@yudiel/react-qr-scanner';


export default function HomePage() {
    //const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
    //const [devices, setDevices] = useState<MediaDeviceInfo[]>(useDevices());

    const router = useRouter()

    function handleScan(detectedCodes: IDetectedBarcode[]) {
        router.push(`/users/${detectedCodes.at(0)?.rawValue}`, {scroll: false})
    }

    return (

        <div className="grid place-items-center">
            <Scanner
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