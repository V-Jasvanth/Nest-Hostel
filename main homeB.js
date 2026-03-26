//---firebase config-----//
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set, get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
const appSetting = {
  databaseURL: "https://nest-hostel-default-rtdb.asia-southeast1.firebasedatabase.app"
}
const app = initializeApp(appSetting);
const database = getDatabase(app);
const Students = ref(database, "Students")
const Admins = ref(database, "Admins")
const Guardians = ref(database, "Guardians")
const warden = ref(database, "warden")
let wardenArray = [];
let StudentsArray = [];
let AdminsArray = [];
let GuardiansArray = [];
let indicator = document.getElementById("indicator");
onValue(Students, (snapshot) =>{
    StudentsArray = snapshot.exists()?Object.entries(snapshot.val()) : [];
})
onValue(Admins, (snapshot) =>{
    AdminsArray = snapshot.exists()?Object.entries(snapshot.val()) : [];
})
onValue(Guardians, (snapshot) =>{
    GuardiansArray = snapshot.exists()?Object.entries(snapshot.val()) : [];
})
onValue(warden, (snapshot) =>{
    wardenArray = snapshot.exists()?Object.entries(snapshot.val()) : [];
})
function navigateUser(){
    let userNameId = document.getElementById("userNameId").value;
    let userPassword = document.getElementById("userPassword").value;
    let studentFound = false;
    let adminFound = false;
    let guardianFound = false;
    let wardenFound = false;
    function slog(a,loggedIn){
        loggedIn = true;
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('Oid',`${a}`);
      }
    function findUser(){
        for(let i=0; i<AdminsArray.length; i++){
            let adminObject = AdminsArray[0];
            let admin = adminObject[1]
            if(userNameId===admin.username && userPassword === admin.password){
                console.log("admin found")
                adminFound = true;
                sessionStorage.setItem('loggedIn', 'true');
                break;
            }
        }
        for(let i=0; i<wardenArray.length; i++){
            let wardenPassword = wardenArray[0];
            let WardenUsername = wardenArray[1]
            console.log(wardenPassword)
            if(userNameId===WardenUsername[1] && userPassword === wardenPassword[1]){
                console.log("warden found")
                wardenFound = true;
                sessionStorage.setItem('loggedIn', 'true');
                break;
            }
        }
        for(let i=0; i<StudentsArray.length; i++){
            let StudentObject = StudentsArray[i];
            let StudentObjectId = StudentObject[0];
            let Student = StudentObject[1];
            if(userNameId===Student.sname || userNameId === Student.sid && userPassword === Student.spass){
                console.log("student found")
                slog(StudentObjectId)
                studentFound = true;
                sessionStorage.setItem('loggedIn', 'true');
                break;
            }
            for(let i=0; i<GuardiansArray.length; i++){
                let GuardianObject = GuardiansArray[i];
                let GuardianObjectId = GuardianObject[0];
                let Guardian = GuardianObject[1];
                console.log(guardianFound)
                if(userNameId===Guardian.gname || userNameId === Guardian.sid && userPassword === Guardian.gpass){
                    console.log("guardian found")
                    slog(GuardianObjectId)
                    guardianFound = true;
                    sessionStorage.setItem('loggedIn', 'true');
                    break;
                }
            }
        }
        
    }
    findUser()
    console.log(adminFound);
    if(adminFound){
        console.log("working")
        window.location.href = "/ADMIN/admin home page.html"
    }
    else if(studentFound){
        window.location.href = "/STUDENT/student home page.html"
    }
    else if(guardianFound){
        window.location.href = "/GUARDIAN/guardian home page.html"
    }else if(wardenFound){
        window.location.href = "/WARDEN/warden home page.html"
    }
    else{
        indicator.textContent = "User not found"
    }
}
document.getElementById("signinBtn").addEventListener('click', 
    navigateUser);

