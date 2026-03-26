import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
const appSetting = {
  databaseURL: "https://nest-hostel-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(appSetting);
const database = getDatabase(app);
const Students = ref(database, "Students");
let StudentsArray = [];
let updatedData = {};

// Fetch students data from Firebase
onValue(Students, function(snapshot) {
    StudentsArray = Object.entries(snapshot.val());
});

function updatedDataFUN(newPassword, Student) {
    return {
        sname: Student.sname,
        sphno: Student.sphno,
        gname: Student.gname,
        gphno: Student.gphno,
        groom: Student.groom,
        broom: Student.broom,
        sid: Student.sid,
        spass: newPassword !== "" ? newPassword : Student.spass,
    };
}

function changePassword() {
    let errorIndicator1 = document.getElementById("errorIndicator1");
    let currentPassword = document.getElementById("currentPassword").value;
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let Oid = sessionStorage.getItem('Oid');

    errorIndicator1.textContent = "";

    let studentFound = false;
    let cPass = false;

    for (let i = 0; i < StudentsArray.length; i++) {
        let StudentObject = StudentsArray[i];
        let StudentObjectId = StudentObject[0];
        let Student = StudentObject[1];

        if (Oid === StudentObjectId) {
            studentFound = true;
            if (currentPassword === Student.spass) {
                cPass = true;
                if (newPassword.length >= 6 && newPassword === confirmPassword) {
                    let toUstudent = ref(database, `Students/${Oid}`);
                    let updatedData = updatedDataFUN(newPassword, Student);
                    set(toUstudent, updatedData).then(() => {
                        clearFeilds()
                        console.log("Password changed successfully");
                        errorIndicator1.textContent = "Password changed successfully";
                    }).catch((error) => {
                        console.error("Error updating password:", error);
                        errorIndicator1.textContent = "Failed to change password";
                    });
                } else {
                    errorIndicator1.textContent = "New passwords do not match or are too short";
                    clearFeilds()
                }
            }
            break; 
        }
    }

    if (!studentFound) {
        errorIndicator1.textContent = "Student not found";
    } else if (studentFound && !cPass) {
        errorIndicator1.textContent = "Incorrect current password";
        clearFeilds()
    }
}
function clearFeilds(){
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
}
document.getElementById("changeSubmit").addEventListener('click', changePassword);
function toHome(){
    window.location.href = "/STUDENT/student home page.html"
}
function logout(){
    let loggedIn = sessionStorage.getItem('loggedIn')
    loggedIn = false;
    sessionStorage.setItem('loggedIn','false');
    sessionStorage.setItem('Oid','');
    window.location.href = '/HOME/main home.html'
}

document.getElementById("HomeBtn").addEventListener('click',toHome);
document.getElementById("logoutBtn").addEventListener('click',logout);
