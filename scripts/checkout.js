import { cart, removeFromCart, calculateCartQuantity, updateQuantity, getQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

function updateCartQuantity(){
    let cartQuantity = calculateCartQuantity();
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
}
updateCartQuantity()

let cartSummaryHTML = '';
cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;
    products.forEach((product) => {
        if(product.id === productId){
            matchingProduct = product;
        }
    });

    cartSummaryHTML += `
    <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label js-quantity-${matchingProduct.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
                </span>
                <input class="quantity-input js-quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                <span class="save-quantity-link link-primary js-save-quantity-link js-save-quantity-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            <div class="delivery-option">
                <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                    FREE Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                    $4.99 - Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Monday, June 13
                </div>
                <div class="delivery-option-price">
                    $9.99 - Shipping
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    `;
});
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
.forEach((link) => {
    link.addEventListener('click', () => {
        const { productId } = link.dataset;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
        updateCartQuantity();
    });
});

document.querySelectorAll('.js-update-link')
.forEach((link) => {
    link.addEventListener('click', () => {
        const { productId } = link.dataset;
        hideOrShowUpdate(productId);       

        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
        quantityInput.value = getQuantity(productId);
    });
});

document.querySelectorAll('.js-save-quantity-link')
.forEach((link) => {
    const { productId } = link.dataset;
    link.addEventListener('click', () => saveQuantity(productId));
});

document.querySelectorAll('.js-quantity-input')
.forEach((input) => {
    input.addEventListener('keydown', (event) => {
        const { productId } = input.dataset; 
        if(event.key === 'Enter'){
            saveQuantity(productId);
        } else {
            input.classList.remove('color-red');
        }
    });
});

function saveQuantity(productId) {
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    // get the quantity input's value
    const quantityInputValue = Number(quantityInput.value);
    
    if(quantityInputValue <= 0 || quantityInputValue > 1000){
        quantityInput.classList.add('color-red');
        return;
    }
    updateQuantity(productId, quantityInputValue);  // update quantity in cart

    const quantity = document.querySelector(`.js-quantity-${productId}`);
    quantity.innerHTML = getQuantity(productId);
    updateCartQuantity();
    hideOrShowUpdate(productId);
}

function hideOrShowUpdate(productId) {
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    const saveQuantity = document.querySelector(`.js-save-quantity-link-${productId}`);
    if(!quantityInput.classList.contains('is-editing-quantity')){
        quantityInput.classList.add("is-editing-quantity");
        saveQuantity.classList.add("is-editing-quantity");
        return;
    } 
    quantityInput.classList.remove("is-editing-quantity");
    saveQuantity.classList.remove("is-editing-quantity"); 
}