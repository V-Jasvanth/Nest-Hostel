document.getElementById("studentProfile").addEventListener("click",function(){
    toggleDisplay("studentProfileBox");
});
document.getElementById("guardianProfile").addEventListener("click",function(){
    toggleDisplay("guardianProfileBox");
});
document.getElementById("requestPermission").addEventListener("click",function(){
    toggleDisplay("requestPermissionBox");
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
function logout() {
    sessionStorage.setItem('loggedIn', 'false'); 
    sessionStorage.setItem('Oid', ''); 
    window.location.href = '/HOME/main home.html'; 
}

let loggedIn = sessionStorage.getItem('loggedIn') === 'true';

if (loggedIn) {
    document.getElementById("logoutBtn").addEventListener('click', logout);
} else {
    alert("Sign in to continue");
    window.location.href = '/HOME/main home.html';
}
