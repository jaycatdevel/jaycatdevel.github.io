let vDesiredCount = 500;
let vCurrentCount = 0;
// Load content from local storage on page load
window.onload = function() {
    const savedContent = localStorage.getItem('novelContent');
    if (savedContent) {
        document.getElementById('novelContent').innerHTML = savedContent;
    }
    const savedCount = localStorage.getItem('desiredCount');
    if (savedCount) {
        vDesiredCount = savedCount;
    }
    updateWordCount(); // Update word count on load    
};

function updateWordCount() {
    const content = document.querySelector('.novel-content').innerText;
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    let vCount = vDesiredCount - words;
    if(vCount < 0) vCount = words;
    document.getElementById('wordCount').innerText = vCount;
    vCurrentCount = words;
    // Save content to local storage
    localStorage.setItem('novelContent', document.getElementById('novelContent').innerHTML);
}

// Download content as a text file
function downloadTextFile() {
    updateWordCount();
    const content = document.getElementById('novelContent').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = vCurrentCount + "_words.txt"; // Name of the downloaded file
    link.click();
    URL.revokeObjectURL(link.href); // Clean up
}

// Clear the text in the content-editable div
function clearText() {
    document.getElementById('novelContent').innerHTML = '';
    updateWordCount(); // Update word count after clearing
}    

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

document.getElementById('openModalBtn').onclick = function() {
    document.getElementById('modal').style.display = 'block';
}

document.getElementById('closeModalBtn').onclick = function() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

document.getElementById('submitBtn').onclick = function() {
    const numberInput = document.getElementById('numberInput').value;
    if (numberInput) {
        vDesiredCount = numberInput;            
        modal.style.display = 'none';
        updateWordCount();
    }
}

// Functionality to add a new to-do item
//document.getElementById('addTodo').onclick = function() {
  //  addTodoItem('New Task',this);
//}

// Function to add a to-do item
function addTodoItem(text, pContext) {
    const newTodo = document.createElement('li');
    newTodo.className = 'card';
    newTodo.contentEditable = true; // Make the new to-do editable
    newTodo.textContent = 'New Task'; // Default text
    newTodo.onblur = function() {
        if (newTodo.textContent.trim() === '') {
            newTodo.remove(); // Remove if empty
        }
    };

    // Create delete icon
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'delete-icon';
    deleteIcon.innerHTML = '&#x1F5D1;'; // Unicode for delete icon
    deleteIcon.onclick = function(event) {
        event.stopPropagation(); // Prevent triggering the drag event
        newTodo.remove(); // Remove the to-do item
    };

    newTodo.appendChild(deleteIcon); // Append delete icon to the new to-do
    newTodo.setAttribute('draggable', true); // Make it draggable
    newTodo.ondragstart = dragStart; // Set drag start event
    newTodo.ondragover = dragOver; // Set drag over event
    newTodo.ondrop = drop; // Set drop event
    document.getElementById('todoList').insertBefore(newTodo, pContext);
    newTodo.focus(); // Focus on the new to-do item
}

// Drag and drop functions
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.innerHTML);
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
}

function dragOver(event) {
    event.preventDefault(); // Prevent default to allow drop
}

function drop(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const dropzone = event.target;

    if (dropzone.classList.contains('card') && dropzone !== draggingElement) {
        const todoList = document.getElementById('todoList');
        todoList.insertBefore(draggingElement, dropzone.nextSibling);
    }
    draggingElement.classList.remove('dragging');
    saveTodos(); // Save todos after reordering
}

// Add drag event listeners to existing to-do items
const todoItems = document.querySelectorAll('.card');
todoItems.forEach(item => {
    item.setAttribute('draggable', true);
    item.ondragstart = dragStart;
    item.ondragover = dragOver;
    item.ondrop = drop;
});

// Function to delete a to-do item
function deleteTodo(event) {
    event.stopPropagation(); // Prevent triggering the drag event
    const todoItem = event.target.parentElement;
    todoItem.remove();
    saveTodos(); // Save todos after reordering
}

// Load to-do items from localStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        addTodoItem(todo.text);
    });
}

// Save to-do items to localStorage
function saveTodos() {
    const todos = [];
    const todoItems = document.querySelectorAll('.card');
    todoItems.forEach(item => {
        todos.push({ text: item.textContent.replace('🗑️', '').trim() });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}