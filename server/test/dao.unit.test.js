const dao = require("../dao");
const mysql = require("mysql2");
const dayjs = require("dayjs");



beforeEach(() => {
    jest.clearAllMocks();
});

describe("isThesisValid", () => {
    
    test("Should return true if the thesis is not expired or archived", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD hh:mm:ss")
        };
        const mockExecuteOutput = [
            {count: 1}
        ]
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockExecuteOutput);
        });

        const result = await dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate);

        expect(mockExecute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE",
            [
                mockInput.thesisID, 
                mockInput.formattedDate
            ],
            expect.any(Function)
        );
        expect(result).toBe(true);
    });

    test("Should return false if the thesis is expired or archived", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD hh:mm:ss")
        };
        const mockExecuteOutput = [
            {count: 0}
        ]
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockExecuteOutput)
        })

        const result = await dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate);

        expect(mockExecute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE",
            [
                mockInput.thesisID, 
                mockInput.formattedDate
            ],
            expect.any(Function)
        );
        expect(result).toBe(false);
    });

    test("Should throw an error if there is more than one thesis", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD hh:mm:ss")
        };
        const mockExecuteOutput = [
            {count: 2}
        ]
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockExecuteOutput)
        })

        await expect(dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate)).rejects.toStrictEqual("Database error");

        expect(mockExecute).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE",
            [
                mockInput.thesisID, 
                mockInput.formattedDate
            ],
            expect.any(Function)
        );
    });

    test("Should throw an error if \"thesisID\" parameter is missing", async () => {
        const mockInput = {
            thesisID: undefined,
            formattedDate: dayjs().format("YYYY-MM-DD hh:mm:ss")
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute");

        await expect(dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled();
    });

    test("Should throw an error if \"date\" parameter is missing", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: undefined
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute");

        await expect(dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockExecute).not.toHaveBeenCalled();
    });

    test("Should handle errors during query execution", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD hh:mm:ss")
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback("Database error")
        })

        await expect(dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate)).rejects.toStrictEqual("Database error");
        
        expect(mockExecute).toHaveBeenCalled();
    });

});

describe("isAlreadyExisting", () => {

    test("Should return true if a student is already applied for a thesis", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
        };
        const mockQueryOutput = [
            {count: 1}
        ]
        const mockQuery = jest.spyOn(mysql.Connection.prototype, "query");
        mockQuery.mockImplementation((sql, params, callback) => {
            callback(null, mockQueryOutput);
        });

        const result = await dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID);

        expect(mockQuery).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?",
            [
                mockInput.studentID, 
                mockInput.thesisID
            ],
            expect.any(Function)
        );
        expect(result).toBe(true);
    });

    test("Should return false if a student is not already applied for a thesis", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
        };
        const mockQueryOutput = [
            {count: 0}
        ]
        const mockQuery = jest.spyOn(mysql.Connection.prototype, "query");
        mockQuery.mockImplementation((sql, params, callback) => {
            callback(null, mockQueryOutput);
        });

        const result = await dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID);

        expect(mockQuery).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?",
            [
                mockInput.studentID, 
                mockInput.thesisID
            ],
            expect.any(Function)
        );
        expect(result).toBe(false);
    });

    test("Should throw an error if there is more than one couple student_id-thesis_id", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1,
        };
        const mockQuery = jest.spyOn(mysql.Connection.prototype, "query");
        mockQuery.mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
        });

        await expect(dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID)).rejects.toStrictEqual(new Error("Database error"));

        expect(mockQuery).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?",
            [
                mockInput.studentID, 
                mockInput.thesisID
            ],
            expect.any(Function)
        );
    });

    test("Should throw an error if \"studentID\" parameter is missing", async () => {
        const mockInput = {
            studentID: undefined,
            thesisID: 1
        };
        const mockQuery = jest.spyOn(mysql.Connection.prototype, "query");

        await expect(dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockQuery).not.toHaveBeenCalled();
    });

    test("Should throw an error if \"thesisID\" parameter is missing", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: undefined
        };
        const mockQuery = jest.spyOn(mysql.Connection.prototype, "query");

        await expect(dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );

        expect(mockQuery).not.toHaveBeenCalled();
    });

    test("Should handle errors during query execution", async () => {
        const mockInput = {
            studentID: 1,
            thesisID: 1
        };
        const mockQuery = jest.spyOn(mysql.Connection.prototype, "query");
        mockQuery.mockImplementation((sql, params, callback) => {
            callback("Database error")
        })

        await expect(dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID)).rejects.toStrictEqual("Database error");
        
        expect(mockQuery).toHaveBeenCalled();
    });

});





/*describe("getTeachers", () => {
    test("Should return the arrays of teachers", async () => {
        const mockRows = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "query");
        mockExecute.mockImplementation((sql, params, callback) => {
            callback(null, mockRows);
        });
        
        const result = await dao.getTeachers();
        
        expect(result).toEqual([1, 2, 3]);
    });

});*/