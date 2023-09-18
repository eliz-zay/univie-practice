import { bootstrapApp, closeApp } from './util';

beforeAll(async () => {
  await bootstrapApp();
});

afterAll(async () => {
  await closeApp();
});
