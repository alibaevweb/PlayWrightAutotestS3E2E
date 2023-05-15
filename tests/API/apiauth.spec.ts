import { test, expect } from '@playwright/test';
import { user } from '../../constants/userdata';
interface LoginResponse {
  access_token: string;
}

test("login", async ({ request, baseURL, context }) => {

  const response = await request.post(`${baseURL}api/auth/login`, {
    data: {
      email: user.email,
      fingerprint: "string",
      password: user.password
    }
  });

  const responseJson = await response.json() as LoginResponse;
  const Token = responseJson.access_token;

  // сохраняем токен в контексте Playwright
  await context.exposeFunction('getToken', () => Token);

  console.log(Token);
});
