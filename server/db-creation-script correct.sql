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

CREATE TABLE IF NOT EXISTS secretary(
    id VARCHAR(7) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS degree_table (
    cod_degree VARCHAR(10) PRIMARY KEY,
    title_degree VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS career (
    id VARCHAR(7) NOT NULL,
    cod_course VARCHAR(10) NOT NULL,
    title_course VARCHAR(50) NOT NULL,
    cfu INT NOT NULL,
    grade DECIMAL(3, 0) NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY (id, cod_course),
    FOREIGN KEY (id) REFERENCES student(id)
);

CREATE TABLE IF NOT EXISTS group_table(
    cod_group VARCHAR(10) PRIMARY KEY,
    group_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS department(
    cod_department VARCHAR(10) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    cod_group VARCHAR(10) NOT NULL,
    PRIMARY KEY (cod_department, cod_group),
    FOREIGN KEY (cod_group) REFERENCES group_table(cod_group)
);

CREATE TABLE IF NOT EXISTS external_supervisor(
    email VARCHAR(255) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL
);



CREATE TABLE IF NOT EXISTS thesis(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    supervisor_id VARCHAR(7) NOT NULL,
    thesis_level VARCHAR(20) NOT NULL,
    thesis_type VARCHAR(50) NOT NULL,
    required_knowledge TEXT NOT NULL,
    notes TEXT NOT NULL,
    expiration DATETIME NOT NULL,
    cod_degree VARCHAR(10) NOT NULL,
    keywords TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT 0,
    is_expired BOOLEAN NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (cod_degree) REFERENCES degree_table(cod_degree),
    FOREIGN KEY (supervisor_id) REFERENCES teacher(id)
);

CREATE TABLE IF NOT EXISTS thesis_request(
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(7) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    supervisor_id VARCHAR(7) NOT NULL,
    thesis_level VARCHAR(20) NOT NULL,
    thesis_type VARCHAR(50) NOT NULL,
    cod_degree VARCHAR(10) NOT NULL,
    status_code INT NOT NULL DEFAULT 0,
    FOREIGN KEY (cod_degree) REFERENCES degree_table(cod_degree),
    FOREIGN KEY (supervisor_id) REFERENCES teacher(id)
);

CREATE TABLE IF NOT EXISTS thesis_group(
    thesis_id INT NOT NULL,
    group_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (thesis_id, group_id),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id),
    FOREIGN KEY (group_id) REFERENCES group_table(cod_group)
);

CREATE TABLE IF NOT EXISTS thesis_cosupervisor_teacher(
    id INT AUTO_INCREMENT PRIMARY KEY,
    thesis_id INT,
    thesisrequest_id INT,
    cosupevisor_id VARCHAR(7) NOT NULL,
    FOREIGN KEY (thesis_id) REFERENCES thesis(id),
    FOREIGN KEY (cosupevisor_id) REFERENCES teacher(id),
    FOREIGN KEY (thesisrequest_id) REFERENCES thesis_request(id)
);

CREATE TABLE IF NOT EXISTS thesis_cosupervisor_external(
    id INT AUTO_INCREMENT PRIMARY KEY,
    thesis_id INT,
    thesisrequest_id INT,
    cosupevisor_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (thesis_id) REFERENCES thesis(id),
    FOREIGN KEY (cosupevisor_id) REFERENCES external_supervisor(email),
    FOREIGN KEY (thesisrequest_id) REFERENCES thesis_request(id)
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
INSERT INTO secretary (id, surname, name, email) 
VALUES
    ('E123456', 'Giallo', 'Paolo', 'paola.giallo@polito.it');
INSERT INTO degree_table (cod_degree, title_degree) 
VALUES
    ('DEGR01', 'Computer engineering Master Degree'),
    ('DEGR02', 'Electronic engineering Master Degree'),
    ('DEGR03', 'Electrical engineering Master Degree'),
    ('DEGR04', 'Data science Master Degree'),
    ('DEGR05', 'Mechanical engineering Master Degree');
INSERT INTO career (id, cod_course, title_course, cfu,grade, date) 
VALUES
    ('S123456','COU01','Software Engineering 2' ,6,30, '2023-01-15'),
    ('S123456','COU02', 'Sicurezza dei sistemi informativi' ,12,18, '2023-02-20'),
    ('S654321','COU01','Data science',9,25, '2023-01-15'),
    ('S654321','COU02', 'Software Engineering 1',9,20, '2023-02-20');
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
INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, keywords, is_archived, is_expired)
VALUES
    ('Development of a Secure Web Application', 'Creating a web application with a focus on security features.', 'P123456', 'Master', 'Sperimental', 'Strong knowledge of web security and programming.', 'None', '2023-12-15 23:59:59', 'DEGR01','AUTOMATATION, HUMAN COMPUTER INTERACTION',1,0),
    ('IoT-Based Smart Home Automation', 'Designing an IoT system for smart home automation.', 'P654321', 'Master', 'Company', 'Experience with IoT protocols and devices.', 'The thesis must be completed within 6 months.', '2024-08-30 23:59:59', 'DEGR02','USER EXPERIENCE, AUTOMATATION, MACHINE LEARNING', 0,0),
    ('Network Traffic Analysis', 'Analyzing network traffic for security and optimization purposes.', 'P123456', 'Master', 'Sperimental', 'Background in network security and data analysis.', 'None', '2024-07-30 23:59:59', 'DEGR01',null,0,0),
    ('Data Visualization Tool', 'Developing a tool for visualizing complex data sets.', 'P654321', 'Master', 'Company', 'Strong knowledge of data visualization techniques.', 'The thesis must be completed within 5 months.', '2023-09-30 23:59:59' ,'DEGR02','SOFTWARE QUALITY',0,0),
    ('Machine Learning for Image Recognition', 'Implementing machine learning for image recognition tasks.', 'P123456', 'Master', 'Sperimental', 'Proficiency in machine learning and computer vision.', 'None', '2024-09-30 23:59:59', 'DEGR01',null ,1,0),
    ('Embedded Systems Programming', 'Developing software for embedded systems in IoT devices.', 'P654321', 'Master', 'Abroad', 'Experience with embedded systems and low-level programming.', 'The thesis must be completed within 7 months.', '2023-05-15 23:59:59' ,'DEGR02','DATA ANALYSIS, AUTOMATATION',0,0),
    ('Blockchain Technology in Supply Chain Management', 'Exploring the use of blockchain for enhancing transparency in supply chains.', 'P123456', 'Master', 'Sperimental', 'Understanding of blockchain technology and supply chain processes.', 'None', '2024-10-31 23:59:59', 'DEGR03', 'BLOCKCHAIN, SUPPLY CHAIN, TECHNOLOGY', 0,1),
    ('Renewable Energy Integration in Smart Grids', 'Investigating the integration of renewable energy sources in smart grid systems.', 'P654321', 'Master', 'Company', 'Knowledge of renewable energy systems and smart grid technologies.', 'The thesis must address sustainability aspects.', '2023-11-30 23:59:59', 'DEGR05', 'RENEWABLE ENERGY, SMART GRIDS, SUSTAINABILITY', 0,0),
    ('Human-Computer Interaction in Virtual Reality', 'Designing immersive user experiences through virtual reality interfaces.', 'P123456', 'Master', 'Sperimental', 'Background in human-computer interaction and virtual reality development.', 'None', '2024-06-30 23:59:59', 'DEGR01', 'VIRTUAL REALITY, HCI, USER EXPERIENCE', 1,0),
    ('Advanced Robotics for Manufacturing', 'Developing advanced robotic systems for manufacturing processes.', 'P654321', 'Master', 'Company', 'Experience in robotics and automation.', 'The thesis must address real-world manufacturing challenges.', '2023-08-15 23:59:59', 'DEGR04', 'ROBOTICS, MANUFACTURING, AUTOMATION', 0,0),
    ('Cybersecurity Measures in Internet of Things', 'Analyzing and implementing cybersecurity measures for IoT devices.', 'P123456', 'Master', 'Sperimental', 'Knowledge of IoT security protocols and cybersecurity best practices.', 'None', '2024-05-31 23:59:59', 'DEGR02', 'CYBERSECURITY, INTERNET OF THINGS, NETWORK SECURITY', 0,1),
    ('Healthcare Data Analytics', 'Applying data analytics techniques to healthcare data for insights and improvements.', 'P654321', 'Master', 'Company', 'Proficiency in data analytics and understanding of healthcare systems.', 'The thesis must comply with privacy regulations.', '2023-12-01 23:59:59', 'DEGR03', 'DATA ANALYTICS, HEALTHCARE, PRIVACY', 0,0),
	('Quantum Computing Algorithms', 'Developing and analyzing algorithms for quantum computing.', 'P123456', 'Master', 'Sperimental', 'Understanding of quantum computing principles and algorithms.', 'None', '2024-09-15 23:59:59', 'DEGR01', 'QUANTUM COMPUTING, ALGORITHMS, THEORETICAL PHYSICS', 0,0),
    ('Urban Mobility Solutions', 'Designing innovative solutions for urban transportation and mobility.', 'P654321', 'Master', 'Company', 'Knowledge of urban planning and sustainable transportation.', 'The thesis must propose practical and sustainable mobility solutions.', '2023-07-31 23:59:59', 'DEGR05', 'URBAN MOBILITY, SUSTAINABILITY, TRANSPORTATION', 0,0),
    ('Augmented Reality Applications in Education', 'Developing educational applications using augmented reality technology.', 'P123456', 'Master', 'Sperimental', 'Background in educational technology and augmented reality development.', 'None', '2024-04-30 23:59:59', 'DEGR01', 'AUGMENTED REALITY, EDUCATIONAL TECHNOLOGY, INTERACTIVE LEARNING', 1,0),
    ('Precision Agriculture with IoT', 'Implementing IoT solutions for precision agriculture and smart farming.', 'P654321', 'Master', 'Company', 'Understanding of agriculture processes and IoT technologies.', 'The thesis must address efficiency and sustainability in agriculture.', '2023-10-15 23:59:59', 'DEGR03', 'PRECISION AGRICULTURE, IOT, SUSTAINABLE FARMING', 0,0),
    ('Natural Language Processing for Chatbots', 'Creating advanced chatbots using natural language processing techniques.', 'P123456', 'Master', 'Sperimental', 'Proficiency in natural language processing and chatbot development.', 'None', '2024-08-01 23:59:59', 'DEGR02', 'NATURAL LANGUAGE PROCESSING, CHATBOTS, ARTIFICIAL INTELLIGENCE', 0,0),
    ('Renewable Energy Monitoring System', 'Developing a monitoring system for renewable energy sources.', 'P654321', 'Master', 'Company', 'Experience with renewable energy systems and monitoring technologies.', 'The thesis must provide real-time monitoring capabilities.', '2023-06-15 23:59:59', 'DEGR04', 'RENEWABLE ENERGY, MONITORING SYSTEM, SUSTAINABILITY', 0,0);
   INSERT INTO thesis_group (thesis_id, group_id)
VALUES
    (1, 'GRP01'),
    (2, 'GRP02'),
    (3, 'GRP01'),
    (4, 'GRP02'),
    (5, 'GRP01'),
    (6, 'GRP02');
/*INSERT INTO application (student_id, thesis_id, status, application_date)
VALUES
    ('S123456', 1, 'Pending', '2023-12-15 10:30:00'),
    ('S123456', 2, 'Approved', '2023-11-20 14:45:00'),
    ('S654321', 3, 'Pending', '2023-12-02 16:15:00'),
    ('S654321', 4, 'Approved', '2023-03-12 09:00:00'),
    ('S123456', 5, 'Pending', '2023-07-10 11:30:00'),
    ('S654321', 6, 'Approved', '2023-02-28 13:15:00')
;*/
INSERT INTO thesis_cosupervisor_teacher (thesis_id, cosupevisor_id)
VALUES 
    (1, 'P654321'),
    (6, 'P123456');
INSERT INTO thesis_cosupervisor_external (thesis_id, cosupevisor_id)
VALUES 
    (3, 'elena.conti@email.net'),
    (4, 'maria.gentile@email.net'),
    (4, 'antonio.bruno@email.org'),
    (6, 'andrea.ferrari@email.com');
INSERT INTO thesis_request (student_id, title, description, supervisor_id, thesis_level, thesis_type, cod_degree, status_code)
VALUES
('S123456', 'Research Topic 1', 'Description for Research Topic 1', 'P123456', 'Master', 'Experimental', 'DEGR01', 1),
('S123456', 'Research Topic 2', 'Description for Research Topic 2', 'P654321', 'PhD', 'Theoretical', 'DEGR01', 0),
('S654321', 'Research Topic 3', 'Description for Research Topic 3', 'P123456', 'Bachelor', 'Practical', 'DEGR02', 1),
('S654321', 'Research Topic 4', 'Description for Research Topic 4', 'P123456', 'Master', 'Mixed', 'DEGR02', 0),
('S123456', 'Research Topic 5', 'Description for Research Topic 5', 'P654321', 'PhD', 'Experimental', 'DEGR01', 1);
