var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
/////////////////////////menubar/////////////////////////////////////
var bod = document.querySelector(".bod");
var menuBar = document.querySelector("#menu-btn");
var close = document.getElementById("close-btn");
menuBar.addEventListener("click", () => {
  bod.classList.toggle("show-the-menu");
});
close.addEventListener("click", () => {
  bod.classList.remove("show-the-menu");
});

// // JavaScript code to handle the click event on each product card
// document.querySelectorAll(".pro").forEach(function (product) {
//   product.addEventListener("click", function () {
//     // Retrieve product details from data attributes
//     const productName = this.getAttribute("data-name");
//     const productPrice = this.getAttribute("data-price");
//     const productImage = this.getAttribute("data-image");

//     // Update the single product section with the clicked product's details
//     document.getElementById("productName").textContent = productName;
//     document.getElementById("productPrice").textContent = "LE " + productPrice;
//     document.getElementById("mainImg").src = productImage;

//     document.getElementById("prodetails").style.display = "block";
//   });
// });

////////////////QUANTATY///////////
var incrementQty;
var decrementQty;
// var plusBtn = $(".cart-qty-plus");
var plusBtn = $(".cart-qty-plus");
var minusBtn = $(".cart-qty-minus");
var incrementQty = plusBtn.click(function () {
  var $n = $(this).parent(".button-container").find(".qty");
  $n.val(Number($n.val()) + 1);
  update_amounts();
});

var decrementQty = minusBtn.click(function () {
  var $n = $(this).parent(".button-container").find(".qty");
  var QtyVal = Number($n.val());
  if (QtyVal > 1) {
    $n.val(QtyVal - 1);
  }
  update_amounts();
});

/////////////////
var MainImg = document.getElementById("mainImg");
var smallImg = document.getElementsByClassName("small-img");

smallImg[0].onclick = function () {
  MainImg.src = smallImg[0].src;
};
smallImg[1].onclick = function () {
  MainImg.src = smallImg[1].src;
};
smallImg[2].onclick = function () {
  MainImg.src = smallImg[2].src;
};
smallImg[3].onclick = function () {
  MainImg.src = smallImg[3].src;
};

//////////////////
function viewProductDetails(product) {
  const productName = product.getAttribute("data-name");
  const productPrice = product.getAttribute("data-price");
  const productImages = product.getAttribute("data-images");
  const productSizes = product.getAttribute("data-sizes");
  // Get the raw string
  // const selectedProduct = product.find((p) => p.name === productName);
  // Redirect to singlepro.html with product details as URL parameters
  window.location.href = ` singlepro.html?name=${encodeURIComponent(
    productName
  )}&price=${encodeURIComponent(productPrice)}&images=${encodeURIComponent(
    productImages
  )}&sizes=${encodeURIComponent(productSizes)}`;
}

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get("name");
  const productPrice = urlParams.get("price");
  const productImages = urlParams.get("images").split(","); // Split the images into an array
  const productSizes = urlParams.get("sizes").split(",");
  // Update the single product section with the details from the URL
  document.getElementById("productName").textContent = productName;
  document.getElementById("productPrice").textContent = "LE " + productPrice;

  // Update the images (main image and small images)
  document.getElementById("mainImg").src = productImages[0];
  document.getElementById("img1").src = productImages[0];
  document.getElementById("img2").src = productImages[1];
  document.getElementById("img3").src = productImages[2];
  document.getElementById("img4").src = productImages[3];

  const sizeSelect = document.querySelector("select");
  sizeSelect.innerHTML = `<option>select size</option>`; // Reset options
  productSizes.forEach((size) => {
    sizeSelect.innerHTML += `<option>${size}</option>`;
  });
  if (sizeSelect.innerHTML === "<option>select size</option>") {
    alert("Please select a size.");
    return;
  }
};

//add to cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.querySelector(".carto").addEventListener("click", addToCart);
document
  .querySelectorAll(".bago, .bag")
  .forEach((icon) => icon.addEventListener("click", openCart));

function addToCart() {
  const productName = document.getElementById("productName").textContent;
  const productPrice = parseFloat(
    document.getElementById("productPrice").textContent.replace("LE", "").trim()
  );
  const productImage = document.getElementById("mainImg").src;
  const selectedSize = document.querySelector("select").value;
  const quantity = parseInt(document.querySelector(".qty").value);

  if (selectedSize === "select size") {
    alert("Please select a size.");
    return;
  }

  let productInCart = cart.find(
    (item) => item.name === productName && item.size === selectedSize
  );

  if (productInCart) {
    productInCart.quantity += quantity;
  } else {
    cart.push({
      name: productName,
      price: productPrice,
      quantity: quantity,
      image: productImage,
      size: selectedSize,
    });
  }

  saveCart();
  renderCart();
  updateCartCounter();
  closeCart();
  setTimeout(openCart, 100); // Ensures the cart reopens after closing
}
// const products = [
//   {
//     id: 1,
//     name: "Mobile Phone",
//     price: 500,
//     images: ["../myou/img/scarves.jpg"],
//   },
//   {
//     id: 2,
//     name: "Smart Watch",
//     price: 200,
//     images: ["../myou/img/scarves.jpg"],
//   },
//   { id: 3, name: "Sunglasses", price: 50, images: ["../myou/img/scarves.jpg"] },
// ];

