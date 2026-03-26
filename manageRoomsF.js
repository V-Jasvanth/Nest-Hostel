export function togleButtons() {
    document.getElementById("editbedroom").addEventListener("click", function() {
        toggleElementVisibility("addBed");
        toggleElementVisibility("RemoveBed");
        toggleElementVisibility("nBeds");
        toggleElementVisibility("bedNum");
    });
}

function toggleElementVisibility(elementId) {
    let element = document.getElementById(elementId);
    if (element.style.display === "none" || element.style.display === "") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}
