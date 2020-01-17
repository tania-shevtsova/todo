import './styles.css';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import PNotifyBrightTheme from '../node_modules/pnotify/dist/PNotifyBrightTheme.css';

let todos = {
    items: [],
    addItems(text, id) {
      const todo = {
        id: id ? id : Date.now(),
        text
      };
  
      this.items.push(todo);
      return todo;
    },
    removeItems(id) {
      return (this.items = this.items.filter(el => el.id !== id));
    }
  };
  
  const refs = {
    form: document.querySelector(".js-editor"),
    list: document.querySelector(".js-todo-list")
  };
  
  const tmp = localStorage.getItem("todos");
  let todoIt;
  if (tmp) {
    try {
      todoIt = JSON.parse(tmp);
    } catch {
      todoIt = {};
    }
  }
  
  if (todoIt && todoIt.items) {
    let startHtml = "";
    todoIt.items.forEach(el => {
      todos.addItems(el.text, el.id);
      startHtml += createItems(el);
    });
    refs.list.innerHTML = startHtml;
  }
  
  refs.form.addEventListener("submit", handleForm);
  refs.list.addEventListener("click", deleteItems);

  function handleForm(e) {
    e.preventDefault();
    let inpValue = e.currentTarget.elements.text.value;
    if(inpValue=== ""){
      PNotify.error('Todo list empty! Please, add an item!');
    }

    else  {
      PNotify.removeAll();
      let todoItem = todos.addItems(inpValue);
  
      let markupTodo = createItems(todoItem);
      localStorage.setItem("todos", JSON.stringify(todos));
      let markup = buildMarkup(refs.list, markupTodo);
    } 
   
  
    refs.form.reset();
  }
  
  function createItems(item) {
    return `<li class="todo-list__item" data-id="${item.id}"><p class="todo__text">${item.text}</p><button class="todo__actions"><span>Удалить</span></button></li>`;
  }
  
  function buildMarkup(list, item) {
    list.insertAdjacentHTML("beforeend", item);
  }
  
  function deleteItems(e) {
    if (e.target.nodeName !== "BUTTON" && e.target.nodeName !== "SPAN") {
      return;
    }
    const btn = e.target;
    const li = btn.closest(".todo-list__item");
  
    const deleteById = Number(li.dataset.id);
    console.log(deleteById);
    let deleted = todos.removeItems(deleteById);
  
    li.remove();
    todoIt = deleted;
    localStorage.setItem("todos", JSON.stringify({ items: todoIt }));
  }