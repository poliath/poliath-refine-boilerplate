import React from "react";
import {
  LoginPageProps,
  LoginFormTypes,
  useLink,
  useRouterType,
  useActiveAuthProvider,
  useLogin,
  useTranslate,
  useRouterContext,
} from "@refinedev/core";
import { ThemedTitle } from "@refinedev/antd";
import {
  bodyStyles,
  containerStyles,
  headStyles,
  layoutStyles,
  titleStyles,
} from "../../components/styles/authStyles";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  CardProps,
  LayoutProps,
  Divider,
  FormProps,
  theme,
} from "antd";

const { Text, Title } = Typography;
const { useToken } = theme;

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
}) => {
  const { token } = useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title ?? <ThemedTitle collapsed={false} />}
      </div>
    );

  const CardTitle = (
    <Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {translate("pages.login.title", "Sign in to your account")}
    </Title>
  );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "8px",
                }}
                onClick={() =>
                  login({
                    providerName: provider.name,
                  })
                }
              >
                {provider.label}
              </Button>
            );
          })}
          <Divider>
            <Text
              style={{
                color: token.colorTextLabel,
              }}
            >
              {translate("pages.login.divider", "or")}
            </Text>
          </Divider>
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card
      title={CardTitle}
      headStyle={headStyles}
      bodyStyle={bodyStyles}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
      {...(contentProps ?? {})}
    >
      {renderProviders()}
      <Form<LoginFormTypes>
        layout="vertical"
        form={form}
        onFinish={(values) => login(values)}
        requiredMark={false}
        initialValues={{
          remember: false,
        }}
        {...formProps}
      >
        <Form.Item
          name="email"
          label={translate("pages.login.fields.email", "Email")}
          rules={[
            { required: true },
            {
              type: "email",
              message: translate(
                "pages.login.errors.validEmail",
                "Invalid email address"
              ),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={translate("pages.login.fields.email", "Email")}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={translate("pages.login.fields.password", "Password")}
          rules={[{ required: true }]}
        >
          <Input type="password" placeholder="●●●●●●●●" size="large" />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          {rememberMe ?? (
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox
                style={{
                  fontSize: "12px",
                }}
              >
                {translate("pages.login.buttons.rememberMe", "Remember me")}
              </Checkbox>
            </Form.Item>
          )}
          {forgotPasswordLink ?? (
            <ActiveLink
              style={{
                color: token.colorPrimaryTextHover,
                fontSize: "12px",
                marginLeft: "auto",
              }}
              to="/forgot-password"
            >
              {translate(
                "pages.login.buttons.forgotPassword",
                "Forgot password?"
              )}
            </ActiveLink>
          )}
        </div>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            block
          >
            {translate("pages.login.signin", "Sign in")}
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 8 }}>
        {registerLink ?? (
          <Text style={{ fontSize: 12 }}>
            {translate(
              "pages.login.buttons.noAccount",
              "Don’t have an account?"
            )}{" "}
            <ActiveLink
              to="/register"
              style={{
                fontWeight: "bold",
                color: token.colorPrimaryTextHover,
              }}
            >
              {translate("pages.login.signup", "Sign up")}
            </ActiveLink>
          </Text>
        )}
      </div>
    </Card>
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContent, PageTitle)
          ) : (
            <>
              {PageTitle}
              {CardContent}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};
