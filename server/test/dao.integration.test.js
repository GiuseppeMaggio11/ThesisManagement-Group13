const dao = require("../dao");
const mysql = require("mysql2");
const dayjs = require("dayjs");



let connection;

beforeAll(() => {
    const dbConfig = {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "test_thesismanagement",
    };

    connection = mysql.createConnection(dbConfig);
});

afterAll(async () => {
    connection.end((error) => {
        if (error) {
            console.log("Error closing MySQL connection: ", error);
            return;
        }

        console.log("MySQL connection closed.");
    });
});

describe("isThesisValid", () => {
    
    beforeEach(async () => {
        connection.execute("DELETE FROM group_table");
        connection.execute("DELETE FROM department");
        connection.execute("DELETE FROM teacher");
        connection.execute("DELETE FROM degree_table");
        connection.execute("DELETE FROM thesis");
    });

    test("Should return true if the thesis is not expired or archived", async () => {
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
                group. cod_group,
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
            cod_group:  "GRP001",
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
            expiration: dayjs("2023-01-01"),
            cod_degree: degree.cod_degree,
            keywords: "keywords",
            is_archived: false
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
        
        const input = {
            thesisID: 1,
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
        connection.execute(
            `
                INSERT INTO group_table (cod_group, group_name)
                vALUES (?, ?)
            `,
            [
                group. cod_group,
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
            cod_group:  "GRP001",
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
            expiration: dayjs("2023-01-01"),
            cod_degree: degree.cod_degree,
            keywords: "keywords",
            is_archived: false
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
        
        connection.execute("SELECT * FROM thesis WHERE id=1", [], function(err, results, fields) {
            console.log(results);
        });
        const input = {
            thesisID: 1,
            date: dayjs("2024-01-01")
        };
        
        const result = await dao.isThesisValid(input.thesisID, input.date);
        //console.log("RESULT = " + result);
        expect(result).toBe(false);
    });

    test.only("Should return false if the thesis is archived", async () => {
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
                group. cod_group,
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
            cod_group:  "GRP001",
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
            expiration: dayjs("2023-01-01"),
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
        
        /*connection.execute("SELECT * FROM thesis WHERE id=1", [], function(err, results, fields) {
            console.log(results);
        });*/
        const input = {
            thesisID: 1,
            date: dayjs("2022-01-01")
        };
        
        const result = await dao.isThesisValid(input.thesisID, input.date);
        //console.log("RESULT = " + result);
        expect(result).toBe(false);
    });
})