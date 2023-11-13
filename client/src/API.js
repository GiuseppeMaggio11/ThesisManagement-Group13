"use strict";

const URL = "http://localhost:3001/api";

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}

async function logIn(credentials) {
  let response = await fetch(URL + "/session/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL + "/session/logout", {
    method: "DELETE",
    credentials: "include",
  });
}

async function getUserInfo() {
  const response = await fetch(URL + "/session/userinfo", {
    credentials: "include",
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;
  }
}

async function applicationThesis (thesis_id) {
  return getJson( fetch(URL + `/newApplication/${thesis_id}`, {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    credentials: "include"
  })
  )
}

async function getThesisProposals () {
  const response = await fetch(URL + "/proposals", {
    credentials: "include",
  });
  const proposals = await response.json();
  if (response.ok) {
      return proposals.map ( 
          (element) => (
              {
                  id: element.id, 
                  title: element.title, 
                  description: element.description,
                  supervisor: element.supervisor, 
                  level: element.level, 
                  type: element.type, 
                  required_knowledge: element.required_knowledge, 
                  notes: element.notes,
                  expiration: element.expiration ? dayjs(element.expiration) : "",
                  keywords: element.keywords,
                  group: element.group,
                  department: element.department,
                  co_supervisors: element.co_supervisors
              })
          )
  }
  else {
      throw proposals;
  }
}

async function getThesisProposalsById (thesisId) {
    const response = await fetch(URL + `/proposal/${thesisId}`, {
    credentials: "include",
  });
  const proposal = await response.json();
  if (response.ok) {
      return proposal;
  }
  else {
      throw proposals;
  }
}

const API = { logIn, logOut, getUserInfo, getThesisProposals, applicationThesis, getThesisProposalsById};
export default API;
