const APIURL = 'http://localhost:1300'

function updateTask(e) {
    const idTask = e.target.dataset.idtask
    const newStatus = e.target.value
    console.log({ idTask, newStatus });
}

async function addTask() {
    const response = await fetch(APIURL + '/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'xd',
            description: 'taba rica la burger',
            status: 'PENDIENTE',
        })
    })
    const data = await response.json()
    await listTasks()
}

async function getTasks() {
    const response = await fetch(APIURL + '/tasks')
    const data = await response.json()
    return data
}



async function listTasks() {
    const tasks = await getTasks()
    const taskContainer = document.getElementById('list-task-box')
    taskContainer.innerHTML = ''
    tasks.forEach(task => {
        taskContainer.innerHTML += `
        <div class="task-item">
                <h5>${task.name}</h5>
                <p>${task.description}</p>
                <select name="1" id="task-select-1" data-idtask='1' class="select-task">
                    <option value="pending">Pendiente</option>
                    <option value="working">En proceso</option>
                    <option value="finished">Finalizada</option>
                </select>
                <button id='del-task-btn'>Eliminar</button>
                <button id='modify-task-btn'>Modificar</button>
        </div>
        `
    });

    async function deleteTask(e) {
        const idTask = e.target.dataset.idTask;
        try {
            const response = await fetch(`${APIURL}/tasks/${idTask}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                console.log('Tarea eliminada.');
            } else {
                console.log('Error al eliminar la tarea.', data);
            }

            await listTasks();
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }


    // OTRO FOR QUE AGREGE LOS EVENT LISTENER

    document.getElementById('btnForm').addEventListener('click', addTask);


    document.addEventListener('click', function (e) {
        if (e.target && e.target.matches('del-task-btn')) {
            deleteTask(e);
        }
    });

    document.addEventListener('change', function (e) {
        if (e.target && e.target.matches('select.select-task')) {

        }
    });
}