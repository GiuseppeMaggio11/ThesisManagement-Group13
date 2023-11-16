"use strict";

const dao = require("../dao");
const { app } = require("../index");
const request = require("supertest");
const express = require("express");
const dayjs = require("dayjs");

const { isStudentMiddleware } = require("../middleware");

jest.mock("../Middleware", () => ({
  isStudentMiddleware: jest.fn(),
}));

jest.mock("../dao");



beforeEach(() => {
    jest.clearAllMocks();
});



describe("POST /api/newApplication/:thesis_id", () => {

    test("Should apply a student for a thesis proposal", async () => {
        isStudentMiddleware.mockImplementation((req, res, next) => {
            req.user = { username: "username", user_type: "STUD", isAuthenticated: true };
            return next();
        });

        dao.getUserID = jest.fn().mockResolvedValue(1);
        dao.isThesisValid = jest.fn().mockResolvedValue(true);
        dao.isAlreadyExisting = jest.fn().mockResolvedValue(false);
        dao.newApply = jest.fn().mockResolvedValue(true);

        const response = await request(app)
            .post("/api/newApplication/1")
            .send({ date: dayjs("2022-06-01") });

        expect(response.status).toStrictEqual(200)
        expect(response.text).toStrictEqual("Application created successfully");
        expect(dao.getUserID).toHaveBeenCalledTimes(1);
        expect(dao.isThesisValid).toHaveBeenCalledTimes(1);
        expect(dao.isAlreadyExisting).toHaveBeenCalledTimes(1);
        expect(dao.newApply).toHaveBeenCalledTimes(1);
    });

});