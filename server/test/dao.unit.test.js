const dao = require("../dao");
const mysql = require("mysql2/promise");
const dayjs = require("dayjs");



jest.mock('mysql2/promise', () => {
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

        expect(mockPool.execute).toHaveBeenCalled();
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

        expect(mockPool.execute).toHaveBeenCalled();
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

