"use strict";
const URL = "http://localhost:3001/api";
const URL_LOGIN = "http://localhost:3001";

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyzing the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}

async function logOut() {
  await fetch(URL_LOGIN + "/logout", {
    method: "POST",
    credentials: "include",
  });
}

const redirectToLogin = () => {
  window.location.replace(URL_LOGIN + "/login");
};

async function getUserInfo() {
  const response = await fetch(URL_LOGIN + "/whoami", {
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
  return getJson(
    fetch(URL + "/newThesis", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thesis),
    })
  );
}

async function getListExternalCosupervisors() {
  return getJson(
    fetch(URL + `/listExternalCosupervisors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  );
}

async function getTeachers() {
  return getJson(
    fetch(URL + `/teachers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  );
}
async function getDegrees() {
  return getJson(
    fetch(URL + `/degrees`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  );
}

async function getGrops() {
  return getJson(
    fetch(URL + `/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  );
}


async function newExternalCosupervisor(external_cosupervisor) {
  return getJson(
    fetch(URL + `/newExternalCosupervisor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(external_cosupervisor),
      credentials: "include",
    })
  );
}

async function applicationThesis(thesis_id, date) {
  return getJson(
    fetch(URL + `/newApplication/${thesis_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
      }),
      credentials: "include",
    })
  );
}

async function sendFiles(formData, thesis_id) {
  try {
    const uploadURL = `${URL}/newFiles/${thesis_id}`;

    const response = await fetch(uploadURL, {
      method: "POST",
      body: formData, // FormData object containing the files
      credentials: "include",
    });

    return await getJson(response);
  } catch (error) {
    return { error: "Cannot communicate" };
  }
}

async function getThesisProposals(date) {
  const response = await fetch(URL + `/proposals?date=${date}`, {
    credentials: "include",
  });
  const proposals = await response.json();
  if (response.ok && proposals.length>0) {
    return proposals.map((element) => ({
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
      cosupervisors: element.cosupervisors,
    }));
  } else {
    throw [];
  }
}

async function getThesisProposalsById(thesisId) {
  const response = await fetch(URL + `/proposal/${thesisId}`, {
    credentials: "include",
  });
  const proposal = await response.json();
  if (response.ok) {
    return proposal;
  } else {
    throw proposal;
  }
}

async function updateExpiration(virtualTime) {
  const response = await fetch(URL + "/updateThesesArchivation", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      datetime: virtualTime,
    }),
  });
  if (response.ok) {
    const msg = await response.json();
    return msg;
  } else if (response.status == "422") {
    const errors = await response.json();
    return errors.errors;
  } else {
    const error = await response.json();
    throw Error(error.error);
  }
}
async function getPendingApplications() {
  return getJson(
    fetch(`${URL}/getApplications`, {
      credentials: "include",
    })
  );
}

async function updateApplictionStatus(thesis_id, student_id, status) {
  return getJson(
    fetch(URL + `/updateApplicationStatus`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thesis_id,
        student_id,
        status,
      }),
    })
  );
}
async function getStudentApplications() {
  return getJson(
    fetch(`${URL}/student/applications`, {
      credentials: "include",
    })
  );
}

async function isApplied() {
  return getJson(
    fetch(`${URL}/isApplied`, {
      credentials: "include",
    })
  );
}



const API = {
  logOut,
  getUserInfo,
  getThesisProposals,
  applicationThesis,
  getThesisProposalsById,
  sendFiles,
  newProposal,
  getListExternalCosupervisors,
  newExternalCosupervisor,
  updateExpiration,
  getPendingApplications,
  updateApplictionStatus,
  redirectToLogin,
  getStudentApplications,
  isApplied,
  getTeachers,
};
export default API;
