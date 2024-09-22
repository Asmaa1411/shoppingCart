document.addEventListener('DOMContentLoaded', function() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Redirect if not logged in
  if (['../pages/cart/cart.html', '../pages/products/products.html'].some(page => window.location.pathname.includes(page))) {
      if (!localStorage.getItem('loggedInUser')) {
          window.location.href = '../pages/login/login.html';
      }
  }

  // Login functionality
  if (window.location.pathname.includes('../pages/login/login.html')) {
      document.getElementById('loginForm').addEventListener('submit', function(e) {
          e.preventDefault();
          const email = document.getElementById('email').value;
          localStorage.setItem('loggedInUser', email);
          window.location.href = '../index.html';
      });
  }

  // Logout functionality
  document.getElementById('logoutButton').addEventListener('click', function() {
    // Remove user data from localStorage
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('cart'); // Optionally clear the cart as well

    // Redirect to login page
    window.location.href = '../pages/login/login.html';
  });

  // Update cart count from localStorage
  document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cartCount').textContent = cart.length;
  });

  // Add event listener to the cart button
  document.getElementById('cartButton').addEventListener('click', function() {
    window.location.href = '../pages/cart/cart.html'; // Navigate to the cart page
  });


  

  // Add to Cart functionality on Products page
  if (window.location.pathname.includes('../pages/products/products.html')) {
      document.querySelectorAll('.add-to-cart').forEach(button => {
          button.addEventListener('click', function() {
              const productName = this.getAttribute('data-product');
              const productPrice = this.getAttribute('data-price');
              const productImage = this.getAttribute('data-image');
              
              // Check if product already exists in the cart
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
  if (window.location.pathname.includes('../pages/cart/cart.html')) {
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

          // Calculate total price based on quantity
          const itemTotalPrice = parseFloat(item.price) * item.quantity;
          totalPrice += itemTotalPrice;

          // Update price when quantity changes
          const quantityInput = cartItem.querySelector(`#quantity-${index}`);
          quantityInput.addEventListener('input', function() {
              const newQuantity = parseFloat(this.value);
              item.quantity = newQuantity;
              localStorage.setItem('cart', JSON.stringify(cart));
              updateTotalPrice();
          });
      });

      totalPriceElement.textContent = totalPrice.toFixed(2);

      // Remove item from cart
      document.querySelectorAll('.remove-item').forEach(button => {
          button.addEventListener('click', function() {
              const index = this.getAttribute('data-index');
              cart.splice(index, 1);
              localStorage.setItem('cart', JSON.stringify(cart));
              window.location.reload();
          });
      });
  }

  // Update cart count on load
  updateCartCount();

  // Add event listener to the cart button
  const cartButton = document.getElementById('cartButton');
  if (cartButton) {
      cartButton.addEventListener('click', function() {
          window.location.href = '../pages/cart/cart.html';
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
