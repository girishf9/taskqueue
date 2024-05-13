document.addEventListener('DOMContentLoaded', function() {
    // Add an event listener for task submission
    document.getElementById('taskForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const taskIdentifier = document.getElementById('taskId').value;
        const taskDescription = document.getElementById('description').value;
        await fetch('/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: taskIdentifier, description: taskDescription })
        });
        document.getElementById('taskId').value = '';
        document.getElementById('description').value = '';
        updateTaskList('Added');
    });

    // Setup buttons for showing different task statuses
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(button => {
        button.addEventListener('click', function() {
            const targetList = this.getAttribute('data-bs-target').slice(1);
            const statusType = targetList.includes('taskQueue') ? 'Added' :
                               targetList.includes('completedTasksList') ? 'Completed' : 'Failed';
            updateTaskList(statusType);
        });
    });

    // Handler for displaying system logs
    document.getElementById('showLogsBtn').addEventListener('click', function() {
        const logsContainer = document.getElementById('systemLogs');
        const isExpanded = logsContainer.classList.contains('show');
        logsContainer.classList.toggle('show', !isExpanded);
        if (!isExpanded) {
            retrieveSystemLogs();
        }
    });
});

// Function to refresh the task list based on status
function updateTaskList(status) {
    const listElementId = status === 'Added' ? 'taskQueueList' :
                          status === 'Completed' ? 'completedTasksList' : 'failedTasksList';
    const targetList = document.querySelector(`#${listElementId} .list-group`);
    fetch(`/tasks?status=${status}`)
        .then(response => response.json())
        .then(tasks => {
            targetList.innerHTML = '';
            tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.textContent = `ID: ${task.taskId} - ${task.description}`;
                if (status === 'Failed') {
                    const retryButton = document.createElement('button');
                    retryButton.textContent = 'Retry Task';
                    retryButton.className = 'btn btn-sm btn-warning ms-2';
                    retryButton.onclick = () => retryFailedTask(task.taskId);
                    listItem.appendChild(retryButton);
                }
                targetList.appendChild(listItem);
            });
        });
}

// Function to retry a failed task
function retryFailedTask(taskId) {
    fetch(`/reassign-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        updateTaskList('Failed');
    })
    .catch(error => console.error('Error retrying task:', error));
}

// Function to fetch and display system logs
function retrieveSystemLogs() {
    const logOutput = document.getElementById('systemLogs');
    logOutput.innerHTML = '';
    fetch('/system-logs')
        .then(response => response.json())
        .then(logs => {
            logs.forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.textContent = log;
                logOutput.appendChild(logEntry);
            });
        })
        .catch(error => {
            console.error('Error fetching system logs:', error);
        });
}
