const dao = require("../dao");
const mysql = require("mysql2/promise");
const dayjs = require("dayjs");



jest.mock("mysql2/promise", () => {
    const mockConnection = {
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
    };
    const mockPool = {
        execute: jest.fn(),
        getConnection: jest.fn(() => mockConnection),
    };
    return {
        createPool: jest.fn(() => mockPool)
    };
});

const mockPool = mysql.createPool();



beforeEach(() => {
    jest.clearAllMocks();
});



describe("isThesisValid", () => {

    test("Should return true if the thesis is not expired or archived", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        const mockExecuteOutput = [
            [{ count: 1 }]
        ];
        mockPool.execute.mockResolvedValue(mockExecuteOutput);

        const result = await dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>?",
            [
                mockInput.thesisID,
                mockInput.formattedDate
            ]
        );
        expect(result).toBe(true);
    });

    test("Should return false if the thesis is expired or archived", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        const mockExecuteOutput = [
            [{ count: 0 }]
        ]
        mockPool.execute.mockResolvedValue(mockExecuteOutput);

        const result = await dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>?",
            [
                mockInput.thesisID,
                mockInput.formattedDate
            ]
        );
        expect(result).toBe(false);
    });

    test("Should throw an error if there is more than one thesis", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        const mockExecuteOutput = [
            [{ count: 2 }]
        ]
        mockPool.execute.mockResolvedValue(mockExecuteOutput);

        await expect(dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate)).rejects.toStrictEqual(new Error("Database error"));

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>?",
            [
                mockInput.thesisID,
                mockInput.formattedDate
            ]
        );
    });

    test("Should handle errors during query execution", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>?",
            [
                mockInput.thesisID,
                mockInput.formattedDate
            ]
        );
    });

});

describe("isAlreadyExisting", () => {

    test("Should return true if a student is already applied for a thesis", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
        };
        const mockExecuteOutput = [
            [{ count: 1 }]
        ]
        mockPool.execute.mockResolvedValue(mockExecuteOutput);

        const result = await dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?",
            [
                mockInput.studentID,
                mockInput.thesisID
            ]
        );
        expect(result).toBe(true);
    });

    test("Should return false if a student is not already applied for a thesis", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
        };
        const mockExecuteOutput = [
            [{ count: 0 }]
        ]
        mockPool.execute.mockResolvedValue(mockExecuteOutput);

        const result = await dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?",
            [
                mockInput.studentID,
                mockInput.thesisID
            ]
        );
        expect(result).toBe(false);
    });

    test("Should throw an error if there is more than one couple student_id-thesis_id", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
        };
        const mockExecuteOutput = [
            [{ count: 2 }]
        ]
        mockPool.execute.mockResolvedValue(mockExecuteOutput);

        await expect(dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID)).rejects.toStrictEqual(new Error("Database error"));

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?",
            [
                mockInput.studentID,
                mockInput.thesisID
            ]
        );
    });

    test("Should handle errors during query execution", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1
        };
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?",
            [
                mockInput.studentID,
                mockInput.thesisID
            ]
        );
    });

});

describe("newApply", () => {

    test("Should insert a new application into the database", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
            date: dayjs()
        };
        const mockOutput = [1, 2, 3];
        mockPool.execute.mockResolvedValue(mockOutput);

        const result = await dao.newApply(mockInput.studentID, mockInput.thesisID, mockInput.date);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO application (student_id, thesis_id, status, application_date) VALUES (?, ?, ?, ?)",
            [
                mockInput.studentID,
                mockInput.thesisID,
                "pending",
                mockInput.date.format("YYYY-MM-DD HH:mm:ss")
            ]
        );
        expect(result).toStrictEqual("Application successful.");
    });

    test("Should handle duplicate entry error", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
            date: dayjs()
        };
        const mockExecuteOutput = {
            code: "ER_DUP_ENTRY"
        };
        mockPool.execute.mockRejectedValue(mockExecuteOutput);

        await expect(dao.newApply(mockInput.studentID, mockInput.thesisID, mockInput.date)).rejects.toStrictEqual("You have already applied to this thesis.");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO application (student_id, thesis_id, status, application_date) VALUES (?, ?, ?, ?)",
            [
                mockInput.studentID,
                mockInput.thesisID,
                "pending",
                mockInput.date.format("YYYY-MM-DD HH:mm:ss")
            ]
        )
    });

    test("Should handle other errors", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
            date: dayjs()
        };
        const mockExecuteOutput = {
            code: "NOT_ER_DUP_ENTRY"
        };
        mockPool.execute.mockRejectedValue(mockExecuteOutput);

        await expect(dao.newApply(mockInput.studentID, mockInput.thesisID, mockInput.date)).rejects.toStrictEqual(mockExecuteOutput);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO application (student_id, thesis_id, status, application_date) VALUES (?, ?, ?, ?)",
            [
                mockInput.studentID,
                mockInput.thesisID,
                "pending",
                mockInput.date.format("YYYY-MM-DD HH:mm:ss")
            ]
        )
    });

});

