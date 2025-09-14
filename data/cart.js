export let cart = JSON.parse(localStorage.getItem('cart')) || 
[
    {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
    },
    {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
    }
];

export function addToCart(productId) {
    let matchingItem;
    cart.forEach((item) => {
        if(productId === item.productId){
            matchingItem = item;
        } 
    });

    const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    if(matchingItem){
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity
        });
    }

    saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if(cartItem.productId === productId)
            return;
        newCart.push(cartItem);
    });

    cart = newCart;

    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function calculateCartQuantity(){
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
}