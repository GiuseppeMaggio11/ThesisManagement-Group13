const dayjs = require("dayjs");
const dao = require("../dao");
const mysql = require("mysql2");

beforeAll(() => {
    jest.clearAllMocks();
});

describe("createThesis", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("Should return the new thesis", async () => {
        const mockInput = {
            title: 'title',
            description: 'description',
            supervisor_id: 't_id',
            thesis_level: 'level',
            type_name: 'type',
            required_knowledge: 'knowledge',
            notes: 'notes',
            expiration: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            cod_degree: 'cod',
            is_archived: false,
            keywords: 'keywordss'
        };

        let rows = {insertId:1}

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                expect(sql).toBe('INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, is_archived, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?); ');
                expect(values).toEqual([mockInput.title, mockInput.description, mockInput.supervisor_id, mockInput.thesis_level, mockInput.type_name,
                    mockInput.required_knowledge, mockInput.notes, mockInput.expiration, mockInput.cod_degree, mockInput.is_archived, mockInput.keywords]);
                callback(null, rows);
            });

        const result = await dao.createThesis(mockInput);

        expect(mockExecute).toHaveBeenCalledTimes(1);
        expect(result).toEqual({id: rows.insertId, ...mockInput});
    });

    test.skip("Should handle database error and reject", async () => {
        const mockInput = {
            title: 'title',
            description: 'description',
            supervisor_id: 't_id',
            thesis_level: 'level',
            type_name: 'type',
            required_knowledge: 'knowledge',
            notes: 'notes',
            expiration: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            cod_degree: 'cod',
            is_archived: false,
            keywords: 'keywordss'
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                callback(new Error('Database error'));
            });

        await expect(dao.createThesis(mockInput)).rejects.toThrow('Database error');

        expect(mockExecute).toHaveBeenCalledTimes(1); // Ensure the query method is called once
    });

    test.skip("Should reject if the parameter is missing ", async () => {
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");

        await expect(dao.create_external_cosupervisor()).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled(); // Ensure the query method is called once
    });
});


describe("getTeacher", () => {

    test("Should return the arrays of teachers id", async () => {
        const mockRows = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockRows);
        });

        const result = await dao.getTeachers();

        expect(result).toEqual([1, 2, 3]);
    });
})

describe("getDegrees", () => {

    test("Should return the arrays of degrees id", async () => {
        const mockRows = [{ id: 'DEGR01' }, { id: 'DEGR02' }, { id: 'DEGR03' }];
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockRows);
        });

        const result = await dao.getTeachers();

        expect(result).toEqual(['DEGR01', 'DEGR02', 'DEGR03']);
    });
})

describe("getCodes_group", () => {

    test("Should return the arrays of groups code", async () => {
        const mockRows = [{ cod_group: 'GRP01' }, { cod_group: 'GRP02' }];
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockRows);
        });

        const result = await dao.getCodes_group();

        expect(result).toEqual(['GRP01', 'GRP02']);
    });
})

describe("createThesis_group", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("Should return the arrays of thesis_group", async () => {
        const mockInput = {
            thesisID: 1,
            groupID: 'GRP01'
        };


        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                expect(sql).toBe('INSERT INTO thesis_group (thesis_id, group_id) VALUES (?,?)');
                expect(values).toEqual([mockInput.thesisID, mockInput.groupID]);
                callback(null, 'created');
            });

        const result = await dao.createThesis_group(mockInput.thesisID, mockInput.groupID);

        expect(mockExecute).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ thesis_id: 1, group_id: 'GRP01' });
    });

    test("Should handle database error and reject", async () => {
        const mockInput = {
            thesisID: 1,
            groupID: 'GRP01'
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                callback(new Error('Database error'));
            });

        await expect(dao.createThesis_group(mockInput.thesisID, mockInput.groupID)).rejects.toThrow('Database error');


        expect(mockExecute).toHaveBeenCalledTimes(1); // Ensure the query method is called once
    });

    test.skip("Should reject if group_id parameter is missing ", async () => {
        const mockInput = {
            thesisID: 1,
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
            });

        await expect(dao.createThesis_group(mockInput.thesisID)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled(); // Ensure the query method is called once
    });

    test.skip("Should reject if thesis_id parameter is missing ", async () => {
        const mockInput = {
            groupID: 'GRP01'
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
            });

        await expect(dao.createThesis_group(mockInput.thesisID)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled(); // Ensure the query method is called once
    });



});