describe("createThesis", () => {

    test("Should return the new thesis", async () => {
        const mockInput = {
            title: "title",
            description: "description",
            supervisor_id: "t_id",
            thesis_level: "level",
            type_name: "type",
            required_knowledge: "knowledge",
            notes: "notes",
            expiration: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: "cod",
            is_archived: false,
            keywords: "keywordss"
        };
        let rows = [{ insertId: 1 }];
        mockPool.execute.mockResolvedValue(rows);

        const result = await dao.createThesis(mockInput);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, is_archived, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
            [mockInput.title, mockInput.description, mockInput.supervisor_id,
            mockInput.thesis_level, mockInput.type_name, mockInput.required_knowledge, mockInput.notes,
            mockInput.expiration, mockInput.cod_degree, mockInput.is_archived, mockInput.keywords]
        );
        expect(result).toStrictEqual({ id: rows[0].insertId, ...mockInput });
    });

    test("Should handle database error and reject", async () => {
        const mockInput = {
            title: "title",
            description: "description",
            supervisor_id: "t_id",
            thesis_level: "level",
            type_name: "type",
            required_knowledge: "knowledge",
            notes: "notes",
            expiration: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: "cod",
            is_archived: false,
            keywords: "keywordss"
        };
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.createThesis(mockInput)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, is_archived, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
            [mockInput.title, mockInput.description, mockInput.supervisor_id,
            mockInput.thesis_level, mockInput.type_name, mockInput.required_knowledge, mockInput.notes,
            mockInput.expiration, mockInput.cod_degree, mockInput.is_archived, mockInput.keywords]
        );
    });
});

describe("getTeacher", () => {

    test("Should return the arrays of teachers id", async () => {
        const mockRows = [[{ id: 1 }, { id: 2 }, { id: 3 }]];
        const mockOutput = [1, 2, 3];
        mockPool.execute.mockResolvedValue(mockRows);

        const result = await dao.getTeachers();

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT id FROM teacher",
        );
        expect(result).toStrictEqual(mockOutput);
    });

    test("Should handle database error and reject", async () => {
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.getTeachers()).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT id FROM teacher",
        );
    });
})

describe("getDegrees", () => {

    test("Should return the arrays of degrees id", async () => {
        const mockRows = [[{ cod_degree: "DEGR01" }, { cod_degree: "DEGR02" }, { cod_degree: "DEGR03" }]];
        const mockOutput = ["DEGR01", "DEGR02", "DEGR03"];
        mockPool.execute.mockResolvedValue(mockRows);

        const result = await dao.getDegrees();

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT cod_degree FROM degree_table",
        );
        expect(result).toStrictEqual(mockOutput);
    });

    test("Should handle database error and reject", async () => {
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.getDegrees()).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT cod_degree FROM degree_table",
        );
    });
})

describe("getCodes_group", () => {

    test("Should return the arrays of groups code", async () => {
        const mockRows = [[{ cod_group: "GRP01" }, { cod_group: "GRP02" }]];
        const mockOutput = ["GRP01", "GRP02"];
        mockPool.execute.mockResolvedValue(mockRows);

        const result = await dao.getCodes_group();

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT cod_group FROM group_table",
        );
        expect(result).toStrictEqual(mockOutput);
    });

    test("Should handle database error and reject", async () => {
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.getCodes_group()).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT cod_group FROM group_table",
        );
    });

})

describe("createThesis_group", () => {

    test("Should return the arrays of thesis_group", async () => {
        const mockInput = {
            thesis_id: 1,
            group_id: "GRP01"
        };

        mockPool.execute.mockResolvedValue(true);

        const result = await dao.createThesis_group(mockInput.thesis_id, mockInput.group_id);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis_group (thesis_id, group_id) VALUES (?,?)",
            [mockInput.thesis_id, mockInput.group_id]
        );
        expect(result).toStrictEqual(mockInput);
    });

    test("Should handle database error and reject", async () => {
        const mockInput = {
            thesis_id: 1,
            group_id: "GRP01"
        };

        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.createThesis_group(mockInput.thesis_id, mockInput.group_id)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis_group (thesis_id, group_id) VALUES (?,?)",
            [mockInput.thesis_id, mockInput.group_id]
        );
    });

});

