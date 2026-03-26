document.getElementById("filterBtn").addEventListener("click",function(){
    toggleDisplay("filterBox");
});
function toggleDisplay(boxId) {
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