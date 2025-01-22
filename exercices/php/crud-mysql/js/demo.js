// Données de démo
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

// Affichage des produits de démo
document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.querySelector('.products-list');
    if (productsList) {
        productsList.innerHTML = demoProducts.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-price">${product.price.toFixed(2)} €</p>
                    <p class="product-description">${product.description}</p>
                    <p class="product-stock">Stock: ${product.stock}</p>
                </div>
            </div>
        `).join('');
    }
}); 