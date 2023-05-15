import { test, expect } from "@playwright/test";
import { userAdm, userOne } from "../../constants/userdata";
import { $text } from "../../constants/textdata";
import { Client } from "pg";
import redis from "redis";
import RedisClient from "@redis/client/dist/lib/client";

test("[POST] Авторизация с корректными данными", async ({ request, baseURL }) => {
  const _response = await request.post(`${baseURL}/web/auth/login`, {
    data: {
      username: userOne.login,
      password: userOne.password
    },
  });

  expect(_response.status()).toBe(201);

});

test("[POST] Авторизация с некорректным логином", async ({ request, baseURL }) => {
  const _response = await request.post(`${baseURL}/web/auth/login`, {
    data: {
      username: userOne.invalid_login,
      password: userOne.password
    },
  });
  const responseBody = JSON.parse(await _response.text());
  expect(_response.status()).toBe(404);
  //expect(Response).toHaveProperty("error");
  expect(responseBody.message).toBe($text.userIsNotFound);
});
