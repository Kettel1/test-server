import {urlCart, url} from "./url.js";


const cartDataRender = async () => {
    const response = await fetch(urlCart);
    const data = await response.json();

    const cart = document.querySelector('.cart__content');


    if (data.length === 0) {
        const h2 = document.createElement('h2');
        h2.innerHTML = 'Корзина пуста!';
        cart.append(h2)
    }

    for (const item of data) {

        const div = document.createElement('div');
        div.classList.add('cart__inner');

        div.innerHTML = `
            <img src="img/catalog-image.png" class="cart__good-img">
            <div class="cart__good-wrapper">

                <div class='cart__good-info'>
                    <p class="cart__good-id">Арткул: <span>${item.id}</span></p>
                    <h2 class="cart__good-name">${item.title}</h2>
                    <button class="cart-good__button-delete">Удалить</button>

                </div>

                <div class="count-buttons">
                    <button class="count-buttons__button count-buttons__button_minus">-</button>
                    <input value="${item.count}" class="count-buttons__input">
                    <button class="count-buttons__button count-buttons__button_plus">+</button>
                </div>

                <p class="cart__good-price">${item.price}</p>
            </div>`

        cart.append(div);
    }

    // Total price
    const totalPriceValueSelectors = Array.from(document.querySelectorAll('.cart__good-price'));
    let totalPriceValue = 0;
    for (const item of totalPriceValueSelectors) {
        const arrValue = +item.innerHTML.match(/(\d)/g).join('')
        totalPriceValue += arrValue
    }

    document.querySelector('.cart__total-count').innerHTML = totalPriceValueSelectors.length;
    document.querySelector('.cart__total-value').innerHTML = totalPriceValue + " ₽";


// document.addEventListener('click', function (e) {
//     if (e.target.classList.contains("count-buttons__button_plus")) {
//         ++e.target.parentElement.querySelector("input").value;
//     } else if (e.target.classList.contains("count-buttons__button_minus")) {
//         --e.target.parentElement.querySelector("input").value;
//     }
// })
}

cartDataRender()
