"use strict";

const { isStudent, isProfessor, isLoggedIn } = require("../controllers/middleware");
const { getProposals, getProposal } = require("../controllers/showThesis");
const { newApplication, updateApplicationStatus, getApplications,getApplicationStudent  } = require("../controllers/manageApplication");
const { addFiles, getAllFiles, getStudentFilesList, getFile } = require("../controllers/manageFiles");
const { newThesis, updateThesesArchivation } = require("../controllers/manageThesis");
const { listExternalCosupervisors, createExternalCosupervisor } = require("../controllers/others");

const dao = require("../dao");
const dayjs = require("dayjs");
const { validationResult } = require("express-validator");
const fs = require("fs");

jest.mock("../dao");
jest.mock("express-validator");
jest.mock("fs");



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

describe("newApplication", () => {

    test("Should create a new application if the thesis is valid and the student hasn't already applied for it", async () => {
        const mockReq = {
            user: {
                username: "username"
            },
            params: {
                thesis_id: 1
            },
            body: {
                date: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        dao.getUserID.mockResolvedValue("S123456");
        dao.isThesisValid.mockResolvedValue(true);
        dao.isAlreadyExisting.mockResolvedValue(false);
        dao.getApplications.mockResolvedValue([]);
        dao.newApply.mockResolvedValue(true);

        await newApplication(mockReq, mockRes);

        expect(dao.getUserID).toHaveBeenCalledTimes(1);
        expect(dao.isThesisValid).toHaveBeenCalledTimes(1);
        expect(dao.isAlreadyExisting).toHaveBeenCalledTimes(1);
        expect(dao.getApplications).toHaveBeenCalledTimes(1);
        expect(dao.newApply).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith("Application created successfully");
    });

    test("Should return 422 - \"thesis_id\" is not an integer", async () => {
        const mockReq = {
            user: {
                username: "username"
            },
            params: {
                thesis_id: "Not a number"
            },
            body: {
                date: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await newApplication(mockReq, mockRes);

        expect(dao.getUserID).not.toHaveBeenCalled();
        expect(dao.isThesisValid).not.toHaveBeenCalled();
        expect(dao.isAlreadyExisting).not.toHaveBeenCalled();
        expect(dao.newApply).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith("Thesis ID must be an integer");
    });

    test("Should return 422 - The thesis is not valid", async () => {
        const mockReq = {
            user: {
                username: "username"
            },
            params: {
                thesis_id: 1
            },
            body: {
                date: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        dao.getUserID.mockResolvedValue("S123456");
        dao.isThesisValid.mockResolvedValue(false);

        await newApplication(mockReq, mockRes);

        expect(dao.getUserID).toHaveBeenCalledTimes(1);
        expect(dao.isThesisValid).toHaveBeenCalledTimes(1);
        expect(dao.isAlreadyExisting).not.toHaveBeenCalled();
        expect(dao.newApply).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith("This thesis is not valid");
    });

    test("Should return 422 - The student is already applie for the thesis", async () => {
        const mockReq = {
            user: {
                username: "username"
            },
            params: {
                thesis_id: 1
            },
            body: {
                date: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        dao.getUserID.mockResolvedValue("S123456");
        dao.isThesisValid.mockResolvedValue(true);
        dao.isAlreadyExisting.mockResolvedValue(true);

        await newApplication(mockReq, mockRes);

        expect(dao.getUserID).toHaveBeenCalledTimes(1);
        expect(dao.isThesisValid).toHaveBeenCalledTimes(1);
        expect(dao.isAlreadyExisting).toHaveBeenCalledTimes(1);
        expect(dao.newApply).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith("You are already applied for this thesis");
    });

    test("Should return 500 - Internal server error", async () => {
        const mockReq = {
            user: {
                username: "username"
            },
            params: {
                thesis_id: 1
            },
            body: {
                date: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        dao.getUserID.mockRejectedValue("Database error");

        await newApplication(mockReq, mockRes);

        expect(dao.getUserID).toHaveBeenCalledTimes(1);
        expect(dao.isThesisValid).not.toHaveBeenCalled();
        expect(dao.isAlreadyExisting).not.toHaveBeenCalled();
        expect(dao.newApply).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith("Database error");
    });

});

describe("newThesis", () => {

    test("Should create a new thesis proposal", async () => {
        const mockReq = {
            body: {
                title: "title",
                description: "description",
                supervisor_id: "P111111",
                thesis_level: "thesis_level",
                type_name: "type_name",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: "2025-01-01 00:00:00",
                cod_degree: "DEGR01",
                is_archived: false,
                keywords: "keywords",
                cod_group: "GRP001",
                cosupervisors_internal: [
                    "P222222",
                    "P333333"
                ],
                cosupervisors_external: [
                    "cos.ext1@mail.com",
                    "cos.ext2@mail.com",
                    "cos.ext3@mail.com"
                ],
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };
        const thesis_group = {
            thesis_id: 1,
            group_id: mockReq.body.cod_group
        };
        const thesis_internal_cosupervisors = [
            {
                thesis_id: 1,
                thesis_cosupervisor: mockReq.body.cosupervisors_external[0]
            },
            {
                thesis_id: 1,
                thesis_cosupervisor: mockReq.body.cosupervisors_external[1]
            },
            {
                thesis_id: 1,
                thesis_cosupervisor: mockReq.body.cosupervisors_external[2]
            }
        ];
        const thesis_external_cosupervisors = [
            {
                thesis_id: 1,
                thesis_cosupervisor: mockReq.body.cosupervisors_internal[0]
            },
            {
                thesis_id: 1,
                thesis_cosupervisor: mockReq.body.cosupervisors_internal[1]
            }
        ];
        const thesis = { id: 1, ...mockReq.body };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getTeachers.mockResolvedValue(["P111111", "P222222", "P333333"]);
        dao.getExternal_cosupervisors_emails.mockResolvedValue(["cos.ext1@mail.com", "cos.ext2@mail.com", "cos.ext3@mail.com"]);
        dao.getDegrees.mockResolvedValue(["DEGR01"]);
        dao.getCodes_group.mockResolvedValue(["GRP001"]);
        dao.createThesis.mockResolvedValue(thesis);
        dao.createThesis_group.mockResolvedValue(thesis_group);
        dao.createThesis_cosupervisor_teacher.mockResolvedValueOnce(thesis_internal_cosupervisors[0]);
        dao.createThesis_cosupervisor_teacher.mockResolvedValueOnce(thesis_internal_cosupervisors[1]);
        dao.createThesis_cosupervisor_external.mockResolvedValueOnce(thesis_external_cosupervisors[0]);
        dao.createThesis_cosupervisor_external.mockResolvedValueOnce(thesis_external_cosupervisors[1]);
        dao.createThesis_cosupervisor_external.mockResolvedValueOnce(thesis_external_cosupervisors[2]);
        dao.commit.mockResolvedValue(true);

        await newThesis(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getTeachers).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).toHaveBeenCalledTimes(1);
        expect(dao.getDegrees).toHaveBeenCalledTimes(1);
        expect(dao.getCodes_group).toHaveBeenCalledTimes(1);
        expect(dao.createThesis).toHaveBeenCalledTimes(1);
        expect(dao.createThesis_group).toHaveBeenCalledTimes(1);
        expect(dao.createThesis_cosupervisor_teacher).toHaveBeenCalledTimes(2);
        expect(dao.createThesis_cosupervisor_external).toHaveBeenCalledTimes(3);
        expect(dao.commit).toHaveBeenCalledTimes(1);
        expect(dao.rollback).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(thesis);
    });

    test("Should return 422 - express-validator has found some errors", async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => false)
        };

        validationResult.mockReturnValue(mockedValidationResult);

        await newThesis(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).not.toHaveBeenCalled();
        expect(dao.getTeachers).not.toHaveBeenCalled();
        expect(dao.getExternal_cosupervisors_emails).not.toHaveBeenCalled();
        expect(dao.getDegrees).not.toHaveBeenCalled();
        expect(dao.getCodes_group).not.toHaveBeenCalled();
        expect(dao.createThesis).not.toHaveBeenCalled();
        expect(dao.createThesis_group).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_teacher).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_external).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json.mock.calls[0][0]).toHaveProperty("errors");
    });

    test("Should return 400 - The provided \"supervisor_id\" doesn't represent a teacher", async () => {
        const mockReq = {
            body: {
                title: "title",
                description: "description",
                supervisor_id: "P444444",
                thesis_level: "thesis_level",
                type_name: "type_name",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: "2025-01-01 00:00:00",
                cod_degree: "DEGR01",
                is_archived: false,
                keywords: "keywords",
                cod_group: "GRP001",
                cosupervisors_internal: [
                    "P222222",
                    "P333333"
                ],
                cosupervisors_external: [
                    "cos.ext1@mail.com",
                    "cos.ext2@mail.com",
                    "cos.ext3@mail.com"
                ],
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getTeachers.mockResolvedValue(["P111111", "P222222", "P333333"]);
        dao.rollback.mockResolvedValue(true);

        await newThesis(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getTeachers).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).not.toHaveBeenCalled();
        expect(dao.getDegrees).not.toHaveBeenCalled();
        expect(dao.getCodes_group).not.toHaveBeenCalled();
        expect(dao.createThesis).not.toHaveBeenCalled();
        expect(dao.createThesis_group).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_teacher).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_external).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: `Supervisor_id: ${mockReq.body.supervisor_id} is not a teacher` });
    });

    test("Should return 400 - At least one of the provided internal cosupervisors is not a teacher", async () => {
        const mockReq = {
            body: {
                title: "title",
                description: "description",
                supervisor_id: "P111111",
                thesis_level: "thesis_level",
                type_name: "type_name",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: "2025-01-01 00:00:00",
                cod_degree: "DEGR01",
                is_archived: false,
                keywords: "keywords",
                cod_group: "GRP001",
                cosupervisors_internal: [
                    "P222222",
                    "P333333",
                    "P444444"
                ],
                cosupervisors_external: [
                    "cos.ext1@mail.com",
                    "cos.ext2@mail.com",
                    "cos.ext3@mail.com"
                ],
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getTeachers.mockResolvedValue(["P111111", "P222222", "P333333"]);
        dao.rollback.mockResolvedValue(true);

        await newThesis(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getTeachers).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).not.toHaveBeenCalled();
        expect(dao.getDegrees).not.toHaveBeenCalled();
        expect(dao.getCodes_group).not.toHaveBeenCalled();
        expect(dao.createThesis).not.toHaveBeenCalled();
        expect(dao.createThesis_group).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_teacher).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_external).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: `Internal cosupervisor_id: P444444 is not a teacher` });
    });

    test("Should return 400 - At least one of the provided external cosupervisors is not a valid cosupervisor", async () => {
        const mockReq = {
            body: {
                title: "title",
                description: "description",
                supervisor_id: "P111111",
                thesis_level: "thesis_level",
                type_name: "type_name",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: "2025-01-01 00:00:00",
                cod_degree: "DEGR01",
                is_archived: false,
                keywords: "keywords",
                cod_group: "GRP001",
                cosupervisors_internal: [
                    "P222222",
                    "P333333"
                ],
                cosupervisors_external: [
                    "cos.ext1@mail.com",
                    "cos.ext2@mail.com",
                    "cos.ext4@mail.com"
                ],
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getTeachers.mockResolvedValue(["P111111", "P222222", "P333333"]);
        dao.getExternal_cosupervisors_emails.mockResolvedValue(["cos.ext1@mail.com", "cos.ext2@mail.com", "cos.ext3@mail.com"]);
        dao.rollback.mockResolvedValue(true);

        await newThesis(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getTeachers).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).toHaveBeenCalledTimes(1);
        expect(dao.getDegrees).not.toHaveBeenCalled();
        expect(dao.getCodes_group).not.toHaveBeenCalled();
        expect(dao.createThesis).not.toHaveBeenCalled();
        expect(dao.createThesis_group).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_teacher).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_external).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: `External cosupervisor email: cos.ext4@mail.com is not a valid external cosupervisor email` });
    });

    test("Should return 400 - The provided \"cod_degree\" doesn't represent a degree", async () => {
        const mockReq = {
            body: {
                title: "title",
                description: "description",
                supervisor_id: "P111111",
                thesis_level: "thesis_level",
                type_name: "type_name",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: "2025-01-01 00:00:00",
                cod_degree: "DEGR02",
                is_archived: false,
                keywords: "keywords",
                cod_group: "GRP001",
                cosupervisors_internal: [
                    "P222222",
                    "P333333"
                ],
                cosupervisors_external: [
                    "cos.ext1@mail.com",
                    "cos.ext2@mail.com",
                    "cos.ext3@mail.com"
                ],
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getTeachers.mockResolvedValue(["P111111", "P222222", "P333333"]);
        dao.getExternal_cosupervisors_emails.mockResolvedValue(["cos.ext1@mail.com", "cos.ext2@mail.com", "cos.ext3@mail.com"]);
        dao.getDegrees.mockResolvedValue(["DEGR01"]);
        dao.rollback.mockResolvedValue(true);

        await newThesis(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getTeachers).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).toHaveBeenCalledTimes(1);
        expect(dao.getDegrees).toHaveBeenCalledTimes(1);
        expect(dao.getCodes_group).not.toHaveBeenCalled();
        expect(dao.createThesis).not.toHaveBeenCalled();
        expect(dao.createThesis_group).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_teacher).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_external).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: `Cod_degree: ${mockReq.body.cod_degree} is not a valid degree code` });
    });

    test("Should return 400 - The provided \"cod_group\" doesn't represent a group", async () => {
        const mockReq = {
            body: {
                title: "title",
                description: "description",
                supervisor_id: "P111111",
                thesis_level: "thesis_level",
                type_name: "type_name",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: "2025-01-01 00:00:00",
                cod_degree: "DEGR01",
                is_archived: false,
                keywords: "keywords",
                cod_group: "GRP002",
                cosupervisors_internal: [
                    "P222222",
                    "P333333"
                ],
                cosupervisors_external: [
                    "cos.ext1@mail.com",
                    "cos.ext2@mail.com",
                    "cos.ext3@mail.com"
                ],
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getTeachers.mockResolvedValue(["P111111", "P222222", "P333333"]);
        dao.getExternal_cosupervisors_emails.mockResolvedValue(["cos.ext1@mail.com", "cos.ext2@mail.com", "cos.ext3@mail.com"]);
        dao.getDegrees.mockResolvedValue(["DEGR01"]);
        dao.getCodes_group.mockResolvedValue(["GRP001"]);
        dao.rollback.mockResolvedValue(true);

        await newThesis(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getTeachers).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).toHaveBeenCalledTimes(1);
        expect(dao.getDegrees).toHaveBeenCalledTimes(1);
        expect(dao.getCodes_group).toHaveBeenCalledTimes(1);
        expect(dao.createThesis).not.toHaveBeenCalled();
        expect(dao.createThesis_group).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_teacher).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_external).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: `Cod_group: ${mockReq.body.cod_group} is not a valid research group code` });
    });

    test("Should return 500 - Internal server error", async () => {
        const mockReq = {
            body: {
                title: "title",
                description: "description",
                supervisor_id: "P111111",
                thesis_level: "thesis_level",
                type_name: "type_name",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: "2025-01-01 00:00:00",
                cod_degree: "DEGR01",
                is_archived: false,
                keywords: "keywords",
                cod_group: "GRP001",
                cosupervisors_internal: [
                    "P222222",
                    "P333333"
                ],
                cosupervisors_external: [
                    "cos.ext1@mail.com",
                    "cos.ext2@mail.com",
                    "cos.ext3@mail.com"
                ],
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockRejectedValue("Database error");
        dao.rollback.mockResolvedValue(true);

        await newThesis(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getTeachers).not.toHaveBeenCalled();
        expect(dao.getExternal_cosupervisors_emails).not.toHaveBeenCalled();
        expect(dao.getDegrees).not.toHaveBeenCalled();
        expect(dao.getCodes_group).not.toHaveBeenCalled();
        expect(dao.createThesis).not.toHaveBeenCalled();
        expect(dao.createThesis_group).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_teacher).not.toHaveBeenCalled();
        expect(dao.createThesis_cosupervisor_external).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(503);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Database error"});
    });

});

