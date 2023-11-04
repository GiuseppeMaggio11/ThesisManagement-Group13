CREATE DATABASE IF NOT EXISTS db_se_thesismanagement;

USE db_se_thesismanagement;

CREATE TABLE user_type (
    id VARCHAR(4) PRIMARY KEY,
    user_type VARCHAR(30)
);
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    salt VARCHAR(16),
    password VARCHAR(128),
    user_type_id VARCHAR(4),
    FOREIGN KEY (user_type_id) REFERENCES user_type(id)
);
CREATE TABLE student (
    id VARCHAR(7) PRIMARY KEY,
    surname VARCHAR(50),
    name VARCHAR(50),
    gender VARCHAR(10),
    nationality VARCHAR(50),
    email VARCHAR(255),
    cod_degree VARCHAR(10),
    enrollment_year INT
);
CREATE TABLE teacher (
    id VARCHAR(7) PRIMARY KEY,
    surname VARCHAR(50),
    name VARCHAR(50),
    email VARCHAR(255),
    cod_group VARCHAR(10),
    cod_department VARCHAR(10)
);
CREATE TABLE degree_table (
    cod_degree VARCHAR(10) PRIMARY KEY,
    title_degree VARCHAR(100)
);
CREATE TABLE course (
    cod_course VARCHAR(10) PRIMARY KEY,
    title_course VARCHAR(100),
    cfu INT
);
CREATE TABLE career (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cod_course VARCHAR(10),
    student_id VARCHAR(7),
    grade DECIMAL(3, 2),
    date DATE,
    FOREIGN KEY (cod_course) REFERENCES course(cod_course),
    FOREIGN KEY (student_id) REFERENCES student(id)
);
CREATE TABLE group_table(
    cod_group VARCHAR(10) PRIMARY KEY,
    group_name VARCHAR(50)
);
CREATE TABLE department(
    cod_department VARCHAR(10) PRIMARY KEY,
    department_name VARCHAR(50),
    cod_group VARCHAR(10),
    FOREIGN KEY (cod_group) REFERENCES group_table(cod_group)
);
CREATE TABLE external_supervisor(
    email VARCHAR(255) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL
);
CREATE TABLE keyword(
    name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE type_table(
    name VARCHAR(50) PRIMARY KEY
);
CREATE TABLE thesis(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    supervisor_id VARCHAR(7),
    thesis_level VARCHAR(20),
    type_name VARCHAR(50),
    required_knowledge TEXT,
    notes TEXT,
    expiration DATETIME,
    cod_degree VARCHAR(10),
    is_archived BOOLEAN,
    foreign key (type_name) references type_table(name),
    foreign key (cod_degree) references degree_table(cod_degree)
);
CREATE TABLE thesis_keyword(
    thesis_id INT,
    keyword_name VARCHAR(50),
    primary key (thesis_id, keyword_name),
    foreign key (thesis_id) references thesis(id),
    foreign key (keyword_name) references keyword(name)
);
CREATE TABLE thesis_group(
    thesis_id INT,
    group_id VARCHAR(10),
    primary key (thesis_id, group_id),
    foreign key (thesis_id) references thesis(id),
    foreign key (group_id) references group_table(cod_group)
);
CREATE TABLE thesis_cosupervisor(
    thesis_id INT,
    cosupevisor_id VARCHAR(255),
    primary key (thesis_id, cosupevisor_id),
    foreign key (thesis_id) references thesis(id),
    foreign key (cosupevisor_id) references teacher(id),
    foreign key (cosupevisor_id) references external_supervisor(email)
);
CREATE TABLE application(
    student_id VARCHAR(7),
    thesis_id INT,
    status VARCHAR(10),
    application_date DATETIME,
    PRIMARY KEY(student_id, thesis_id),
    foreign key (student_id) references student(id),
    foreign key (thesis_id) references thesis(id)
);