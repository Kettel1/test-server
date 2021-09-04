import {urlCart, url} from "./url.js";


const cartDataRender = async () => {
    const response = await fetch(urlCart);
    const data = await response.json();

    const cart = document.querySelector('.cart');


    for (const item of data) {
        const div = document.createElement('div');
        div.classList.add('cart__inner');

        div.innerHTML = `<div class="cart__wrapper">
            <img src="img/catalog-image.png" class="cart__good-img">
            <div class="cart__good-wrapper">

                <div class='cart__good-info'>
                    <p class="cart__good-id">Арткул: <span>${item.id}</span></p>
                    <h2 class="cart__good-name">${item.title}</h2>
                    <button class="cart-good__button-delete">Удалить</button>

                </div>

                <div class="count-buttons">
                    <button class="count-buttons__button count-buttons__button_minus">+</button>
                    <input class="count-buttons__input">
                    <button class="count-buttons__button count-buttons__button_plus">-</button>
                </div>

                <p class="cart__good-price">2000</p>
            </div>
        </div>`

        cart.append(div);
    }
}


cartDataRender()
