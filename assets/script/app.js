const ToDoList = document.getElementById('listToDoId');
const inserTask = document.getElementById('insertTaskId');
const updateTask = document.getElementById('updateTaskId')
const saveBtn = document.getElementById('newSaveBtn');
const CancelButton = document.getElementById('newCancelBtn')
const saveUpdate = document.getElementById('updateSaveBtn');
const cancelUpdate = document.getElementById('updateCancelBtn')
const addTaskBtn = document.getElementById('btnAdd');
const warnningForm = document.getElementById('myModal');
const deleteForm = document.getElementById('myModal1');
let ListToDo = []
let ToDo = { taskName: "", checked: false, createdAt: "", completedAt: "", priority: 0, tag: "" };

if (localStorage.getItem("ToDo") == null) {
    ListToDo = [];
} else {
    ListToDo = JSON.parse(localStorage.getItem("ToDo"));
    displayTable()
}


addTaskBtn.addEventListener('click', function() {
    ToDoList.style.display = "none";
    inserTask.style.display = "block";
});
saveBtn.addEventListener('click', addTask);
CancelButton.addEventListener('click', cancelTask);
cancelUpdate.addEventListener('click', cancelTask);


function displayTable() {
    let Li = "";
    Li = `<table class="table table-bordered Table table-sortable" id="tableToDo" data-sort="table">
                <tr>
                    <th scope="col">checked</th>
                    <th scope="col" order="sb" s-col="Task">Task</th>
                    <th scope="col" order="no" s-col="CreatedAt">CreatedAt</th>
                    <th scope="col" order="no" s-col="CompletedAt">CompletedAt</th>
                    <th scope="col" order="no" s-col="Priority">Priority</th>
                    <th scope="col" order="no" s-col="Tag">Tag</th>
                    <th scope="col">Controls</th>
                </tr>`
    for (let i = 0; i < ListToDo.length; i++) {
        let input = `<td><input type="checkbox" name="chb" id="chb(${i})" class="chb" onclick="checkedBox(${i})"></td>`
        let row = `
                <tr class ="dragDrop" scope="row" id="row(${i})">
                    ${input}                    
                    <td id="label${i}" class="labelForChb">${ListToDo[i].taskName}</td>
                    <td>${ListToDo[i].createdAt}</td>
                    <td>${ListToDo[i].completedAt}</td>
                    <td>${ListToDo[i].priority}</td>
                    <td class="Tag" style="background-color: #ffd777;">${ListToDo[i].tag}</td>
                    <td>
                        <div class="icons">
                            <button id="done" class="Done" onclick="doneItemt(${i})"><i class="fa fa-check " aria-hidden="true "></i></button>
                            <button id="edit" onclick="editItemt(${i})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                            <button id="delete" onclick="deleteItem(${i})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                        </div>
                    </td>
                </tr>`
        if (ListToDo[i].checked) {
            input = `<td><input type="checkbox" checked id="chb${i}" class="chb" onclick="checkedBox(${i})" ></td>`;
            row = `<tr scope="row" id="row(${i})" style="background-color: #eee;" class ="dragDrop">
                    ${input}                    
                    <td id="label${i}" class="labelForChb" style="color: black">${ListToDo[i].taskName}</td>
                    <td style="color: black">${ListToDo[i].createdAt}</td>
                    <td style="color: black">${ListToDo[i].completedAt}</td>
                    <td style="color: black">${ListToDo[i].priority}</td>
                    <td style="color: black" class="Tag" style="background-color: #ffd777;">${ListToDo[i].tag}</td>
                    <td style="color: black">
                        <div class="icons">
                            <button id="done" class="Done" onclick="doneItemt(${i})"><i class="fa fa-check " aria-hidden="true "></i></button>
                            <button id="edit" onclick="editItemt(${i})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                            <button id="delete" onclick="deleteItem(${i})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                        </div>
                    </td>
                </tr>`;
        }
        Li += `${row}`;
    }
    Li += `
    </table>`;
    document.getElementById("tabelId").innerHTML = Li;
    //Drag Drop
    $('table').sortable({
        items: 'tr:not(tr:first-child)',
    });

    var getCellValue = function(tr, idx) { return tr.children[idx].innerText || tr.children[idx].textContent; }

    var comparer = function(idx, asc) {
        return function(a, b) {
            return function(v1, v2) {
                return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
            }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
        }
    };

    // do the work...
    Array.from(document.querySelectorAll('th')).forEach(function(th) {
        th.addEventListener('click', function() {
            var table = th.closest('table');
            Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
                .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                .forEach(function(tr) { table.appendChild(tr) });
        })
    });
}

