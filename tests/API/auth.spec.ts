import { test, expect } from "@playwright/test";
import { user } from "../../constants/testdata";
import { $text } from "../../constants/textdata";
import { Client } from "pg";
import redis from "redis";
import RedisClient from "@redis/client/dist/lib/client";

test("[POST] Двух-факторная авторизация", async ({ request, baseURL }) => {
  const _response = await request.post(`${baseURL}/auth/jwt`, {
    data: {
      type: "two-factor",
      twoFactor: {
        username: "TestUserThree",
        password: "qweQWE1234!",
        verificationCode: "1234",
        userUnixTime: 555,
      },
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  process.env.refreshToken = responseBody.refreshToken;
  process.env.Token = responseBody.accessToken;
  expect(_response.status()).toBe(201);
  expect(responseBody).toHaveProperty("accessToken");
  expect(responseBody).toHaveProperty("refreshToken");
  expect(responseBody).toHaveProperty("expireTime");
  expect(responseBody).toHaveProperty("uuid");
});

test("[POST] Авторизация через ЭЦП", async ({ request, baseURL }) => {
  const _response = await request.post(`${baseURL}/auth/jwt`, {
    data: {
      type: "certificate",
      certificate: {
        iin: process.env.iin,
        issueDate: "2023-01-04 17:16:03",
        expireDate: "2024-01-04 17:16:03",
        sn: process.env.ecp_sn,
      },
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  expect(_response.status()).toBe(201);
  expect(responseBody).toHaveProperty("accessToken");
  expect(responseBody).toHaveProperty("refreshToken");
  expect(responseBody).toHaveProperty("expireTime");
  expect(responseBody).toHaveProperty("uuid");
});

test("[POST] Поиск несуществующего пользователя ЭЦП", async ({
  request,
  baseURL,
}) => {
  const _response = await request.post(`${baseURL}/auth/jwt`, {
    data: {
      type: "certificate",
      certificate: {
        iin: process.env.fake_iin,
        issueDate: "2023-01-04 17:16:03",
        expireDate: "2024-01-04 17:16:03",
        sn: process.env.ecp_sn,
      },
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  expect(responseBody.statusCode).toBe(400);
  expect(responseBody.message).toBe($text.userIsNotFound);
});

test("[POST] Неверный ввод динамического кода", async ({
  request,
  baseURL,
}) => {
  const _response = await request.post(`${baseURL}/auth/jwt`, {
    data: {
      type: "two-factor",
      twoFactor: {
        username: "g.muhamedzhanov",
        password: "qweQWE1234!",
        verificationCode: "1234",
        userUnixTime: 1234,
      },
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  expect(responseBody.statusCode).toBe(400);
  expect(responseBody.message).toBe($text.invalidDynamicCode);
});

test("[POST] Поиск несуществующего пользователя", async ({
  request,
  baseURL,
}) => {
  const _response = await request.post(`${baseURL}/auth/jwt`, {
    data: {
      type: "two-factor",
      twoFactor: {
        username: "",
        password: "qweQWE1234!",
        verificationCode: "1234",
        userUnixTime: 1234,
      },
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  expect(responseBody.statusCode).toBe(400);
  expect(responseBody.message).toBe($text.userIsNotFound);
});

test("[POST] Ввод неверного пароля", async ({ request, baseURL }) => {
  const _response = await request.post(`${baseURL}/auth/jwt`, {
    data: {
      type: "two-factor",
      twoFactor: {
        username: "d.tairov",
        password: "qweQWE1234!",
        verificationCode: "1234",
        userUnixTime: 555,
      },
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  const blockUserMessage = responseBody.message;

  if (blockUserMessage == $text.blockUserMessage || $text.userAccountBlockedMsg) {
    const pgClient = new Client({
      host: process.env.postgreHost,
      port: process.env.postgrePort,
      user: process.env.postgreUser,
      password: process.env.postgrePassword,
      database: process.env.postgreDB,
    });

    await pgClient.connect();
    const result = (
      await pgClient.query(
        'SELECT is_deleted FROM "public"."user" WHERE id=9689'
      )
    ).rows[0].is_deleted;  

    if (result == true) {
      await pgClient.query(
        'UPDATE "public"."user" SET is_deleted=false WHERE id=9689'
      );
    }
    await pgClient.end();
    const redis = require("redis");
    require("dotenv").config();
    const url = `redis://${process.env.redisHost}:${process.env.redisPort}`;
    const redisClient = redis.createClient({
      url,
      password: process.env.redisKey,
    });
    redisClient.connect();

    await new Promise<void>((resolve, reject) => {
      redisClient.on("connect", () => {
        console.log("Redis connected");
        resolve();
      });
      redisClient.on("error", (err) => {
        console.error(`Redis error: ${err}`);
        reject(err);
      });
      redisClient.del("user_auth_attempts_short_count:9689", function (err) {
        console.error(`Redis error: ${err}`);
      });
      redisClient.del("user_auth_attempts_long_count:9689", function (err) {
        console.error(`Redis error: ${err}`);
      });
    });

    redisClient.quit();
  } else expect(responseBody.message).toBe("Invalid password");
});

test("[POST] Проверка refreshToken", async ({ request, baseURL }) => {
  const _response = await request.post(`${baseURL}/auth/verify-refresh-token`, {
    data: {
      refreshToken: `${process.env.refreshToken}`,
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  expect(_response.status()).toBe(201);
  expect(responseBody).toHaveProperty("isValid");
});

test("[POST] Неверный refreshToken - под учетной запись авторизовались на другом устройстве", async ({
  request,
  baseURL,
}) => {
  const _response = await request.post(`${baseURL}/auth/verify-refresh-token`, {
    data: {
      refreshToken: `${process.env.refreshToken}s`,
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  expect(_response.status()).toBe(400);
  expect(responseBody).toHaveProperty("statusCode");
  expect(responseBody).toHaveProperty("error");
  expect(responseBody).toHaveProperty("message");
  expect(responseBody.message).toBe($text.anotherLoggedUser);
});

test("[POST] Получение обновленных accessToken и refreshToken", async ({
  request,
  baseURL,
}) => {
  const _response = await request.post(`${baseURL}/auth/refresh-token`, {
    data: {
      refreshToken: `${process.env.refreshToken}`,
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  expect(_response.status()).toBe(201);
  expect(responseBody).toHaveProperty("accessToken");
  expect(responseBody).toHaveProperty("refreshToken");
  expect(responseBody).toHaveProperty("expireTime");
});

test("[POST] Сессия истекла", async ({ request, baseURL }) => {
  const _response = await request.post(`${baseURL}/auth/refresh-token`, {
    data: {
      refreshToken: `${process.env.Token}`,
    },
    headers: {
      Accept: "application/json",
    },
  });

  const responseBody = JSON.parse(await _response.text());
  expect(_response.status()).toBe(400);
  expect(responseBody).toHaveProperty("statusCode");
  expect(responseBody).toHaveProperty("error");
  expect(responseBody).toHaveProperty("message");
  expect(responseBody.message).toBe($text.expiredSessionMessage);
});

test("[PUT] Выход из учетной записи", async ({ request, baseURL }) => {
  const _response = await request.put(`${baseURL}/auth/logout`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.Token}`,
    },
  });

  expect(_response.status()).toBe(200);
});