describe("createThesis_cosupervisor_teacher", () => {

    test("Should return the object of a thesis_cosupervisor (teacher), the cosupervisor is a teacher", async () => {
        const mockInput = {
            thesis_id: 1,
            professor_id: "P123456"
        };
        const mockOutput = {
            thesis_id: 1,
            thesis_cosupervisor: "P123456"
        };
        mockPool.execute.mockResolvedValue(true);

        const result = await dao.createThesis_cosupervisor_teacher(mockInput.thesis_id, mockInput.professor_id);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis_cosupervisor_teacher (thesis_id, cosupevisor_id) VALUES (?,?)",
            [mockInput.thesis_id, mockInput.professor_id]
        );
        expect(result).toStrictEqual(mockOutput);
    });


    test("Should handle database error and reject", async () => {
        const mockInput = {
            thesis_id: 1,
            professor_id: "P123456"
        };
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.createThesis_cosupervisor_teacher(mockInput.thesis_id, mockInput.professor_id)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis_cosupervisor_teacher (thesis_id, cosupevisor_id) VALUES (?,?)",
            [mockInput.thesis_id, mockInput.professor_id]
        );
    });

});

describe("createThesis_cosupervisor_external", () => {

    test("Should return the object of a thesis_cosupervisor (external), the cosupervisor is not a teacher", async () => {
        const mockInput = {
            thesis_id: 1,
            email: "test@test.com"
        };
        const mockOutput = {
            thesis_id: 1,
            thesis_cosupervisor: "test@test.com"
        };
        mockPool.execute.mockResolvedValue(true);

        const result = await dao.createThesis_cosupervisor_external(mockInput.thesis_id, mockInput.email);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis_cosupervisor_external (thesis_id, cosupevisor_id) VALUES (?,?)",
            [mockInput.thesis_id, mockInput.email]
        );
        expect(result).toStrictEqual(mockOutput);
    });


    test("Should handle database error and reject", async () => {
        const mockInput = {
            thesis_id: 1,
            email: "test@test.com"
        };
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.createThesis_cosupervisor_external(mockInput.thesis_id, mockInput.email)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis_cosupervisor_external (thesis_id, cosupevisor_id) VALUES (?,?)",
            [mockInput.thesis_id, mockInput.email]
        );
    });

});

describe("getExternal_cosupervisors", () => {

    test("Should return the arrays of cosupervisors", async () => {
        const mockRows = [{ email: "test@test.com", surname: "surname", name: "name" }, { email: "aaabbb@test.com", surname: "aaa", name: "bbb" }];
        mockPool.execute.mockResolvedValue([mockRows])

        const result = await dao.getExternal_cosupervisors();

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT * FROM external_supervisor"
        );
        expect(result).toStrictEqual(mockRows);
    });

    test("Should reject if the database returns an error", async () => {
        mockPool.execute.mockRejectedValue("Database error")

        await expect(dao.getExternal_cosupervisors()).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT * FROM external_supervisor"
        );
    });
})

describe("getExternal_cosupervisors_emails", () => {

    test("Should return the arrays of external cosupervisors emails", async () => {
        const mockRows = [{ email: "test@test.com", surname: "surname", name: "name" }, { email: "aaabbb@test.com", surname: "aaa", name: "bbb" }];
        mockPool.execute.mockResolvedValue([mockRows])

        const result = await dao.getExternal_cosupervisors_emails();

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT email FROM external_supervisor"
        );
        expect(result).toStrictEqual([mockRows[0].email, mockRows[1].email]);
    });

    test("Should reject if the database returns an error", async () => {
        mockPool.execute.mockRejectedValue("Database error")

        await expect(dao.getExternal_cosupervisors_emails()).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "SELECT email FROM external_supervisor"
        );
    });
})

describe("create_external_cosupervisor", () => {

    test("Should return the new external cosupervsior", async () => {
        const mockInput = {
            email: "test@test.com",
            surname: "surname",
            name: "name"
        };
        mockPool.execute.mockResolvedValue(true);

        const result = await dao.create_external_cosupervisor(mockInput);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO external_supervisor (email, surname, name) VALUES (?,?,?)",
            [mockInput.email, mockInput.surname, mockInput.name]
        );
        expect(result).toEqual(mockInput);
    });

    test("Should handle database error and reject", async () => {
        const mockInput = {
            email: "test@test.com",
            surname: "surname",
            name: "name"
        };
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.create_external_cosupervisor(mockInput)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO external_supervisor (email, surname, name) VALUES (?,?,?)",
            [mockInput.email, mockInput.surname, mockInput.name]
        );
    });

});

