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
        alert(`You entered: ${numberInput}`);
    } else {
        alert('Please enter a number.');
    }
}

// Functionality to add a new to-do item
document.getElementById('addTodo').onclick = function() {
    const newTodo = document.createElement('li');
    newTodo.className = 'card';
    newTodo.contentEditable = true; // Make the new to-do editable
    newTodo.placeholder = 'Enter a new task';
    newTodo.textContent = 'New Task'; // Default text
    newTodo.onblur = function() {
        if (newTodo.textContent.trim() === '') {
            newTodo.remove(); // Remove if empty
        }
    };
    document.getElementById('todoList').insertBefore(newTodo, this);
    newTodo.focus(); // Focus on the new to-do item
}
