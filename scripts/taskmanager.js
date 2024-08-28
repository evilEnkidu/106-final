function saveTask() {
    
    console.log("Task Manager...");
    const title = $("#txtTitle").val();
    const description = $("#txtDescription").val();
    const color = $("#txtColor").val();
    const date = $("#txtDate").val();
    const status = $("#selStatus").val();
    const budget = $("#numBudget").val();
    console.log(title, description, color, date, status, budget);
    
    let taskSave = new Task(title, description, color, date, status, budget);
    console.log(taskSave);

    // Save to server
    $.ajax({
        type: "post",
        url: "http://fsdiapi.azurewebsites.net/api/tasks/",
        data: JSON.stringify(taskSave),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            displayTask(taskSave);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function loadTasks(){
    $.ajax({
        type: "get",
        url: "http://fsdiapi.azurewebsites.net/api/tasks/",
        success: function (response){
            console.log("response ", response);
            let data = JSON.parse(response);
            console.log("response json: ", data);
            for (let i = 0; i < data.length; i++){
                let task = data[i];
                if (task.userid === "666"){
                    displayTask(task);
                }
            }
        }
    })
}

function displayTask(task) {
    let syntax = `
    <div class="task" id="${task.title}" style="border-left: 5px solid ${task.color}; padding-left: 10px; margin-top:20px;">
        <div class="info">
            <h5>${task.title}</h5>
            <p>${task.description}</p>
        </div>
        <label class="status">${task.status}</label>
        <div class="date-budget">
            <label>${task.date}</label>
            <label>$${task.budget}</label>
        </div>
        <div>
            <p class="delete-btn" data-title="${task.title}" style="cursor:pointer; color: grey;">Delete</p>
        </div>
    </div>
    `;
    $("#list").append(syntax);

    // Attach delete event CORRECT
    $(`#${task.title} .delete-btn`).click(function() {
        deleteTask($(this).data("title"));
    });
}

function deleteTask(title) {
$.ajax({
    type: "delete",
    url: `http://fsdiapi.azurewebsites.net/api/tasks/${title}`,
    success: function (response){
        console.log("Task deleted:", response);
        // remove from display
        $(`#${title}`).remove();
    },
    error: function (error){
        console.error("Error deleting task:", error);
    }
})

}
function clearAll(){
    $('#empty').click(function(){
        $("#list").empty();
    })
}

function init() {
    $("#btnSave").click(saveTask);
    loadTasks();
    clearAll();
}

window.onload = init;