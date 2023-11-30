const APIURL = 'http://localhost:1300'

const taskName = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
let formattedUpdateDate;

window.addEventListener('load', listTasks);

async function updateTask(e) {
    const idTask = e.target.dataset.idtask;
    const newStatus = e.target.value;

    const tasks = await getTasks();
    const taskToUpdate = tasks.find(task => task.id === idTask);

    const updateDate = new Date();
    const formattedUpdateDate = updateDate.toISOString();
}

async function addTask() {
    const response = await fetch(APIURL + '/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: taskName.value,
            description: taskDescription.value,
            status: 'PENDIENTE',
            update_at: formattedUpdateDate,
        }),
    });

    if (response.ok) {
        console.log('Status actualizado.');
    } else {
        console.log('Error al actualizar.');
    }
    const data = await response.json();
    listTasks();
    console.log(data);

}

async function getTasks() {
    const response = await fetch(APIURL + '/tasks');
    const data = await response.json();
    console.log(data);
    return data;
}

async function deleteTask(e) {
    console.log(e.currentTarget);
    const idTask = e.currentTarget.dataset.idtask;
    try {
        const response = await fetch(`${APIURL}/tasks/${idTask}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Tarea eliminada.');
        } else {
            console.log('Error al eliminar la tarea.', data);

        }

        await listTasks();
    } catch (error) {
        console.log(error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}
async function listTasks() {
    const tasks = await getTasks();
    const taskContainer = document.getElementById('list-task-box');
    console.log(tasks);
    taskContainer.innerHTML = '';
    tasks.forEach((task) => {
        const formattedCreatedAt = formatDate(task.created_at);
        const formattedUpdateAt = formatDate(task.update_at);
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        taskItem.classList.add('d-flex');
        taskItem.classList.add('justify-content-center');
        taskItem.classList.add('row');
        taskItem.classList.add('p-3');
        taskItem.innerHTML += `
        
                <h5 class='col-1'>${task.name}</h5>
                <p class='col-2'>${task.description}</p>
                <p class = 'col-1 d-flex justify-content-center'>${formattedCreatedAt}</p>
                <p class = 'update-date col-1 d-flex justify-content-center'>${formattedUpdateAt}</p>
                <div class = 'task-status-box col-4 d-flex justify-content-center'>
                <select name="2" id="task-select-1" data-idtask='${task.id}' class="select-task col-3">
                    <option value="pending"${task.status === 'PENDIENTE' ? 'selected' : ''}>Pendiente</option>
                    <option value="working"${task.status === 'EN_PROCESO' ? 'selected' : ''}>En proceso</option>
                    <option value="finished"${task.status === 'FINALIZADA' ? 'selected' : ''}>Finalizada</option>
                </select>
                </div>
            
                <button  class='col-1 del-btn' id='del-task-btn${task.id}' data-idtask='${task.id}'><i class='bx bx-trash'></i></button>
        
        `;
        const updateElement = taskItem.querySelector('.update-date');
        updateElement.textContent = formattedUpdateAt;
        taskContainer.appendChild(taskItem);
        return tasks;


    });

    tasks.forEach((task) => {
        const delButton = document.getElementById(`del-task-btn${task.id}`);
        const modifyButton = document.querySelector(`#modify-task-btn${task.id}`);
        const selectTask = document.querySelector(`.select-task[data-idtask="${task.id}"]`);

        delButton.addEventListener('click', function (e) {
            deleteTask(e);
        });

        selectTask.addEventListener('change', function (e) {
            updateTask(e);
        });
    });
}


document.getElementById('btn-form').addEventListener('click', function (e) {
    addTask();
});



