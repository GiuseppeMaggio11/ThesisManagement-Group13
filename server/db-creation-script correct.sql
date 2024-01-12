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
    id INT AUTO_INCREMENT PRIMARY KEY,
    thesis_id INT,
    thesisrequest_id INT,
    cosupevisor_id VARCHAR(7) NOT NULL,
    FOREIGN KEY (thesis_id) REFERENCES thesis(id),
    FOREIGN KEY (cosupevisor_id) REFERENCES teacher(id),
    FOREIGN KEY (thesisrequest_id) REFERENCES thesis_request(id)
    FOREIGN KEY (cosupevisor_id) REFERENCES teacher(id),
    FOREIGN KEY (thesisrequest_id) REFERENCES thesis_request(id)
);

CREATE TABLE IF NOT EXISTS thesis_cosupervisor_external(
    id INT AUTO_INCREMENT PRIMARY KEY,
    thesis_id INT,
    thesisrequest_id INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    thesis_id INT,
    thesisrequest_id INT,
    cosupevisor_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (thesis_id) REFERENCES thesis(id),
    FOREIGN KEY (cosupevisor_id) REFERENCES external_supervisor(email),
    FOREIGN KEY (thesisrequest_id) REFERENCES thesis_request(id)
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
    ('Development of a Secure Web Application', 'The thesis, "Development of a Secure Web Application," focuses on creating a robust and safeguarded online platform. Delving into the evolving landscape of cyber threats, the research explores cutting-edge security measures for web application development. The study encompasses a thorough analysis of prevalent threats, secure coding practices, and encryption protocols. Key elements include the integration of authentication mechanisms and continuous monitoring to fortify the application against unauthorized access and data breaches. The development phase emphasizes the selection of secure technologies and programming languages to build a resilient foundation. The thesis also addresses user authentication, authorization, and the implementation of multi-factor authentication for heightened security. Continuous testing, automated security tools, and prompt application of security updates contribute to the proactive defense against emerging threats. Real-world testing scenarios validate the efficacy of the developed secure web application, assessing its performance under various conditions. The research serves as a practical guide for developers, businesses, and organizations aiming to prioritize security in the web development process. By combining theoretical insights with tested implementations, this thesis contributes to the ongoing efforts to create web applications that not only meet functional requirements but also adhere to the highest standards of security.', 'P123456', 'Master', 'Sperimental', 'Strong knowledge of web security and programming.', 'None', '2023-12-15 23:59:59', 'DEGR01','AUTOMATATION, HUMAN COMPUTER INTERACTION',1,0),
    ('IoT-Based Smart Home Automation', 'The thesis, IoT-Based Smart Home Automation, explores the integration of the Internet of Things (IoT) in home technology, aiming to enhance efficiency and convenience. It delves into the theoretical foundations and practical implementation of IoT devices, examining protocols, sensors, and communication technologies. The research focuses on creating interconnected systems for seamless control of home devices, incorporating sensors for environment monitoring and automated responses. Security, privacy, and data management within the IoT ecosystem are addressed, with real-world case studies validating the system efficacy. The thesis anticipates future trends, offering a concise guide for researchers and developers in creating intelligent, secure, and scalable smart home solutions.', 'P654321', 'Master', 'Company', 'Experience with IoT protocols and devices.', 'The thesis must be completed within 6 months.', '2024-08-30 23:59:59', 'DEGR02','USER EXPERIENCE, AUTOMATATION, MACHINE LEARNING', 0,0),
    ('Network Traffic Analysis', 'The thesis, "Network Traffic Analysis," delves into the examination and understanding of data flows within computer networks. Focused on enhancing cybersecurity, the research explores techniques for monitoring, capturing, and analyzing network traffic patterns. It investigates the identification of anomalous behavior, potential security threats, and the optimization of network performance. The study encompasses the utilization of advanced tools, protocols, and methodologies to extract meaningful insights from the vast volume of data traversing networks. Practical applications include intrusion detection, network optimization, and overall improvement in the security posture of interconnected systems. This thesis serves as a valuable resource for cybersecurity professionals, network administrators, and researchers seeking to bolster network resilience and preemptively address emerging threats.', 'P123456', 'Master', 'Sperimental', 'Background in network security and data analysis.', 'None', '2024-07-30 23:59:59', 'DEGR01',null,0,0),
    ('Data Visualization Tool', 'The thesis, "Data Visualization Tool," focuses on the development and application of tools for visualizing complex datasets. Investigating the intersection of technology and data representation, the research explores design principles, visualization techniques, and usability considerations in creating effective data visualization tools. Emphasizing clarity and accessibility, the study covers the integration of interactive features and diverse visualization methods to facilitate meaningful insights from intricate data sets. Practical applications include aiding decision-making processes, identifying patterns, and communicating information effectively. This thesis is a valuable resource for developers, analysts, and decision-makers aiming to harness the power of visual representation in understanding and conveying complex information.', 'P654321', 'Master', 'Company', 'Strong knowledge of data visualization techniques.', 'The thesis must be completed within 5 months.', '2023-09-30 23:59:59' ,'DEGR02','SOFTWARE QUALITY',0,0),
    ('Machine Learning for Image Recognition', 'The thesis, "Machine Learning for Image Recognition," delves into the realm of artificial intelligence, focusing on the application of machine learning algorithms for image analysis. Exploring the theoretical foundations and practical implementations, the research investigates the training and optimization of models capable of recognizing patterns and features within visual data. Key components include the utilization of deep learning architectures, convolutional neural networks, and image preprocessing techniques. The study aims to enhance accuracy and efficiency in image recognition tasks, with real-world applications ranging from object identification to facial recognition. This thesis serves as a comprehensive guide for researchers, developers, and practitioners seeking to leverage machine learning to advance the capabilities of image recognition systems.', 'P123456', 'Master', 'Sperimental', 'Proficiency in machine learning and computer vision.', 'None', '2024-09-30 23:59:59', 'DEGR01',null ,1,0),
    ('Embedded Systems Programming', 'The thesis, "Embedded Systems Programming," delves into the intricacies of designing and coding for embedded systems. Focused on the intersection of hardware and software, the research explores programming techniques tailored for resource-constrained environments. Investigating real-time operating systems, low-level programming languages, and optimization strategies, the study addresses the challenges of developing efficient and reliable embedded systems. Practical applications include firmware development for microcontrollers, IoT devices, and other embedded platforms. This thesis provides a comprehensive resource for programmers, engineers, and developers, offering insights into the nuances of embedded systems programming and its significance in the evolving landscape of connected and smart devices.', 'P654321', 'Master', 'Abroad', 'Experience with embedded systems and low-level programming.', 'The thesis must be completed within 7 months.', '2023-05-15 23:59:59' ,'DEGR02','DATA ANALYSIS, AUTOMATATION',0,0),
    ('Blockchain Technology in Supply Chain Management', 'The thesis, "Blockchain Technology in Supply Chain Management," navigates the transformative impact of blockchain on the logistics and distribution landscape. Investigating the theoretical foundations and practical implementations, the research explores how blockchain enhances transparency, traceability, and security throughout the supply chain. Emphasizing decentralized and tamper-resistant ledgers, the study delves into the potential reduction of fraud, errors, and inefficiencies in supply chain processes. Real-world applications include product provenance tracking, smart contracts for automated agreements, and improved overall supply chain visibility. This thesis serves as a comprehensive guide for supply chain professionals, technologists, and researchers seeking to leverage blockchain technology for enhanced efficiency and trust in supply chain management.', 'P123456', 'Master', 'Sperimental', 'Understanding of blockchain technology and supply chain processes.', 'None', '2024-10-31 23:59:59', 'DEGR03', 'BLOCKCHAIN, SUPPLY CHAIN, TECHNOLOGY', 0,1),
    ('Renewable Energy Integration in Smart Grids', 'The thesis, "Renewable Energy Integration in Smart Grids," delves into the dynamic intersection of renewable energy sources and advanced grid technologies. Investigating the theoretical foundations and practical applications, the research explores strategies to seamlessly incorporate renewable energy into smart grids. Key elements include the optimization of energy generation, distribution, and consumption through advanced monitoring, control, and communication systems. The study addresses the challenges associated with the intermittent nature of renewable sources, proposing innovative solutions such as energy storage and demand response mechanisms. Emphasizing grid flexibility and resilience, the research investigates the integration of machine learning algorithms and predictive modeling for efficient energy management. Real-world case studies validate the viability of renewable energy integration, showcasing how smart grids enhance reliability, reduce carbon footprints, and promote sustainability. This thesis serves as a comprehensive guide for researchers, engineers, and policymakers, offering insights into the evolving landscape of renewable energy integration within the context of smart grid technologies.', 'P654321', 'Master', 'Company', 'Knowledge of renewable energy systems and smart grid technologies.', 'The thesis must address sustainability aspects.', '2023-11-30 23:59:59', 'DEGR05', 'RENEWABLE ENERGY, SMART GRIDS, SUSTAINABILITY', 0,0),
    ('Human-Computer Interaction in Virtual Reality', 'The thesis, "Human-Computer Interaction in Virtual Reality (VR)," delves into the immersive realm where technology meets user experience. Focused on the convergence of human interaction and virtual environments, the research explores the theoretical underpinnings and practical applications of designing user interfaces within VR spaces. Investigating interaction modalities, usability considerations, and user-centered design principles, the study addresses the unique challenges and opportunities presented by virtual reality. Key elements include the exploration of natural user interfaces, gesture recognition, and haptic feedback to enhance the sense of presence and engagement. The research also delves into the cognitive and perceptual aspects of VR interaction, ensuring a seamless and intuitive user experience. Real-world applications encompass virtual simulations, training environments, and entertainment platforms, showcasing the transformative potential of effective human-computer interaction in VR. This thesis serves as a comprehensive guide for designers, developers, and researchers seeking to create compelling and user-friendly virtual reality experiences, contributing to the ongoing evolution of immersive technologies.', 'P123456', 'Master', 'Sperimental', 'Background in human-computer interaction and virtual reality development.', 'None', '2024-06-30 23:59:59', 'DEGR01', 'VIRTUAL REALITY, HCI, USER EXPERIENCE', 1,0),
    ('Advanced Robotics for Manufacturing', 'The thesis, "Advanced Robotics for Manufacturing," explores the integration of cutting-edge robotics technologies to revolutionize manufacturing processes. Investigating both theoretical foundations and practical implementations, the research delves into the design and deployment of robotic systems to enhance efficiency, precision, and flexibility in manufacturing environments. Key aspects include the utilization of advanced sensors, artificial intelligence, and machine learning algorithms to enable robots to adapt to dynamic production requirements. The study addresses challenges such as human-robot collaboration, autonomous decision-making, and the optimization of production workflows. Real-world applications range from intricate assembly tasks to complex machining operations, showcasing the transformative potential of advanced robotics in improving product quality and reducing production costs. This thesis serves as a valuable resource for engineers, manufacturers, and researchers aiming to leverage state-of-the-art robotics for innovation in the manufacturing sector, contributing to the ongoing evolution of smart and adaptive production systems.', 'P654321', 'Master', 'Company', 'Experience in robotics and automation.', 'The thesis must address real-world manufacturing challenges.', '2023-08-15 23:59:59', 'DEGR04', 'ROBOTICS, MANUFACTURING, AUTOMATION', 0,0),
    ('Cybersecurity Measures in Internet of Things', 'The thesis, "Cybersecurity Measures in Internet of Things (IoT)," focuses on safeguarding the interconnected landscape of IoT devices. Investigating both theoretical foundations and practical implementations, the research explores robust cybersecurity measures to mitigate vulnerabilities and protect sensitive data in the IoT ecosystem. The study encompasses a comprehensive analysis of prevalent threats such as unauthorized access, data breaches, and device manipulation. It delves into encryption protocols, secure communication channels, and access control mechanisms to fortify the security posture of IoT devices. Key aspects include the integration of anomaly detection systems and continuous monitoring to identify and respond to potential cyber threats in real-time. The research also addresses the challenges of device heterogeneity, scalability, and the dynamic nature of IoT environments. Real-world applications include securing smart homes, industrial IoT deployments, and critical infrastructure, showcasing the importance of implementing effective cybersecurity measures to ensure the integrity and reliability of IoT systems. This thesis serves as a vital guide for researchers, developers, and cybersecurity professionals navigating the complex landscape of securing the Internet of Things.', 'P123456', 'Master', 'Sperimental', 'Knowledge of IoT security protocols and cybersecurity best practices.', 'None', '2024-05-31 23:59:59', 'DEGR02', 'CYBERSECURITY, INTERNET OF THINGS, NETWORK SECURITY', 0,1),
    ('Healthcare Data Analytics', 'The thesis, "Healthcare Data Analytics," delves into the transformative impact of data analytics in the healthcare domain. Investigating both theoretical foundations and practical applications, the research explores how advanced analytics techniques can extract valuable insights from vast and complex healthcare datasets. Key aspects include the utilization of data mining, machine learning algorithms, and statistical analysis to uncover patterns, trends, and correlations within medical data. The study addresses the challenges of handling diverse healthcare data sources, ensuring data privacy, and maintaining compliance with regulatory standards. Real-world applications encompass predictive analytics for disease diagnosis, patient outcome forecasting, and resource optimization within healthcare systems. The thesis highlights the potential for data analytics to enhance clinical decision-making, improve patient outcomes, and streamline healthcare operations. This comprehensive guide serves as a valuable resource for healthcare professionals, researchers, and data scientists seeking to harness the power of data analytics to drive innovation and improvements in the healthcare industry.', 'P654321', 'Master', 'Company', 'Proficiency in data analytics and understanding of healthcare systems.', 'The thesis must comply with privacy regulations.', '2023-12-01 23:59:59', 'DEGR03', 'DATA ANALYTICS, HEALTHCARE, PRIVACY', 0,0),
	('Quantum Computing Algorithms', 'The thesis, "Quantum Computing Algorithms," explores the cutting-edge realm of quantum computing, investigating both theoretical frameworks and practical implementations of algorithms that harness the unique properties of quantum systems. The research delves into quantum parallelism, entanglement, and superposition to design algorithms that outperform classical counterparts in specific computational tasks. Key aspects include an examination of Shor\'s algorithm for factoring large numbers exponentially faster than classical algorithms, and Grover\'s algorithm for unstructured search problems, showcasing the potential for quantum speedup. The study addresses challenges such as quantum error correction, qubit coherence, and the development of quantum gates.Real-world applications span optimization problems, cryptography, and simulations of quantum systems. The thesis serves as a pivotal resource for researchers, mathematicians, and computer scientists navigating the complexities of quantum algorithms, contributing to the ongoing revolution in computing paradigms.', 'P123456', 'Master', 'Sperimental', 'Understanding of quantum computing principles and algorithms.', 'None', '2024-09-15 23:59:59', 'DEGR01', 'QUANTUM COMPUTING, ALGORITHMS, THEORETICAL PHYSICS', 0,0);
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
