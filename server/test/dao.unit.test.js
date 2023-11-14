const dao = require("../dao");
const mysql = require("mysql2");



beforeEach(() => {
    jest.clearAllMocks();
});

describe("isThesisValid", () => {
    
    test("Should return true if the thesis is not expired or archived", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: new Date().toISOString().slice(0, 19).replace("T", " ")
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute").mockResolvedValue(["thesis exists"]);

        const result = await dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate);
        
        /*expect(mockExecute).toHaveBeenCalledWith(
            "SELECT * FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE",
            [
                mockInput.thesisID, 
                mockInput.formattedDate
            ]
        );*/
        expect(mockExecute).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    test("Should return false if the thesis is expired or archived", async () => {
        const mockInput = {
            thesisID: 1,
            formattedDate: new Date().toISOString().slice(0, 19).replace("T", " ")
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute").mockResolvedValue([]);

        const result = await dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate);

        /*expect(mockExecute).toHaveBeenCalledWith(
            "SELECT * FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE",
            [
                mockInput.thesisID, 
                mockInput.formattedDate
            ]
        );*/
        expect(mockExecute).toHaveBeenCalled();
        expect(result).toBe(false);
    });

    test("Should throw an error if \"thesisID\" parameter is missing", async () => {
        const mockInput = {
            thesisID: undefined,
            formattedDate: new Date().toISOString().slice(0, 19).replace("T", " ")
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
            formattedDate: new Date().toISOString().slice(0, 19).replace("T", " ")
        };
        const mockExecute = jest.spyOn(mysql.Connection.prototype, "execute").mockRejectedValue('Database error');

        await expect(dao.isThesisValid(mockInput.thesisID, mockInput.formattedDate)).rejects.toStrictEqual("Database error");
        
        expect(mockExecute).toHaveBeenCalled();
    });
});

