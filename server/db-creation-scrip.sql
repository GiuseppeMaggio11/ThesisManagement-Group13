CREATE DATABASE IF NOT EXISTS db_se_thesismanagement;

USE db_se_thesismanagement;

CREATE TABLE user_type (
    id VARCHAR(4) PRIMARY KEY,
    user_type VARCHAR(30)
);
INSERT INTO user_type (id, user_type) VALUES
    ('PRF', 'Professor'),
    ('CSP', 'Co-supervisor'),
    ('STD', 'Student'),
    ('SEC', 'Secretary clerk'),
    ('FAC', 'Faculty director'),
    ('POC', 'President of commission');

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    salt VARCHAR(16),
    password VARCHAR(128),
    user_type_id VARCHAR(4),
    FOREIGN KEY (user_type_id) REFERENCES user_type(id)
);

INSERT INTO users (email, salt, password, user_type_id) VALUES
    ('david.brown@example.com', 'salt1', 'hexpassword1', 'PRF'),
    ('maria.martinez@example.com', 'salt2', 'hexpassword2', 'PRF'),
    ('john.smith@example.com', 'salt3', 'hexpassword3', 'STD'),
    ('mary.johnson@example.com', 'salt4', 'hexpassword4', 'STD'),
    ('juan.garcia@example.com', 'salt5', 'hexpassword5', 'STD');

CREATE TABLE STUDENT (
    ID INT PRIMARY KEY,
    SURNAME VARCHAR(50),
    NAME VARCHAR(50),
    GENDER VARCHAR(10),
    NATIONALITY VARCHAR(50),
    EMAIL VARCHAR(255),
    COD_DEGREE VARCHAR(10),
    ENROLLMENT_YEAR INT
);
INSERT INTO STUDENT (ID, SURNAME, NAME, GENDER, NATIONALITY, EMAIL, COD_DEGREE, ENROLLMENT_YEAR)
VALUES
    (1, 'Smith', 'John', 'Male', 'US', 'john.smith@example.com', 'CSE101', 2022),
    (2, 'Johnson', 'Mary', 'Female', 'UK', 'mary.johnson@example.com', 'ECON201', 2022),
    (3, 'Garcia', 'Juan', 'Male', 'Spain', 'juan.garcia@example.com', 'MATH301', 2021);


CREATE TABLE TEACHER (
    ID INT PRIMARY KEY,
    SURNAME VARCHAR(50),
    NAME VARCHAR(50),
    EMAIL VARCHAR(255),
    COD_GROUP VARCHAR(10),
    COD_DEPARTMENT VARCHAR(10)
);
INSERT INTO TEACHER (ID, SURNAME, NAME, EMAIL, COD_GROUP, COD_DEPARTMENT)
VALUES
    (1, 'Brown', 'David', 'david.brown@example.com', 'CS', 'COMPUTER'),
    (2, 'Martinez', 'Maria', 'maria.martinez@example.com', 'ECO', 'ECONOMICS');


CREATE TABLE DEGREE (
    COD_DEGREE VARCHAR(10) PRIMARY KEY,
    TITLE_DEGREE VARCHAR(100)
);
INSERT INTO DEGREE (COD_DEGREE, TITLE_DEGREE)
VALUES
    ('CSE101', 'Computer Science'),
    ('ECON201', 'Economics'),
    ('MATH301', 'Mathematics'),
    ('PHYS401', 'Physics');

CREATE TABLE CAREER (
    ID INT PRIMARY KEY,
    COD_COURSE VARCHAR(10),
    TITLE_COURSE VARCHAR(100),
    CFU INT,
    GRADE DECIMAL(3, 2),
    DATE DATE
);
INSERT INTO CAREER (ID, COD_COURSE, TITLE_COURSE, CFU, GRADE, DATE)
VALUES
    (1, 'CS101', 'Introduction to Programming', 5, 4.0, '2022-05-15'),
    (2, 'ECO201', 'Microeconomics', 6, 3.5, '2022-06-20'),
    (3, 'MATH301', 'Calculus II', 4, 4.0, '2022-07-10'),
    (4, 'PHYS401', 'Quantum Mechanics', 5, 3.7, '2023-01-30');