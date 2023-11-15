const dao = require("../dao");
const { createPool } = require("mysql2/promise");
const dayjs = require("dayjs");

let pool;

beforeAll(async () => {
    const dbConfig = {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "test_thesismanagement",
    };
    pool = await createPool(dbConfig);
});

afterAll(async () => {
    await pool.end();
});
describe("createThesis", () => {
    beforeEach(async () => {
        await pool.execute("DELETE FROM thesis_cosupervisor_teacher");
        await pool.execute("DELETE FROM thesis");
        await pool.execute("DELETE FROM degree_table");
        await pool.execute("DELETE FROM external_supervisor");
        await pool.execute("DELETE FROM teacher");
        await pool.execute("DELETE FROM department");
        await pool.execute("DELETE FROM group_table");
    });
    test("Should return a thisis object", async () => {
        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        const cod_degree = {
            cod_degree: "DEGR01",
            title_degree: "Degree 1"
        };
        const thesis = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            type_name: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: 'DEGR01',
            keywords: "keywords",
            is_archived: false
        };

        await pool.execute(
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

        await pool.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree)
                VALUES (?, ?)
            `,
            [
                cod_degree.cod_degree,
                cod_degree.title_degree
            ]
        );
        
        const result = await dao.createThesis(thesis);
        expect(result).toMatchObject({
            title: thesis.title,
            description: thesis.description,
            supervisor_id:teacher.id,
            thesis_level:thesis.thesis_level,
            type_name: thesis.type_name,
            required_knowledge: thesis.required_knowledge,
            notes: thesis.notes,
            expiration: thesis.expiration,
            cod_degree:thesis.cod_degree,
            keywords: thesis.keywords,
            is_archived: thesis.is_archived
        })
        expect(result.id).toBeDefined();
    });
    test.skip("Should return an error if some field miss in thesis object ", async () => {
        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        const cod_degree = {
            cod_degree: "DEGR01",
            title_degree: "Degree 1"
        };

        const thesisProposal = {
            title: "title",
            description: "description",
            
            thesis_level: "level",
           
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: 'DEGR01',
            keywords: "keywords",
            is_archived: false
        };

        await pool.execute(
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

        await pool.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree)
                VALUES (?, ?)
            `,
            [
                cod_degree.cod_degree,
                cod_degree.title_degree
            ]
        );

        await expect(dao.createThesis(thesis)).rejects.toThrow()
    });
    test.skip("Should return an error if the parameter is missing ", async () => {
        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };

        const cod_degree = {
            cod_degree: "DEGR01",
            title_degree: "Degree 1"
        };

        await pool.execute(
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

        await pool.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree)
                VALUES (?, ?)
            `,
            [
                cod_degree.cod_degree,
                cod_degree.title_degree
            ]
        );

        await expect(dao.createThesis()).rejects.toThrow()
    });
});
describe("getDegrees", () => {
    beforeEach(async () => {
        await pool.execute("DELETE FROM thesis_cosupervisor_teacher");
        await pool.execute("DELETE FROM thesis");
        await pool.execute("DELETE FROM degree_table");
        await pool.execute("DELETE FROM external_supervisor");
        await pool.execute("DELETE FROM teacher");
        await pool.execute("DELETE FROM department");
        await pool.execute("DELETE FROM group_table");
    });
    test("Should return an empty array when no degrees exist", async () => {
        const result = await dao.getDegrees(pool);
        expect(result).toEqual([]);
    });
    test("Should return an array of degrees codes", async () => {
        const degree = [
            {
                cod_degree: "DGR001",
                title_degree: "degree1"
            },
            {
                cod_degree: "DGR002",
                title_degree: "degree2"
            }
        ];

        await pool.execute(
            `INSERT INTO degree_table (cod_degree, title_degree) VALUES (?, ?)`,
            [
                degree[0].cod_degree,
                degree[0].title_degree
            ]
        );
        await pool.execute(
            `INSERT INTO degree_table (cod_degree, title_degree) VALUES (?, ?)`,
            [
                degree[1].cod_degree,
                degree[1].title_degree
            ]
        );

        const result = await dao.getDegrees(pool);
        expect(result).toEqual([degree[0].cod_degree, degree[1].cod_degree]);
    });
});
describe("getCodes_group", () => {
    beforeEach(async () => {
        await pool.execute('DELETE FROM group_table');
    });
    test("Should return an empty array when no group exists", async () => {
        const result = await dao.getCodes_group(pool);
        expect(result).toEqual([]);
    });
    test("Should return an array of groups codes", async () => {
        const group = [
            {
                cod_group: "DRP01",
                group_name: "g1"
            },
            {
                cod_group: "DRP02",
                group_name: "g2"
            }
        ];

        await pool.execute(
            `INSERT INTO group_table (cod_group, group_name) VALUES (?, ?)`,
            [
                group[0].cod_group,
                group[0].group_name
            ]
        );
        await pool.execute(
            `INSERT INTO group_table (cod_group, group_name) VALUES (?, ?)`,
            [
                group[1].cod_group,
                group[1].group_name
            ]
        );

        const result = await dao.getCodes_group(pool);
        expect(result).toEqual([group[0].cod_group, group[1].cod_group]);
    });
});
describe("createThesis_cosupervisor_teacher", () => {
    beforeEach(async () => {
        await pool.execute("DELETE FROM thesis_cosupervisor_teacher");
        await pool.execute("DELETE FROM thesis");
        await pool.execute("DELETE FROM degree_table");
        await pool.execute("DELETE FROM teacher");
        await pool.execute("DELETE FROM department");
        await pool.execute("DELETE FROM group_table");
    });
    test.skip("Should return an error because when an parameter is not passed", async () => {
        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        const cod_degree = {
            cod_degree: "DEGR01",
            title_degree: "Degree 1"
        };

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: 'DEGR01',
            keywords: "keywords",
            is_archived: false
        };

        await pool.execute(
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

        await pool.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree)
                VALUES (?, ?)
            `,
            [
                cod_degree.cod_degree,
                cod_degree.title_degree
            ]
        );


        await pool.execute(
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
        let [rows] = await pool.execute("SELECT id FROM thesis LIMIT 1");
        let id = rows[0].id;
        await expect(dao.createThesis_cosupervisor_teacher(id)).rejects.toThrow();
    });
    test("Should return an object thesis_cosupervisor_teacher", async () => {
        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        const cod_degree = {
            cod_degree: "DEGR01",
            title_degree: "Degree 1"
        };

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: 'DEGR01',
            keywords: "keywords",
            is_archived: false
        };

        await pool.execute(
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

        await pool.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree)
                VALUES (?, ?)
            `,
            [
                cod_degree.cod_degree,
                cod_degree.title_degree
            ]
        );


        await pool.execute(
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
        let [rows] = await pool.execute("SELECT id FROM thesis LIMIT 1");
        let id = rows[0].id;
        const result = await dao.createThesis_cosupervisor_teacher(id, teacher.id);
        expect(result).toEqual({ thesis_id: id, thesis_cosupervisor: teacher.id });
    });
});
describe("createThesis_cosupervisor_external", () => {
    beforeEach(async () => {
        await pool.execute("DELETE FROM thesis_cosupervisor_teacher");
        await pool.execute("DELETE FROM thesis");
        await pool.execute("DELETE FROM degree_table");
        await pool.execute("DELETE FROM external_supervisor");
        await pool.execute("DELETE FROM teacher");
        await pool.execute("DELETE FROM department");
        await pool.execute("DELETE FROM group_table");
    });
    test.skip("Should return an error because when thesis_id is not passed", async () => {
        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        const external = {
            email: "test@test.com",
            surname: "surname",
            name: "name",
        };
        const cod_degree = {
            cod_degree: "DEGR01",
            title_degree: "Degree 1"
        };

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: 'DEGR01',
            keywords: "keywords",
            is_archived: false
        };

        await pool.execute(
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

        await pool.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree)
                VALUES (?, ?)
            `,
            [
                cod_degree.cod_degree,
                cod_degree.title_degree
            ]
        );

        await pool.execute(
            `
                INSERT INTO external_supervisor (email, surname, name)
                VALUES (?, ?, ?)
            `,
            [
                external.email,
                external.surname,
                external.name
            ]
        );

        await pool.execute(
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
        let [rows] = await pool.execute("SELECT id FROM thesis LIMIT 1");
        let id = rows[0].id;
        await expect(dao.createThesis_cosupervisor_external(id)).rejects.toThrow();
    });
    test("Should return an object thesis_cosupervisor_external", async () => {
        const teacher = {
            id: "P123456",
            surname: "surname",
            name: "name",
            email: "email",
            cod_group: "GRP001",
            cod_department: "DPR001"
        };
        const external = {
            email: "test@test.com",
            surname: "surname",
            name: "name",
        };
        const cod_degree = {
            cod_degree: "DEGR01",
            title_degree: "Degree 1"
        };

        const thesisProposal = {
            title: "title",
            description: "description",
            supervisor_id: teacher.id,
            thesis_level: "level",
            thesis_type: "type",
            required_knowledge: "required_knowledge",
            notes: "notes",
            expiration: dayjs("2023-01-01").format("YYYY-MM-DD HH:mm:ss"),
            cod_degree: 'DEGR01',
            keywords: "keywords",
            is_archived: false
        };

        await pool.execute(
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

        await pool.execute(
            `
                INSERT INTO degree_table (cod_degree, title_degree)
                VALUES (?, ?)
            `,
            [
                cod_degree.cod_degree,
                cod_degree.title_degree
            ]
        );

        await pool.execute(
            `
                INSERT INTO external_supervisor (email, surname, name)
                VALUES (?, ?, ?)
            `,
            [
                external.email,
                external.surname,
                external.name
            ]
        );

        await pool.execute(
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
        let [rows] = await pool.execute("SELECT id FROM thesis LIMIT 1");
        let id = rows[0].id;
        const result = await dao.createThesis_cosupervisor_external(id, external.email);
        expect(result).toEqual({ thesis_id: id, thesis_cosupervisor: external.email });
    });
});
describe("getExternal_cosupervisors", () => {
    beforeEach(async () => {
        await pool.execute("DELETE FROM thesis_cosupervisor_external");
        await pool.execute("DELETE FROM thesis");
        await pool.execute("DELETE FROM degree_table");
        await pool.execute("DELETE FROM external_supervisor");
        await pool.execute("DELETE FROM teacher");
        await pool.execute("DELETE FROM department");
        await pool.execute("DELETE FROM group_table");
    });
    test("Should return an array of objects external_cosupervisors", async () => {
        const external = [
            {
                email: "test@test.com",
                surname: "surname",
                name: "name",
            },
            {
                email: "test2@test.com",
                surname: "surname2",
                name: "name2",
            }
        ];
        await pool.execute(
            `
            INSERT INTO external_supervisor (email, surname, name)
            VALUES (?, ?, ?)
        `,
            [
                external[0].email,
                external[0].surname,
                external[0].name
            ]
        )
        await pool.execute(
            `
            INSERT INTO external_supervisor (email, surname, name)
            VALUES (?, ?, ?)
        `,
            [
                external[1].email,
                external[1].surname,
                external[1].name
            ]
        )

        const result = await dao.getExternal_cosupervisors();
        expect(result).toEqual(external);
    });
})
describe("getExternal_cosupervisors_emails", () => {
    beforeEach(async () => {
        await pool.execute("DELETE FROM thesis_cosupervisor_external");
        await pool.execute("DELETE FROM thesis");
        await pool.execute("DELETE FROM degree_table");
        await pool.execute("DELETE FROM external_supervisor");
        await pool.execute("DELETE FROM teacher");
        await pool.execute("DELETE FROM department");
        await pool.execute("DELETE FROM group_table");
    });
    test("Should return an array of eemails of external_cosupervisors", async () => {
        const external = [
            {
                email: "test@test.com",
                surname: "surname",
                name: "name",
            },
            {
                email: "test2@test.com",
                surname: "surname2",
                name: "name2",
            }
        ];
        await pool.execute(
            `
            INSERT INTO external_supervisor (email, surname, name)
            VALUES (?, ?, ?)
        `,
            [
                external[0].email,
                external[0].surname,
                external[0].name
            ]
        )
        await pool.execute(
            `
            INSERT INTO external_supervisor (email, surname, name)
            VALUES (?, ?, ?)
        `,
            [
                external[1].email,
                external[1].surname,
                external[1].name
            ]
        )

        const result = await dao.getExternal_cosupervisors_emails();
        expect(result).toEqual([external[0].email, external[1].email]);
    });

})
describe("getExternal_cosupervisors", () => {
    beforeEach(async () => {
        await pool.execute("DELETE FROM thesis_cosupervisor_external");
        await pool.execute("DELETE FROM thesis");
        await pool.execute("DELETE FROM degree_table");
        await pool.execute("DELETE FROM external_supervisor");
        await pool.execute("DELETE FROM teacher");
        await pool.execute("DELETE FROM department");
        await pool.execute("DELETE FROM group_table");
    });
    test("Should return an object external_cosupervisors", async () => {
        const external =
        {
            email: "test@test.com",
            surname: "surname",
            name: "name",
        };
        const result = await dao.create_external_cosupervisor(external);
        expect(result).toEqual(external);
    });
    test.skip("Should return an error because parameter is missing", async () => {
        await expect(dao.create_external_cosupervisor()).rejects.toThrow();
    });

})
