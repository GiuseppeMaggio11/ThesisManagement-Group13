CREATE DATABASE IF NOT EXISTS db_se_thesismanagement;

USE db_se_thesismanagement;

CREATE TABLE IF NOT EXISTS user_type (
    id VARCHAR(4) PRIMARY KEY,
    user_type VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) PRIMARY KEY,
    salt VARCHAR(16) NOT NULL,
    password VARCHAR(128) NOT NULL,
    user_type_id VARCHAR(4) NOT NULL,
    FOREIGN KEY (user_type_id) REFERENCES user_type(id)
);

CREATE TABLE IF NOT EXISTS student (
    id VARCHAR(7) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cod_degree VARCHAR(10) NOT NULL,
    enrollment_year INT NOT NULL
);

CREATE TABLE IF NOT EXISTS teacher (
    id VARCHAR(7) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cod_group VARCHAR(10) NOT NULL,
    cod_department VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS degree_table (
    cod_degree VARCHAR(10) PRIMARY KEY,
    title_degree VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS course (
    cod_course VARCHAR(10) PRIMARY KEY,
    title_course VARCHAR(100) NOT NULL,
    cfu INT NOT NULL
);

CREATE TABLE IF NOT EXISTS career (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cod_course VARCHAR(10) NOT NULL,
    student_id VARCHAR(7) NOT NULL,
    grade DECIMAL(3, 0) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (cod_course) REFERENCES course(cod_course),
    FOREIGN KEY (student_id) REFERENCES student(id)
);

CREATE TABLE IF NOT EXISTS group_table(
    cod_group VARCHAR(10) PRIMARY KEY,
    group_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS department(
    cod_department VARCHAR(10) PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    cod_group VARCHAR(10) NOT NULL,
    FOREIGN KEY (cod_group) REFERENCES group_table(cod_group)
);

CREATE TABLE IF NOT EXISTS external_supervisor(
    email VARCHAR(255) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS keyword(
    name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS type_table(
    name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS thesis(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    supervisor_id VARCHAR(7) NOT NULL,
    thesis_level VARCHAR(20) NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    required_knowledge TEXT NOT NULL,
    notes TEXT NOT NULL,
    expiration DATETIME NOT NULL,
    cod_degree VARCHAR(10) NOT NULL,
    is_archived BOOLEAN NOT NULL,
    FOREIGN KEY (type_name) REFERENCES type_table(name),
    FOREIGN KEY (cod_degree) REFERENCES degree_table(cod_degree)
);

CREATE TABLE IF NOT EXISTS thesis_keyword(
    thesis_id INT NOT NULL,
    keyword_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (thesis_id, keyword_name),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id),
    FOREIGN KEY (keyword_name) REFERENCES keyword(name)
);

CREATE TABLE IF NOT EXISTS thesis_group(
    thesis_id INT NOT NULL,
    group_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (thesis_id, group_id),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id),
    FOREIGN KEY (group_id) REFERENCES group_table(cod_group)
);

CREATE TABLE IF NOT EXISTS thesis_cosupervisor(
    thesis_id INT NOT NULL,
    cosupevisor_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (thesis_id, cosupevisor_id),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id),
    FOREIGN KEY (cosupevisor_id) REFERENCES teacher(id),
    FOREIGN KEY (cosupevisor_id) REFERENCES external_supervisor(email)
);

CREATE TABLE IF NOT EXISTS application(
    student_id VARCHAR(7) NOT NULL,
    thesis_id INT NOT NULL,
    status VARCHAR(10) NOT NULL,
    application_date DATETIME NOT NULL,
    PRIMARY KEY (student_id, thesis_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id)
);


INSERT INTO user_type (id, user_type)
VALUES
    ('PROF', 'Professor'),
    ('COSP', 'Co-supervisor'),
    ('STUD', 'Student'),
    ('SECR', 'Secretary clerk'),
    ('FADI', 'Faculty director'),
    ('PCOM', 'President of commission');
INSERT INTO users (email, salt, password, user_type_id)
VALUES  
    ('mario.rossi@polito.it', 'djfhdkfkdiccjfnd', '11e645a4aba1bafaba5e0ee6f4d3e5ebf744955e5f7a1ee55f5e4fe1973adff8d8b28aab85e3701848c310b60448216e40e173b35e1a904e5501567bd39bb936', 'PROF'),
    ('sofia.bianchi@polito.it', 'ofkgmdkcmdjmdjcj', 'e1c8b98e21034791c5211bf024ac7da3f5ffa1863924da7debdf6e528aff641c226d180cfa1fcbf3ca2c3348891a976d8d797d6402c36cfc60db5394f962d4bb', 'PROF'),
    ('luca.esposito@studenti.polito.it', 'ghnhngsfddfrfrfr', '02895538f17ffe15681c0e47b4453d2b461bc917b2ec450621363f4446d19eb2a589842a4c5885e92795a4e80b3295c966af188b8f49e0fdb29b88dbcb8e0679', 'STUD'),
    ('alessandra.moretti@studenti.polito.it', 'ofmdjdivlkmdfvnv', '8acbaf864d280f282d1ea5dc2c4c8b469b4e7abbf1679435e3736321f3b05c90a0d14f0c106b9b92ba5e7512a88465800b6e04408918a46b8b3450d0f344f7e1', 'STUD');
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) 
VALUES
    ('S123456', 'Esposito', 'Luca', 'Male', 'Italian', 'luca.esposito@studenti.polito.it', 'DEGR01', 2020),
    ('S654321', 'Moretti', 'Alessandra', 'Female', 'Italian', 'alessandra.moretti@studenti.polito.it', 'DEGR02', 2018);
INSERT INTO teacher (id, surname, name, email, cod_group, cod_department) 
VALUES
    ('P123456', 'Rossi', 'Mario', 'mario.rossi@polito.it', 'GRP01', 'DEP01'),
    ('P654321', 'Bianchi', 'Sofia', 'sofia.bianchi@polito.it', 'GRP02', 'DEP02');
INSERT INTO degree_table (cod_degree, title_degree) 
VALUES
    ('DEGR01', 'Computer engineering Master Degree'),
    ('DEGR02', 'Electronic engineering Master Degree');
INSERT INTO course (cod_course, title_course, cfu) 
    VALUES
    ('COU01', 'Web Applications 1', 6),
    ('COU02', 'System and device programming', 10);
INSERT INTO career (cod_course, student_id, grade, date) 
VALUES
    ('COU01', 'S123456', 30, '2023-01-15'),
    ('COU02', 'S123456', 18, '2023-02-20'),
    ('COU01', 'S654321', 25, '2023-01-15'),
    ('COU02', 'S654321', 20, '2023-02-20');
INSERT INTO group_table (cod_group, group_name)
VALUES
    ('GRP01', 'Computer group'),
    ('GRP02', 'Electronic group');
INSERT INTO department (cod_department, department_name, cod_group) 
    VALUES
    ('DEP01', 'Computer department', 'GRP01'),
    ('DEP02', 'Electronic department', 'GRP02');
INSERT INTO external_supervisor (email, surname, name) 
    VALUES
    ('andrea.ferrari@email.com', 'Ferrari', 'Andrea'),
    ('maria.gentile@email.net', 'Gentile', 'Maria'),
    ('antonio.bruno@email.org', 'Bruno', 'Antonio'),
    ('elena.conti@email.net', 'Conti', 'Elena');
INSERT INTO keyword (name) 
    VALUES
    ('Web development'),
    ('Cybersecurity'),
    ('IoT'),
    ('Home Automation'),
    ('Network Security'),
    ('Data Visualization'),
    ('Machine Learning'),
    ('Embedded Systems');
INSERT INTO type_table (name) VALUES
    ('Sperimental'),
    ('Company'),
    ('Abroad');
INSERT INTO thesis (title, description, supervisor_id, thesis_level, type_name, required_knowledge, notes, expiration, cod_degree, is_archived)
VALUES
    ('Development of a Secure Web Application', 'Creating a web application with a focus on security features.', 'P123456', 'Master', 'Sperimental', 'Strong knowledge of web security and programming.', 'None', '2023-05-15 23:59:59', 'DEGR01', 0),
    ('IoT-Based Smart Home Automation', 'Designing an IoT system for smart home automation.', 'P654321', 'Master', 'Company', 'Experience with IoT protocols and devices.', 'The thesis must be completed within 6 months.', '2023-08-30 23:59:59', 'DEGR02', 0),
    ('Network Traffic Analysis', 'Analyzing network traffic for security and optimization purposes.', 'P123456', 'Master', 'Sperimental', 'Background in network security and data analysis.', 'None', '2023-07-30 23:59:59', 'DEGR01', 0),
    ('Data Visualization Tool', 'Developing a tool for visualizing complex data sets.', 'P654321', 'Master', 'Company', 'Strong knowledge of data visualization techniques.', 'The thesis must be completed within 5 months.', '2023-09-30 23:59:59' ,'DEGR02', 0),
    ('Machine Learning for Image Recognition', 'Implementing machine learning for image recognition tasks.', 'P123456', 'Master', 'Sperimental', 'Proficiency in machine learning and computer vision.', 'None', '2023-09-30 23:59:59', 'DEGR01', 0),
    ('Embedded Systems Programming', 'Developing software for embedded systems in IoT devices.', 'P654321', 'Master', 'Abroad', 'Experience with embedded systems and low-level programming.', 'The thesis must be completed within 7 months.', '2023-05-15 23:59:59' ,'DEGR02', 0);
INSERT INTO thesis_keyword (thesis_id, keyword_name)
VALUES
    (1, 'Web development'),
    (1, 'Cybersecurity'),
    (2, 'IoT'),
    (2, 'Home Automation'),
    (3, 'Network Security'),
    (4, 'Data Visualization'),
    (4, 'Web development'),
    (5, 'Machine Learning'),
    (6, 'Embedded Systems'),
    (6, 'IoT');
INSERT INTO thesis_group (thesis_id, group_id)
VALUES
    (1, 'GRP01'),
    (2, 'GRP02'),
    (3, 'GRP01'),
    (4, 'GRP02'),
    (5, 'GRP01'),
    (6, 'GRP02');
INSERT INTO application (student_id, thesis_id, status, application_date)
VALUES
    ('S123456', 1, 'Pending', '2023-04-15 10:30:00'),
    ('S123456', 2, 'Approved', '2023-03-20 14:45:00'),
    ('S654321', 3, 'Pending', '2023-05-02 16:15:00'),
    ('S654321', 4, 'Approved', '2023-06-12 09:00:00'),
    ('S123456', 5, 'Pending', '2023-07-10 11:30:00'),
    ('S654321', 6, 'Approved', '2023-02-28 13:15:00');
