import AppLogo from "../../components/AppLogo";
import {LoginPage} from "./login";

export const Login = () => {
  return (
    <LoginPage
        title={<AppLogo/>}
      formProps={{
        initialValues: { email: "admin@example.com", password: "secret" },
      }}
    />
  );
};
