import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set, get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { toggleDisplay } from "./manageStudentsF.js";
import { checkSn } from "./manageRoomsB.js";
const appSetting ={
  databaseURL: "https://nest-hostel-default-rtdb.asia-southeast1.firebasedatabase.app"
}
//-------------------------------------------------------------------//
const app=initializeApp(appSetting);
const database = getDatabase(app);
const Students = ref(database, "Students")
const Bedrooms = ref(database, "Bedrooms") 
const Genrooms = ref(database, "Genrooms")
const Guardians = ref(database, "Guardians")
//------------------------------------------------------------------//
//Add student button 
document.getElementById("addStuSubmitBtn").addEventListener('click',function(){
    console.log("add Student button clicked");
    newStudent();
})
//delete student button
document.getElementById("RemoveStudentbtn").addEventListener('click', function(){
    console.log("remove student button clicked");
    RemoveStudent();
})
document.getElementById("changeDetails").addEventListener('click', function(){
    console.log("change details button clicked")
    studentId2update();
})
document.getElementById("updateDetailsbtn").addEventListener('click', function(){
    console.log("change details button clicked")
    updateStudent(Oid)
})
//fetching Students from database in array from 
onValue(Students, function(snapshot){
    StudentsArray = Object.entries(snapshot.val())
})
onValue(Bedrooms, function(snapshot){
    BedroomsArray = Object.entries(snapshot.val())
})
onValue(Genrooms, function(snapshot){
    GenroomsArray = Object.entries(snapshot.val())
})
onValue(Guardians, function(snapshot){
    GuardiansArray = Object.entries(snapshot.val())
})


