"use strict";

class ToDo {
  constructor(element) {
    this.todo = element;

    this.#init();
  }

  #init() {
    this.#findElements();
    this.#addListeners();
  }

  #findElements() {
    this.form = this.todo.querySelector(".todo__form");
    this.input = this.form.querySelector(".form__input");
    this.addButton = this.form.querySelector(".form__button");

    this.list = this.todo.querySelector(".todo__list");
  }

  #addListeners() {
    this.form.addEventListener("submit", this.#handleFormSubmit.bind(this));
    this.list.addEventListener("click", this.#handleListClick.bind(this));
  }

  // Handlers
  #handleFormSubmit(e) {
    e.preventDefault();
    const value = this.input.value;
    this.input.value = "";
    if (value.trim().length === 0) return;

    this.#createListItem(value);
  }

  #handleListClick(e) {
    const { target } = e;
    if (target.classList.contains("list__button")) {
      this.#handleListAction(target);
    }
  }
  // End handlers

  #handleListAction(target) {
    const typeAction = this.#getActionType(target);
    const listItem = target.closest(".list__item");
    const targetText = target.innerText.toLowerCase();

    switch (typeAction) {
      case "complete":
        listItem.classList.toggle("list__item_completed");
        target.innerText =
          targetText === "выполнить" ? "Не выполнено" : "Выполнить";
        break;
      case "important":
        listItem.classList.toggle("list__item_important");
        target.innerText = targetText === "важно" ? "Не важно" : "Важно";
        break;
      case "delete":
        listItem.remove();
        break;
    }
  }

  #getActionType(target) {
    let action;
    switch (true) {
      case target.classList.contains("list__button_complete"):
        action = "complete";
        break;
      case target.classList.contains("list__button_important"):
        action = "important";
        break;
      case target.classList.contains("list__button_delete"):
        action = "delete";
        break;
      default:
        action = null;
    }

    return action;
  }

  // #createListItem(value) {
  //   const newItem = `
  //   <li class="list__item"}>
  //     <span class="list__text">${value}</span>
  //     <button
  //       aria-label="Отметить задачу как важную"
  //       class="list__button list__button_important"
  //     >Важно</button>
  //     <button
  //       aria-label="Отметить задачу как выполненную"
  //       class="list__button list__button_complete"
  //     >Выполнить</button>
  //     <button
  //       aria-label="Удалить задачу"
  //       class="list__button list__button_delete"
  //     >Удалить</button>
  //   </li>`;

  //   this.list.insertAdjacentHTML("beforeend", newItem);
  // }

  #createListItem(value) {
    const listItem = document.createElement("li");
    listItem.classList.add("list__item");

    const textSpan = document.createElement("span");
    textSpan.classList.add("list__text");
    textSpan.textContent = value;

    const importantButton = this.#createButton(
      "list__button_important",
      "Важно"
    );
    const completeButton = this.#createButton(
      "list__button_complete",
      "Выполнить"
    );
    const deleteButton = this.#createButton("list__button_delete", "Удалить");

    const creationDate = document.createElement("span");
    creationDate.classList.add("list__creationDate");
    creationDate.textContent = new Date().toISOString();
    creationDate.style.display = "none";

    listItem.append(textSpan, importantButton, completeButton, deleteButton, creationDate);
    this.list.appendChild(listItem);
    dateSort();
  }

  #createButton(buttonClass, buttonText) {
    const button = document.createElement("button");
    button.classList.add("list__button", buttonClass);
    button.textContent = buttonText;
    return button;
  }
}

new ToDo(document.querySelector(".todo"));





document.querySelector(".showFilters").addEventListener("click", function () {
  if (document.querySelector(".filterBox").style.display === "none") {
    document.querySelector(".filterBox").style.display = "grid";
    document.querySelector(".showFilters").textContent = "Скрыть фильтры";
  } else {
    document.querySelector(".filterBox").style.display = "none";
    document.querySelector(".showFilters").textContent = "Показать фильтры";
  }
});





function filterTasks() {
  document.querySelectorAll(".list__item").forEach((task) => {
    task.style.display = "none";
    if (document.getElementById("allTasks").checked) {
      if (task.querySelector(".list__text").textContent.toLowerCase().includes(searchTask.value.toLowerCase())) {
        task.style.display = "grid"; 
      }
    } else if (document.getElementById("important").checked) {
      if (task.querySelector(".list__text").textContent.toLowerCase().includes(searchTask.value.toLowerCase()) && task.querySelector(".list__button_important").textContent === "Не важно") {
        task.style.display = "grid"; 
      }
    } else if (document.getElementById("completed").checked) {
      if (task.querySelector(".list__text").textContent.toLowerCase().includes(searchTask.value.toLowerCase()) && task.querySelector(".list__button_complete").textContent === "Не выполнено") {
        task.style.display = "grid"; 
      }  
    } else if (document.getElementById("notCompleted").checked) {
      if (task.querySelector(".list__text").textContent.toLowerCase().includes(searchTask.value.toLowerCase()) && task.querySelector(".list__button_complete").textContent === "Выполнить") {
        task.style.display = "grid"; 
      }
    }
  });
};

document.getElementById("searchTask").addEventListener("input", filterTasks);

document.querySelectorAll(".radiobutton").forEach((radio) => {
  radio.addEventListener("change", filterTasks);
});





function dateSort() {
  const result = Array.from(document.querySelectorAll(".list__item")).sort((a, b) => {
    const dateA = new Date(a.querySelector(".list__creationDate").textContent);
    const dateB = new Date(b.querySelector(".list__creationDate").textContent);
    if (document.querySelector(".date").value === "newest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });
  document.querySelector(".todo__list.list").innerHTML = "";
  result.forEach(e => {
     document.querySelector(".todo__list.list").appendChild(e);
   });
};

document.getElementById("date").addEventListener("change", dateSort);

