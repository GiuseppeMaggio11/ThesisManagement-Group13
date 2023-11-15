const dao = require("../dao");
const mysql = require("mysql2/promise");
const dayjs = require("dayjs");



let connection;

beforeAll(async () => {
    const dbConfig = {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "test_thesismanagement",
    };

    connection = await mysql.createConnection(dbConfig);
});

afterAll(async () => {
    await connection.end();
});

describe("isThesisValid", () => {

    beforeEach(async () => {
        await connection.execute("DELETE FROM application");
        await connection.execute("DELETE FROM student");
        await connection.execute("DELETE FROM thesis");
        await connection.execute("DELETE FROM degree_table");
        await connection.execute("DELETE FROM teacher");
        await connection.execute("DELETE FROM department");
        await connection.execute("DELETE FROM group_table");
    });

    test("Should return true if the thesis is not expired or archived", async () => {
        const group = {
            cod_group: "GRP001",
            group_name: "Group 1"
        };
        await connection.execute(
            `
                INSERT INTO group_table (cod_group, group_name)
                vALUES (?, ?)
            `,
            [
                group.cod_group,
                group.group_name
            ]
        );

        const department = {
            cod_department: "DPR001",
            department_name: "department_name",
            cod_group: "GRP001"
        };
        await connection.execute(
            `
                INSERT INTO department (cod_department, department_name, cod_group) 
                VALUES (?, ?, ?)
            `,
            [
                department.cod_department,
                department.department_name,
                department.cod_group
            ]
        );

        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        await connection.execute(
            `
                INSERT INTO teacher (id, surname, name, email, cod_group, cod_department) 
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                teacher.id,
                teacher.surname,
                teacher.name,
                teacher.email,
                teacher.cod_group,
                teacher.cod_department
            ]
        );

        const degree = {
            cod_degree: "DGR001",
            title_degree: "title_degree"
        };
        await connection.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree) 
                VALUES (?, ?)
            `,
            [
                degree.cod_degree,
                degree.title_degree
            ]
        );

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: degree.cod_degree,
            keywords: "keywords",
            is_archived: false
        };
        await connection.execute(
            `
                INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, keywords, is_archived)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                thesisProposal.title,
                thesisProposal.description,
                thesisProposal.supervisor_id,
                thesisProposal.thesis_level,
                thesisProposal.thesis_type,
                thesisProposal.required_knowledge,
                thesisProposal.notes,
                thesisProposal.expiration,
                thesisProposal.cod_degree,
                thesisProposal.keywords,
                thesisProposal.is_archived,
            ]
        );

        let [rows] = await connection.execute("SELECT id FROM thesis LIMIT 1");
        let id = rows[0].id;
        const input = {
            thesisID: id,
            date: dayjs("2022-01-01")
        };

        const result = await dao.isThesisValid(input.thesisID, input.date);

        expect(result).toBe(true);
    });

    test("Should return false if the thesis is expired", async () => {
        const group = {
            cod_group: "GRP001",
            group_name: "Group 1"
        };
        await connection.execute(
            `
                INSERT INTO group_table (cod_group, group_name)
                vALUES (?, ?)
            `,
            [
                group.cod_group,
                group.group_name
            ]
        );

        const department = {
            cod_department: "DPR001",
            department_name: "department_name",
            cod_group: "GRP001"
        };
        await connection.execute(
            `
                INSERT INTO department (cod_department, department_name, cod_group) 
                VALUES (?, ?, ?)
            `,
            [
                department.cod_department,
                department.department_name,
                department.cod_group
            ]
        );

        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        await connection.execute(
            `
                INSERT INTO teacher (id, surname, name, email, cod_group, cod_department) 
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                teacher.id,
                teacher.surname,
                teacher.name,
                teacher.email,
                teacher.cod_group,
                teacher.cod_department
            ]
        );

        const degree = {
            cod_degree: "DGR001",
            title_degree: "title_degree"
        };
        await connection.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree) 
                VALUES (?, ?)
            `,
            [
                degree.cod_degree,
                degree.title_degree
            ]
        );

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: degree.cod_degree,
            keywords: "keywords",
            is_archived: false
        };
        await connection.execute(
            `
                INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, keywords, is_archived)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                thesisProposal.title,
                thesisProposal.description,
                thesisProposal.supervisor_id,
                thesisProposal.thesis_level,
                thesisProposal.thesis_type,
                thesisProposal.required_knowledge,
                thesisProposal.notes,
                thesisProposal.expiration,
                thesisProposal.cod_degree,
                thesisProposal.keywords,
                thesisProposal.is_archived,
            ]
        );
        await connection.execute(
            `
                INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, keywords, is_archived)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                thesisProposal.title,
                thesisProposal.description,
                thesisProposal.supervisor_id,
                thesisProposal.thesis_level,
                thesisProposal.thesis_type,
                thesisProposal.required_knowledge,
                thesisProposal.notes,
                thesisProposal.expiration,
                thesisProposal.cod_degree,
                thesisProposal.keywords,
                thesisProposal.is_archived,
            ]
        );

        let [rows] = await connection.execute("SELECT id FROM thesis LIMIT 1");
        let id = rows[0].id;

        const input = {
            thesisID: id,
            date: dayjs("2024-01-01")
        };

        const result = await dao.isThesisValid(input.thesisID, input.date);
        
        expect(result).toBe(false);
    });

    test("Should return false if the thesis is archived", async () => {
        const group = {
            cod_group: "GRP001",
            group_name: "Group 1"
        };
        connection.execute(
            `
                INSERT INTO group_table (cod_group, group_name)
                vALUES (?, ?)
            `,
            [
                group.cod_group,
                group.group_name
            ]
        );

        const department = {
            cod_department: "DPR001",
            department_name: "department_name",
            cod_group: "GRP001"
        };
        connection.execute(
            `
                INSERT INTO department (cod_department, department_name, cod_group) 
                VALUES (?, ?, ?)
            `,
            [
                department.cod_department,
                department.department_name,
                department.cod_group
            ]
        );

        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        connection.execute(
            `
                INSERT INTO teacher (id, surname, name, email, cod_group, cod_department) 
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                teacher.id,
                teacher.surname,
                teacher.name,
                teacher.email,
                teacher.cod_group,
                teacher.cod_department
            ]
        );

        const degree = {
            cod_degree: "DGR001",
            title_degree: "title_degree"
        };
        connection.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree) 
                VALUES (?, ?)
            `,
            [
                degree.cod_degree,
                degree.title_degree
            ]
        );

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: degree.cod_degree,
            keywords: "keywords",
            is_archived: true
        };
        connection.execute(
            `
                INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, keywords, is_archived)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                thesisProposal.title,
                thesisProposal.description,
                thesisProposal.supervisor_id,
                thesisProposal.thesis_level,
                thesisProposal.thesis_type,
                thesisProposal.required_knowledge,
                thesisProposal.notes,
                thesisProposal.expiration,
                thesisProposal.cod_degree,
                thesisProposal.keywords,
                thesisProposal.is_archived,
            ]
        );

        let [rows] = await connection.execute("SELECT id FROM thesis LIMIT 1");
        let id = rows[0].id;

        const input = {
            thesisID: id,
            date: dayjs("2022-01-01")
        };

        const result = await dao.isThesisValid(input.thesisID, input.date);
        
        expect(result).toBe(false);
    });

    test("Should throw an error if \"thesisID\" parameter is missing", async () => {
        const input = {
            thesisID: undefined,
            date: dayjs("2022-01-01")
        };

        await expect(dao.isThesisValid(input.thesisID, input.date)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );
    });

    test("Should throw an error if \"date\" parameter is missing", async () => {
        const input = {
            thesisID: 1,
            date: undefined
        };

        await expect(dao.isThesisValid(input.thesisID, input.date)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );
    });

});