let indicator1 = document.getElementById("indicator1");
let indicator2 = document.getElementById("indicator2");
let indicator3 = document.getElementById("indicator3");
let indicator4 = document.getElementById("indicator4");
let StudentsArray
let BedroomsArray
let GenroomsArray
let GuardiansArray
//-----------------------Extra function---------------------//
// function to check input is letter or not
function isLetter(char) {
   return /[a-zA-Z]/.test(char);
}
function BedRoomexist(BedroomsArray, bRoom) {
    let BedRoomNo
    for(let [Roomid, inRoom] of BedroomsArray){
        let Beds = inRoom.Beds;
         BedRoomNo = inRoom.roomNum;
       if (BedRoomNo == bRoom) {
           return true;
       }
    }
    console.log("Bedroom existens checking...",BedRoomNo)
    return false;
}
function GenRoomexist(GenroomsArray, gRoom) {
    let Roomno
    let Roomid
    for (let i=0; i<GenroomsArray.length; i++) {
        let Room = GenroomsArray[i]
        Roomid = Room[0]
        Roomno = Room[1].roomNum
        if (Roomno == gRoom) {
          return true;
        }
    }
    console.log("General Room existens checking...",Roomno)
    return false;
}
function clear(){
    document.getElementById("studentName").value = "";
    document.getElementById("AddStudentId").value = "";
    document.getElementById("studentPhNo").value = "";
    document.getElementById("guardianName").value = "";
    document.getElementById("guardianPhNo").value = "";
    document.getElementById("genRoomNo").value = "";
    document.getElementById("bedRoomNo").value = "";
    document.getElementById("DelStudentId").value = "";
    document.getElementById("DelGenRoomNO").value = "";
    document.getElementById("DelBedRoomNo").value = "";
}
function SidExist(sId){
    let Sid;
    for(let i=0;i<StudentsArray.length;i++){
        let S = StudentsArray[i]
        let SobjectId = S[0];
        let student = S[1];
        Sid = student.sid  
        if(Sid == sId){
            return false;
        }
    }
return true;
}
function SphnoExist(sPhno){
    let Sphno;
    for(let i=0;i<StudentsArray.length;i++){
        let S = StudentsArray[i]
        let SobjectId = S[0];
        let student = S[1];
        Sphno = student.sphno
        console.log(Sphno)
        if(Sphno == sPhno){
            return false;
        }
    }
    return true;
}
//---------------------------------------------------------//
// constructor of student
class Student {
    constructor(sname, sid, sphno, gname, gphno, spass, groom, broom) {
        this.sname = sname;
        this.sid = sid;
        this.sphno = sphno;
        this.gname = gname;
        this.gphno = gphno;
        this.spass = spass;
        this.groom = groom;
        this.broom = broom;
    }
}
class Guardian {
    constructor(sname, sid, sphno, gname, gphno, gpass) {
        this.sname = sname;
        this.sid = sid;
        this.sphno = sphno;
        this.gname = gname;
        this.gphno = gphno;
        this.gpass = gpass;
    }
}
// Function to create a new student
function newStudent() {
    // Get values from input fields
    let sName = document.getElementById("studentName").value;
    let sId = document.getElementById("AddStudentId").value;
    let sPhno = document.getElementById("studentPhNo").value;
    let gName = document.getElementById("guardianName").value;
    let gPhno = document.getElementById("guardianPhNo").value;
    let gRoom = document.getElementById("genRoomNo").value;
    let bRoom = document.getElementById("bedRoomNo").value;
    let sPassword = "nest" + sId;
    let gPassword = "nG" + sId;
    gRoom = checkSn(gRoom)
    bRoom = checkSn(bRoom)
    //conditions of input feilds
   if(!checkInputFeilds(sName,sId,sPhno,gName,gPhno,gRoom,bRoom)){
   console.log("checking input feilds")
   }
    else{
        let sCount=0;
        let gCount=0;
        let Nstudent = new Student(sName,sId,sPhno,gName,gPhno,sPassword,gRoom,bRoom);
        let Nguardian = new Guardian(sName, sId, sPhno, gName, gPhno, gPassword)
        sCount++;
        gCount++;
        push(Students, Nstudent);
        push(Guardians, Nguardian);
        indicator1.textContent="Student added successfully";
        clear();
    }
}
//Function to delete account
function RemoveStudent() {
    let sId = document.getElementById("DelStudentId").value;
    let groom = document.getElementById("DelGenRoomNO").value;
    let broom = document.getElementById("DelBedRoomNo").value;
    let indicator2 = document.getElementById("indicator2");

    if (!sId || !groom || !broom) {
        indicator2.textContent = "Enter details";
        return;
    }

    let student, id, obj, sid;

    for (let i = 0; i < StudentsArray.length; i++) {
        student = StudentsArray[i];
        id = student[0];
        obj = student[1];
        if (obj.sid == sId && obj.groom == groom && obj.broom == broom) {
            sid = sId;
            console.log("student found")
            let toDstudent = ref(database, `Students/${id}`);
            // Remove the student
            remove(toDstudent);
            // Remove corresponding guardian
            for (let j = 0; j < GuardiansArray.length; j++) {
                let guardian = GuardiansArray[j];
                let guardianId = guardian[0];
                let guardianObj = guardian[1];
                console.log(guardianId)

                if (guardianObj.sid == sid) {
                    let toDguardian = ref(database, `Guardians/${guardianId}`);

                    // Remove the guardian
                    remove(toDguardian);

                    indicator2.textContent = "Student & Guardian removed successfully";
                    clear();
                    return;
                }
            }

            indicator2.textContent = "Guardian not found for the student";
            clear();
            return;
        }
    }

    indicator2.textContent = "No student found with these details";
}

