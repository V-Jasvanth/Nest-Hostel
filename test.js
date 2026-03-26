/*function isLetter(char) {
    return /[a-zA-Z]/.test(char);
 
 }
 let s="@";
if(isLetter(s)){
    console.log(isLetter(s));
    console.log("its a letter");
}else{
    console.log(isLetter(s));
    console.log("its  not a letter");
}*/ //working

/*let sCount = 0;
let Students = []; // Array to store the created student objects
class Student {
    constructor(sname, sid, sphno, gname, gphno,  groom, broom) {
        this.sname = sname;
        this.sid = sid;
        this.sphno = sphno;
        this.gname = gname;
        this.gphno = gphno;
        this.groom = groom;
        this.broom = broom;
    }
}

function createStudent() {
    let student = new Student(sName, sId, sPhno, gName, gPhno, gRoom, bRoom);
    sCount++;
    let studentName = 'student' + sCount; // Dynamically create student name
    let studentObj = {};
    studentObj[studentName] = student; // Assign student object to dynamically created property
    Students.push(studentObj); // Push the object into the array
}
sName = "y";
sId = 123;
sPhno = 9959
gName = "y"
gPhno = 9000
gRoom = 123
bRoom = 321

// Example of calling createStudent function
createStudent(sName, sId, sPhno, gName, gPhno, gRoom, bRoom);
console.log(Students)*/
/*let a = "90";

function checkSn(a) {
    const SN = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const DN = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
    for (let i = 0; i < SN.length; i++) {
        if (a === SN[i]) {
            return DN[i];
        }
    }
    return a;
}

console.log(checkSn(a)); // Output: "01"*/
let a = 2;
if(a==10){
    console.log("w");
    return;
}else if(a==2){
    console.log("q");
}else{
    console.log("n")
}
