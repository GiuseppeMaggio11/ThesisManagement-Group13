const dao = require("../dao");
const mysql = require("mysql2");

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
    await connection.execute("DELETE FROM degree_table");
  });

  test("Should return an array of degrees codes", async () => {
    const degree = [
      {
        cod_degree: "DGR001",
        title_degree: "degree1",
      },
      {
        cod_degree: "DGR002",
        title_degree: "degree2",
      },
    ];
    await connection.execute(
      `
                INSERT INTO degree_table (cod_degree, title_degree) 
                VALUES (?, ?)
            `,
      [degree[0].cod_degree, degree[0].title_degree]
    );
    await connection.execute(
      `
                INSERT INTO degree_table (cod_degree, title_degree) 
                VALUES (?, ?)
            `,
      [degree[1].cod_degree, degree[1].title_degree]
    );

    const result = await dao.getDegrees();

    expect(result).toEqual([degree[0].cod_degree, degree[1].cod_degree]);
  });

  test("Should return an empty array when no degrees exist", async () => {
    const result = await dao.getDegrees();
    expect(result).toEqual([]);
  });
});