describe("getProposals", () => {

    test("Should get all thesis proposals viewable by a certain student - STUD; applicationResult.length != 0", async () => {
        const mockInput = {
            user_type: "STUD",
            username: "username",
            date: dayjs()
        };
        const mockOutput = [
            {
                cosupervisors: ["name surname", "name surname"],
                department_name: "department_name",
                description: 1,
                expiration: "2022-01-01 00:00:00",
                group_name: [{ "department": "department_name", "group": "group_name" }],
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
        ]

        mockPool.execute
            .mockResolvedValueOnce([[{ title_degree: "title_degree" }]])
            .mockResolvedValueOnce([[{ thesis_id: 2 }, { thesis_id: 3 }]])
            .mockResolvedValueOnce([[{
                id: 1,
                title: "title",
                description: 1,
                name: "name",
                surname: "surname",
                thesis_level: "thesis_level",
                thesis_type: "thesis_type",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: dayjs("2022-01-01").format("YYYY-MM-DD HH:mm:ss"),
                keywords: "keywords",
                title_degree: "title_degree",
                group_name: "group_name",
                department_name: "department_name",
                is_archived: true
            }]])
            .mockResolvedValueOnce([[{
                id: 1,
                cosupevisor_id: 1,
                name: "name",
                surname: "surname"
            }]])
            .mockResolvedValueOnce([[{
                id: 1,
                name: "name",
                surname: "surname",
                group_name: "group_name",
                department_name: "department_name"
            }]]);

        const result = await dao.getProposals(mockInput.user_type, mockInput.username, mockInput.date);

        expect(mockPool.execute).toHaveBeenCalledTimes(5);
        expect(result).toStrictEqual(mockOutput);

    });

    test("Should get all thesis proposals viewable by a certain student - NOT STUD", async () => {
        const mockInput = {
            user_type: "PROF",
            username: "username",
            date: dayjs()
        };
        const mockOutput = [
            {
                cosupervisors: ["name surname", "name surname"],
                department_name: "department_name",
                description: 1,
                expiration: "2022-01-01 00:00:00",
                group_name: [{ "department": "department_name", "group": "group_name" }],
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
        ]

        mockPool.execute
            .mockResolvedValueOnce([[{
                id: 1,
                title: "title",
                description: 1,
                name: "name",
                surname: "surname",
                thesis_level: "thesis_level",
                thesis_type: "thesis_type",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: dayjs("2022-01-01").format("YYYY-MM-DD HH:mm:ss"),
                keywords: "keywords",
                title_degree: "title_degree",
                group_name: "group_name",
                department_name: "department_name",
                is_archived: true
            }]])
            .mockResolvedValueOnce([[{
                id: 1,
                cosupevisor_id: 1,
                name: "name",
                surname: "surname"
            }]])
            .mockResolvedValueOnce([[{
                id: 1,
                name: "name",
                surname: "surname",
                group_name: "group_name",
                department_name: "department_name"
            }]]);

        const result = await dao.getProposals(mockInput.user_type, mockInput.username, mockInput.date);

        expect(mockPool.execute).toHaveBeenCalledTimes(3);
        expect(result).toStrictEqual(mockOutput);

    });

    test("Should return error \"no entry\"", async () => {
        const mockInput = {
            user_type: "STUD",
            username: "username",
            date: dayjs()
        };

        mockPool.execute
            .mockResolvedValueOnce([[{ title_degree: "title_degree" }]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[]]);

        const result = await dao.getProposals(mockInput.user_type, mockInput.username, mockInput.date)

        expect(mockPool.execute).toHaveBeenCalledTimes(3);
        expect(result).toStrictEqual({ error: "no entry" });

    });

    test("Should handle database errors", async () => {
        const mockInput = {
            user_type: "STUD",
            username: "username",
            date: dayjs()
        };
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.getProposals(mockInput.user_type, mockInput.username, mockInput.date)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
    });

});

describe("getProposalById", () => {

    test("Should get all informations about a thesis proposal if it is viewable by a certain student", async () => {
        const mockInput = {
            requested_thesis_id: 1,
            user_type: "STUD",
            username: "username"
        };
        const mockOutput =
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


        mockPool.execute
            .mockResolvedValueOnce([[{ cod_degree: "DEGR01" }]])
            .mockResolvedValueOnce([[{ cod_degree: "DEGR01" }]])
            .mockResolvedValueOnce([[{
                id: 1,
                title: "title",
                description: 1,
                name: "name",
                surname: "surname",
                thesis_level: "thesis_level",
                thesis_type: "thesis_type",
                required_knowledge: "required_knowledge",
                notes: "notes",
                expiration: dayjs("2022-01-01").format("YYYY-MM-DD HH:mm:ss"),
                keywords: "keywords",
                title_degree: "title_degree",
                group_name: "group_name",
                department_name: "department_name",
                is_archived: true
            }]])
            .mockResolvedValueOnce([[{
                id: 1,
                cosupevisor_id: 1,
                name: "name1",
                surname: "surname1"
            }]])
            .mockResolvedValueOnce([[{
                id: 1,
                name: "name2",
                surname: "surname2",
                group_name: "group_name2",
                department_name: "department_name2"
            }]]);

        const result = await dao.getProposalById(mockInput.requested_thesis_id, mockInput.user_type, mockInput.username);

        expect(mockPool.execute).toHaveBeenCalledTimes(5);
        expect(result).toStrictEqual(mockOutput);
    });

    test("Should return error \"you are not allowed to see proposals from other degrees\" - First if", async () => {
        const mockInput = {
            requested_thesis_id: 1,
            user_type: "STUD",
            username: "username"
        };

        mockPool.execute
            .mockResolvedValueOnce([[{ cod_degree: "DEGR01" }]])
            .mockResolvedValueOnce([[{ cod_degree: "DEGR02" }]]);

        const result = await dao.getProposalById(mockInput.requested_thesis_id, mockInput.user_type, mockInput.username);

        expect(mockPool.execute).toHaveBeenCalledTimes(2);
        expect(result).toStrictEqual({ error: "you are not allowed to see proposals from other degrees" });
    });

    test("Should return error \"you are not allowed to see proposals from other degrees\" - Second if", async () => {
        const mockInput = {
            requested_thesis_id: 1,
            user_type: "STUD",
            username: "username"
        };

        mockPool.execute
            .mockResolvedValueOnce([[{ cod_degree: "DEGR01" }]])
            .mockResolvedValueOnce([[{ cod_degree: "DEGR01" }]])
            .mockResolvedValueOnce([[]]);

        const result = await dao.getProposalById(mockInput.requested_thesis_id, mockInput.user_type, mockInput.username);

        expect(mockPool.execute).toHaveBeenCalledTimes(3);
        expect(result).toStrictEqual({ error: "you are not allowed to see proposals from other degrees" });
    });

    test("Should handle database errors", async () => {
        const mockInput = {
            requested_thesis_id: 1,
            user_type: "STUD",
            username: "username"
        };
        mockPool.execute.mockRejectedValue("Database error");

        await expect(dao.getProposalById(mockInput.requested_thesis_id, mockInput.user_type, mockInput.username)).rejects.toStrictEqual("Database error");

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
    });

});

describe("beginTransaction", () => {

    test("Should begin a transaction", async () => {
        let mockConnection = mockPool.getConnection();
        mockConnection.beginTransaction.mockResolvedValue(true);

        await dao.beginTransaction();

        expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    test("Should handle database errors", async () => {
        let mockConnection = mockPool.getConnection();
        mockConnection.beginTransaction.mockRejectedValue("Database error");

        await expect(dao.beginTransaction()).rejects.toStrictEqual("Database error");

        expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

});

describe("commit", () => {

    test("Should commit a transaction", async () => {
        let mockConnection = mockPool.getConnection();
        mockConnection.commit.mockResolvedValue(true);

        await dao.commit();

        expect(mockConnection.commit).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    test("Should handle database errors", async () => {
        let mockConnection = mockPool.getConnection();
        mockConnection.commit.mockRejectedValue("Database error");

        await expect(dao.commit()).rejects.toStrictEqual("Database error");

        expect(mockConnection.commit).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

});

describe("rollback", () => {

    test("Should rollback a transaction", async () => {
        let mockConnection = mockPool.getConnection();
        mockConnection.rollback.mockResolvedValue(true);

        await dao.rollback();

        expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    test("Should handle database errors", async () => {
        let mockConnection = mockPool.getConnection();
        mockConnection.rollback.mockRejectedValue("Database error");

        await expect(dao.rollback()).rejects.toStrictEqual("Database error");

        expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

})