function sortDate(index) {
    if (index === 3) {
        ListToDo.sort(function(a, b) {
            var keyA = new Date(a.createdAt),
                keyB = new Date(b.createdAt);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
    } else {
        ListToDo.sort(function(a, b) {
            var keyA = new Date(a.completedAt),
                keyB = new Date(b.completedAt);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

    }
    displayTable()
}


function addTask(event) {
    event.preventDefault();
    let input = document.getElementById('insertTaskk');
    let select = document.getElementById('priority')
    if (!input.value) {
        warnningForm.style.display = "block"
    } else if (input.value) {
        console.log(input.value)
        if (select.options[select.selectedIndex].value === "none") {
            warnningForm.style.display = "block"
        } else {
            console.log(input.value);
            console.log(select.options[select.selectedIndex].value);
            let today = new Date();
            const date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log(date);
            const text = select.options[select.selectedIndex].text;
            console.log(text);
            let tag = document.getElementById('tag');
            const textTag = tag.value;
            console.log(textTag);

            // Save it!
            console.log('Thing was saved to the list.');
            ToDo = { taskName: input.value, checked: false, createdAt: date, completedAt: "", priority: text, tag: textTag };
            ListToDo.push(ToDo);
            console.log(ListToDo);
            localStorage.setItem("ToDo", JSON.stringify(ListToDo));
            setTimeout(function() {
                input.value = ""; // reset
                tag.value = ""
                text.selectedIndex = 0;
                ToDoList.style.display = "block";
                inserTask.style.display = "none";
            }, 500);
        }
    }
    displayTable();
}

function cancelTask(event) {
    event.preventDefault();
    let input = document.getElementById('insertTaskk');
    let text = document.getElementById('priority')
    let tag = document.getElementById('tag');
    input.value = ""; // reset
    tag.value = ""
    text.selectedIndex = 0;
    ToDoList.style.display = "block";
    inserTask.style.display = "none";
}


function deleteItem(index) {
    deleteForm.style.display = "block";
    const okBtn1 = document.getElementById('okkk');
    okBtn1.addEventListener('click', function() {
        ListToDo.splice(index, 1);
        for (let i = 0; i < ListToDo.length; i++) {
            console.log(ListToDo[i].Name);
        }
        localStorage.setItem("ToDo", JSON.stringify(ListToDo));
        deleteForm.style.display = "none";
        displayTable();
        console.log('The Item Deleted.');
    })
}


function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].text == valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}

function convertDate(d) {
    var p = d.split("/");
    return +(p[2] + p[1] + p[0]);
}

function sortByDate() {
    var tbody = document.querySelector("tr:not(tr:first-child)");
    // get trs as array for ease of use
    var rows = [].slice.call(tbody.querySelectorAll("tr"));

    rows.sort(function(a, b) {
        return convertDate(a.cells[0].innerHTML) - convertDate(b.cells[0].innerHTML);
    });

    rows.forEach(function(v) {
        tbody.appendChild(v); // note that .appendChild() *moves* elements
    });
}

function cancelEdit() {
    warnningForm.style.display = "none";
}

function editItemt(index) {
    event.preventDefault();
    ToDoList.style.display = "none";
    updateTask.style.display = "block";
    const label = document.getElementById('updateTask');
    label.value = ListToDo[index].taskName;
    const select = document.getElementById('priorityUpdate');
    setSelectedValue(select, ListToDo[index].priority);
    select.options[select.selectedIndex].text = ListToDo[index].priority;
    const tag = document.getElementById('tagUpdate');
    tag.value = ListToDo[index].tag;
    saveUpdate.addEventListener('click', function() {
        if (label.value === "") {
            event.preventDefault();
            warnningForm.style.display = "block";
        } else if (label.value != "") {
            if (select.options[select.selectedIndex].value === "none") {
                event.preventDefault();
                warnningForm.style.display = "block";
            } else {
                // Save it!
                console.log('Thing was saved to the list.');
                ListToDo[index].taskName = label.value;
                let today = new Date();
                const date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                ListToDo[index].createdAt = date;
                ListToDo[index].completedAt = dateCompleted.value;
                ListToDo[index].priority = select.options[select.selectedIndex].text;;
                ListToDo[index].tag = tag.value;
                localStorage.setItem("ToDo", JSON.stringify(ListToDo));

                setTimeout(function() {
                    label.value = ""; // reset
                    tag.value = ""
                    select.selectedIndex = 0;
                    todoList.style.display = "block";
                    updateTask.style.display = "none";
                }, 500);
            }
        }
        displayTable();
    });
}

function checkedBox(index) {
    if (ListToDo[index].checked) {
        ListToDo[index].checked = false;
        ListToDo[index].completedAt = "";
        console.log('Thing was marked as not done.');
    } else {
        let today = new Date()
        const date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        ListToDo[index].checked = true;
        ListToDo[index].completedAt = date
        console.log('Thing was marked as done.');
    }
    localStorage.setItem("ToDo", JSON.stringify(ListToDo));
    displayTable();
}

function doneItemt(index) {
    if (ListToDo[index].checked) {
        ListToDo[index].checked = false;
        ListToDo[index].completedAt = "";
        console.log('Thing was marked as not done.');
    } else {
        let today = new Date()
        const date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        ListToDo[index].checked = true;
        ListToDo[index].completedAt = date
        console.log('Thing was marked as done.');
    }
    localStorage.setItem("ToDo", JSON.stringify(ListToDo));
    displayTable();
}