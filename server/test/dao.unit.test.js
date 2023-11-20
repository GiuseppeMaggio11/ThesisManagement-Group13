const dao = require("../dao");
const mysql = require("mysql2/promise");
const dayjs = require("dayjs");



jest.mock("mysql2/promise", () => {
    const mockPool = {
        execute: jest.fn(),
        query: jest.fn(),
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
            [{count: 1}]
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
        mockPool.execute.mockRejectedValue(new Error("Database error"));

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
        let rows = [{insertId:1}];
        mockPool.execute.mockResolvedValue(rows);

        const result = await dao.createThesis(mockInput);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(
            "INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, is_archived, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
            [mockInput.title, mockInput.description, mockInput.supervisor_id, 
                mockInput.thesis_level, mockInput.type_name, mockInput.required_knowledge, mockInput.notes, 
                mockInput.expiration, mockInput.cod_degree, mockInput.is_archived, mockInput.keywords]
        );
        expect(result).toStrictEqual({id: rows[0].insertId, ...mockInput});
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

    test("Should reject if group_id parameter is missing ", async () => {
        const mockInput = {
            thesis_id: 1,
        };

        await expect(dao.createThesis_group(mockInput.thesis_id)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockPool.execute).not.toHaveBeenCalled(); 
    });

    test("Should reject if thesis_id parameter is missing ", async () => {
        const mockInput = {
            group_id: "GRP01"
        };

        await expect(dao.createThesis_group(mockInput.group_id)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockPool.execute).not.toHaveBeenCalled();
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

    test("Should reject if thesis_cosupervisor parameter is missing ", async () => {
        const mockInput = {
            thesis_id: 1,
        };

        await expect(dao.createThesis_cosupervisor_teacher(mockInput.thesis_id)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockPool.execute).not.toHaveBeenCalled();
    });

    test("Should reject if thesis_id parameter is missing ", async () => {
        const mockInput = {
            professor_id: "P123456"
        };

        await expect(dao.createThesis_cosupervisor_teacher(mockInput.professor_id)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockPool.execute).not.toHaveBeenCalled();
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

    test("Should reject if thesis_cosupervisor parameter is missing ", async () => {
        const mockInput = {
            thesis_id: 1,
        };

        await expect(dao.createThesis_cosupervisor_external(mockInput.thesis_id)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockPool.execute).not.toHaveBeenCalled();
    });

    test("Should reject if thesis_id parameter is missing ", async () => {
        const mockInput = {
            email: "test@test.com"
        };

        await expect(dao.createThesis_cosupervisor_external(mockInput.email)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockPool.execute).not.toHaveBeenCalled();
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

    test("Should reject if parameter is missing ", async () => {
        await expect(dao.create_external_cosupervisor()).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockPool.execute).not.toHaveBeenCalled();
    });
});