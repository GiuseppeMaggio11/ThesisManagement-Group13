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
  try {
    const response = await fetch(URL + "/newThesis", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thesis),
    });
    const newProposal = await response.json();
    if (response.ok) {
      return newProposal;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err.message, { cause: err });
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
      const message = await response.text();
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
}

async function newExternalCosupervisor(external_cosupervisor) {
  try {
    const response = await fetch(URL + "/newExternalCosupervisor", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(external_cosupervisor),
    });
    const newExternalCosupervisor = await response.json();
    if (response.ok) {
      return newExternalCosupervisor;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
}

const API = { logIn, logOut, getUserInfo, newProposal, getListExternalCosupervisors, newExternalCosupervisor };

export default API;
