import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, push, set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

// Fetch initial data and display permissions

onValue(permissionsRef, (snapshot) => {
    if (snapshot.exists()) {
        permissionsArray = Object.entries(snapshot.val());
        updatePendingPermissionsTable();
        updateAcceptedPermissionsTable();
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

let loginStatus = sessionStorage.getItem("loggedIn");
console.log(loginStatus);

function updatePendingPermissionsTable() {
    let tableBody = document.querySelector("#pendingPermissionsTbody");
    tableBody.innerHTML = ""; // Clear previous content

   
    for (let [objectId, permission] of permissionsArray) {
        if(permission.status == "NOT ACCEPTED"){
            let newRow = document.createElement("tr");
            let nameCell = document.createElement("td");
            nameCell.textContent = permission.permissionDetails.Sname;
            newRow.appendChild(nameCell);
            
            let studentIdCell = document.createElement("td");
            studentIdCell.textContent = permission.permissionDetails.StudentID;
            newRow.appendChild(studentIdCell);
            
            let dateCell = document.createElement("td");
            dateCell.textContent = permission.permissionDetails.Date;
            newRow.appendChild(dateCell);
            
            let reasonCell = document.createElement("td");
            reasonCell.textContent = permission.permissionDetails.Reason;
            newRow.appendChild(reasonCell);
    
            let permissionIdCell = document.createElement("td");
            permissionIdCell.textContent = permission.permissionDetails.PermissionId;
            newRow.appendChild(permissionIdCell);
    
            let statusCell = document.createElement("td");
            statusCell.textContent = permission.status;
            newRow.appendChild(statusCell);
    
            tableBody.appendChild(newRow);
        }
    }
}
function updateAcceptedPermissionsTable() {
    let tableBody = document.querySelector("#acceptedPermissionsTbody");
    tableBody.innerHTML = ""; // Clear previous content

   
    for (let [objectId, permission] of permissionsArray) {
        if(permission.status == "ACCEPTED"){
            let newRow = document.createElement("tr");
            let nameCell = document.createElement("td");
            nameCell.textContent = permission.permissionDetails.Sname;
            newRow.appendChild(nameCell);
            
            let studentIdCell = document.createElement("td");
            studentIdCell.textContent = permission.permissionDetails.StudentID;
            newRow.appendChild(studentIdCell);
            
            let dateCell = document.createElement("td");
            dateCell.textContent = permission.permissionDetails.Date;
            newRow.appendChild(dateCell);
            
            let reasonCell = document.createElement("td");
            reasonCell.textContent = permission.permissionDetails.Reason;
            newRow.appendChild(reasonCell);
    
            let permissionIdCell = document.createElement("td");
            permissionIdCell.textContent = permission.permissionDetails.PermissionId;
            newRow.appendChild(permissionIdCell);
    
            let statusCell = document.createElement("td");
            statusCell.textContent = permission.status;
            newRow.appendChild(statusCell);
    
            tableBody.appendChild(newRow);
        }
    }
}
// Function to check if the permission has already been accepted
function checkStatus(AcceptingPermissionId) {
    for (let [objectId, permission] of permissionsArray) {
        if (AcceptingPermissionId == permission.permissionDetails.PermissionId) {
            if (permission.status == "ACCEPTED") {
                console.log("checked");
                return true;
            }
            return false;
        }
    }
    return false;
}

// Function to create the updated status object
function createUpdateStatus(permissionDetails) {
    return {
        permissionDetails: permissionDetails,
        status: "ACCEPTED"
    };
}

// Function to accept the permission
function AcceptPermission() {
    let AcceptingPermissionId = document.getElementById("acceptingPermissionId").value;
    let indicator1 = document.getElementById("indicator1");

    // Validate the PermissionId length
    if (AcceptingPermissionId.length != 5) {
        indicator1.textContent = "Enter a valid PermissionId";
    } else if (checkStatus(AcceptingPermissionId)) {
        // Check if the permission has already been accepted
        indicator1.textContent = `Permission already accepted Id(${AcceptingPermissionId})`;
    } else {
        // Find and update the permission status
        for (let [objectId, permission] of permissionsArray) {
            if (AcceptingPermissionId === permission.permissionDetails.PermissionId) {
                let permissionDetails = permission.permissionDetails;
                let toUstatus = ref(database, `Permissions/${objectId}`);
                let UpdateStatus = createUpdateStatus(permissionDetails);
                set(toUstatus, UpdateStatus)
                    .then(() => {
                        console.log("working");
                        indicator1.textContent = `Permission accepted for Id(${AcceptingPermissionId})`;
                    })
                    .catch(error => {
                        console.error("Error updating permission:", error);
                        indicator1.textContent = "Error accepting permission";
                    });
                break;
            }
        }
    }
}


document.getElementById("testButton").addEventListener('click', function(){
    console.log("test button clicked");
    AcceptPermission() 
    // You can call this function to refresh the table when needed
});
document.getElementById("AcceptStatusBtn").addEventListener('click', function(){
    AcceptPermission() 
});