"use strict";

const { isStudent, isProfessor, isLoggedIn } = require("../controllers/middleware");
const { getProposals, getProposal } = require("../controllers/showThesis");
const { newApplication } = require("../controllers/manageApplication");
const { addFiles, getAllFiles, getStudentFilesList, getFile } = require("../controllers/manageFiles");
const { newThesis } = require("../controllers/manageThesis");
const { listExternalCosupervisors, createExternalCosupervisor } = require("../controllers/others");

const dao = require("../dao");
const dayjs = require("dayjs");

jest.mock("../dao");



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

describe("getProposals", () => {
    
    test("Should get a list of thesis proposals", async () => {
        const mockReq = {
            user: {
                username: "username",
                user_type: "STUD"
            },
            query:  {
                date: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const output = "output";
        dao.getProposals.mockResolvedValue(output);
    
        await getProposals(mockReq, mockRes);
    
        expect(dao.getProposals).toHaveBeenCalledTimes(1)
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(output);
    });

    test("Should return 500 - internal server error", async () => {
        const mockReq = {
            user: {
                username: "username",
                user_type: "STUD"
            },
            query:  {
                date: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        dao.getProposals.mockRejectedValue("Database error");
    
        await getProposals(mockReq, mockRes);
    
        expect(dao.getProposals).toHaveBeenCalledTimes(1)
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith("Database error");
    });

});

describe("getProposal", () => {
    
    test("Should get all the fields of a thesis proposal", async () => {
        const mockReq = {
            params: {
                id: 1
            },
            user: {
                username: "username",
                user_type: "STUD"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const output = "output";
        dao.getProposalById.mockResolvedValue(output);
    
        await getProposal(mockReq, mockRes);
    
        expect(dao.getProposalById).toHaveBeenCalledTimes(1)
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(output);
    });

    test("Should return 500 - \"thesis_id\" is not a number", async () => {
        const mockReq = {
            params: {
                id: "not a number"
            },
            user: {
                username: "username",
                user_type: "STUD"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await getProposal(mockReq, mockRes);
    
        expect(dao.getProposalById).not.toHaveBeenCalled()
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(new Error('Thesis ID must be an integer'));
    });

    test("Should return 500 - internal server error", async () => {
        const mockReq = {
            params: {
                id: 1
            },
            user: {
                username: "username",
                user_type: "STUD"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        dao.getProposalById.mockRejectedValue("Database error");
    
        await getProposal(mockReq, mockRes);
    
        expect(dao.getProposalById).toHaveBeenCalledTimes(1)
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith("Database error");
    });

});
