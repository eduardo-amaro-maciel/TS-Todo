type ILocalstorageTask = {
    id: string,
    describe: string,
    isCompleted: boolean,
}

class TaskManager {
    taskContainer: HTMLDivElement;

    constructor() {
        this.taskContainer = document.querySelector("#taskContainer") as HTMLDivElement;
        this.loadTasks();

        const addTask = document.querySelector("#addTask") as HTMLButtonElement;
        addTask.addEventListener('click', this.onAddTask.bind(this));
    }

    onAddTask(event: MouseEvent) {
        event.preventDefault();

        const taskInput = document.querySelector("#taskDescribre") as HTMLInputElement;
        const describe = taskInput.value;
        
        if (describe.length > 0) {
            console.log(describe.length)
            const id = crypto.randomUUID();
            const isCompleted = false;

            taskInput.value = "";
            this.saveTask({ id, describe, isCompleted });

        } else {
            alert("Descreva a sua tarefa antes de adiciona-la")
        } 
    }

    loadTasks() {
        this.taskContainer.innerHTML = "";

        const tasks: ILocalstorageTask[] = JSON.parse(localStorage.getItem('tasks') as string) || [];

        tasks.length > 0 ? (
            tasks.forEach(({ isCompleted, describe, id }) => {
                this.taskContainer.innerHTML += `
                <div class="task">
                    <label class="container">
                        <input ${isCompleted ? "checked" : ""} type="checkbox" data-task-id="${id}">
                        <div class="checkmark"></div>
                    </label>
                    <span class="task__info">${describe}</span>
                    <div class="task__options">
                        <img src="./src/img/edit.svg" alt="" class="btn-edit" data-edit-id="${id}" data-edit-describe="${describe}">
                        <img src="./src/img/trash-2.svg" alt="" class="btn-delete" data-delete-id="${id}">
                    </div>
                </div>
              `
            })
         ) : (
            this.taskContainer.innerHTML = `
                <p style="margin: 20px auto; text-align: center;">Adicione tarefas e elas irão aparecer aqui!</p>
                <img style="margin: 0 auto 20px auto" src="./src/img/undraw_completed_tasks_vs6q.svg" width="150" />
            `
        )

        this.addEventCheckbox();
        this.addEventDelete();
        this.addEventEdit();
    }

    addEventEdit() {
        const editButtons = this.taskContainer.querySelectorAll('.btn-edit');
        const modal = document.getElementById("modal") as HTMLDivElement;
        const closeModalButton = modal.querySelector(".close") as HTMLButtonElement;
        const inputEdit = modal.querySelector(".input__edit") as HTMLInputElement;
        const saveButton = modal.querySelector(".btn-save-edit") as HTMLButtonElement

        closeModalButton.addEventListener("click", () => {
            modal.style.display = "none";
            inputEdit.value = "";
            modal.setAttribute("data-modal-id", "")
            modal.setAttribute("data-modal-describe", "")
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
                inputEdit.value = "";
                modal.setAttribute("data-modal-id", "")
                modal.setAttribute("data-modal-describe", "")
            }
        });

        saveButton.addEventListener("click", (event) => {
            const id = modal.getAttribute("data-modal-id") as string
            const inputElement = modal.querySelector("#inputEditTask") as HTMLInputElement
            const describe = inputElement.value

            this.editTask(id, describe)

            modal.style.display = "none"
        })

        editButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const taskId = button.getAttribute('data-edit-id') as string;
                const describe = button.getAttribute('data-edit-describe') as string;

                // Atribua os valores aos atributos data-modal-id e data-modal-describe
                modal.setAttribute('data-modal-id', taskId);
                modal.setAttribute('data-modal-describe', describe);

                inputEdit.value = describe;
                modal.style.display = "flex";
            });
        });
    }

    addEventCheckbox() {
        const checkboxes = this.taskContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', this.handleCheckboxChange.bind(this));
        });
    }

    addEventDelete() {
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', this.handleDeleteButtonClick.bind(this));
        });
    }

    deleteTask(id: string) {
        let dataLocalStorage = JSON.parse(localStorage.getItem('tasks') as string);
        let indexData = dataLocalStorage.findIndex((item: ILocalstorageTask) => item.id === id);
        dataLocalStorage.splice(indexData, 1);
        localStorage.setItem('tasks', JSON.stringify(dataLocalStorage));

        this.loadTasks();
    }

    handleDeleteButtonClick(event: Event) {
        const button = event.target as HTMLButtonElement;
        const id = button.getAttribute('data-delete-id') as string;
        this.deleteTask(id);
    }

    handleCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const id = checkbox.getAttribute('data-task-id');

        const dataLocalStorage = JSON.parse(localStorage.getItem('tasks') as string);
        const indexData = dataLocalStorage.findIndex((item: ILocalstorageTask) => item.id === id);

        dataLocalStorage[indexData].isCompleted = checkbox.checked;
        localStorage.setItem('tasks', JSON.stringify(dataLocalStorage));
    }

    saveTask(task: ILocalstorageTask) {
        if (localStorage.getItem('tasks') == undefined) {
            localStorage.setItem('tasks', '[]');
        }

        let dataLocalstorage = JSON.parse(localStorage.getItem('tasks') as string);
        dataLocalstorage.push(task);
        localStorage.setItem('tasks', JSON.stringify(dataLocalstorage));

        this.loadTasks();
    }

    editTask(id: string, describe: string) {
        let dadosLocalStorage = JSON.parse(localStorage.getItem('tasks') as string);
        let indice = dadosLocalStorage.findIndex((item: ILocalstorageTask) => item.id === id);
        dadosLocalStorage[indice].describe = describe;
        localStorage.setItem('tasks', JSON.stringify(dadosLocalStorage));

        this.loadTasks();
    }
}

const taskManager = new TaskManager();