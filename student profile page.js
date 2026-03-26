import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
const appSetting ={
  databaseURL: "https://nest-hostel-default-rtdb.asia-southeast1.firebasedatabase.app"
}
const app=initializeApp(appSetting);
const database = getDatabase(app);
const Students = ref(database, "Students");
let StudentsArray = [];
onValue(Students, function(snapshot){
    StudentsArray = Object.entries(snapshot.val());
})
function logout(){
    let loggedIn = sessionStorage.getItem('loggedIn')
    loggedIn = false;
    sessionStorage.setItem('loggedIn','false');
    sessionStorage.setItem('Oid','');
    window.location.href = '/HOME/main home.html'
}
function toHome(){
    window.location.href = "/STUDENT/student home page.html"
}
document.getElementById("HomeBtn").addEventListener('click',toHome);
document.getElementById("logoutBtn").addEventListener('click',logout);


const Oid = sessionStorage.getItem("Oid");
function studentProfile(){
    let display = {}; // Initialize display object

    // Clear previous rows
    removeRows();

    for(let i = 0; i < StudentsArray.length; i++){
        let Slist = StudentsArray[i];
        let objectId = Slist[0];
        let student = Slist[1];
        if(Oid === objectId){
            display = {
                name: `Name: ${student.sname}`,
                sid: `StudentId: ${student.sid}`,
                gname: `Guardian: ${student.gname}`,
                sphno: `Student Phone: ${student.sphno}`,
                gphno: `Guardian Phone: ${student.gphno}`,
                broom: `Bedroom: ${student.broom}`,
                groom: `General room: ${student.groom}`
            };
            addRows();
            break; // Exit loop once the profile is found
        }
    }

    function createRow(content) {
        let newRow = document.createElement("tr");
        let cell = document.createElement("td");
        cell.textContent = content;
        newRow.appendChild(cell);
        return newRow;
    }

    function removeRows() {
        let tableBody = document.querySelector("#Tbody");
        tableBody.innerHTML = ""; // Remove all rows
    }

    function addRows() {
        let tableBody = document.querySelector("#Tbody");
        // Create and append rows for each property in the display object
        tableBody.appendChild(createRow(display.name));
        tableBody.appendChild(createRow(display.sid));
        tableBody.appendChild(createRow(display.gname));
        tableBody.appendChild(createRow(display.sphno));
        tableBody.appendChild(createRow(display.gphno));
        tableBody.appendChild(createRow(display.groom));
        tableBody.appendChild(createRow(display.broom));
    }
}

document.getElementById("DisplayProfile").addEventListener('click', studentProfile);
function updatePhno(){
    let uphno = document.getElementById("Uphno").value
    if(uphno!=10){
        document.getElementById("indicator1").textContent = "Enter a valid mobile no."
        return;
    }
    for(let i = 0; i < StudentsArray.length; i++){
        let Slist = StudentsArray[i];
        let objectId = Slist[0];
        let student = Slist[1];
        if(Oid === objectId){
            let toUstudent = ref(database, `Students/${Oid}`);
            let updatedData = updatedDataFUN(student, uphno);
            set(toUstudent, updatedData).then(()=>{
                document.getElementById("indicator1").textContent = "Phno updated"
            })
        }
    }
}
function updatedDataFUN(Student,uphno) {
    return {
        sname: Student.sname,
        sphno: uphno !==""? uphno:Student.sphno,
        gname: Student.gname,
        gphno: Student.gphno,
        groom: Student.groom,
        broom: Student.broom,
        sid: Student.sid,
        spass: Student.spass
    };
}


document.getElementById("updateBtn").addEventListener('click',updatePhno)