describe("isAlreadyExisting", () => {

    beforeEach(async () => {
        await connection.execute("DELETE FROM application");
        await connection.execute("DELETE FROM student");
        await connection.execute("DELETE FROM thesis");
        await connection.execute("DELETE FROM degree_table");
        await connection.execute("DELETE FROM teacher");
        await connection.execute("DELETE FROM department");
        await connection.execute("DELETE FROM group_table");
    });

    test("Should return true if the thesis is not expired or archived", async () => {
        const group = {
            cod_group: "GRP001",
            group_name: "Group 1"
        };
        await connection.execute(
            `
                INSERT INTO group_table (cod_group, group_name)
                vALUES (?, ?)
            `,
            [
                group.cod_group,
                group.group_name
            ]
        );

        const department = {
            cod_department: "DPR001",
            department_name: "department_name",
            cod_group: "GRP001"
        };
        await connection.execute(
            `
                INSERT INTO department (cod_department, department_name, cod_group) 
                VALUES (?, ?, ?)
            `,
            [
                department.cod_department,
                department.department_name,
                department.cod_group
            ]
        );

        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        await connection.execute(
            `
                INSERT INTO teacher (id, surname, name, email, cod_group, cod_department) 
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                teacher.id,
                teacher.surname,
                teacher.name,
                teacher.email,
                teacher.cod_group,
                teacher.cod_department
            ]
        );

        const degree = {
            cod_degree: "DGR001",
            title_degree: "title_degree"
        };
        await connection.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree) 
                VALUES (?, ?)
            `,
            [
                degree.cod_degree,
                degree.title_degree
            ]
        );

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: degree.cod_degree,
            keywords: "keywords",
            is_archived: false
        };
        await connection.execute(
            `
                INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, keywords, is_archived)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                thesisProposal.title,
                thesisProposal.description,
                thesisProposal.supervisor_id,
                thesisProposal.thesis_level,
                thesisProposal.thesis_type,
                thesisProposal.required_knowledge,
                thesisProposal.notes,
                thesisProposal.expiration,
                thesisProposal.cod_degree,
                thesisProposal.keywords,
                thesisProposal.is_archived,
            ]
        );

        const student = {
            id: "S123456",
            surname:"surname",
            name: "name",
            gender: "gender",
            nationality: "nationality",
            email: "email",
            cod_degree: degree.cod_degree,
            enrollment_year: 2019
        };
        await connection.execute(
            `
                INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                student.id,
                student.surname,
                student.name,
                student.gender,
                student.nationality,
                student.email,
                student.cod_degree,
                student.enrollment_year
            ]
        );

        let [rowsThesis] = await connection.execute("SELECT id FROM thesis LIMIT 1");
        let thesis_id = rowsThesis[0].id;

        const application = {
            student_id: student.id,
            thesis_id: thesis_id,
            status: "pending",
            application_date: dayjs("2022-06-01").format("YYYY-MM-DD HH:mm:ss")
        };
        
        await connection.execute(
            `
                INSERT INTO application(student_id, thesis_id, status, application_date)
                VALUES (?, ?, ?, ?)
            `,
            [
                application.student_id,
                application.thesis_id,
                application.status,
                application.application_date
            ]
        );
        
        const input = {
            studentID: student.id,
            thesisID: thesis_id
        };

        const result = await dao.isAlreadyExisting(input.studentID, input.thesisID);

        expect(result).toBe(true);
    });

    test("Should return false if a student is not already applied for a thesis", async () => {
        const input = {
            studentID: "S123456",
            thesisID: 1
        };

        const result = await dao.isAlreadyExisting(input.studentID, input.thesisID);

        expect(result).toBe(false);
    });

    test("Should throw an error if \"studentID\" parameter is missing", async () => {
        const input = {
            studentID: undefined,
            thesisID: 1
        };

        await expect(dao.isThesisValid(input.thesisID, input.date)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );
    });

    test("Should throw an error if \"thesisID\" parameter is missing", async () => {
        const input = {
            studentID: "S123456",
            thesisID: undefined
        };

        await expect(dao.isThesisValid(input.thesisID, input.date)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );
    });
    
});

