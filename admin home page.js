function navTo(url){
    window.location.href=url;
}
function logout() {
    sessionStorage.setItem('loggedIn', 'false'); 
    window.location.href = '/HOME/main home.html'; 
}

let loggedIn = sessionStorage.getItem('loggedIn') === 'true';

if (loggedIn) {
    document.getElementById("logoutBtn").addEventListener('click', logout);
} else {
    alert("Sign in to continue");
    window.location.href = '/HOME/main home.html';
}
