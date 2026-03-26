//---firebase config-----//
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set, get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { togleButtons } from "./manageRoomsF.js";
const appSetting = {
  databaseURL: "https://nest-hostel-default-rtdb.asia-southeast1.firebasedatabase.app"
}
const app = initializeApp(appSetting);
const database = getDatabase(app);
const Grooms = ref(database, "Genrooms");
const Brooms = ref(database, "Bedrooms");
const Students = ref(database, "Students");
const Beds = ref(database, "Bedrooms", "Beds")
let GenroomArray = [];
let BedroomArray = [];
let StudentsArray =[];
let BedsArray = [];
// Fetching general rooms data
onValue(Grooms, (snapshot) => {
  GenroomArray = snapshot.exists() ? Object.entries(snapshot.val()) : [];
});
// Fetching bed rooms data
onValue(Brooms, (snapshot) => {
  BedroomArray = snapshot.exists() ? Object.entries(snapshot.val()) : [];
});
onValue(Students, (snapshot) =>{
    StudentsArray = snapshot.exists()?Object.entries(snapshot.val()) : [];
})
onValue(Beds, (snapshot) =>{
    BedsArray = snapshot.exists()?Object.entries(snapshot.val()) : [];
})
// Buttons Event Listeners
document.getElementById("addgenroom")?.addEventListener('click', AddGRooms);
document.getElementById("addbedroom")?.addEventListener('click', AddBRooms);
document.getElementById("deletegenroom")?.addEventListener('click', removeGRoom);
document.getElementById("deletebedroom")?.addEventListener('click', removeBRoom);
document.getElementById("editbedroom")?.addEventListener('click', checkRoomno);
document.getElementById("addBed")?.addEventListener('click', AddBeds);
document.getElementById("RemoveBed")?.addEventListener('click', removeBeds);
// Constructors
export function checkSn(a) {
  const SN = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const DN = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
  for (let i = 0; i < SN.length; i++) {
      if (a === SN[i]) {
          return DN[i];
      }
  }
  return a;
}
class GeneralRoom {
  constructor(roomNum) {
    this.roomNum = roomNum;
  }
}
class BedRooms {
  constructor(roomNum) {
    this.roomNum = roomNum;
  }
}
// Functions to add bed rooms
function AddBRooms() {
  let roomNum = document.getElementById("bedRoomnumber").value;
  if (!roomNum) {
    document.getElementById("indicator1").textContent = "Enter room number";
  } else if(!bRoomExistenss(roomNum)) {
    document.getElementById("indicator1").textContent = "BedRoom already Exist"
  }else {
    let bedRoom = new BedRooms(roomNum);
    push(Brooms, bedRoom).then(() => {
      document.getElementById("bedRoomnumber").value = "";
      document.getElementById("indicator1").textContent = "Bedroom created successfully";
    });
  }
}
// Function to add general rooms
function AddGRooms() {
  let roomNum = document.getElementById("generalRoomNumber").value;
  console.log(roomNum);
  if (!roomNum) {
    document.getElementById("indicator").textContent = "Enter room number";
  }else if(!gRoomExistenss()){
    document.getElementById("indicator").textContent = "Room already exists"
  }else {
    let generalRoom = new GeneralRoom(roomNum);
    push(Grooms, generalRoom).then(() => {
      document.getElementById("generalRoomNumber").value = "";
      document.getElementById("indicator").textContent = "General room created successfully";
    });

  }
}
// Function to delete general rooms
function removeGRoom() {
  let Dgenroom = document.getElementById("generalRoomNumber").value;
  if (Dgenroom) {
    let roomFound = false;
    for (let [genRoomId, genRoom] of GenroomArray) {
      if (Dgenroom == genRoom.roomNum) {
        let toDgenroom = ref(database, `Genrooms/${genRoomId}`);
        remove(toDgenroom).then(() => {
          document.getElementById("indicator").textContent = "Room deleted successfully";
          document.getElementById("generalRoomNumber").value = "";
          roomFound = true;
        });
        break;
      }
    }
    if (!roomFound) {
      document.getElementById("indicator").textContent = "Room not found";
    }
  }
}
// Function to delete bed rooms
function removeBRoom() {
  let Dbedroom = document.getElementById("bedRoomnumber").value;
  if (Dbedroom) {
    let roomFound = false;
    for (let [bedRoomId, bedRoom] of BedroomArray) {
      if (Dbedroom == bedRoom.roomNum) {
        let toDbedroom = ref(database, `Bedrooms/${bedRoomId}`);
        remove(toDbedroom).then(() => {
          document.getElementById("indicator1").textContent = "Room deleted successfully";
          document.getElementById("bedRoomnumber").value = "";
          roomFound = true;
        });
        break;
      }
    }
    if (!roomFound) {
      document.getElementById("indicator1").textContent = "Room not found";
    }
  }
}
// Check Room Number Function
function checkRoomno() {
  let RoomNumber = document.getElementById("bedRoomnumber").value;
  if (!RoomNumber) {
    document.getElementById("indicator1").textContent = "Enter Bed room number";
  } else {
    let roomFound = false;
    for (let [BedRoomId, BedRoom] of BedroomArray) {
      if (BedRoom.roomNum == RoomNumber) {
        roomFound = true;
        togleButtons();
        break;
      }
    }
    if (!roomFound) {
      document.getElementById("indicator1").textContent = "Room not found";
    }
  }
}
// Add Beds Function
function AddBeds() {
    let noBeds = parseInt(document.getElementById("nBeds").value);
    let RoomNumber = document.getElementById("bedRoomnumber").value;
    let indicator2 = document.getElementById("indicator2");
    if (!noBeds) {
        indicator2.textContent = "Enter number of beds";
    } else {
        let roomFound = false;
        for (let [BedRoomId, BedRoom] of BedroomArray) {
            if (BedRoom.roomNum == RoomNumber) {
                roomFound = true;
                let toUbedroom = ref(database, `Bedrooms/${BedRoomId}/Beds`);
                let updates = {};
                for (let i = 1; i <= noBeds; i++) {
                    updates[`bedNum${i}`] = i; // Structure as bedNum1: 1, bedNum2: 2, etc.
                }
                set(toUbedroom, updates)
                    .then(() => {
                        indicator2.textContent = "Beds added successfully";
                        document.getElementById("nBeds").value = "";
                        setTimeout(clearIndicators, 3000); // Clear indicators after 3 seconds
                    })
                    .catch(error => {
                        indicator2.textContent = `Error adding beds: ${error.message}`;
                        setTimeout(clearIndicators, 3000); // Clear indicators after 3 seconds
                    });

                break;
            }
        }
        if (!roomFound) {
            indicator2.textContent = "Room not found";
            setTimeout(clearIndicators, 3000); // Clear indicators after 3 seconds
        }
    }
}
let indicator3 = document.getElementById("indicator3");
function removeBeds() {
    let bedNum = document.getElementById("bedNum").value;
    let RoomNumber = document.getElementById("bedRoomnumber").value;
    let indicator2 = document.getElementById("indicator2");
    let indicator3 = document.getElementById("indicator3");
    if (!bedNum) {
        indicator3.textContent = "Enter bed number";
        return;
    }
    let roomFound = false;
    for (let [Roomid, inRoom] of BedroomArray) {
        if (inRoom.roomNum == RoomNumber) {
            roomFound = true;
            let bedRef = ref(database, `Bedrooms/${Roomid}/Beds/bedNum${bedNum}`);
            onValue(bedRef, (snapshot) => {
                if (snapshot.exists()) {
                    set(bedRef, null)
                        .then(() => {
                            indicator3.textContent = `Bed number ${bedNum} removed from room ${RoomNumber}`;
                        })
                        .catch(error => {
                            indicator3.textContent = `Error removing bed: ${error.message}`;
                        });
                } else {
                    indicator3.textContent = `Bed number ${bedNum} not found in room ${RoomNumber}`;
                }
            }, {
                onlyOnce: true
            });

            break;
        }
    }
    if (!roomFound) {
        indicator2.textContent = "Room not found";
        setTimeout(clearIndicators, 3000); // Clear indicators after 3 seconds
    }
} 
function clearIndicators() {
        document.getElementById("indicator").textContent = "";
        document.getElementById("indicator1").textContent = "";
        document.getElementById("indicator2").textContent = "";
        document.getElementById("indicator3").textContent = "";
}
document.addEventListener('DOMContentLoaded', async function() {
  await RoomsDataTableMaker();
  
  async function RoomsDataTableMaker() {
      try {
          // Fetch data from the database
          const snapshot = await get(Brooms);
          const BedroomArray = Object.entries(snapshot.val());
          const snapshot1 = await get(Students);
          const StudentsArray = Object.entries(snapshot1.val());

          function addRowGENROOM(SgroomNo, Sni) {
              let tableBody = document.querySelector("#GroomsDataTable");
              if (!tableBody) {
                  console.log("Table body not found");
                  return;
              }
              let newRow = document.createElement("tr");

              let SroomNoCell = document.createElement("td");
              SroomNoCell.textContent = SgroomNo;

              let SniCell = document.createElement("td");
              SniCell.textContent = Sni;

              newRow.appendChild(SroomNoCell);
              newRow.appendChild(SniCell);
              tableBody.appendChild(newRow);
          }

          // Function to add a row to the table
          function addRowBEDROOMS(Bed, SroomNo, Sni) {
              let tableBody = document.querySelector("#BroomsDataTable");
              if (!tableBody) {
                  console.log("Table body not found");
                  return;
              }
              let newRow = document.createElement("tr");

              let SroomNoCell = document.createElement("td");
              SroomNoCell.textContent = SroomNo;

              let SniCell = document.createElement("td");
              SniCell.textContent = Sni;

              let BedCell = document.createElement("td");
              BedCell.textContent = Bed;

              newRow.appendChild(SroomNoCell);
              newRow.appendChild(SniCell);
              newRow.appendChild(BedCell);
              tableBody.appendChild(newRow);
          }

          // Process BedroomArray
          for (let [Roomid, inRoom] of BedroomArray) {
              let bRnum = inRoom.roomNum;
              let Beds = inRoom.Beds;
              let bedCount = Object.keys(Beds || {}).length;

              for (let [studentId, student] of StudentsArray) {
                  let SbroomNo = student.broom;
                  let Sname = student.sname;
                  let Sid = student.sid;
                  let Sni = `${Sname} (${Sid})`;

                  if (SbroomNo === bRnum) {
                      addRowBEDROOMS(bedCount, SbroomNo, Sni);
                  }
              }
          }

          for (let i = 0; i < GenroomArray.length; i++) {
              let G = GenroomArray[i];
              let Gid = G[0];
              let inG = G[1];
              let gRnum = inG.roomNum;

              for (let [studentId, student] of StudentsArray) {
                  let Sname = student.sname;
                  let Sid = student.sid;
                  let SgroomNo = student.groom;
                  let Sni = `${Sname} (${Sid})`;

                  if (gRnum === SgroomNo) {
                      addRowGENROOM(gRnum, Sni);
                  }
              }
          }
      } catch (error) {
          console.error("Error", error);
      }
  }
});
function gRoomExistenss(){
  let gRoom = document.getElementById("generalRoomNumber").value;
  gRoom = checkSn(gRoom)
  console.log(gRoom)
  for(let i=0; i<GenroomArray.length; i++){
    let G = GenroomArray[i];
    let Gid = G[0];
    let Gr = G[1]
    let GRoom =Gr.roomNum
    if(GRoom === gRoom){
      return false;
    }
  }
  return true
}
function bRoomExistenss(){
  let roomNum = document.getElementById("bedRoomnumber").value;
  roomNum = checkSn(roomNum);
  for(let i=0; i<BedroomArray.length; i++){
    let B = BedroomArray[i]
    let Bid = B[0];
    let BR = B[1]
    let bRoomnum = BR.roomNum;
    if(roomNum == bRoomnum){
      return false;
    }
  }
  return true;
}
//document.getElementById("testButton")?.addEventListener('click', bRoomExistenss);