describe("listExternalCosupervisors", () => {

    test("Should retrieve the list of all the external cosupervisors", async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const output = ["cos_ext_1", "cos_ext_2", "cos_ext_3"];

        dao.getExternal_cosupervisors.mockResolvedValue(output);

        await listExternalCosupervisors(mockReq, mockRes);

        expect(dao.getExternal_cosupervisors).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(output);
    });

    test("Should return 500 - Internal server error", async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        dao.getExternal_cosupervisors.mockRejectedValue("Database error");

        await listExternalCosupervisors(mockReq, mockRes);

        expect(dao.getExternal_cosupervisors).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith("Database error");
    });

});

describe("createExternalCosupervisor", () => {

    test("Should create a new external cosupervisor", async () => {
        const mockReq = {
            body: {
                name: "cos",
                surname: "ext",
                email: "cos.ext4@mail.com"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getExternal_cosupervisors_emails.mockResolvedValue(["cos.ext1@mail.com", "cos.ext2@mail.com", "cos.ext3@mail.com"]);
        dao.create_external_cosupervisor.mockResolvedValue({ ...mockReq.body })
        dao.commit.mockResolvedValue(true);

        await createExternalCosupervisor(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).toHaveBeenCalledTimes(1);
        expect(dao.create_external_cosupervisor).toHaveBeenCalledTimes(1);
        expect(dao.commit).toHaveBeenCalledTimes(1);
        expect(dao.rollback).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ ...mockReq.body });
    });

    test("Should return 422 - express-validator has found some errors", async () => {
        const mockReq = {
            body: {
                name: "cos",
                surname: "ext",
                email: "cos.ext4@mail.com"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockedValidationResult = {
            isEmpty: jest.fn(() => false),
        };

        validationResult.mockReturnValue(mockedValidationResult);

        await createExternalCosupervisor(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).not.toHaveBeenCalled();
        expect(dao.getExternal_cosupervisors_emails).not.toHaveBeenCalled();
        expect(dao.create_external_cosupervisor).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json.mock.calls[0][0]).toHaveProperty("errors");
    });

    test("Should return 400 - The provided \"email\" belongs to an already existing external cosupervisor", async () => {
        const mockReq = {
            body: {
                name: "cos",
                surname: "ext",
                email: "cos.ext1@mail.com"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getExternal_cosupervisors_emails.mockResolvedValue(["cos.ext1@mail.com", "cos.ext2@mail.com", "cos.ext3@mail.com"]);
        dao.rollback.mockResolvedValue(true);

        await createExternalCosupervisor(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).toHaveBeenCalledTimes(1);
        expect(dao.create_external_cosupervisor).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: `External cosupervisor email: ${mockReq.body.email} is already present in db` });
    });

    test("Should return 500 - Internal server error", async () => {
        const mockReq = {
            body: {
                name: "cos",
                surname: "ext",
                email: "cos.ext1@mail.com"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockRejectedValue("Database error");
        dao.rollback.mockResolvedValue(true);

        await createExternalCosupervisor(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getExternal_cosupervisors_emails).not.toHaveBeenCalled();
        expect(dao.create_external_cosupervisor).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(503);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Database error"});
    });

});

// SPRINT 2

describe("updateThesesArchivation", () => {

    test("Should begin a transaction, update \"isArchived\" for every thesis when the virtual clock date is after their expiration date and commit the transaction", async () => {
        const mockReq = {
            body: {
                datetime: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        dao.beginTransaction.mockResolvedValue(true);
        dao.updateThesesArchivation.mockResolvedValue("ok");
        dao.commit.mockResolvedValue(true);

        await updateThesesArchivation(mockReq, mockRes);

        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.updateThesesArchivation).toHaveBeenCalledTimes(1);
        expect(dao.commit).toHaveBeenCalledTimes(1);
        expect(dao.rollback).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith("ok");
    });

    test("Should return 500 - Internal server error", async () => {
        const mockReq = {
            body: {
                datetime: dayjs()
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        dao.beginTransaction.mockRejectedValue("Database error");
        dao.rollback.mockResolvedValue(true);

        await updateThesesArchivation(mockReq, mockRes);

        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.updateThesesArchivation).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith("Database error");
    });

});

describe("updateApplicationStatus", () => {

    test("Should accept a student application, cancels all other applications for that student and rejects every other student application for that same thesis", async () => {
        const mockReq = {
            body: {
                student_id: "S222222",
                thesis_id: 1,
                status: "Accepted"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };
        const mockApplications = [
            {
                student_id: "S111111",
                thesis_id: 1,
                application_date: dayjs(),
                status: "status"
            },
            {
                student_id: "S222222",
                thesis_id: 1,
                application_date: dayjs(),
                status: "status"
            },
            {
                student_id: "S222222",
                thesis_id: 2,
                application_date: dayjs(),
                status: "status"
            }
        ];
        const dir = `studentFiles/${mockReq.body.student_id}/${mockApplications[2].thesis_id}`;

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getApplications.mockResolvedValue(mockApplications);
        dao.updateApplicationStatus.mockResolvedValue(mockReq.body);
        fs.rmSync = jest.fn().mockReturnValue(true);
        dao.rejectApplicationsExcept.mockResolvedValue(mockReq.body);
        dao.cancelStudentApplications.mockResolvedValue(mockReq.body);
        dao.commit.mockResolvedValue(true);
        
        await updateApplicationStatus(mockReq, mockRes);
        
        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getApplications).toHaveBeenCalledTimes(1);
        expect(dao.updateApplicationStatus).toHaveBeenCalledTimes(1);
        expect(fs.rmSync).toHaveBeenCalledTimes(1);
        expect(fs.rmSync).toHaveBeenCalledWith(
            dir,
            {
                recursive: true, 
                force: true
            }
        );
        expect(dao.rejectApplicationsExcept).toHaveBeenCalledTimes(1);
        expect(dao.cancelStudentApplications).toHaveBeenCalledTimes(1);
        expect(dao.commit).toHaveBeenCalledTimes(1);
        expect(dao.rollback).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockReq.body);
    });

    test("Should just update an application'status if no student has been accepted", async () => {
        const mockReq = {
            body: {
                student_id: "S222222",
                thesis_id: 1,
                status: "Not accepted"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };
        const mockApplications = [
            {
                student_id: "S111111",
                thesis_id: 1,
                application_date: dayjs(),
                status: "status"
            },
            {
                student_id: "S222222",
                thesis_id: 1,
                application_date: dayjs(),
                status: "status"
            },
            {
                student_id: "S222222",
                thesis_id: 2,
                application_date: dayjs(),
                status: "status"
            }
        ];

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getApplications.mockResolvedValue(mockApplications);
        dao.updateApplicationStatus.mockResolvedValue(mockReq.body);
        dao.commit.mockResolvedValue(true);

        await updateApplicationStatus(mockReq, mockRes);
        
        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getApplications).toHaveBeenCalledTimes(1);
        expect(dao.updateApplicationStatus).toHaveBeenCalledTimes(1);
        expect(fs.rmSync).not.toHaveBeenCalled();
        expect(dao.rejectApplicationsExcept).not.toHaveBeenCalled();
        expect(dao.cancelStudentApplications).not.toHaveBeenCalled();
        expect(dao.commit).toHaveBeenCalledTimes(1);
        expect(dao.rollback).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockReq.body);
    });

    test("Should return 422 - express-validator has found some errors", async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => false)
        };

        validationResult.mockReturnValue(mockedValidationResult);

        await updateApplicationStatus(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).not.toHaveBeenCalled();
        expect(dao.getApplications).not.toHaveBeenCalled();
        expect(dao.updateApplicationStatus).not.toHaveBeenCalled();
        expect(fs.rmSync).not.toHaveBeenCalled();
        expect(dao.rejectApplicationsExcept).not.toHaveBeenCalled();
        expect(dao.cancelStudentApplications).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json.mock.calls[0][0]).toHaveProperty("errors");
    });

    test("Should return 400 - No application found", async () => {
        const mockReq = {
            body: {
                student_id: "S333333",
                thesis_id: 1,
                status: "Accepted"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };
        const mockApplications = [
            {
                student_id: "S111111",
                thesis_id: 1,
                application_date: dayjs(),
                status: "status"
            },
            {
                student_id: "S222222",
                thesis_id: 1,
                application_date: dayjs(),
                status: "status"
            },
            {
                student_id: "S222222",
                thesis_id: 2,
                application_date: dayjs(),
                status: "status"
            }
        ];

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockResolvedValue(true);
        dao.getApplications.mockResolvedValue(mockApplications);

        await updateApplicationStatus(mockReq, mockRes);
        
        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getApplications).toHaveBeenCalledTimes(1);
        expect(dao.updateApplicationStatus).not.toHaveBeenCalled();
        expect(fs.rmSync).not.toHaveBeenCalled();
        expect(dao.rejectApplicationsExcept).not.toHaveBeenCalled();
        expect(dao.cancelStudentApplications).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
            ` error: Application of student: ${mockReq.body.student_id} for thesis with id: ${mockReq.body.thesis_id} not found `
        );
    });

    test("Should return 500 - Internal server error", async () => {
        const mockReq = {
            body: {
                student_id: "S222222",
                thesis_id: 1,
                status: "Not accepted"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockedValidationResult = {
            isEmpty: jest.fn(() => true),
        };

        validationResult.mockReturnValue(mockedValidationResult);
        dao.beginTransaction.mockRejectedValue("Database error");
        dao.rollback.mockResolvedValue(true);

        await updateApplicationStatus(mockReq, mockRes);

        expect(validationResult).toHaveBeenCalledTimes(1);
        expect(dao.beginTransaction).toHaveBeenCalledTimes(1);
        expect(dao.getApplications).not.toHaveBeenCalled();
        expect(dao.updateApplicationStatus).not.toHaveBeenCalled();
        expect(fs.rmSync).not.toHaveBeenCalled();
        expect(dao.rejectApplicationsExcept).not.toHaveBeenCalled();
        expect(dao.cancelStudentApplications).not.toHaveBeenCalled();
        expect(dao.commit).not.toHaveBeenCalled();
        expect(dao.rollback).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(503);
        expect(mockRes.json).toHaveBeenCalledWith("Database error");
    });
    /*
async function updateApplicationStatus(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors });
  }

  try {
    await dao.beginTransaction();
    let decision = {
      student_id: req.body.student_id,
      thesis_id: req.body.thesis_id,
      status: req.body.status,
    };
    const applications = await dao.getApplications();
    for (const application of applications) {
      if (
        application.student_id == req.body.student_id &&
        application.thesis_id == req.body.thesis_id
      ) {
        const updated_application = await dao.updateApplicationStatus(decision);
        if (decision.status === "Accepted") {
          for (const a of applications) {
            if (
              a.student_id == req.body.student_id &&
              a.thesis_id !== req.body.thesis_id
            ) {
              let dir = `studentFiles/${a.student_id}/${a.thesis_id}`;
              console.log(dir);
              fs.rmSync(dir, { recursive: true, force: true });
            }
          }
          //reject every other student applications for that thesis
          const result_reject = await dao.rejectApplicationsExcept(decision);
          //cancels every other application of that student
          const result_cancel = await dao.cancelStudentApplications(decision);
        }
        await dao.commit();
        return res.json(updated_application);
      }
    }
            return res
      .status(400)
      .json(
        ` error: Application of student: ${req.body.student_id} for thesis with id: ${req.body.thesis_id} not found `
      );
  } catch (err) {
    await dao.rollback();
    return res.status(503).json(` error: ${err} `);
  }
} */

});

