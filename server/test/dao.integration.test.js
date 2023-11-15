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
    /*return new Promise((resolve, reject) => {
        connection.end((error) => {
            if (error) {
                console.log("Error closing MySQL connection: ", error);
                reject(error);
                return;
            }

            console.log("MySQL connection closed.");
            resolve();
        });
    });*/
});

describe("isThesisValid", () => {

    beforeEach(async () => {
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
        
        

        /*let id;
        connection.execute("SELECT id FROM thesis", [], function (err, rows, fields) {
            if (err) console.log("ERRORE");
            else {
                console.log(rows);
                console.log(rows[0])
                id = rows[0].id;
                console.log(id)
            }
        });
        console.log(id)*/

        let [rows] = await connection.execute("SELECT id FROM thesis LIMIT 1");
        console.log(rows)
        let id = rows[0].id;
        // Ora puoi accedere all'id dalla prima riga restituita
        //const thesisId222 = rows[0].id;

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
        console.log(rows)
        let id = rows[0].id;

        const input = {
            thesisID: id,
            date: dayjs("2024-01-01")
        };

        const result = await dao.isThesisValid(input.thesisID, input.date);
        //console.log("RESULT = " + result);
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