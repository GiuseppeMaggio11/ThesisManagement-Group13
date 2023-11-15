const dao = require("../dao");
const mysql = require("mysql2");
const dayjs = require("dayjs");



beforeEach(() => {
    jest.clearAllMocks();
});

describe.skip("isThesisValid", () => {
    
    test("Should return true if the thesis is not expired or archived", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: dayjs().format("YYYY-MM-DD hh:mm:ss")
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute").mockResolvedValue(["thesis exists"]);

        const result = await dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate);
        
        expect(mockExecute).toHaveBeenCalledWith(
            "SELECT * FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE",
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
            formattedDate: dayjs().format("YYYY-MM-DD hh:mm:ss")
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute").mockResolvedValue([]);

        const result = await dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate);

        expect(mockExecute).toHaveBeenCalledWith(
            "SELECT * FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE",
            [
                mockInput.thesisID, 
                mockInput.formattedDate
            ]
        );
        expect(result).toBe(false);
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

    test.skip("Should throw an error if \"date\" parameter is missing", async () => {
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
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute").mockRejectedValue('Database error');

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
            callback(new Error('Database error'));
        });

        await expect(dao.isAlreadyExisting(mockInput.studentID, mockInput.thesisID)).rejects.toStrictEqual("Database error");

        expect(mockQuery).toHaveBeenCalledWith(
            "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?",
            [
                mockInput.studentID, 
                mockInput.thesisID
            ],
            expect.any(Function)
        );
    });

});

/*//returns false is the student is not already applied for a thesis,  otherwise true
exports.isAlreadyExisting = async (studentID, thesisID) => {
    if (!thesisID || !studentID) {
      throw { error: "parameter is missing" };
    }
    const sql =
      "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?";
  
    return new Promise((resolve, reject) => {
      connection.query(sql, [studentID, thesisID], function (err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].count === 1);
        }
      });
    });
  };*/





/*describe('getTeachers', () => {
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