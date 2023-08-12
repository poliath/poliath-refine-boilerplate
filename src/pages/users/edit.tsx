import React from "react";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import {Form, Input, DatePicker, Select} from "antd";
import {userRoles} from "../../interfaces/userRole.interface";

export const UserEdit: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { formProps, saveButtonProps, queryResult } = useForm();

  return (
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Form.Item
              label={translate("users.fields.id")}
              name={["id"]}
              rules={[
                {
                  required: true,
                },
              ]}
          >
            <Input readOnly disabled />
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
              <Select options={userRoles.map(role => ({ value: role.id, label: role.name }))} />
          </Form.Item>
        </Form>
      </Edit>
  );
};
