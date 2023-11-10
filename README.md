# ThesisManagement 13

# Thesis Management API

## Endpoints

### 1. `POST /api/newApplication/:thesis_id`

- **Description**: Create a new application for a thesis.
- **Middleware**: `isStudent`
- **Request Parameters**:
  - `thesis_id` (integer): The ID of the thesis to apply for.
- **Request Body**:
  - None
- **Response**:
  - `200 OK` if the application is created successfully.
  - `500 Internal Server Error` if an unexpected error occurs.
- **Example**:
  ```json
  {
    "thesis_id": 1
  }
  ```

### 2. `POST /api/newFiles`

- **Description**: Upload files related to a thesis application.
- **Middleware**: `isStudent`
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

### 3. `GET /api/getAllFiles/:student_id`

- **Description**: Get a zip archive containing files uploaded by a student.
- **Middleware**: `isProfessor`
- **Request Parameters**
  - `student_id` (string): The ID of the student to retrieve files for.
- **Request Body**
  ```json
  []
  ```
- **Response**
  - `200 OK` with a zip archive containing the student's files.
  - `500 Internal Server Error` if an unexpected error occurs or there's an error reading files.


### 4. `GET /api/getStudentFilesList/:student_id`

- **Description**: Get the names of all the files uploaded by a specific student.
- **Middleware**: `isProfessor`
- **Request Parameters**
  - `student_id` (string): The ID of the student to retrieve files for.
- **Request Body**
  ```json
  []
  ```
- **Response**
  - `200 OK` The response contains a JSON array with the names of the student's files.
  - `500 Internal Server Error` if an unexpected error occurs or there's an error reading files.


### 5. `GET /api/getFile/:student_id/:file_name`

- **Description**: Get a specific file uploaded by a student.
- **Middleware**: `isProfessor`
- **Request Parameters**
  - `student_id` (string): The ID of the student to retrieve files for.
- **Request Body**
  ```json
  []
  ```
- **Response**
    - `200 OK`: The response contains the specific file for download.
    - `404 Not Found`: If the specified file is not found.
    - `500 Internal Server Error`: If an unexpected error occurs during the process.