// function renderProducts(products) {
//   const productContainer = document.getElementById("Product-cont");
//   productContainer.innerHTML = "";
//   products.forEach((product) => {
//     const productHTML = `
//         <div class="pro" onclick="viewProductDetails(this);" data-name="${
//           product.name
//         }" data-price="${product.price}" data-images="${product.images.join(
//       " , "
//     )}" >

//       <img src="${product.images[0]}" alt="">
//       <div class="des">
//        <h5 >${product.name}</h5>
//        <h4>${product.price}</h4>
//       </div>
//       <a href="#" ><i  class=" fa-solid fa-cart-shopping cart"></i></a>
//     </div>

//     `;

//     // productContainer.innerHTML += productHTML;
//   });
// }

//   renderProducts(products);
// script.js
// Array of product objects
// const products = [
//   { id: 1, name: "Product 1", price: 100, img: "../myou/img/scarves.jpg" },
//   {
//     id: 2,
//     name: "Product 2",
//     price: 150,
//     img: "../myou/img/scarves.jpg",
//   },
//   {
//     id: 3,
//     name: "Product 3",
//     price: 200,
//     img: "../myou/img/scarves.jpg",
//   },
// ];

// // Function to create and render product cards
// function renderProductCards(products) {
//   const container = document.getElementById("Product-cont");

//   // Clear the container if needed
//   container.innerHTML = '';

//   products.forEach(product => {
//     // Create a new div element for the product card
//     const card = document.createElement('div');
//     card.classList.add('product-card');

//     // Create the HTML content for each product card
//     card.innerHTML = `
//       <img src="${product.img}" alt="${product.name}">
//       <h3 class="product-name">${product.name}</h3>
//       <p class="product-price">$${product.price}</p>
//     `;

//     // Append the card to the container
//     container.appendChild(card);
//   });
// }

// // Call the function to render the product cards
// renderProductCards(products);

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = ""; // Clear cart display

  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
            <img src="${item.image}" alt="${
      item.name
    }" width="70px" height="70px">
            <p>${item.name} - Size: ${item.size}</p>
            <p>Price: LE ${item.price.toFixed(2)}</p>
            <p>Quantity: 
                <button class="cart-qty-minus" data-name="${
                  item.name
                }" data-size="${item.size}">-</button>
                <span>${item.quantity}</span>
                <button class="cart-qty-plus" data-name="${
                  item.name
                }" data-size="${item.size}">+</button>
            </p>
            <hr>
            <p>Total: LE ${(item.price * item.quantity).toFixed(2)}</p>
        `;
    cartItemsContainer.appendChild(itemElement);
  });

  updateCartTotal();
}

function updateCartTotal() {
  const cartTotalContainer = document.getElementById("cart-total");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalContainer.textContent = `Total: LE ${total.toFixed(2)}`;
  return total;
}

function checkout(event) {
  event.preventDefault();
  // Assuming total holds the cart's total value
  let total = updateCartTotal(); // Replace this with your actual logic to get the total value

  if (total === 0) {
    // Display an error message or perform any error handling
    alert("Your cart is empty. Please add items before checking out.");
    return;
  } else {
    // Proceed to checkout process
    proceedToCheckout(); // Replace this with your actual checkout logic
  }
}

// Assuming this is the function triggered when the checkout button is clicked
document
  .getElementById("checkout-button")
  .addEventListener("click", function (event) {
    checkout(event);
  });

// Helper function to simulate getting cart total, replace with real logic
// function getCartTotal() {
//   // Replace this with the actual logic to get the cart's total
//   return 0; // For testing purposes, the total is 0
// }

// Dummy function to simulate the checkout process
function proceedToCheckout() {
  console.log("Proceeding to checkout...");
}

document
  .getElementById("cart-items")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("cart-qty-plus")) {
      const productName = event.target.getAttribute("data-name");
      const productSize = event.target.getAttribute("data-size");
      changeQuantity(productName, productSize, 1);
    } else if (event.target.classList.contains("cart-qty-minus")) {
      const productName = event.target.getAttribute("data-name");
      const productSize = event.target.getAttribute("data-size");
      changeQuantity(productName, productSize, -1);
    }
  });

function changeQuantity(productName, productSize, change) {
  let productInCart = cart.find(
    (item) => item.name === productName && item.size === productSize
  );
  if (productInCart) {
    productInCart.quantity += change;
    if (productInCart.quantity <= 0) {
      cart = cart.filter(
        (item) => item.name !== productName || item.size !== productSize
      );
    }
  }

  saveCart();
  renderCart();
  updateCartCounter();
}

function openCart() {
  document.getElementById("cart-sidebar").classList.add("open");
}

function closeCart() {
  document.getElementById("cart-sidebar").classList.remove("open");
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCounter() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document
    .querySelectorAll(".zero")
    .forEach((counter) => (counter.textContent = totalItems));
}

// Load cart on page load
document.addEventListener("DOMContentLoaded", function () {
  renderCart();
  updateCartCounter();
  if (cart.length > 0) {
    openCart(); // Automatically open the cart if there are items in it
  }
});

// Close button event
document
  .getElementById("close-cart-btn")
  .addEventListener("click", function () {
    closeCart();
  });

document
  .getElementById("checkout-button")
  .addEventListener("click", function () {
    window.location.href = "checkout.html";
  });
