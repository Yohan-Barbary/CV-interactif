// Données de démo pour les produits
const demoProducts = [
    {
        id: 1,
        name: "Ordinateur Portable",
        price: 999.99,
        description: "Ordinateur portable haute performance",
        stock: 15
    },
    {
        id: 2,
        name: "Smartphone",
        price: 699.99,
        description: "Smartphone dernière génération",
        stock: 25
    },
    {
        id: 3,
        name: "Tablette",
        price: 449.99,
        description: "Tablette tactile 10 pouces",
        stock: 10
    }
];

class CrudDemo {
    constructor() {
        this.products = [...demoProducts];
        this.initElements();
        this.initEventListeners();
        this.displayProducts();
    }

    initElements() {
        this.productsList = document.querySelector('.products-list');
        this.addButton = document.querySelector('.btn-add');
        this.modalTemplate = `
            <div class="modal">
                <div class="modal-content">
                    <h3>Ajouter un Produit</h3>
                    <form id="productForm">
                        <div class="form-group">
                            <label for="name">Nom du produit</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="price">Prix</label>
                            <input type="number" id="price" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="stock">Stock</label>
                            <input type="number" id="stock" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-save">Enregistrer</button>
                            <button type="button" class="btn-cancel">Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        this.addButton.addEventListener('click', () => this.showAddModal());
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-edit')) {
                const productId = parseInt(e.target.dataset.id);
                this.editProduct(productId);
            }
            if (e.target.matches('.btn-delete')) {
                const productId = parseInt(e.target.dataset.id);
                this.deleteProduct(productId);
            }
        });
    }

    displayProducts() {
        const productsHtml = this.products.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toFixed(2)} €</p>
                    <p class="description">${product.description}</p>
                    <p class="stock">Stock: ${product.stock}</p>
                </div>
                <div class="product-actions">
                    <button class="btn-edit" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.productsList.innerHTML = productsHtml || `
            <div class="no-products">
                <p>Aucun produit disponible</p>
            </div>
        `;
    }

    showAddModal(product = null) {
        const modal = document.createElement('div');
        modal.innerHTML = this.modalTemplate;
        document.body.appendChild(modal.firstElementChild);

        const form = document.getElementById('productForm');
        const cancelBtn = form.querySelector('.btn-cancel');

        if (product) {
            form.name.value = product.name;
            form.price.value = product.price;
            form.description.value = product.description;
            form.stock.value = product.stock;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newProduct = {
                id: product ? product.id : this.products.length + 1,
                name: form.name.value,
                price: parseFloat(form.price.value),
                description: form.description.value,
                stock: parseInt(form.stock.value)
            };

            if (product) {
                this.updateProduct(newProduct);
            } else {
                this.addProduct(newProduct);
            }

            this.closeModal();
        });

        cancelBtn.addEventListener('click', () => this.closeModal());
    }

    addProduct(product) {
        this.products.push(product);
        this.displayProducts();
        this.showNotification('Produit ajouté avec succès');
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.showAddModal(product);
        }
    }

    updateProduct(updatedProduct) {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            this.products[index] = updatedProduct;
            this.displayProducts();
            this.showNotification('Produit mis à jour avec succès');
        }
    }

    deleteProduct(productId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.displayProducts();
            this.showNotification('Produit supprimé avec succès');
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Styles supplémentaires pour la démo
const style = document.createElement('style');
style.textContent = `
    .product-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .product-info h3 {
        color: #fff;
        margin: 0 0 0.5rem 0;
    }

    .price {
        color: #4CAF50;
        font-weight: bold;
        margin: 0.5rem 0;
    }

    .description, .stock {
        color: #e0e0e0;
        margin: 0.5rem 0;
    }

    .product-actions {
        display: flex;
        gap: 0.5rem;
    }

    .btn-edit, .btn-delete {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    .btn-edit {
        color: #2196F3;
    }

    .btn-delete {
        color: #f44336;
    }

    .btn-edit:hover, .btn-delete:hover {
        transform: translateY(-2px);
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: #1a1a1a;
        padding: 2rem;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        color: #fff;
        margin-bottom: 0.5rem;
    }

    .form-group input, .form-group textarea {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        color: #fff;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);

// Initialisation de la démo
document.addEventListener('DOMContentLoaded', () => {
    new CrudDemo();
}); 