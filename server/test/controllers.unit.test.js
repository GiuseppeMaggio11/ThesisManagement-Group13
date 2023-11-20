"use strict";

const { isStudent, isProfessor, isLoggedIn } = require("../controllers/middleware")
const { getProposals, getProposal } = require("../controllers/showThesis")
const { newApplication } = require("../controllers/manageApplication")
const { addFiles, getAllFiles, getStudentFilesList, getFile } = require("../controllers/manageFiles")
const { newThesis } = require("../controllers/manageThesis")
const { listExternalCosupervisors, createExternalCosupervisor } = require("../controllers/others")



beforeEach(() => {
    jest.clearAllMocks();
});



describe("isLoggedIn", () => {

    test("Should grant access to an authenticated user", () => {
        const mockReq = {
            isAuthenticated: jest.fn().mockReturnValue(true)
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        isLoggedIn(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    test('Should return 401 if user is not authenticated', () => {
        const mockReq = {
            isAuthenticated: jest.fn().mockReturnValue(false)
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        isLoggedIn(mockReq, mockRes, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

});

describe("isStudent", () => {

    test("Should grant access to an authenticated student", () => {
        const mockReq = {
            isAuthenticated: jest.fn().mockReturnValue(true),
            user: {
                user_type: "STUD"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        isStudent(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    test('Should return 401 if student is not authenticated', () => {
        const mockReq = {
            isAuthenticated: jest.fn().mockReturnValue(false),
            user: {
                user_type: "STUD"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        isStudent(mockReq, mockRes, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not student' });
    });

    test('Should return 401 if the user is not a student', () => {
        const mockReq = {
            isAuthenticated: jest.fn().mockReturnValue(true),
            user: {
                user_type: "NOT_STUD"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        isStudent(mockReq, mockRes, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not student' });
    });

});

describe("isProfessor", () => {

    test("Should grant access to an authenticated student", () => {
        const mockReq = {
            isAuthenticated: jest.fn().mockReturnValue(true),
            user: {
                user_type: "PROF"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        isProfessor(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    test('Should return 401 if student is not authenticated', () => {
        const mockReq = {
            isAuthenticated: jest.fn().mockReturnValue(false),
            user: {
                user_type: "PROF"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        isProfessor(mockReq, mockRes, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not professor' });
    });

    test('Should return 401 if the user is not a student', () => {
        const mockReq = {
            isAuthenticated: jest.fn().mockReturnValue(true),
            user: {
                user_type: "NOT_PROF"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        isProfessor(mockReq, mockRes, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not professor' });
    });

});