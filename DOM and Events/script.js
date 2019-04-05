/*
Name: Amy Stockinger
Assignment: DOM and Events
Date: 1/31/2019
*/

// make table
var addTable = document.createElement("table");
var addTbody = document.createElement("tbody");

for(var i = 0; i < 4; i++){
    var newRow = document.createElement("tr");
    for(var j = 0; j < 4; j++){
        if(i == 0){
            var thHeader = "Header " + (j + 1);
            var th = document.createElement("th");
            th.textContent = thHeader;
            newRow.appendChild(th);
        }
        else{
            var tdText = i + ", " + (j + 1);
            var td = document.createElement("td");
            td.textContent = tdText;
            if(i == 1 && j == 0){                       // mark cell below Header 1
                td.id = "current";                      // use as identifier for buttons
            }
            else{
                td.id = i + "-" + (j + 1);
            }
            newRow.appendChild(td);
        }
    }
    addTbody.appendChild(newRow);
}

addTable.border = "1px";
addTable.appendChild(addTbody);
document.body.appendChild(addTable);


// make buttons
function makeButton(id, content){
    button = document.createElement("button");
    button.id = id;
    button.textContent = content;
    button.addEventListener("click", function(x) {
        if(id != "Mark"){
            move(id);
        }
        else{
            markCell();
        }
    });
    return button;
}

document.body.appendChild(makeButton("Up", "^"));
document.body.appendChild(document.createElement('BR'));
document.body.appendChild(makeButton("Left", "<"));
document.body.appendChild(makeButton("Right", ">"));
document.body.appendChild(document.createElement('BR'));
document.body.appendChild(makeButton("Down", "v"));
document.body.appendChild(document.createElement('BR'));
document.body.appendChild(makeButton("Mark", "Mark Cell"));

var current = document.getElementById("current");               // start at current
current.style.borderWidth = "2px";


// add functions to buttons
function move(direction){
    current = document.getElementById("current");
    switch(direction){                                          // use switch to set new 'current'
        case "Up": 
            if(current.parentNode.rowIndex == 1){               // do nothing if going out of bounds
                return;
            }
            else{
                var col = current.cellIndex;
                current.style.borderWidth = "1px";
                current.removeAttribute("id");
                current = current.parentNode;
                current = current.previousElementSibling;       // go "up" to previous row
                current = current.firstElementChild;            // go back into td's
                for(var i = 0; i < col; i++){                   // move to correct column
                    current = current.nextElementSibling;       // move to correct td in the row
                }
            }
            break;
        case "Left":
            if(current.cellIndex == 0){
                return;
            }
            else{
                current.style.borderWidth = "1px";
                current.removeAttribute("id");
                current = current.previousElementSibling;
            }
            break;
        case "Right":
            if(current.cellIndex == 3){
                return;
            }
            else{
                current.style.borderWidth = "1px";
                current.removeAttribute("id");
                current = current.nextElementSibling;
            }
            break;
        case "Down":
            if(current.parentNode.rowIndex == 3){
                return;
            }
            else{
                var col = current.cellIndex;
                current.style.borderWidth = "1px";
                current.removeAttribute("id");
                current = current.parentNode;
                current = current.nextElementSibling;
                current = current.firstElementChild;
                for(var i = 0; i < col; i++){
                    current = current.nextElementSibling;
                }
            }
    }
    current.id = "current";                                 // apply id and border
    current.style.borderWidth = "2px";
}

function markCell(){
    current.style.backgroundColor = "yellow"; 
}