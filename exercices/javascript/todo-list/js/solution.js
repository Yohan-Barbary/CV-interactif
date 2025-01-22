// Gestion du stockage local
class TodoStorage {
    constructor() {
        this.key = 'todos';
    }

    getTodos() {
        const todos = localStorage.getItem(this.key);
        return todos ? JSON.parse(todos) : [];
    }

    saveTodos(todos) {
        localStorage.setItem(this.key, JSON.stringify(todos));
    }
}

// Gestion de l'interface utilisateur
class TodoUI {
    constructor() {
        this.storage = new TodoStorage();
        this.todos = this.storage.getTodos();
        this.filter = 'all';
        
        this.initElements();
        this.initEventListeners();
        this.renderTodos();
    }

    initElements() {
        this.todoInput = document.querySelector('.todo-input input');
        this.addButton = document.querySelector('.add-btn');
        this.todoList = document.querySelector('.todo-list');
        this.filterButtons = document.querySelectorAll('.filter-btn');
    }

    initEventListeners() {
        // Ajouter une tâche
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filtrage
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.renderTodos();
            });
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (text === '') return;

        const todo = {
            id: Date.now(),
            text,
            completed: false
        };

        this.todos.push(todo);
        this.storage.saveTodos(this.todos);
        this.todoInput.value = '';
        this.renderTodos();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        this.storage.saveTodos(this.todos);
        this.renderTodos();
    }

    deleteTodo(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        todoElement.classList.add('fade-out');

        setTimeout(() => {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.storage.saveTodos(this.todos);
            this.renderTodos();
        }, 300);
    }

    getFilteredTodos() {
        switch (this.filter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = todo.id;
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn" title="Marquer comme ${todo.completed ? 'non ' : ''}terminé">
                    <i class="fas fa-check"></i>
                </button>
                <button class="delete-btn" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Événements des boutons
        const completeBtn = li.querySelector('.complete-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        completeBtn.addEventListener('click', () => this.toggleTodo(todo.id));
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        return li;
    }

    renderTodos() {
        this.todoList.innerHTML = '';
        const filteredTodos = this.getFilteredTodos();

        filteredTodos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todoList.appendChild(todoElement);
            
            // Animation d'entrée
            requestAnimationFrame(() => {
                todoElement.classList.add('fade-in');
            });
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new TodoUI();
});

// Styles pour les animations
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