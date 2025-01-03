// On checkout.html page, retrieve the cart data from localStorage
let cartData = JSON.parse(localStorage.getItem("cart")) || [];

// Function to display the cart data
function displayCart() {
    const cartContainer = document.getElementById("cartItems");

    // Clear the existing content
    cartContainer.innerHTML = '';

    // Loop through the cart data and create table rows
    cartData.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${(item.quantity * item.price).toFixed(2)}</td>
        `;

        cartContainer.appendChild(row);
    });

    updateCartTotal();
}

// Function to calculate the total price of the cart
function updateCartTotal() {
    let total = 0;
    cartData.forEach(item => {
        total += item.quantity * item.price;
    });

    // Update the paragraph with the total
    const totalAmountParagraph = document.getElementById("totalAmount");
    totalAmountParagraph.textContent = `Total: Rs. ${total.toFixed(2)}`;

    // Update the "ITEMS TOTAL" in Billing Summary
    const itemsTotalElement = document.getElementById("items-total");
    if (itemsTotalElement) {
        itemsTotalElement.textContent = `Rs. ${total.toFixed(2)}`;
    }

    // Update order total including shipping
    updateOrderTotal(total);
}

// Function to update the order total including shipping
function updateOrderTotal(itemsTotal) {
    const shippingElement = document.getElementById("shipping-cost");
    const totalForOrderElement = document.getElementById("total-for-order");

    let shippingCost = 0;
    const selectedShipping = document.querySelector('input[name="choice"]:checked');

    if (selectedShipping) {
        if (selectedShipping.value === "option2") {
            shippingCost = 250; // Delivery shipping cost
        } else if (selectedShipping.value === "option3") {
            shippingCost = 600; // Express delivery shipping cost
        }
    }

    if (shippingElement) {
        shippingElement.textContent = `Rs. ${shippingCost.toFixed(2)}`;
    }

    const totalOrderCost = itemsTotal + shippingCost;
    if (totalForOrderElement) {
        totalForOrderElement.textContent = `Rs. ${totalOrderCost.toFixed(2)}`;
    }
}

// Call the displayCart function when the page loads
document.addEventListener("DOMContentLoaded", function () {
    displayCart();
});

// Hiding the content from delivery
document.addEventListener("DOMContentLoaded", function () {
    // Get all radio buttons and content divs for delivery methods
    const deliveryRadioButtons = document.querySelectorAll('input[name="choice"]');
    const deliveryContent1 = document.getElementById("content1");
    const deliveryContent2 = document.getElementById("content2");
    const deliveryContent3 = document.getElementById("content3");

    // Function to hide all delivery content divs
    function hideAllDeliveryContent() {
        deliveryContent1.classList.add("hidden");
        deliveryContent2.classList.add("hidden");
        deliveryContent3.classList.add("hidden");
    }

    // Event listener for delivery radio button changes
    deliveryRadioButtons.forEach((radio) => {
        radio.addEventListener("change", function () {
            hideAllDeliveryContent(); // Hide all delivery content first

            // Show the appropriate delivery content based on selected option
            if (this.value === "option1") {
                deliveryContent1.classList.remove("hidden");
            } else if (this.value === "option2") {
                deliveryContent2.classList.remove("hidden");
            } else if (this.value === "option3") {
                deliveryContent3.classList.remove("hidden");
            }

            // Update order total if shipping method changes
            let itemsTotal = 0;
            cartData.forEach(item => {
                itemsTotal += item.quantity * item.price;
            });
            updateOrderTotal(itemsTotal);
        });
    });

    // Initialize delivery method: Hide all on page load
    hideAllDeliveryContent();
});

// Payment method toggling
document.addEventListener("DOMContentLoaded", function () {
    // Get all payment radio buttons
    const paymentRadioButtons = document.querySelectorAll('input[name="payment"]');

    // Selectors for payment detail sections
    const cardDetails = document.querySelectorAll(".form-group, .form-row"); 
    const depositDetails = document.getElementById("Deposit");
    const payLocationDetails = document.getElementById("paylocation"); 

    // Function to hide all payment details
    function hideAllPaymentDetails() {
        // Hide all card details fields (Visa-related fields)
        cardDetails.forEach(element => (element.style.display = "none"));
        depositDetails.style.display = "none"; 
        payLocationDetails.style.display = "none"; 
    }

    // Function to show the correct payment details
    function togglePaymentDetails() {
        hideAllPaymentDetails(); 

        const selectedPayment = document.querySelector('input[name="payment"]:checked'); 
        if (selectedPayment) {
            if (selectedPayment.value === "visa") {
                // Show all Visa-related fields (card number, expiry date, CVV)
                cardDetails.forEach(element => (element.style.display = "block"));
            } else if (selectedPayment.value === "paypal") {
                // Show Deposit details
                depositDetails.style.display = "block";
            } else if (selectedPayment.value === "amex") {
                // Show Pay at Location details
                payLocationDetails.style.display = "block";
            }
        }
    }

    // Add event listeners to payment radio buttons
    paymentRadioButtons.forEach(button => {
        button.addEventListener("change", togglePaymentDetails);
    });

    hideAllPaymentDetails();
});

// Final button

document.addEventListener("DOMContentLoaded", function () {
    const confirmButton = document.getElementById("confirmButton");

    confirmButton.addEventListener("click", function (event) {
        event.preventDefault(); 

        // Retrieve form inputs
        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");
        const email = document.getElementById("email");
        const city = document.getElementById("city");
        const address = document.getElementById("address");
        const phone = document.getElementById("phone");
        const selectedShipping = document.querySelector('input[name="choice"]:checked');
        const selectedPayment = document.querySelector('input[name="payment"]:checked');

        // Card details
        const cardNumber = document.getElementById("card-number");
        const expiryMonth = document.getElementById("expiry-month");
        const expiryYear = document.getElementById("expiry-year");
        const securityCode = document.getElementById("security-code");

        // Validation flags
        let isValid = true;
        let errorMessage = "";

        resetErrorStyles();

        // Validate required fields and apply error styles
        if (!validateTextField(firstName.value)) {
            isValid = false;
            showError(firstName);
            errorMessage += "Please fill in your first name.\n";
        }
        if (!validateTextField(lastName.value)) {
            isValid = false;
            showError(lastName);
            errorMessage += "Please fill in your last name.\n";
        }
        if (!validateEmail(email.value)) {
            isValid = false;
            showError(email);
            errorMessage += "Please enter a valid email address.\n";
        }
        if (!validateSelectField(city)) {
            isValid = false;
            showError(city);
            errorMessage += "Please select your city.\n";
        }
        if (!validateTextField(address.value)) {
            isValid = false;
            showError(address);
            errorMessage += "Please fill in your address.\n";
        }
        if (!validatePhoneNumber(phone.value)) {
            isValid = false;
            showError(phone);
            errorMessage += "Please enter a valid phone number.\n";
        }

        // Validate shipping method
        if (!selectedShipping) {
            isValid = false;
            errorMessage += "Please select a shipping method.\n";
        }

        // Validate payment method
        if (!selectedPayment) {
            isValid = false;
            errorMessage += "Please select a payment method.\n";
        } else if (selectedPayment.value === "visa") {

            if (!validateCardNumber(cardNumber.value)) {
                isValid = false;
                showError(cardNumber);
                errorMessage += "Please enter a valid card number.\n";
            }
            if (!validateExpiryDate(expiryMonth.value, expiryYear.value)) {
                isValid = false;
                showError(expiryMonth);
                showError(expiryYear);
                errorMessage += "Please enter a valid expiry date.\n";
            }
            if (!validateTextField(securityCode.value)) {
                isValid = false;
                showError(securityCode);
                errorMessage += "Please enter the security code.\n";
            }
        }

        // Show error message if validation fails
        if (!isValid) {
            alert(errorMessage);
            return; 
        }

   
        if (selectedShipping.value === "option1") {
            alert("We are waiting to see you at Winfield Hospital!");
        } else {
            alert("Your products are being delivered. Thank you for shopping with us!");
        }

        clearForm();
    });
});

// Reset error styles
function resetErrorStyles() {
    const fields = document.querySelectorAll("input, select");
    fields.forEach(field => {
        field.style.borderColor = ""; 
        const errorMessage = field.parentElement.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.remove(); 
        }
    });
}

// Show error styling and message
function showError(field) {
    field.style.borderColor = "red"; 

    // Optionally, add an error message next to the field
    let errorMessage = field.parentElement.querySelector(".error-message");
    if (!errorMessage) {
        errorMessage = document.createElement("span");
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red";
        errorMessage.textContent = "This field is required."; 
        field.parentElement.appendChild(errorMessage);
    }
}

// Clear the form fields
function clearForm() {
    const formFields = document.querySelectorAll("input, select");
    formFields.forEach(field => {
        if (field.type === "radio" || field.type === "checkbox") {
            field.checked = false; 
        } else {
            field.value = ""; 
        }
    });
}

// Validation functions
function validateTextField(value) {
    return value && value.trim() !== '';
}

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

function validateSelectField(selectElement) {
    return selectElement && selectElement.value.trim() !== '';
}

function validatePhoneNumber(phone) {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
}

function validateCardNumber(cardNumber) {
    const cardNumberPattern = /^\d{16}$/; 
    return cardNumberPattern.test(cardNumber);
}

function validateExpiryDate(expiryMonth, expiryYear) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; 

    if (expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentMonth)) {
        return true;
    }
    return false;
}



