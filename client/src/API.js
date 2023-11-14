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

async function applicationThesis (thesis_id, date) {
 const response = await fetch(URL + `/newApplication/${thesis_id}`, {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: date
      }),
    credentials: "include"
  });

  if(response.ok){
    return ;
  } else {
    throw  response.errDetail;
  } 
}

async function sendFiles (formData) {
  const response = await fetch(URL + `/newFiles`, formData, {
    method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    credentials: "include"
  });

  if(response.ok){
    return ;
  } else {
    throw  response.errDetail;
  }
}

const API = { logIn, logOut, getUserInfo, applicationThesis, sendFiles};
export default API;
