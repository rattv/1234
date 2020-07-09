// Форма
// Список задач
const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body: "Добавить первое To-Do задание на сегодня\r\n",
    title: "To-Do",
  },
];

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  const themes = {
    default: {
      "--base-text-color": "#212529",
      "--header-bg": "#007bff",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#007bff",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#0069d9",
      "--default-btn-border-color": "#0069d9",
      "--danger-btn-bg": "#dc3545",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#bd2130",
      "--danger-btn-border-color": "#dc3545",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#80bdff",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
    },
    dark: {
      "--base-text-color": "#212529",
      "--header-bg": "#343a40",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#58616b",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#292d31",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#b52d3a",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#88222c",
      "--danger-btn-border-color": "#88222c",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
    light: {
      "--base-text-color": "#212529",
      "--header-bg": "#fff",
      "--header-text-color": "#212529",
      "--default-btn-bg": "#fff",
      "--default-btn-text-color": "#212529",
      "--default-btn-hover-bg": "#e8e7e7",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#f1b5bb",
      "--danger-btn-text-color": "#212529",
      "--danger-btn-hover-bg": "#ef808a",
      "--danger-btn-border-color": "#e2818a",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
  };
  let lastSelectedTheme = localStorage.getItem("app_theme") || "default";

  // Elemnts UI
  const listContainer = document.querySelector(
    ".tasks-list-section .list-group"
  );
  const form = document.forms["addTask"];  //!!! {1}
  const inputTitle = form.elements["title"]; //!!!! {2}
  const inputBody = form.elements["body"]; //!!!!! {3}
  const themeSelect = document.getElementById("themeSelect");

  // Events
  setTheme(lastSelectedTheme);
  renderAllTasks(objOfTasks);
  form.addEventListener("submit", onFormSubmitHandler); //!!!! {4}
  listContainer.addEventListener("click", onDeletehandler); //!!!! {7}
  themeSelect.addEventListener("change", onThemeSelectHandler);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error("Передайте список задач!");
      return;
    }

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  }

  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    li.setAttribute("data-task-id", _id);

    const span = document.createElement("span");
    span.textContent = title;
    span.style.fontWeight = "bold";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");

    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100");

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);
    return li;
  }

  //!!!!!!!!!!!!!!!!!!!!!!! (1)
  //-- функционал добавления задачи в список для этого нашли в документе {1}
  // {2} , {3} используя специальные специальные свойства forms elements. 
  // Далее на форму был повешен обработчик событий 'submit' {4}
  // Внутри функции onFormSubmitHandler забрали два значения inputTitle и inputBody.
  // Проверили присутствуют ли значения, если отсутствуют то выводится специальное сообщение с просьбой ввести title и body. 
  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Пожалуйста введите Заголовок и Описание");
      return;
    }

    const task = createNewTask(titleValue, bodyValue); //!!! {5}
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset(); //!!!! {6}
  }

  //!!!!!!!!!!!!!!!!!!!!!!!!!! (2)
  //Была создана функция createNewTask которая занимается тем, что она создает один объект задачи, в который записывается title и body переданный из обработчика. А также состояние задачи и её id, который случайно генерируется. Далее созданная задача добавляется в список всех задач и возвращается копия новой задачи 
  // Копия новой задачи получается в переменной task {5}
  // на следующем шаге создаем с помощью функции listItemTemplate DOM Объект шаблон элемента списка на основе созданного задания (task). Получив этот DOM объект он добавляется при помощи свойства insertAdjacentElement в самое начало списка задач и сбрасывается форма при помощи {6}
  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    };

    objOfTasks[newTask._id] = newTask;
    return { ...newTask }; //возвращение копии новой задачи 
  }

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (3)
  // Был реализован функционал удаления задач, для этого был повешен обработчик событий на весь список в котором генерируется задача {7}. Было добавлено подстверждение удаления задачи, в зависимости от ответа пользователя возвращается true или false. 
  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Точно вы хотите удалить задачу: ${title}`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (5)
  // Функция проверяет если было подтверждение(true) то она удаляет задачу из разметки, если не было в таком случае она прекращает своё действие. 
  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (4)
  // При клике на весь список определяется на кого произошёл клик, если это кнопка удаления с классом .'delete-btn', тогда находится родитель по атрибуту "[data-task-id]", который был предварительно добавлен в функцию listItemTemplate. При генерации этот атрибут добавляется на каждый элемент для того, чтобы в последующем определить, какой конкретный элемент хотим удалить из DOM. Далее забирается id и передается в deleteTask(id). Далее получаем статус confirmed (true или false) и затем он передается в функцию deleteTaskFromHtml.
  function onDeletehandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent);
    }
  }

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (6)
  // Функция onThemeSelectHandler позволяет пользователю выбрать цветовую схему веб-страницы с сохранением её в localStorage, что при обновлении веб-страницы она будет сохранена. 
  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;
    const isConfirmed = confirm(
      `Вы действительно хотите изменить тему: ${selectedTheme}`
    );
    if (!isConfirmed) {
      themeSelect.value = lastSelectedTheme;
      return;
    }
    setTheme(selectedTheme);
    lastSelectedTheme = selectedTheme;
    localStorage.setItem("app_theme", selectedTheme);
  }

  function setTheme(name) {
    const selectedThemObj = themes[name];
    Object.entries(selectedThemObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
})(tasks);
