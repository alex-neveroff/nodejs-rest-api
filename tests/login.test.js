import mongoose from "mongoose";
import request from "supertest";
import "dotenv/config";
import app from "../app";
import { User } from "../models/users.js";

const { DB_HOST_TEST } = process.env;

describe("test login router", () => {
  let server = null;
  const correctUser = {
    email: "alexandr.neveroff@gmail.com",
    password: "1234567",
  };

  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(3000);

    await request(app).post("/users/register").send(correctUser);
  });
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });
  afterEach(async () => {
    await request(app).post("/users/logout").send();
  });

  // Тестую логин з корректними данними
  test("test login with correct data", async () => {
    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(correctUser);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("token");
    expect(body).toMatchObject({
      user: {
        email: expect.any(String),
        subscription: expect.any(String),
      },
    });
    expect(body.user.email).toBe(correctUser.email);
  });

  // Тестую логин з некорректним е-мейлом

  test("test login with incorrect email", async () => {
    const incorrectEmail = {
      email: "neveroff@gmail.com",
      password: "1234567",
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(incorrectEmail);

    expect(statusCode).toBe(401);
    expect(body).not.toHaveProperty("token");
    expect(body).toMatchObject({
      message: "Email or password is wrong",
    });
  });

  // Тестую логин з некорректним паролем

  test("test login with incorrect password", async () => {
    const incorrectPassword = {
      email: "alexandr.neveroff@gmail.com",
      password: "abcdefg",
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(incorrectPassword);

    expect(statusCode).toBe(401);
    expect(body).not.toHaveProperty("token");
    expect(body).toMatchObject({
      message: "Email or password is wrong",
    });
  });

  // Тестую логин з невалiдним е-мейлом
  test("test login with invalid email", async () => {
    const invalidEmail = {
      email: "alexandr.neveroffgmail.com",
      password: "1234567",
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(invalidEmail);

    expect(statusCode).toBe(400);
    expect(body).not.toHaveProperty("token");
    expect(body).toMatchObject({
      message: "Field email not valid",
    });
  });

  // Тестую логин з е-мейлом не рядком
  test("test login with not string email", async () => {
    const notStringEmail = {
      email: true,
      password: "1234567",
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(notStringEmail);

    expect(statusCode).toBe(400);
    expect(body).not.toHaveProperty("token");
    expect(body).toMatchObject({
      message: "Field email must be a string",
    });
  });
  // Тестую логин з паролем не рядком
  test("test login with not string password", async () => {
    const notStringPassword = {
      email: "alexandr.neveroff@gmail.com",
      password: true,
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(notStringPassword);

    expect(statusCode).toBe(400);
    expect(body).not.toHaveProperty("token");
    expect(body).toMatchObject({
      message: "Field password must be a string",
    });
  });

  // Тестую логин без е-мейла
  test("test login without email", async () => {
    const withoutEmail = {
      password: "1234567",
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(withoutEmail);

    expect(statusCode).toBe(400);
    expect(body).not.toHaveProperty("token");
    expect(body).toMatchObject({
      message: "Missing required email field",
    });
  });
  // Тестую логин без пароля
  test("test login without password", async () => {
    const withoutPassword = {
      email: "alexandr.neveroff@gmail.com",
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(withoutPassword);

    expect(statusCode).toBe(400);
    expect(body).not.toHaveProperty("token");
    expect(body).toMatchObject({
      message: "Missing required password field",
    });
  });
});
