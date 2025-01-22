class CrudApp {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.initElements();
        this.initEventListeners();
        this.loadProducts();
    }

    initElements() {
        this.productsList = document.querySelector('.products-list');
        this.pagination = document.querySelector('.pagination');
        this.modal = document.getElementById('productModal');
        this.form = document.getElementById('productForm');
    }

    initEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-edit')) {
                const productId = e.target.dataset.id;
                this.editProduct(productId);
            }
            if (e.target.matches('.btn-delete')) {
                const productId = e.target.dataset.id;
                this.deleteProduct(productId);
            }
        });
    }

    async loadProducts() {
        try {
            const response = await fetch(`php/read.php?page=${this.currentPage}&limit=${this.itemsPerPage}`);
            const data = await response.json();
            
            if (data.success) {
                this.displayProducts(data.data.products);
                this.setupPagination(data.data.pagination);
            } else {
                this.showNotification(data.message, 'error');
            }
        } catch (error) {
            this.showNotification('Erreur lors du chargement des produits', 'error');
        }
    }

    displayProducts(products) {
        this.productsList.innerHTML = products.length ? products.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-price">${parseFloat(product.price).toFixed(2)} €</p>
                    <p class="product-description">${product.description}</p>
                    <p class="product-stock">Stock: ${product.stock}</p>
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
        `).join('') : '<div class="no-products">Aucun produit disponible</div>';
    }

    setupPagination(pagination) {
        const { total, page, pages } = pagination;
        let paginationHtml = '';

        if (pages > 1) {
            if (page > 1) {
                paginationHtml += `<button class="page-btn" data-page="${page - 1}">«</button>`;
            }

            for (let i = 1; i <= pages; i++) {
                paginationHtml += `
                    <button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            }

            if (page < pages) {
                paginationHtml += `<button class="page-btn" data-page="${page + 1}">»</button>`;
            }
        }

        this.pagination.innerHTML = paginationHtml;
        this.pagination.addEventListener('click', (e) => {
            if (e.target.matches('.page-btn')) {
                this.currentPage = parseInt(e.target.dataset.page);
                this.loadProducts();
            }
        });
    }

    async handleSubmit() {
        const formData = {
            name: this.form.name.value,
            price: this.form.price.value,
            description: this.form.description.value,
            stock: this.form.stock.value
        };

        const productId = this.form.productId.value;
        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `php/update.php` : 'php/create.php';

        if (productId) {
            formData.id = productId;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                this.showNotification(data.message, 'success');
                this.loadProducts();
                this.closeModal();
            } else {
                this.showNotification(data.message, 'error');
            }
        } catch (error) {
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }

    async editProduct(id) {
        try {
            const response = await fetch(`php/read.php?id=${id}`);
            const data = await response.json();
            
            if (data.success) {
                const product = data.data;
                this.form.productId.value = product.id;
                this.form.name.value = product.name;
                this.form.price.value = product.price;
                this.form.description.value = product.description;
                this.form.stock.value = product.stock;
                this.showModal();
            }
        } catch (error) {
            this.showNotification('Erreur lors du chargement du produit', 'error');
        }
    }

    async deleteProduct(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                const response = await fetch(`php/delete.php?id=${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                
                if (data.success) {
                    this.showNotification(data.message, 'success');
                    this.loadProducts();
                } else {
                    this.showNotification(data.message, 'error');
                }
            } catch (error) {
                this.showNotification('Erreur lors de la suppression', 'error');
            }
        }
    }

    showModal() {
        this.modal.style.display = 'flex';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.form.reset();
        this.form.productId.value = '';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CrudApp();
});

// Fonction globale pour le bouton d'ajout
function showAddModal() {
    window.app.showModal();
}

// Fonction globale pour fermer le modal
function closeModal() {
    window.app.closeModal();
} 