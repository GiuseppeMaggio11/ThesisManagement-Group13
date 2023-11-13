"use strict";

const URL = "http://localhost:3001/api";

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
                  supervisor: element.surname.concat(" ", element.name), 
                  level: element.thesis_level, 
                  type: element.thesis_type, 
                  required_knowledge: element.required_knowledge, 
                  notes: element.notes,
                  expiration: element.expiration,
                  keywords: element.keywords,
                  groups: element.group_name,
                  department: element.department_name,
                  cosupervisors: element.cosupervisor
              })
          )
  }
  else {
      throw proposals;
  }
}

const API = { logIn, logOut, getUserInfo, getThesisProposals };
export default API;
