import { test, expect } from '@playwright/test';
import { Client } from 'pg';
import redis from 'redis';
import { RedisClient } from 'redis';

test('PostgreSQL and Redis connection test', async () => {
  const client: RedisClient = redis.createClient({
    host: '10.240.18.100',
    port: 6380,
    username: 'default',
    password: 'rpass',
  } as redis.RedisClientOptions);

  await new Promise<void>((resolve, reject) => {
    client.on('connect', () => {
      console.log('Redis connected');
      resolve();
    });
    client.on('error', (err) => {
      console.error(`Redis error: ${err}`);
      reject(err);
    });
  });

  const pgClient = new Client({
    host: '10.240.18.100',
    port: 5432,
    user: 'default',
    password: 'pgpass',
    database: 'testdb',
  });

  await pgClient.connect();
  const result = await pgClient.query('testsergek');

  result.rows.forEach((row) => {
    console.log(row.Name);
    expect(row.Name).toContain('ttest');
  });

  await pgClient.end();
  client.quit();
});
