import React from "react";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import {userRoles} from "../../interfaces/userRole.interface";

export const UserCreate: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { formProps, saveButtonProps, queryResult } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={translate("users.fields.email")}
                    name={["email"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate("users.fields.password")}
                    name={["password"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input type={'password'} />
                </Form.Item>
                <Form.Item
                    label={translate("users.fields.firstName")}
                    name={["firstName"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate("users.fields.lastName")}
                    name={["lastName"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate("users.fields.role")}
                    name={["role", "id"]}

                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select options={userRoles.map(role => ({ value: role.id, label: role.name }))} placeholder="Please select user role" />
                </Form.Item>
            </Form>
        </Create>
    );
};
