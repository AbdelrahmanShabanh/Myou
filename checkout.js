document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const shippingFee = 60;
  const receiptItemsContainer = document.getElementById("receipt-items");
  const receiptTotalContainer = document.getElementById("receipt-total");
  const contactForm = document.getElementById("contact-form");
  const paymentMethodSelect = document.getElementById("payment-method");
  const paymentInfo = document.getElementById("payment-info");
  const submitButton = document.getElementById("submit-button");

  renderReceipt();

  paymentMethodSelect.addEventListener("change", function () {
    updatePaymentInfo();
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm()) {
      saveAndRedirect();
    }
  });

  function renderReceipt() {
    receiptItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemElement = document.createElement("div");
      itemElement.className = "receipt-item";
      itemElement.innerHTML = `
                <img src="${item.image}" alt="${
        item.name
      }" width="70px" height="70px">
                <div>${item.name} - Size: ${item.size}</div>
                <div>Price: LE ${item.price.toFixed(2)}</div>
                <div>Quantity: ${item.quantity}</div>
                <div>Total: LE ${itemTotal.toFixed(2)}</div>
            `;
      receiptItemsContainer.appendChild(itemElement);
    });

    total += shippingFee;

    const shippingElement = document.createElement("div");
    shippingElement.className = "receipt-item";
    shippingElement.innerHTML = `
            <div>Shipping Fee:</div>
            <div>LE ${shippingFee.toFixed(2)}</div>
        `;
    receiptItemsContainer.appendChild(shippingElement);

    receiptTotalContainer.textContent = `Total: LE ${total.toFixed(2)}`;
  }

  function updatePaymentInfo() {
    const selectedMethod = paymentMethodSelect.value;

    if (selectedMethod === "cod") {
      paymentInfo.style.display = "none";
      submitButton.textContent = "Complete Shopping";
    } else {
      paymentInfo.style.display = "block";
      submitButton.textContent = `Pay with ${
        selectedMethod === "vodafone-cash" ? "Vodafone Cash" : "Instapay"
      }`;
    }
  }

  function validateForm() {
    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const government = document.getElementById("government").value.trim();

    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach((span) => {
      span.style.display = "none";
    });

    if (name.length < 3) {
      document.getElementById("name-error").style.display = "block";
      isValid = false;
    }

    if (phone.length !== 11 || isNaN(phone)) {
      document.getElementById("phone-error").style.display = "block";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById("email-error").style.display = "block";
      isValid = false;
    }

    if (address.length < 8) {
      document.getElementById("address-error").style.display = "block";
      isValid = false;
    }

    if (city.length < 3) {
      document.getElementById("city-error").style.display = "block";
      isValid = false;
    }

    if (government.length < 3) {
      document.getElementById("government-error").style.display = "block";
      isValid = false;
    }

    return isValid;
  }

  function saveAndRedirect() {
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const government = document.getElementById("government").value;
    const email = document.getElementById("email").value;
    const paymentMethod = document.getElementById("payment-method").value;

    // Prepare data to pass to the new page
    const checkoutData = {
      name,
      address,
      phone,
      city,
      government,
      email,
      paymentMethod,
      cart,
      shippingFee,
    };

    // Save the data to localStorage
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    // Redirect to the final receipt page
    window.location.href = "final-receipt.html";
  }
});