describe("createThesis_cosupervisor_teacher", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("Should return the object of a thesis_cosupervisor (teacher), the cosupervisor is a teacher", async () => {
        const mockInput = {
            thesisID: 1,
            thesis_cosupervisor: 'P123456'
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                expect(sql).toBe('INSERT INTO thesis_cosupervisor_teacher (thesis_id, cosupevisor_id) VALUES (?,?)');
                expect(values).toEqual([mockInput.thesisID, mockInput.thesis_cosupervisor]);
                callback(null, 'created');
            });

        const result = await dao.createThesis_cosupervisor_teacher(mockInput.thesisID, mockInput.thesis_cosupervisor);

        expect(mockExecute).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ thesis_id: mockInput.thesisID, thesis_cosupervisor: mockInput.thesis_cosupervisor });
    });


    test("Should handle database error and reject", async () => {
        const mockInput = {
            thesisID: 1,
            thesis_cosupervisor: 'P123456'
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                callback(new Error('Database error'));
            });

        await expect(dao.createThesis_cosupervisor_teacher(mockInput.thesisID, mockInput.thesis_cosupervisor)).rejects.toThrow('Database error');


        expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    test.skip("Should reject if thesis_cosupervisor parameter is missing ", async () => {
        const mockInput = {
            thesisID: 1,
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");

        await expect(dao.createThesis_cosupervisor_teacher(mockInput.thesisID)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled(); // Ensure the query method is called once
    });

    test.skip("Should reject if thesis_id parameter is missing ", async () => {
        const mockInput = {
            thesis_cosupervisor: 'P123456'
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");

        await expect(dao.createThesis_cosupervisor_teacher(mockInput.thesis_cosupervisor)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled(); // Ensure the query method is called once
    });

});

describe("createThesis_cosupervisor_external", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("Should return the object of a thesis_cosupervisor (external), the cosupervisor is not a teacher", async () => {
        const mockInput = {
            thesisID: 1,
            thesis_cosupervisor: 'test@test.com'
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                expect(sql).toBe('INSERT INTO thesis_cosupervisor_external (thesis_id, cosupevisor_id) VALUES (?,?)');
                expect(values).toEqual([mockInput.thesisID, mockInput.thesis_cosupervisor]);
                callback(null, 'created');
            });

        const result = await dao.createThesis_cosupervisor_external(mockInput.thesisID, mockInput.thesis_cosupervisor);

        expect(mockExecute).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ thesis_id: mockInput.thesisID, thesis_cosupervisor: mockInput.thesis_cosupervisor });
    });


    test("Should handle database error and reject", async () => {
        const mockInput = {
            thesisID: 1,
            thesis_cosupervisor: 'P123456'
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                callback(new Error('Database error'));
            });

        await expect(dao.createThesis_cosupervisor_external(mockInput.thesisID, mockInput.thesis_cosupervisor)).rejects.toThrow('Database error');


        expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    test.skip("Should reject if thesis_cosupervisor parameter is missing ", async () => {
        const mockInput = {
            thesisID: 1,
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
            });

        await expect(dao.createThesis_cosupervisor_external(mockInput.thesisID)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled(); // Ensure the query method is called once
    });

    test.skip("Should reject if thesis_id parameter is missing ", async () => {
        const mockInput = {
            thesis_cosupervisor: 'P123456'
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
            });

        await expect(dao.createThesis_cosupervisor_external(mockInput.thesis_cosupervisor)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled(); // Ensure the query method is called once
    });

});

describe("getExternal_cosupervisors", () => {

    test("Should return the arrays of cosupervisors", async () => {
        const mockRows = [{ email: 'test@test.com', surname: 'surname', name: 'name' }, { email: 'aaabbb@test.com', surname: 'aaa', name: 'bbb' }];
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockRows);
        });

        const result = await dao.getExternal_cosupervisors();

        expect(result).toEqual(mockRows);
    });
    test("Should reject if the database returns an error", async () => {
        const mockRows = [{ email: 'test@test.com', surname: 'surname', name: 'name' }, { email: 'aaabbb@test.com', surname: 'aaa', name: 'bbb' }];
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(new Error('Database error'));
        });

        await expect(dao.getExternal_cosupervisors()).rejects.toThrow('Database error')
    });
})

describe("getExternal_cosupervisors_emails", () => {

    test("Should return the arrays of external cosupervisors emails", async () => {
        const mockRows = [{ email: 'test@test.com', surname: 'surname', name: 'name' }, { email: 'aaabbb@test.com', surname: 'aaa', name: 'bbb' }];
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockRows);
        });

        const result = await dao.getExternal_cosupervisors_emails();

        expect(result).toEqual([mockRows[0].email, mockRows[1].email]);
    });
    test("Should reject if the database returns an error", async () => {
        const mockRows = [{ email: 'test@test.com', surname: 'surname', name: 'name' }, { email: 'aaabbb@test.com', surname: 'aaa', name: 'bbb' }];
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(new Error('Database error'));
        });

        await expect(dao.getExternal_cosupervisors_emails()).rejects.toThrow('Database error')
    });
})

describe("create_external_cosupervisor", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("Should return the new external cosupervsior", async () => {
        const mockInput = {
            email: 'test@test.com',
            surname: 'surname',
            name: 'name'
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                expect(sql).toBe('INSERT INTO external_supervisor (email, surname, name) VALUES (?,?,?)');
                expect(values).toEqual([mockInput.email, mockInput.surname, mockInput.name]);
                callback(null, 'created');
            });

        const result = await dao.create_external_cosupervisor(mockInput);

        expect(mockExecute).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockInput);
    });

    test("Should handle database error and reject", async () => {
        const mockInput = {
            email: 'test@test.com',
            surname: 'surname',
            name: 'name'
        };

        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query")
            .mockImplementation((sql, values, callback) => {
                callback(new Error('Database error'));
            });

        await expect(dao.create_external_cosupervisor(mockInput)).rejects.toThrow('Database error');


        expect(mockExecute).toHaveBeenCalledTimes(1); // Ensure the query method is called once
    });

    test.skip("Should reject if parameter is missing ", async () => {
        const mockInput = {
            email: 'test@test.com',
            surname: 'surname',
            name: 'name'
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");

        await expect(dao.create_external_cosupervisor()).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled(); // Ensure the query method is called once
    });
});
