// Sélection des éléments du DOM
const todoInput = document.querySelector('.todo-input input');
const addButton = document.querySelector('.add-btn');
const todoList = document.querySelector('.todo-list');

// Exemple de tâches pour la démo
const demoTasks = [
    { id: 1, text: 'Exemple de tâche', completed: false },
    { id: 2, text: 'Tâche terminée', completed: true }
];

// Afficher les tâches de démo
function displayDemoTasks() {
    demoTasks.forEach(task => {
        const todoItem = createTodoItem(task);
        todoList.appendChild(todoItem);
    });
}

// Créer un élément de tâche
function createTodoItem(task) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (task.completed) {
        li.classList.add('completed');
    }

    li.innerHTML = `
        <span class="todo-text">${task.text}</span>
        <div class="todo-actions">
            <button class="complete-btn" title="Marquer comme terminé">
                <i class="fas fa-check"></i>
            </button>
            <button class="delete-btn" title="Supprimer">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Ajouter les écouteurs d'événements pour la démo
    const completeBtn = li.querySelector('.complete-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    completeBtn.addEventListener('click', () => {
        li.classList.toggle('completed');
    });

    deleteBtn.addEventListener('click', () => {
        li.classList.add('fade-out');
        setTimeout(() => li.remove(), 300);
    });

    return li;
}

// Ajouter une nouvelle tâche (pour la démo)
function addDemoTask(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (text !== '') {
        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };

        const todoItem = createTodoItem(task);
        todoList.appendChild(todoItem);
        
        // Animation d'entrée
        todoItem.classList.add('fade-in');
        
        // Réinitialiser l'input
        todoInput.value = '';
    }
}

// Écouteurs d'événements
addButton.addEventListener('click', addDemoTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addDemoTask(e);
    }
});

// Initialiser la démo
displayDemoTasks();

// Ajouter les styles CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    .todo-item {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.3s ease;
    }

    .todo-item.completed .todo-text {
        text-decoration: line-through;
        opacity: 0.6;
    }

    .todo-item.fade-in {
        animation: fadeIn 0.3s ease;
    }

    .todo-item.fade-out {
        opacity: 0;
        transform: translateX(-20px);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style); 