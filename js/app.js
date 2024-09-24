document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Redirect if not logged in
    if (['pages/cart/cart.html', 'pages/products/products.html'].some(page => window.location.pathname.includes(page))) {
        if (!localStorage.getItem('loggedInUser')) {
            window.location.href = '/pages/login/login.html'; // Updated path
        }
    }

    // Login functionality
    if (window.location.pathname.includes('/pages/login/login.html')) { // Updated path
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            localStorage.setItem('loggedInUser', email);
            window.location.href = '/index.html'; // Updated path
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('cart'); // Optionally clear the cart as well
            window.location.href = '/pages/login/login.html'; // Updated path
        });
    }

    // Update cart count from localStorage
    updateCartCount();

    // Add event listener to the cart button
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            window.location.href = '/pages/cart/cart.html'; // Updated path
        });
    }

    // Add to Cart functionality on Products page
    if (window.location.pathname.includes('/pages/products/products.html')) { // Updated path
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productName = this.getAttribute('data-product');
                const productPrice = this.getAttribute('data-price');
                const productImage = this.getAttribute('data-image');

                const existingProduct = cart.find(item => item.name === productName);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push({
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Product added to cart');
                updateCartCount();
            });
        });
    }

    // Display Cart Items on Cart page
    if (window.location.pathname.includes('/pages/cart/cart.html')) { // Updated path
        const cartItemsContainer = document.getElementById('cartItems');
        const totalPriceElement = document.getElementById('totalPrice');
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item-card');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <p>Price: $<span class="item-price">${item.price}</span> / lb</p>
                    <div>
                        <label for="quantity-${index}">Quantity (lb):</label>
                        <input type="number" id="quantity-${index}" class="quantity-input" value="${item.quantity}" min="1">
                    </div>
                    <button class="btn btn-danger remove-item" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);

            const itemTotalPrice = parseFloat(item.price) * item.quantity;
            totalPrice += itemTotalPrice;

            const quantityInput = cartItem.querySelector(`#quantity-${index}`);
            quantityInput.addEventListener('input', function() {
                const newQuantity = parseFloat(this.value);
                item.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateTotalPrice();
            });
        });

        totalPriceElement.textContent = totalPrice.toFixed(2);

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                window.location.reload();
            });
        });
    }

    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cartCount').textContent = cart.length;
    }

    // Function to update total price
    function updateTotalPrice() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalPrice += parseFloat(item.price) * item.quantity;
        });

        document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    }
});