describe("getApplicationStudent", () => {

    test("Should return all applications submitted by a student", async () => {
        const mockReq = {
            params: {
                student_id: "S123456"
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
        const mockOutput = [
            {
                status: "status",
                cosupervisors: ["name1 surname1", "name2 surname2"],
                department_name: "department_name",
                description: 1,
                expiration: "2022-01-01 00:00:00",
                group_name: [{ department: "department_name", group: "group_name" }, { department: "department_name2", group: "group_name2" }],
                id: 1,
                is_archived: true,
                keywords: ["keywords"],
                name: "name",
                notes: "notes",
                required_knowledge: "required_knowledge",
                surname: "surname",
                thesis_level: "thesis_level",
                thesis_type: "thesis_type",
                title: "title",
                title_degree: "title_degree"
            },
            {
                status: "status",
                cosupervisors: ["name1 surname1", "name2 surname2"],
                department_name: "department_name",
                description: 1,
                expiration: "2022-01-01 00:00:00",
                group_name: [{ department: "department_name", group: "group_name" }, { department: "department_name2", group: "group_name2" }],
                id: 2,
                is_archived: true,
                keywords: ["keywords"],
                name: "name",
                notes: "notes",
                required_knowledge: "required_knowledge",
                surname: "surname",
                thesis_level: "thesis_level",
                thesis_type: "thesis_type",
                title: "title",
                title_degree: "title_degree"
            }
        ]

        dao.getUserID.mockResolvedValue("S123456");
        dao.getStudentApplication.mockResolvedValue(
            [
                {
                    thesis_id: 1,
                    status: "status"
                },
                {
                    thesis_id: 2,
                    status: "status"
                },
            ]
        );
        dao.getProposalById
            .mockResolvedValueOnce(
                {
                    cosupervisors: ["name1 surname1", "name2 surname2"],
                    department_name: "department_name",
                    description: 1,
                    expiration: "2022-01-01 00:00:00",
                    group_name: [{ department: "department_name", group: "group_name" }, { department: "department_name2", group: "group_name2" }],
                    id: 1,
                    is_archived: true,
                    keywords: ["keywords"],
                    name: "name",
                    notes: "notes",
                    required_knowledge: "required_knowledge",
                    surname: "surname",
                    thesis_level: "thesis_level",
                    thesis_type: "thesis_type",
                    title: "title",
                    title_degree: "title_degree"
                }
            )
            .mockResolvedValueOnce(
                {
                    cosupervisors: ["name1 surname1", "name2 surname2"],
                    department_name: "department_name",
                    description: 1,
                    expiration: "2022-01-01 00:00:00",
                    group_name: [{ department: "department_name", group: "group_name" }, { department: "department_name2", group: "group_name2" }],
                    id: 2,
                    is_archived: true,
                    keywords: ["keywords"],
                    name: "name",
                    notes: "notes",
                    required_knowledge: "required_knowledge",
                    surname: "surname",
                    thesis_level: "thesis_level",
                    thesis_type: "thesis_type",
                    title: "title",
                    title_degree: "title_degree"
                }
            );
        
        await getApplicationStudent(mockReq, mockRes);

        expect(dao.getUserID).toHaveBeenCalledTimes(1);
        expect(dao.getStudentApplication).toHaveBeenCalledTimes(1);
        expect(dao.getProposalById).toHaveBeenCalledTimes(2);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockOutput);
    });

    test("Should return 500 - Internal server error", async () => {
        const mockReq = {
            params: {
                student_id: "S123456"
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

        dao.getUserID.mockRejectedValue("Database error");

        await getApplicationStudent(mockReq, mockRes);

        expect(dao.getUserID).toHaveBeenCalledTimes(1);
        expect(dao.getStudentApplication).not.toHaveBeenCalled();
        expect(dao.getProposalById).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith("Database error");
    });

});

describe("getApplications", () => {

    test("Should return all applications offered by a professor that are still pending", async () => {
        const mockReq = {
            user: {
                username: "username"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        dao.getApplicationsForProfessor.mockResolvedValue("result");

        await getApplications(mockReq, mockRes);

        expect(dao.getApplicationsForProfessor).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith("result");
    });

    test("Should return 500 - Internal server error", async () => {
        const mockReq = {
            user: {
                username: "username"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        dao.getApplicationsForProfessor.mockRejectedValue("Database error");

        await getApplications(mockReq, mockRes);

        expect(dao.getApplicationsForProfessor).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith("Database error");
    });

});