//Function to update student details
function updateStudent(Oid) {
    let sName = document.getElementById("UstudentName").value;
    let sPhno = document.getElementById("UstudentPhNo").value;
    let gName = document.getElementById("UguardianName").value;
    let gPhno = document.getElementById("UguardianPhNo").value;
    let gRoom = document.getElementById("UgenRoomNo").value;
    let bRoom = document.getElementById("UbedRoomNo").value;
    let obj;
    let updatedData = {};

    for (let i = 0; i < StudentsArray.length; i++) {
        let student = StudentsArray[i];
        let id = student[0];
        obj = student[1];
        if (Oid === id) {
            console.log("updating details");
            let toUstudent = ref(database, `Students/${id}`);
            updatedDataFUN();
            set(toUstudent, updatedData)
                .then(() => {
                    indicator4.textContent = "Data updated successfully"
                    console.log("Data updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating data:", error);
                });
            break; 
        }
    }
    function updatedDataFUN() {
        updatedData = {
            sname: sName !== "" ? sName : obj.sname,
            sphno: sPhno !== "" ? sPhno : obj.sphno,
            gname: gName !== "" ? gName : obj.gname,
            gphno: gPhno !== "" ? gPhno : obj.gphno,
            groom: gRoom !== "" ? gRoom : obj.groom,
            broom: bRoom !== "" ? bRoom : obj.broom,
            sid: obj.sid,
            spass: obj.spass
        };

        // Check if no fields were updated
        if (Object.keys(updatedData).length === 0) {
            indicator4.textContent = "Enter the changes to update";
            return;
        }
    }
}
let Oid;// object id of the student to be updated
// Function to find student object id
function studentId2update(){
    let id = document.getElementById("UpdateStudentId").value
    let student
    let obj;
    for(let i=0; i<StudentsArray.length; i++){
        student = StudentsArray[i];
        Oid = student[0]
        obj = student[1]
        if(obj.sid == id){
            console.log(`found id:${id}, working`)
            toggleDisplay("updateDetailsBox")
            return;
        }else{
            console.log("Student not found")
            indicator3.textContent = "Student not Found"
        }
    }
}
// function to display student data 
async function StudentDataTableMaker() {
    try {
        // Fetch data from the database
        const snapshot = await get(Students);
        const StudentsArray = Object.entries(snapshot.val());
        // Function to add a row to the table
        function addRow(name, Sid, Broom){
            let tableBody = document.querySelector("#sdtBody");
            let newRow = document.createElement("tr");
            let nameCell = document.createElement("td");
            nameCell.textContent = name;
            let sidCell = document.createElement("td");
            sidCell.textContent = Sid;
            let broomCell = document.createElement("td");
            broomCell.textContent = Broom;
            newRow.appendChild(nameCell);
            newRow.appendChild(sidCell);
            newRow.appendChild(broomCell);
            tableBody.appendChild(newRow);
        }
        for(let i = 0; i < StudentsArray.length; i++){
            const student = StudentsArray[i];
            const Objectid = student[0];
            const nStuObject = student[1];
            const name = nStuObject.sname;
            const Sid = nStuObject.sid;
            const Broom = nStuObject.broom;
            addRow(name, Sid, Broom);
        }
    } catch (error) {
        console.error("Error fetching and displaying data:", error);
    }
}
// Call StudentDataTableMaker function when the page is refreshed
document.addEventListener('DOMContentLoaded', function(){
    StudentDataTableMaker();
});

function checkInputFeilds(sName,sId,sPhno,gName,gPhno,gRoom,bRoom){
    if(!isLetter(sName)){
        indicator1.textContent="Enter a valid Name";
        document.getElementById("studentName").value = "";
        return false;
    }
    else if(!isLetter(gName)){
        indicator1.textContent="Enter a valid Name";
        document.getElementById("guardianName").value = "";
        return false;
    }
    else if(sPhno.length!=10){
        indicator1.textContent="Enter a valid phone number";
        document.getElementById("studentPhNo").value = "";
        return false;
    }
    else if(gPhno.length!=10){
        indicator1.textContent="Enter a valid phone number"
        document.getElementById("guardianPhNo").value = "";
        return false;
    }
    else if(sPhno===gPhno){
        indicator1.textContent="Student and Guardian cannot share the same phone number."
        document.getElementById("guardianPhNo").value = "";
        document.getElementById("studentPhNo").value = "";
        return false;
    }
    else if(!BedRoomexist(BedroomsArray,bRoom)){
        indicator1.textContent = "BedRoom does not Exist"
        document.getElementById("bedRoomNo").value = "";
        return false;
    }
    else if(!GenRoomexist(GenroomsArray,gRoom)){
        indicator1.textContent = "General Room does not Exist"
        document.getElementById("genRoomNo").value = "";
        return false;
    }else if(!SidExist(sId)){
        indicator1.textContent = `Student exist with  Id: ${sId}`
        sId.value = "";
        return false;
    }else if(!SphnoExist(sPhno)){
        indicator1.textContent = `Student exist with ${sPhno}`
        sPhno.value = ""
        return false;
    }else{
        return true;
    }  
}