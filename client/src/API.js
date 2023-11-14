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

async function newProposal(thesis) {
  const response = await fetch(URL + "/newThesis", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thesis),
  });
  if (response.ok) {
    const newProposal = await response.json();
    return newProposal;
  } else if (response.status == "422") {
    const errors = await response.json();
    return errors.errors;
  } else {
    const error = await response.json();
    throw Error(error.error);
  }
}

async function getListExternalCosupervisors() {
  try {
    const response = await fetch(URL + "/listExternalCosupervisors", {
      method: "GET",
      credentials: "include",
    });
    const list = await response.json();
    if (response.ok) {
      return list;
    } else {
      const error = await response.json();
      throw Error(error.error);
      }
  } catch (err) {
    throw Error(err.error);
  }
}

async function newExternalCosupervisor(external_cosupervisor) {
  const response = await fetch(URL + "/newExternalCosupervisor", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(external_cosupervisor),
  });
  if (response.ok) {
    const newProposal = await response.json();
    return newProposal;
  } else if (response.status == "422") {
    const errors = await response.json();
    return errors.errors;
  } else {
    const error = await response.json();
    throw Error(error.error);
  }  
}

const API = { logIn, logOut, getUserInfo, newProposal, getListExternalCosupervisors, newExternalCosupervisor };

export default API;
