// NEEDS MUCH VALIDATIONS ON INPUTSTRINGS

// -=-=-=-=-=-=- [ LOGIN FLESHED OUT:
// -=-=-=-[ INPUT_COLLECTION:]
// -=-= [ btn_input_name_form: ]
function setInputValue(targ = "inputName") {
    let name = document.getElementById(targ);
    console.log('[login.js][setInputValue()][name.value: ' + name.value + ']');
    name_modal_hide();
    return name.value;
}

function clearInputBox(targ = "inputName") {
    let test = document.getElementById(targ);
    return test.value = '';
}
// -=-=- [completed above line] -=-=-=-=


// -=-=-=- [ WAiTING ON SOCKET.IO ]
// TBI::
function isDataValid(data) {
    // socket.io check if name is already taken.(dont really matter from socket.io UID)
    // check string for invalid characters TODO:


    // must add isNameValid_Server(data) function && operator.
    if (isNameValidClient(data)) {
        return true;
    } else {
        return false;
    }

}
// TB::
function isNameValidClient(name) {
    // simple check if string is longer than zero characters long:
    if (name.length > 0) {
        return true;
    } else {
        return false;
    }
}

function isInputValid(val) {
    // socket.io make sure nobody else is using that name.
    // valid condition is a joke.
    if (validcondition) {
        return true;
    } else {
        return false;
    }

}
// -=-=-=- [ WAiTING ON SOCKET.IO ]
// -=-=-=-=-=-=- [ LOGIN FLESHED END ]

// -=-=-=-=-=-=- [ name_modal FLESHED OUT:

var name_modal = document.getElementById('Name_modal');
var X_toclose = document.getElementsByClassName("close")[0];
// NOTE: shouldn't be able to close until we have a valid input already set.
X_toclose.onclick = function () {
    return name_modal.style.display = "none";
}

function name_modal_hide() {
    return name_modal.style.display = "none";
}

function name_modal_show() {
    return name_modal.style.display = "block";
}

// -=-=-=-=-=-=- [ name_modal FLESHED END ]

//name_modal_show()
//LEVEL_splashscreen();
