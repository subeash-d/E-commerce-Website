let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let main = document.querySelector("main");
let searchInput = document.querySelector(".searchbar input");
let cartCount = document.getElementById("cartCount");

let singleProduct = document.getElementById("singleProduct");
let cartSection = document.getElementById("cartSection");
let checkoutSection = document.getElementById("checkoutSection");

let checkoutItems = [];

async function getData() {
    let res = await fetch("./products.json");
    let data = await res.json();
    products = data;
    displayProducts(products);
    updateCartCount();
}
getData();

function updateCartCount() {
    cartCount.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
}

function displayProducts(data) {
    main.style.display = "grid";
    singleProduct.style.display = "none";
    cartSection.style.display = "none";
    checkoutSection.style.display = "none";
    main.innerHTML = "";

    data.forEach((e) => {
        let div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <img src="${e.image}">
            <h3>${e.title}</h3>
            <p class="price">$${e.price}</p>
            <p class="rating">⭐ ${e.rating.rate}</p>
        `;

        div.onclick = () => {
            localStorage.setItem("selectedProduct", JSON.stringify(e));
            showSingleProduct();
        };

        main.append(div);
    });
}

function showSingleProduct() {
    let p = JSON.parse(localStorage.getItem("selectedProduct"));

    main.style.display = "none";
    cartSection.style.display = "none";
    checkoutSection.style.display = "none";
    singleProduct.style.display = "grid";

    singleProduct.innerHTML = `
        <div><img src="${p.image}" width="300"></div>
        <div>
            <h1>${p.title}</h1>
            <h2>$${p.price}</h2>
            <p>${p.description}</p>

            <button onclick="addToCart(${p.id})">Add to Cart</button>
            <button onclick="buyNow(${p.id})">Buy Now</button>
            <br><br>
            <button onclick="displayProducts(products)">← Back</button>
        </div>
    `;
}

function addToCart(id) {
    let p = products.find(x => x.id === id);
    let found = cart.find(i => i.id === id);

    if (found) found.qty++;
    else cart.push({ ...p, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart");
}

function buyNow(id) {
    let p = products.find(x => x.id === id);
    checkoutItems = [{ ...p, qty: 1 }];
    showCheckout();
}

function showCart() {
    main.style.display = "none";
    singleProduct.style.display = "none";
    checkoutSection.style.display = "none";
    cartSection.style.display = "block";

    if (cart.length === 0) {
        cartSection.innerHTML = "<h2>Cart is empty</h2>";
        return;
    }

    let total = 0;
    cartSection.innerHTML = "<h2>Your Cart</h2>";

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        cartSection.innerHTML += `
            <p>${item.title} — $${item.price} × ${item.qty}</p>
            <button onclick="increaseQty(${index})">+</button>
            <button onclick="decreaseQty(${index})">−</button>
            <hr>
        `;
    });

    cartSection.innerHTML += `
        <h3>Total: $${total.toFixed(2)}</h3>
        <button onclick="checkoutFromCart()">Checkout</button>
        <button onclick="displayProducts(products)">← Back</button>
    `;
}

function checkoutFromCart() {
    checkoutItems = [...cart];
    showCheckout();
}

function showCheckout() {
    main.style.display = "none";
    singleProduct.style.display = "none";
    cartSection.style.display = "none";
    checkoutSection.style.display = "block";

    let total = 0;
    checkoutSection.innerHTML = "<h2>Checkout</h2>";

    checkoutItems.forEach(item => {
        total += item.price * item.qty;
        checkoutSection.innerHTML += `
            <p>${item.title} — $${item.price} × ${item.qty}</p>
        `;
    });

    checkoutSection.innerHTML += `
        <h3>Total Payable: $${total.toFixed(2)}</h3>

        <h3>Shipping Details</h3>
        <input placeholder="Name"><br><br>
        <input placeholder="Address"><br><br>
        <input placeholder="Phone"><br><br>

        <button onclick="placeOrder()">Place Order</button>
        <button onclick="displayProducts(products)">Cancel</button>
    `;
}

function placeOrder() {
    alert("Order placed successfully 🎉");

    cart = [];
    checkoutItems = [];
    localStorage.removeItem("cart");
    updateCartCount();

    displayProducts(products);
}

function increaseQty(i) {
    cart[i].qty++;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showCart();
}

function decreaseQty(i) {
    if (cart[i].qty > 1) cart[i].qty--;
    else cart.splice(i, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showCart();
}

searchInput.addEventListener("input", e => {
    let val = e.target.value.toLowerCase();
    displayProducts(products.filter(p => p.title.toLowerCase().includes(val)));
});

document.querySelector(".fa-bag-shopping").onclick = showCart;