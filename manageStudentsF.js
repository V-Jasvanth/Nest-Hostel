document.addEventListener('DOMContentLoaded', function() {
 document.getElementById("Addstudent").addEventListener("click", function() {
  console.log("Addstudent button clicked");
 toggleDisplay("addStudentBox");
});

document.getElementById("deleteStudent").addEventListener("click", function() {
    console.log("deleteStudent button clicked");
    toggleDisplay("deleteStudentBox");
});

document.getElementById("UpdateStudent").addEventListener("click", function() {
    console.log("UpdateStudent button clicked");
    toggleDisplay("bUpdateBox");
});
})


function toggleDisplay(boxId) {
    console.log("Toggling display for box:", boxId);
    var boxes = document.querySelectorAll(".Box");
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].id === boxId) {
            if (boxes[i].style.display === "none") {
                boxes[i].style.display = "block";
            } else {
                boxes[i].style.display = "none";
            }
        } else {
            boxes[i].style.display = "none";
        }
    }
}
export {toggleDisplay};


