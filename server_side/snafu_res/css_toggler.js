// css related functions.
function TOG_display(ElIdStr = "Name_modal") {
    // element ID toggle between "block" and "none"
    let ElId = document.getElementById(ElIdStr.toString());
    if (ElId.style.display == "none") {
        return ElId.style.display = "block";
    } else {
        return ElId.style.display = "none";
    }
}
