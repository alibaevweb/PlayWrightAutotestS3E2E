import { user } from '../constants/userdata';

const baseURL: string = 'http://admin.qazvms.local/';

export async function login(page): Promise<string> {
  interface LoginResponse {
    access_token: string;
  }

  const response = await page.context().request.post(`${baseURL}api/auth/login`, {
    data: {
      email: user.email,
      fingerprint: "string",
      password: user.password
    }
  });

  const responseJson: LoginResponse = await response.json();
  const Token: string = responseJson.access_token;

  // сохраняем access_token в контексте Playwright
  await page.context().exposeFunction('getToken', () => Token);

  console.log(Token);

  return Token; // добавлено для возврата токена
}

