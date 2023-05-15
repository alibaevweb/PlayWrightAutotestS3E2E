import { test, expect } from "@playwright/test";
import { userAdm, userOne } from "../../constants/userdata";
import { $text } from "../../constants/textdata";
import { Client } from "pg";
import redis from "redis";
import RedisClient from "@redis/client/dist/lib/client";

test.beforeEach(async ({ request, baseURL }) => {
    const _response = await request.post(`${baseURL}/web/auth/login`, {
        data: {
          username: userOne.login,
          password: userOne.password
        },
      });
    
  });