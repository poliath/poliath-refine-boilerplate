import React from "react";
import {
  IResourceComponentsProps,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  Show,
  NumberField,
  TagField,
  EmailField,
  TextField,
  DateField,
} from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const UserShow: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
      <Show isLoading={isLoading}>
        <Title level={5}>{translate("users.fields.id")}</Title>
        <NumberField value={record?.id ?? ""} />
        <Title level={5}>{translate("users.fields.email")}</Title>
        <EmailField value={record?.email} />
        <Title level={5}>{translate("users.fields.provider")}</Title>
        <TextField value={record?.provider} />
        <Title level={5}>{translate("users.fields.firstName")}</Title>
        <TextField value={record?.firstName} />
        <Title level={5}>{translate("users.fields.lastName")}</Title>
        <TextField value={record?.lastName} />
        <Title level={5}>{translate("users.fields.createdAt")}</Title>
        <DateField value={record?.createdAt} />
        <Title level={5}>{translate("users.fields.updatedAt")}</Title>
        <DateField value={record?.updatedAt} />
        <Title level={5}>{translate("users.fields.role")}</Title>
        <TextField value={record?.role?.name} />
      </Show>
  );
};