describe("newApply", () => {
    
    beforeEach(async () => {
        await connection.execute("DELETE FROM application");
        await connection.execute("DELETE FROM student");
        await connection.execute("DELETE FROM thesis");
        await connection.execute("DELETE FROM degree_table");
        await connection.execute("DELETE FROM teacher");
        await connection.execute("DELETE FROM department");
        await connection.execute("DELETE FROM group_table");
    });

    test("Should insert a new application into the database", async () => {
        const group = {
            cod_group: "GRP001",
            group_name: "Group 1"
        };
        await connection.execute(
            `
                INSERT INTO group_table (cod_group, group_name)
                vALUES (?, ?)
            `,
            [
                group.cod_group,
                group.group_name
            ]
        );

        const department = {
            cod_department: "DPR001",
            department_name: "department_name",
            cod_group: "GRP001"
        };
        await connection.execute(
            `
                INSERT INTO department (cod_department, department_name, cod_group) 
                VALUES (?, ?, ?)
            `,
            [
                department.cod_department,
                department.department_name,
                department.cod_group
            ]
        );

        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        await connection.execute(
            `
                INSERT INTO teacher (id, surname, name, email, cod_group, cod_department) 
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                teacher.id,
                teacher.surname,
                teacher.name,
                teacher.email,
                teacher.cod_group,
                teacher.cod_department
            ]
        );

        const degree = {
            cod_degree: "DGR001",
            title_degree: "title_degree"
        };
        await connection.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree) 
                VALUES (?, ?)
            `,
            [
                degree.cod_degree,
                degree.title_degree
            ]
        );

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: degree.cod_degree,
            keywords: "keywords",
            is_archived: false
        };
        await connection.execute(
            `
                INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, keywords, is_archived)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                thesisProposal.title,
                thesisProposal.description,
                thesisProposal.supervisor_id,
                thesisProposal.thesis_level,
                thesisProposal.thesis_type,
                thesisProposal.required_knowledge,
                thesisProposal.notes,
                thesisProposal.expiration,
                thesisProposal.cod_degree,
                thesisProposal.keywords,
                thesisProposal.is_archived,
            ]
        );

        const student = {
            id: "S123456",
            surname:"surname",
            name: "name",
            gender: "gender",
            nationality: "nationality",
            email: "email",
            cod_degree: degree.cod_degree,
            enrollment_year: 2019
        };
        await connection.execute(
            `
                INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                student.id,
                student.surname,
                student.name,
                student.gender,
                student.nationality,
                student.email,
                student.cod_degree,
                student.enrollment_year
            ]
        );

        let [rowsThesis] = await connection.execute("SELECT id FROM thesis LIMIT 1");
        let thesis_id = rowsThesis[0].id;

        const input = {
            studentID: student.id, 
            thesisID: thesis_id,
            date: dayjs("2022-06-01")
        };

        const expectedOutput =  {
            affectedRows: 1, 
            changedRows: 0, 
            fieldCount: 0, 
            info: "", 
            insertId: 0, 
            serverStatus: 2, 
            warningStatus: 0
        };

        const result = await dao.newApply(input.studentID, input.thesisID, input.date);

        expect(result).toEqual(expectedOutput);
    });

    test("Should handle duplicate entry error", async () => {
        const group = {
            cod_group: "GRP001",
            group_name: "Group 1"
        };
        await connection.execute(
            `
                INSERT INTO group_table (cod_group, group_name)
                vALUES (?, ?)
            `,
            [
                group.cod_group,
                group.group_name
            ]
        );

        const department = {
            cod_department: "DPR001",
            department_name: "department_name",
            cod_group: "GRP001"
        };
        await connection.execute(
            `
                INSERT INTO department (cod_department, department_name, cod_group) 
                VALUES (?, ?, ?)
            `,
            [
                department.cod_department,
                department.department_name,
                department.cod_group
            ]
        );

        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        await connection.execute(
            `
                INSERT INTO teacher (id, surname, name, email, cod_group, cod_department) 
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                teacher.id,
                teacher.surname,
                teacher.name,
                teacher.email,
                teacher.cod_group,
                teacher.cod_department
            ]
        );

        const degree = {
            cod_degree: "DGR001",
            title_degree: "title_degree"
        };
        await connection.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree) 
                VALUES (?, ?)
            `,
            [
                degree.cod_degree,
                degree.title_degree
            ]
        );

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: degree.cod_degree,
            keywords: "keywords",
            is_archived: false
        };
        await connection.execute(
            `
                INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, keywords, is_archived)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                thesisProposal.title,
                thesisProposal.description,
                thesisProposal.supervisor_id,
                thesisProposal.thesis_level,
                thesisProposal.thesis_type,
                thesisProposal.required_knowledge,
                thesisProposal.notes,
                thesisProposal.expiration,
                thesisProposal.cod_degree,
                thesisProposal.keywords,
                thesisProposal.is_archived,
            ]
        );

        const student = {
            id: "S123456",
            surname:"surname",
            name: "name",
            gender: "gender",
            nationality: "nationality",
            email: "email",
            cod_degree: degree.cod_degree,
            enrollment_year: 2019
        };
        await connection.execute(
            `
                INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                student.id,
                student.surname,
                student.name,
                student.gender,
                student.nationality,
                student.email,
                student.cod_degree,
                student.enrollment_year
            ]
        );

        let [rowsThesis] = await connection.execute("SELECT id FROM thesis LIMIT 1");
        let thesis_id = rowsThesis[0].id;

        const application = {
            student_id: student.id,
            thesis_id: thesis_id,
            status: "pending",
            application_date: dayjs("2022-06-01").format("YYYY-MM-DD HH:mm:ss")
        };
        
        await connection.execute(
            `
                INSERT INTO application(student_id, thesis_id, status, application_date)
                VALUES (?, ?, ?, ?)
            `,
            [
                application.student_id,
                application.thesis_id,
                application.status,
                application.application_date
            ]
        );

        const input = {
            studentID: student.id, 
            thesisID: thesis_id,
            date: dayjs("2022-06-01")
        };

        await expect(dao.newApply(input.studentID, input.thesisID, input.date)).rejects.toStrictEqual("You have already applied to this thesis.");
    });

    test("Should throw an error if \"studentID\" parameter is missing", async () => {
        const input = {
            studentID: undefined, 
            thesisID: 1,
            date: dayjs("2022-06-01")
        };

        await expect(dao.newApply(input.thesisID, input.date)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );
    });

    test("Should throw an error if \"thesisID\" parameter is missing", async () => {
        const input = {
            studentID: 1, 
            thesisID: undefined,
            date: dayjs("2022-06-01")
        };

        await expect(dao.newApply(input.thesisID, input.date)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );
    });

    test("Should throw an error if \"date\" parameter is missing", async () => {
        const input = {
            studentID: 1, 
            thesisID: 1,
            date: undefined
        };

        await expect(dao.newApply(input.thesisID, input.date)).rejects.toStrictEqual(
            {
                error: "parameter is missing"
            }
        );
    });

});