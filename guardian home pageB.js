import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSetting = {
    databaseURL: "https://nest-hostel-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const studentsRef = ref(database, "Students");
const guardiansRef = ref(database, "Guardians");
const permissionsRef = ref(database, "Permissions");

let studentsArray = [];
let guardiansArray = [];
let permissionsArray = [];
let permissionDetails = {};

// Fetch initial data and display permissions
onValue(permissionsRef, (snapshot) => {
    if (snapshot.exists()) {
        permissionsArray = Object.entries(snapshot.val());
        
    }
});

onValue(studentsRef, (snapshot) => {
    if (snapshot.exists()) {
        studentsArray = Object.entries(snapshot.val());
    }
});

onValue(guardiansRef, (snapshot) => {
    if (snapshot.exists()) {
        guardiansArray = Object.entries(snapshot.val());
    }
});

const Oid = sessionStorage.getItem("Oid");
let indicator = document.getElementById("indicator")

class Permission {
    constructor(permissionDetails, status) {
        this.permissionDetails = permissionDetails;
        this.status = status;
    }
}

function formatDateToYYYYMMDD(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function guardianProfile(Oid) {
    let gdisplay = {};
    for (let [objectId, guardian] of guardiansArray) {
        if (Oid === objectId) {
            gdisplay = {
                name: `Name: ${guardian.gname}`,
                sphno: `Student Phone: ${guardian.sphno}`,
                gphno: `Guardian Phone: ${guardian.gphno}`
            };
            addRowsToTable("#Tbodyg", gdisplay);
            break;
        }
    }
}

function searchStudent() {
    for (let [objectId, guardian] of guardiansArray) {
        if (Oid === objectId) {
            return guardian.sid;
        }
    }
    console.error("searchStudent Error");
    return null;
}

function studentProfile() {
    let SID = searchStudent();
    if (!SID) return;

    let display = {};
    for (let [objectId, student] of studentsArray) {
        if (SID === student.sid) {
            display = {
                name: `Name: ${student.sname}`,
                sid: `Student ID: ${student.sid}`,
                gname: `Guardian: ${student.gname}`,
                sphno: `Student Phone: ${student.sphno}`,
                gphno: `Guardian Phone: ${student.gphno}`,
                broom: `Bedroom: ${student.broom}`,
                groom: `General Room: ${student.groom}`
            };
            addRowsToTable("#Tbody", display);
            break;
        }
    }
}

function addRowsToTable(tableSelector, display) {
    let tableBody = document.querySelector(tableSelector);
    tableBody.innerHTML = "";
    for (let key in display) {
        let row = createRow(display[key]);
        tableBody.appendChild(row);
    }
}

function createRow(content) {
    let newRow = document.createElement("tr");
    let cell = document.createElement("td");
    cell.textContent = content;
    newRow.appendChild(cell);
    return newRow;
}

let status = "NOT ACCEPTED";

function requestPermission() {
    let SID = searchStudent();
    let currentDate = new Date();
    let formattedDate = formatDateToYYYYMMDD(currentDate);
    let reason = document.getElementById("reasonIn").value;
    let date = document.getElementById("dateIn").value;
    let sname;
    for (let [objectId, student] of studentsArray) {
        if (SID === student.sid) {
            sname = student.sname
        }
    }
    if (!reason || !date) {
        console.error("Enter details");
        indicator.textContent = "Enter details"
        return;
    }

    if (date <= formattedDate) {
        console.error("Enter a proper date");
        indicator.textContent = "Enter a valid date"
        return;
    }

    let sid = searchStudent();
    if (!sid) return;

    let permissionId = getRandomNumber();
    permissionDetails = {
        Reason: reason,
        Date: date,
        StudentID: sid,
        PermissionId: permissionId,
        Sname: sname

    };

    let newPermission = new Permission(permissionDetails, status);
    push(permissionsRef, newPermission);
    console.log("Request sent successfully");
    indicator.textContent = "Request sent successfully"
}

function getRandomNumber() {
    return String(Math.floor(Math.random() * 100000)).padStart(5, '0');
}

function checkPreviousPermission() {
    let SID = searchStudent();
    if (!SID) return;

    let permissionFound = false;
    for (let [objectId, permission] of permissionsArray) {
        if (SID === permission.permissionDetails.StudentID) {
            permissionFound = true;
            if (permission.status === "NOT ACCEPTED") {
                console.error("Already a permission requested, waiting for warden response.");
                indicator.textContent = "Already a permission requested, waiting for warden response."
                return;
            }
        }
    }
    if (!permissionFound) {
        requestPermission();
    }
}

function displayPermissions() {
    let SID = searchStudent();
    if (!SID) return;

    let tableBody = document.querySelector("#Tbodyp");
    tableBody.innerHTML = ""; // Clear previous content

    for (let [objectId, permission] of permissionsArray) {
        if (SID === permission.permissionDetails.StudentID) {
            let newRow = document.createElement("tr");

            let permissionIdCell = document.createElement("td");
            permissionIdCell.textContent = permission.permissionDetails.PermissionId;
            newRow.appendChild(permissionIdCell);

            let reasonCell = document.createElement("td");
            reasonCell.textContent = permission.permissionDetails.Reason;
            newRow.appendChild(reasonCell);

            let dateCell = document.createElement("td");
            dateCell.textContent = permission.permissionDetails.Date;
            newRow.appendChild(dateCell);

            let statusCell = document.createElement("td");
            statusCell.textContent = permission.status;
            newRow.appendChild(statusCell);

            tableBody.appendChild(newRow);
        }
    }
}

// Event listeners for various actions
document.getElementById("studentProfile").addEventListener('click', studentProfile);
document.getElementById("guardianProfile").addEventListener('click', () => guardianProfile(Oid));
document.getElementById("sendRequest").addEventListener('click', checkPreviousPermission);
document.getElementById("requestPermission").addEventListener('click', displayPermissions)
