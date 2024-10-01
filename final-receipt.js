document.addEventListener("DOMContentLoaded", function () {
  const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));

  if (checkoutData) {
    // Display contact and delivery details
    document.getElementById(
      "full-name"
    ).textContent = `Full Name: ${checkoutData.name}`;
    document.getElementById(
      "address"
    ).textContent = `Address: ${checkoutData.address}`;
    document.getElementById(
      "phone"
    ).textContent = `Phone: ${checkoutData.phone}`;
    document.getElementById(
      "email"
    ).textContent = `Email: ${checkoutData.email}`;
    document.getElementById("city").textContent = `City: ${checkoutData.city}`;
    document.getElementById(
      "government"
    ).textContent = `Governorate: ${checkoutData.government}`;

    // Display payment method
    const paymentMethodText =
      checkoutData.paymentMethod === "cod"
        ? "Cash on Delivery"
        : checkoutData.paymentMethod === "vodafone-cash"
        ? "Vodafone Cash"
        : "Instapay";
    document.getElementById(
      "payment-method"
    ).textContent = `Payment Method: ${paymentMethodText}`;

    // Display the receipt items
    const receiptItemsContainer = document.getElementById("receipt-items");
    let total = 0;

    checkoutData.cart.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "receipt-item";
      itemElement.innerHTML = `
            <div>   <img src="${item.image}" alt="${
        item.name
      }" width="70px" height="70px">
                ${item.name} - Size: ${item.size}</div>
                <div>LE ${item.price.toFixed(2)} x ${item.quantity}</div>
                <div >Total: LE ${(item.price * item.quantity).toFixed(2)}</div>
            `;
      receiptItemsContainer.appendChild(itemElement);

      total += item.price * item.quantity;
    });

    // Add the shipping fee to the total
    total += checkoutData.shippingFee;

    // Display the total
    document.getElementById(
      "receipt-total"
    ).textContent = `Total: LE ${total.toFixed(2)}`;
  }
});
