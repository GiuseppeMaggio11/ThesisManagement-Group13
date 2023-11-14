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


## API Server

### Authentication Server

#### Login Server

#### Check if user is logged in Server

#### Logout Server

### Other APIs Server

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

#### OTHER 2 Client

#### OTHER 3 Client



## Database Tables



## Main React Components

- `SearchProposalComponent` (inside `SearchProposal.jsx`): It's a component that appears in the `/proposals` route.
Starting from the list of thesis proposals obtained from the server, it builds a filtered list. The filter is a string that can be set in a special form on the same page. If the filtered list is empty, it shows a message, otherwise it builds a table containing a row for each thesis proposal. The table rows are constructed using the `ProposalTableRow` component present in the same file and contain only the basic information of a thesis proposals (title, supervisor and expiration date). To access all the data of a specific thesis proposal, the user needs to click on its title. If the device screen is very small, the list is replaced by an accordion. Each accordion item is buildt using the `ProposalAccordion` component and has the title of a proposal in the header and supervisor and expiration date in the body.

## Users Credentials
