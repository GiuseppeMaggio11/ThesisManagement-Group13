# Thesis Management - Group 13

## Students

Alvandkoohi sajjad s314581 
Amat Carla s320836
Busnelli Matteo s317090
Campagnale Paolo s317687
Corrias Jacopo s310381
Fissore Manuel 319980
Maggio Giuseppe 313346

## Contents

- [React Client Application Routes](#react-client-application-routes)
- [Docker Compose](#docker-compose)
- [API Server](#api-server)
    + [Authentication Server](#authentication-server)
        * [Login Server](#login-server)
        * [Check if user is logged in Server](#check-if-user-is-logged-in-server)
        * [Logout Server](#logout-server)
    + [Other APIs Server](#other-apis-server)
        * [OTHER 1 Server](#other-1-server)
        * [OTHER 2 Server](#other-2-server)
        * [OTHER 3 Server](#other-3-server)
- [API Client](#api-client)
    + [Authentication Client](#authentication-client)
        * [Login Client](#login-client)
        * [Check if user is logged in Client](#check-if-user-is-logged-in-client)
        * [Logout Client](#logout-client)
    + [Other APIs](#other-apis-client)
        * [getThesisProposals](#getThesisProposals)
        * [OTHER 2 Client](#other-2-client)
        * [OTHER 3 Client](#other-3-client)
- [Database Tables](#database-tables)
- [Main React Components](#main-react-components)
- [Users Credentials](#user-credentials)



## React Client Application Routes

- Route `/`: Initial route. Unauthenticated users will not see anything in it.
Authenticated users will see buttons to access the various routes
- Route `/login`: Route containing the login form
- Route `/proposals`: Route containing the list of all thesis proposals relating to the degree of the logged-in student. It is accessible only to authenticated users and shows only basic information (title, supervisor and expiration date).
It is possible to filter thesis proposals based on the content of a text field form
- Route `/teacher`: Route only accessible to authenticated professors containing a button to create a new thesis proposal.
- Route `/newproposal`: Route only accessible to authenticated professors. It allows them to create a new thesis proposal by filling all its informations (title, description, supervisor, co-supervisors, level, keywords, type, group, required knowledge, notes, expiration date, degree and if it's archived).

## Docker Compose

### How to run the application via Docker Compose **as a developper** ?

First, modify in the server/dao.js file the dbConfig host from "127.0.0.1" to "database" : 

```
  host: "database",
```

Finally, run this command at the root of the project : 

```
docker compose up -d --build
```

Your app is accessible on this URL `http://localhost:5173/` !

### How to run the application via Docker Compose as a regular user ?

First, download the docker-compose.yml of our project. 

Then, open a terminal in the same directory and run this command : 

```
docker compose up -d --build
```


Once you see that the 3 containers started, you can access the app via this URL `http://localhost:5173/` on your browser !

### How to stop the application ?

Run in the same terminal the following command : 

```
docker compose down
```

## API Server

### Authentication Server

#### Login Server

#### Check if user is logged in Server

#### Logout Server

#### 1. **New application**: `POST /api/newApplication/:thesis_id`

  - **Description**: Create a new application for a thesis.
  - **Middleware**: `isStudent`
  - **Request Parameters**:
    - `thesis_id` (integer): The ID of the thesis to apply for.
  - **Request Body**:
    - `date` (string): The date associated with the application.
  - **Response**:
    - `200 OK` if the application is created successfully.
    - `422 Unprocessable Entity` if the thesis is not valid or the user has already applied for it.
    - `500 Internal Server Error` if an unexpected error occurs.
  - **Example**:
    ```json
    {
      "date": "2023-11-15T11:05Z"
    }
    ```

#### 2. **Upload files**: `POST /api/newFiles/:thesis_id`

  - **Description**: Upload files related to a thesis application.
  - **Middleware**: `isStudent`
  - **Request Parameters**:
  - `Thesis_id` (integer): The ID of the thesis to upload the file for.
  - **Request Body**:
    - Form Data: `file` (array of files, up to 10 files allowed).
  - **Response**:
    - `200 OK` if files are uploaded correctly.
    - `500 Internal Server Error` if an unexpected error occurs or there's a multer error during file upload.
  - **Example**:
    ```json
    [
      {
        "file": "file1.pdf"
      },
      {
        "file": "file2.pdf"
      }
    ]
    ```

#### 3. **New thesis**: `POST /api/newThesis`

  - **Description**: Creates a new thesis and related int/external cosupervisors
  - **Middleware**: `isProfessor`
  - **Request Body**:
    - `title` (string): The title of the thesis that is created,
    - `description` (string): The description of the thesis that is created,
    - `supervisor_id` (string): The supervisor ID of the thesis that is created,
    - `thesis_level` (string): The level of the thesis that is created,
    - `type_name` (string): The type of the thesis that is created,
    - `required_knowledge` (string): The required knowledge of the thesis that is created,
    - `notes` (string): Notes about the thesis that is created,
    - `expiration` (date): The expiration date of the thesis that is created,
    - `cod_degree` (string): The degree of the thesis that is created,
    - `is_archived` (boolean): If the thesis that is created is archived,
    - `keywords` (string): The keywords of the thesis that is created,
    - `internal_cosupervisiors` (array): The internal co-supervisors of the thesis that is created,
    - `external_cosupervisiors` (array): The external co-supervisors of the thesis that is created
  - **Response**:
    - thesis body if all the fields are correct
    - `422 Unprocessable Entity` if some inputs are wrong
    - `400`if data is incorrect
  - **Example**:
    ```json
    {   
      "title": "Test ERROR2",
      "description": "Test description",
      "supervisor_id":"P123456",
      "thesis_level": "Bachelor",
      "type_name": "Test type_name2",
      "required_knowledge": " Test required_knowledge",
      "notes": " test noted",
      "expiration": "2024-12-31 23:59:59",
      "cod_degree": "DEGR01",
      "is_archived": 0,
      "keywords" : "IoT, Genetica",
      "cod_group" : "GRP01",
      "cosupervisors_external": ["antonio.bruno@email.org"],
      "cosupervisors_internal": ["P123456"]  
    }
    ```

#### 4. **External co-supevisors list**: `GET /api/listExternalCosupervisors`

  - **Description**: Returns list of every external cosupervisors
  - **Middleware**: `isProfessor`
  - **Response**:
    - array of external co-supervisors
    - `500 Internal Server Error` if an unexpected error occurs
  - **Example**:
    ```json
    [
    {   
      "email": "testmai22222222l@mail.org",
      "name":"testname",
      "surname":"testsurname"
    }
    ]
    ```

#### 5. **New external co-supevisors**: `POST /api/newExternalCosupervisor`

  - **Description**: Creates new external cosupervisor 
  - **Middleware**: `isProfessor`
  - **Request Body**:
    - `email` (string): The email of the external co-supervisor that is created,
    - `surname` (string): The surname of the external co-supervisor that is created
    - `name` (string): The name of the external co-supervisor that is created,
  - **Response**:
    - new external co-supervisor body
    - `422 Unprocessable Entity` if some inputs are wrong
    - `400`if data is incorrect
  - **Example**:
    ```json
    [
    {   
      "email": "testmai22222222l@mail.org",
      "name":"testname",
      "surname":"testsurname"
    }
    ]
    ```

#### 6. **Update archivation of proposal**: `PUT /api/updateThesesArchivation`

  - **Description**: Updates archivation status of thesis proposal based on new virtualclock time
  - **Middleware**: 
  - **Request Body**:
    - `datetime` (string): The new virtual clock time
  - **Response**:
    - String with info on number of updated rows
    - `500 Internal Server Error` if an unexpected error occurs
  - **Example**:
    ```json
      {   
          "datetime": "2026-01-21T10:00:26.145Z"
      }
    ```
#### 7. **New external co-supevisors**: `POST /api/updateApplicationStatus`

  - **Description**: Updates status of application
  - **Middleware**: `isProfessor`
  - **Request Body**:
    - `thesis_id` (string): The id of the thesis the application refers to,
    - `student_id` (string): The id of the student of the application,
    - `status` (string): The new status of the application ,
  - **Response**:
    - Some application information
    - `400` if data is incorrect
  - **Example**:
    ```json
      {
        "student_id": "S123456",
        "thesis_id": 3,
        "status": "Accepted"
      }
    ```

#### **Update a thesis proposal**: `PUT /api/updateThesis`

  - **Description**: Updates an existing thesis including its group, internal cosupervisors and external cosupervisors
  - **Middleware**: `isProfessor`
  - **Request Body**:
    - `thesis_id` (unsigned non-zero integer): The id of the thesis,
    - `title` (string): The new title of the thesis,
    - `description` (string): The new description of the thesis,
    - `supervisor_id` (string): The new supervisor ID of the thesis,
    - `thesis_level` (string): The new level of the thesis,
    - `type_name` (string): The new type of the thesis,
    - `required_knowledge` (string): The new required knowledge of the thesis,
    - `notes` (string): The new notes about the thesis,
    - `expiration` (date): The new expiration date of the thesis,
    - `cod_degree` (string): The new degree of the thesis,
    - `is_archived` (boolean): If the updated thesis is archived,
    - `keywords` (string): The new keywords of the thesis,
    - `cosupervisors_internal` (array): The new internal co-supervisors of the thesis,
    - `cosupervisors_external` (array): The new external co-supervisors of the thesis
    - `cod_group` (string): The new code group of the thesis
  - **Response**:
    - In case of success, the api returns all the fields of the updated thesis as memorized inside the database
    ```
    {
      "thesis_id": n (unsigned non-zero integer),
      "title": "new title",
      "description": "new description",
      "supervisor_id": "new supervisor_id",
      "thesis_level": "new thesis_level",
      "type_name": "new type_name",
      "required_knowledge": "new required_knowledge",
      "notes": "new notes",
      "expiration": "new expiration as string in the format YYYY-MM-DDThh:mm:ss.sssZ",
      "cod_degree": "new cod_degree",
      "is_archived": new_is_archived (boolean),
      "keywords": "new keywords"
    }
    ```
    - `422` if some inputs are wrong
    - `400` if data is incorrect
    - `500` if inside the group_table there was more than one entry with thesis_id equal to the one passed inside the request body
    - `503` if a database error occurres 
  - **Example**:
    ```json
    {   
      "thesis_id": 1,
      "title": "new title",
      "description": "new description",
      "supervisor_id" : "P654321",
      "thesis_level": "Bachelor",
      "type_name": "new type_name",
      "required_knowledge": "new required_knowledge",
      "notes": "new notes",
      "expiration": "2050-01-01T00:00:00.000Z",
      "cod_degree": "DEGR02",
      "is_archived": false,
      "keywords": "k1, k2",
      "cosupervisors_internal": ["P123456"],
      "cosupervisors_external": ["elena.conti@email.net"],
      "cod_group": "GRP02"
    } 
    ```

#### **Update a thesis proposal**: `PUT /api/updateThesis`

  - **Description**: Updates an existing thesis including its group, internal cosupervisors and external cosupervisors
  - **Middleware**: `isProfessor`
  - **Request Body**:
    - `thesis_id` (unsigned non-zero integer): The id of the thesis,
    - `title` (string): The new title of the thesis,
    - `description` (string): The new description of the thesis,
    - `supervisor_id` (string): The new supervisor ID of the thesis,
    - `thesis_level` (string): The new level of the thesis,
    - `type_name` (string): The new type of the thesis,
    - `required_knowledge` (string): The new required knowledge of the thesis,
    - `notes` (string): The new notes about the thesis,
    - `expiration` (date): The new expiration date of the thesis,
    - `cod_degree` (string): The new degree of the thesis,
    - `is_archived` (boolean): If the updated thesis is archived,
    - `keywords` (string): The new keywords of the thesis,
    - `cosupervisors_internal` (array): The new internal co-supervisors of the thesis,
    - `cosupervisors_external` (array): The new external co-supervisors of the thesis
    - `cod_group` (string): The new code group of the thesis
  - **Response**:
    - In case of success, the api returns all the fields of the updated thesis as memorized inside the database
    ```
    {
      "thesis_id": n (unsigned non-zero integer),
      "title": "new title",
      "description": "new description",
      "supervisor_id": "new supervisor_id",
      "thesis_level": "new thesis_level",
      "type_name": "new type_name",
      "required_knowledge": "new required_knowledge",
      "notes": "new notes",
      "expiration": "new expiration as string in the format YYYY-MM-DDThh:mm:ss.sssZ",
      "cod_degree": "new cod_degree",
      "is_archived": new_is_archived (boolean),
      "keywords": "new keywords"
    }
    ```
    - `422` if some inputs are wrong
    - `400` if data is incorrect
    - `500` if inside the group_table there was more than one entry with thesis_id equal to the one passed inside the request body
    - `503` if a database error occurres 
  - **Example**:
    ```json
    {   
      "thesis_id": 1,
      "title": "new title",
      "description": "new description",
      "supervisor_id" : "P654321",
      "thesis_level": "Bachelor",
      "type_name": "new type_name",
      "required_knowledge": "new required_knowledge",
      "notes": "new notes",
      "expiration": "2050-01-01T00:00:00.000Z",
      "cod_degree": "DEGR02",
      "is_archived": false,
      "keywords": "k1, k2",
      "cosupervisors_internal": ["P123456"],
      "cosupervisors_external": ["elena.conti@email.net"],
      "cod_group": "GRP02"
    } 
    ```

#### 8. **Download all student's application files**: `GET /api/getAllFiles/:student_id/:thesis_id`

  - **Description**: Download all files associated with an application 
  - **Middleware**: `isProfessor`
  - **Request Body**: None,
  - **Response**:
    - `200` with a zip folder inside res.download containing all the files of the application
    - `500` if an unexpected error occurs

#### 9. **Download a single student's application file**: `GET /api/getFile/:student_id/:thesis_id/:file_name`

  - **Description**: Download a single file associated with an application 
  - **Middleware**: `isProfessor`
  - **Request Body**: None,
  - **Response**:
    - `200` with a pdf file inside res.download 
    - `500` if an unexpected error occurs

#### 10. **Show the list of all files related to an application**: `GET /api/getStudentFilesList/:student_id/:thesis_id`

  - **Description**: Get the list of the names of all the PDF files linked to an application 
  - **Middleware**: `isProfessor`
  - **Request Body**: None,
  - **Response**:
    - `200` with a list of strings representing files' name 
    - `500` if an unexpected error occurs

#### OTHER 1 Server

#### OTHER 2 Server

#### OTHER 3 Server



## API Client

### Authentication Client

#### Login Client

#### Check if user is logged in Client

#### Logout Client

### Other APIs Client

#### getThesisProposals

- Description: Asks the server for the list of all thesis proposals relating to the degree of the logged-in student
- API server called: GET `/api/proposals`
- Input: _None_
- Output: A vector containing detailed information on all thesis proposals

```
[
    {
        id: id,
        title: "title",
        description: "description",
        supervisor: "supervisor",
        level: "level",
        type: "type",
        required_knowledge: "required_knowledge",
        notes: "notes",
        expiration: expiration,
        keywords: [
            "keyword 1",
            "keyword 2",
            "keyword 3",
            ...
        ],
        group: "group",
        department: "department",
        co_supervisors: [
            "co supervisor 1",
            "co supervisor 2",
            "co supervisor 3",
            "co supervisor 4",
            ...
        ]
    },
    {
        ...
    },
    ...
]
```

#### newProposal

- Description: Asks the server to create a new thesis proposal
- API server called: POST `/api/newProposal`
- Input: thesis object
- Output: inserted thesis object or errors

```
{   
    "title": "Test ERROR2",
    "description": "Test description",
    "supervisor_id":"P123456",
    "thesis_level": "Bachelor",
    "type_name": "Test type_name2",
    "required_knowledge": " Test required_knowledge",
    "notes": " test noted",
    "expiration": "2024-12-31 23:59:59",
    "cod_degree": "DEGR01",
    "is_archived": 0,
    "keywords" : "IoT, Genetica",
    "cod_group" : "GRP01",
    "cosupervisors_external": ["antonio.bruno@email.org"],
    "cosupervisors_internal": ["P123456"]
    
}
```

#### getListExternalCosupervisors

- Description: Asks the server for the list of all the external co-supervisors
- API server called: GET `/api/listExternalCosupervisors`
- Input: _None_
- Output: A vector containing detailed information on all external co-supervisors

```
[
{   
    "email": "testmai22222222l@mail.org",
    "name":"testname",
    "surname":"testsurname"
    
}
]
```

#### newExternalCosupervisor

- Description: Asks the server to create a new external co-supervisors
- API server called: POST `/api/newExternalCosupervisor`
- Input: external co-supervisor object
- Output: inserted external co-supervisor object

```
{   
    "email": "testmai22222222l@mail.org",
    "name":"testname",
    "surname":"testsurname"
    
}
```
#### updateExpiration

- Description: Asks the server to update archivation of proposals based on new virtual clock time
- API server called: PUT `/api/updateThesesArchivation`
- Input: datetime string
- Output: information on update

```
"Rows matched: 6  Changed: 3  Warnings: 0"
```

#### downloadStudentApplicationAllFiles

- Description: Asks the server to download a zip folder containing all the files associated with an application
- API server called:  GET `/api/getAllFiles/:student_id/:thesis_id`
- Input: 
  + `student_id`: The id of the student who submitted the application 
  + `thesis_id`: The id of the thesis for which the student submitted the application.
- Output: _None_

#### downloadStudentApplicationFile

- Description: Asks the server to download one of the PDF files associated with an application
- API server called:  GET `/api/getFile/:student_id/:thesis_id/:file_name`
- Input: 
  + `student_id`: The id of the student who submitted the application 
  + `thesis_id`: The id of the thesis for which the student submitted the application.
  + `file_name`: The name of the file to be downloaded
- Output: _None_

#### listApplicationFiles

- Description: Asks the server for the list of files' name associated with an application
- API server called:  GET `/api/getStudentFilesList/:student_id/:thesis_id`
- Input: 
  + `student_id`: The id of the student who submitted the application 
  + `thesis_id`: The id of the thesis for which the student submitted the application.
- Output: A vector of strings, each representing the name of one of the files associated with the application
- Example:
```json
[
  "file_1.pdf",
  "file_2.pdf",
  "file_3.pdf",
  ...
]
```

#### OTHER 2 Client

#### OTHER 3 Client



## Database Tables



## Main React Components

- `SearchProposalComponent` (inside `SearchProposal.jsx`): It's a component that appears in the `/proposals` route.
Starting from the list of thesis proposals obtained from the server, it builds a filtered list. The filter is a string that can be set in a special form on the same page. If the filtered list is empty, it shows a message, otherwise it builds a table containing a row for each thesis proposal. The table rows are constructed using the `ProposalTableRow` component present in the same file and contain only the basic information of a thesis proposals (title, supervisor and expiration date). To access all the data of a specific thesis proposal, the user needs to click on its title. If the device screen is very small, the list is replaced by an accordion. Each accordion item is buildt using the `ProposalAccordion` component and has the title of a proposal in the header and supervisor and expiration date in the body.
- `NewProposal` (inside `NewProposal.jsx`): It's a component that appears in the `/newproposal` route, only accessible by authenticated professors. It's a form component that handles the creation of a new thesis proposal. The user has to enter a few mandatory fields which are : title, supervisor_id, type, level, group, degree, expiration. The others are optional. In order to choose external co-supervisors the user can select one or more existing ones, or add a new one by clicking on the corresponding button and fill the form in the `NewExternalCosupervisor.jsx` component. The errors returned by the server are displayed at the bottom of the form when the user clicks on the create button. The internal co-supervisors and keywords inputs are handled by the `ChipsInput.jsx`component. The user has to enter them one by one by pressing enter each time.
- `TeacherPage` (inside `TeacherPage.jsx`): It's a component that appears in the `/teacher` route, only accessible by authenticated professors. It contains a button redirecting to the `NewProposal`component.

## Users Credentials
