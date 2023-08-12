import React, {useState} from 'react';
import {ConfigProvider, theme} from "antd";
import {useTranslate} from "@refinedev/core";

const AppLogo: React.FC = () => {
    const translate = useTranslate();
    const colorModeFromLocalStorage = localStorage.getItem("colorMode");
    const isSystemPreferenceDark = window?.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches;
    const systemPreference = isSystemPreferenceDark ? "dark" : "light";
    const [mode] = useState(
        colorModeFromLocalStorage || systemPreference,
    );

    const logoTextStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',  // Display items in a column
        alignItems: 'center',    // Center items horizontally
        textAlign: 'center',     // Center text within the span
        color: mode === 'light' ? '#000' : '#fff',
    };

    const imageStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        marginBottom: '10px',  // Add margin at the bottom to separate the image and text
    };

    return (
        <ConfigProvider
            theme={{
                algorithm:
                    mode === "light"
                        ? theme.defaultAlgorithm
                        : theme.darkAlgorithm,
            }}
        >
            <div style={logoTextStyle}>
                <img
                    src={'/logo.png'}
                    alt="App Logo"
                    style={imageStyle}
                />
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{translate('documentTitle.default', 'APP Name')}</span>
            </div>
        </ConfigProvider>
    );
};

export default AppLogo;
