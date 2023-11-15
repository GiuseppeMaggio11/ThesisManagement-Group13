const request = require("supertest");
const { app, isProfessor, isLoggedIn } = require("../index");
const {
  getTeachers,
  getExternal_cosupervisors_emails,
  getDegrees,
  getCodes_group,
  createThesis,
  createThesis_group,
  createThesis_cosupervisor_teacher,
  createThesis_cosupervisor_external,
} = require("../dao");
jest.mock("../dao");

beforeAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  getTeachers.mockClear();
  getExternal_cosupervisors_emails.mockClear();
  getDegrees.mockClear();
  getCodes_group.mockClear();
  createThesis.mockClear();
  createThesis_group.mockClear();
  createThesis_cosupervisor_teacher.mockClear();
  createThesis_cosupervisor_external.mockClear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("T1: Test new thesis", () => {
  test("T1.1 error 401 not authenticated", (done) => {
    const mockedThesis = {};
    isProfessor.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .post("/api/newThesis")
      .send(mockedThesis)
      .then((res) => {
        expect(res.status).toBe(401);
        done();
      });
  });
});
