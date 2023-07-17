var TaskManager = /** @class */ (function () {
    function TaskManager() {
        this.taskContainer = document.querySelector("#taskContainer");
        this.loadTasks();
        var addTask = document.querySelector("#addTask");
        addTask.addEventListener('click', this.onAddTask.bind(this));
    }
    TaskManager.prototype.onAddTask = function (event) {
        event.preventDefault();
        var taskInput = document.querySelector("#taskDescribre");
        var describe = taskInput.value;
        if (describe.length > 0) {
            console.log(describe.length);
            var id = crypto.randomUUID();
            var isCompleted = false;
            taskInput.value = "";
            this.saveTask({ id: id, describe: describe, isCompleted: isCompleted });
        }
        else {
            alert("Descreva a sua tarefa antes de adiciona-la");
        }
    };
    TaskManager.prototype.loadTasks = function () {
        var _this = this;
        this.taskContainer.innerHTML = "";
        var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.length > 0 ? (tasks.forEach(function (_a) {
            var isCompleted = _a.isCompleted, describe = _a.describe, id = _a.id;
            _this.taskContainer.innerHTML += "\n                <div class=\"task\">\n                    <label class=\"container\">\n                        <input ".concat(isCompleted ? "checked" : "", " type=\"checkbox\" data-task-id=\"").concat(id, "\">\n                        <div class=\"checkmark\"></div>\n                    </label>\n                    <span class=\"task__info\">").concat(describe, "</span>\n                    <div class=\"task__options\">\n                        <img src=\"./src/img/edit.svg\" alt=\"\" class=\"btn-edit\" data-edit-id=\"").concat(id, "\" data-edit-describe=\"").concat(describe, "\">\n                        <img src=\"./src/img/trash-2.svg\" alt=\"\" class=\"btn-delete\" data-delete-id=\"").concat(id, "\">\n                    </div>\n                </div>\n              ");
        })) : (this.taskContainer.innerHTML = "\n                <p style=\"margin: 20px auto; text-align: center;\">Adicione tarefas e elas ir\u00E3o aparecer aqui!</p>\n                <img style=\"margin: 0 auto 20px auto\" src=\"./src/img/undraw_completed_tasks_vs6q.svg\" width=\"150\" />\n            ");
        this.addEventCheckbox();
        this.addEventDelete();
        this.addEventEdit();
    };
    TaskManager.prototype.addEventEdit = function () {
        var _this = this;
        var editButtons = this.taskContainer.querySelectorAll('.btn-edit');
        var modal = document.getElementById("modal");
        var closeModalButton = modal.querySelector(".close");
        var inputEdit = modal.querySelector(".input__edit");
        var saveButton = modal.querySelector(".btn-save-edit");
        closeModalButton.addEventListener("click", function () {
            modal.style.display = "none";
            inputEdit.value = "";
            modal.setAttribute("data-modal-id", "");
            modal.setAttribute("data-modal-describe", "");
        });
        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
                inputEdit.value = "";
                modal.setAttribute("data-modal-id", "");
                modal.setAttribute("data-modal-describe", "");
            }
        });
        saveButton.addEventListener("click", function (event) {
            var id = modal.getAttribute("data-modal-id");
            var inputElement = modal.querySelector("#inputEditTask");
            var describe = inputElement.value;
            _this.editTask(id, describe);
            modal.style.display = "none";
        });
        editButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var taskId = button.getAttribute('data-edit-id');
                var describe = button.getAttribute('data-edit-describe');
                // Atribua os valores aos atributos data-modal-id e data-modal-describe
                modal.setAttribute('data-modal-id', taskId);
                modal.setAttribute('data-modal-describe', describe);
                inputEdit.value = describe;
                modal.style.display = "flex";
            });
        });
    };
    TaskManager.prototype.addEventCheckbox = function () {
        var _this = this;
        var checkboxes = this.taskContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', _this.handleCheckboxChange.bind(_this));
        });
    };
    TaskManager.prototype.addEventDelete = function () {
        var _this = this;
        var deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(function (button) {
            button.addEventListener('click', _this.handleDeleteButtonClick.bind(_this));
        });
    };
    TaskManager.prototype.deleteTask = function (id) {
        var dataLocalStorage = JSON.parse(localStorage.getItem('tasks'));
        var indexData = dataLocalStorage.findIndex(function (item) { return item.id === id; });
        dataLocalStorage.splice(indexData, 1);
        localStorage.setItem('tasks', JSON.stringify(dataLocalStorage));
        this.loadTasks();
    };
    TaskManager.prototype.handleDeleteButtonClick = function (event) {
        var button = event.target;
        var id = button.getAttribute('data-delete-id');
        this.deleteTask(id);
    };
    TaskManager.prototype.handleCheckboxChange = function (event) {
        var checkbox = event.target;
        var id = checkbox.getAttribute('data-task-id');
        var dataLocalStorage = JSON.parse(localStorage.getItem('tasks'));
        var indexData = dataLocalStorage.findIndex(function (item) { return item.id === id; });
        dataLocalStorage[indexData].isCompleted = checkbox.checked;
        localStorage.setItem('tasks', JSON.stringify(dataLocalStorage));
    };
    TaskManager.prototype.saveTask = function (task) {
        if (localStorage.getItem('tasks') == undefined) {
            localStorage.setItem('tasks', '[]');
        }
        var dataLocalstorage = JSON.parse(localStorage.getItem('tasks'));
        dataLocalstorage.push(task);
        localStorage.setItem('tasks', JSON.stringify(dataLocalstorage));
        this.loadTasks();
    };
    TaskManager.prototype.editTask = function (id, describe) {
        var dadosLocalStorage = JSON.parse(localStorage.getItem('tasks'));
        var indice = dadosLocalStorage.findIndex(function (item) { return item.id === id; });
        dadosLocalStorage[indice].describe = describe;
        localStorage.setItem('tasks', JSON.stringify(dadosLocalStorage));
        this.loadTasks();
    };
    return TaskManager;
}());
var taskManager = new TaskManager();
