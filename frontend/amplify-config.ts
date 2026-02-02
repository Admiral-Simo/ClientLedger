import { ResourcesConfig } from "aws-amplify";

export const authConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: "eu-west-3_KNGnh8BiO",
      userPoolClientId: "2ucqnhil98igr1iqbtso96vk52",
      loginWith: {
        email: true,
      },
    },
  },
};
