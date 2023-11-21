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
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response" }))

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
        reject({ error: "Cannot communicate" })
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

async function newProposal(thesis) {
  return getJson(fetch(URL + "/newThesis", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thesis),
  })
  )
}

async function getListExternalCosupervisors() {
  return getJson(fetch(URL + `/listExternalCosupervisors`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include"
  })
  )
}

async function newExternalCosupervisor(external_cosupervisor) {
  return getJson(fetch(URL + `/newExternalCosupervisor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(external_cosupervisor),
    credentials: "include"
  })
  )
}

async function applicationThesis(thesis_id, date) {
  return getJson(fetch(URL + `/newApplication/${thesis_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: date
    }),
    credentials: "include"
  })
  )
}

async function sendFiles(formData, thesis_id) {
  try {
    const uploadURL = `${URL}/newFiles/${thesis_id}`;

    const response = await fetch(uploadURL, {
      method: 'POST',
      body: formData, // FormData object containing the files
      credentials: 'include',
    });

    return await getJson(response);
  } catch (error) {
    return { error: 'Cannot communicate' };
  }
}


async function getThesisProposals(date) {
  const response = await fetch(URL + `/proposals?${JSON.stringify(date)}`, {
    credentials: "include",
  });
  const proposals = await response.json();
  if (response.ok) {
    return proposals.map(
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

async function getThesisProposalsById(thesisId) {
  const response = await fetch(URL + `/proposal/${thesisId}`, {
    credentials: "include",
  });
  const proposal = await response.json();
  if (response.ok) {
    return proposal;
  }
  else {
    throw proposal;
  }
}

const API = { logIn, logOut, getUserInfo, getThesisProposals, applicationThesis, getThesisProposalsById, sendFiles, newProposal, getListExternalCosupervisors, newExternalCosupervisor };

export default API;
