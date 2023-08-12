import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
    useTranslate,
} from "@refinedev/core";
import {
    Card,
    Typography,
    Button,
    theme, message, Layout, Row, Col,
} from "antd";
import AppLogo from "../../components/AppLogo";
import {containerStyles, layoutStyles} from "../../components/styles/authStyles";
import {API_URL} from "../../constants";

const { Title } = Typography;
const { useToken } = theme;

export const ConfirmEmailPage: React.FC = () => {
    const navigate = useNavigate(); // Get the navigate function
    const { token } = useToken();
    const translate = useTranslate();
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams(); // Extract the id from the URL

    const handleConfirm = async () => {
        setIsLoading(true);

        try {
                const response = await fetch(`${API_URL}/auth/email/confirm`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hash: id })
                });

                if (response.ok) {
                    message.success("Email confirmed successfully");

                    setTimeout(() => {
                        navigate("/login"); // Replace "/login" with your actual login page route
                    }, 1200);
                } else {
                    message.error("There was a problem verifying your email");
                    setIsLoading(false);
                }

            // Handle successful confirmation, e.g., show a success message
        } catch (error) {
            message.error("There was a problem verifying your email");
            setIsLoading(false);
        }
    };

    const CardTitle = (
        <Title
            level={3}
            style={{
                color: token.colorPrimaryTextHover,
                display: "flex",
                justifyContent: "center",
            }}
        >
            {translate("pages.confirmEmail.title", "Confirm email")}
        </Title>
    );

    const CardContent = (
        <Card
            title={CardTitle}
            style={{
                ...containerStyles,
                backgroundColor: token.colorBgElevated,
            }}
        >
            <Button
                type="primary"
                size="large"
                loading={isLoading}
                block
                onClick={handleConfirm} // Call handleConfirm on button click
                disabled={isLoading}
            >
                {isLoading
                    ? translate("pages.confirmEmail.buttons.confirming", "Confirming...")
                    : translate("pages.confirmEmail.buttons.confirm", "Confirm")}
            </Button>

        </Card>
    );

    return (
        <Layout style={layoutStyles}>
            <Row
                justify="center"
                align="middle"
                style={{
                    height: "100vh",
                }}
            >
                <Col xs={22}>
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: "32px",
                                    fontSize: "20px",
                                }}
                            >
                                <AppLogo />
                            </div>
                            {CardContent}
                        </>
                </Col>
            </Row>
        </Layout>
    );
};
