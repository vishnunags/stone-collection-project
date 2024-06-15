document.addEventListener('DOMContentLoaded', () => {
    const apiEndpoint = 'http://localhost:3001/api/products'; // Replace with your API endpoint

    // Function to fetch and display ordered products
    const fetchAndDisplayProducts = () => {
        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                const productList = document.getElementById('product-list');
                productList.innerHTML = ''; // Clear previous product list

                // Divide products into rows with 3 items per row
                const rowSize = 3;
                for (let i = 0; i < data.length; i += rowSize) {
                    const row = document.createElement('div');
                    row.className = 'product-list-container'; // Apply container styles

                    for (let j = i; j < i + rowSize && j < data.length; j++) {
                        const productItem = createProductItem(data[j]);
                        row.appendChild(productItem);
                    }

                    productList.appendChild(row);
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    // Function to create a product item DOM element
    const createProductItem = (product) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productImage = document.createElement('img');
        productImage.src = product.image; // Assuming product.image is a valid URL
        productImage.alt = product.name;

        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';

        const productName = document.createElement('div');
        productName.className = 'product-name';
        productName.textContent = product.name;

        const productPrice = document.createElement('div');
        productPrice.className = 'product-price';
        productPrice.textContent = `$${product.price}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            deleteProduct(product.id);
        });

        productDetails.appendChild(productName);
        productDetails.appendChild(productPrice);
        productItem.appendChild(productImage);
        productItem.appendChild(productDetails);
        productItem.appendChild(deleteButton);

        return productItem;
    };

    // Function to delete a product
    const deleteProduct = (productId) => {
        fetch(`${apiEndpoint}/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Product deleted successfully!');
                fetchAndDisplayProducts(); // Refresh product list
            } else {
                throw new Error('Failed to delete product');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        });
    };

    // Event listener for the "New Product" form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Get form data
            const formData = new FormData(productForm);
            const newProduct = {
                name: formData.get('productName'),
                description: formData.get('productDescription'),
                price: parseFloat(formData.get('productPrice')),
                image: formData.get('productImage')
            };

            // Example: Post new product data to API (replace with your actual API POST method)
            fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Product added successfully:', data);
                // Clear form after successful submission
                productForm.reset();
                alert('Product added successfully!');
                fetchAndDisplayProducts(); // Refresh product list

                // Redirect to main page (index.html) after adding a product
                window.location.href = 'vishnu.html'; // Adjust the URL as needed
            })
            .catch(error => {
                console.error('Error adding product:', error);
                alert('Failed to add product. Please try again.');
            });
        });
    }

    // Initialize page by fetching and displaying products
    fetchAndDisplayProducts();
});
