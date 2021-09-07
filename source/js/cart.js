import {urlCart, submit, urlOrder} from "./url.js";

const cartDataRender = async () => {
    const response = await fetch(urlCart);
    const data = await response.json();

    const cart = document.querySelector('.cart__content');

    for (const item of data) {

        const div = document.createElement('div');
        div.classList.add('cart__inner');

        div.innerHTML = `
            <img src="img/catalog-image.png" class="cart__good-img">
            <div class="cart__good-wrapper">

                <div class='cart__good-info'>
                    <p class="cart__good-id">Арткул: <span class="cart__good-id-value">${item.id}</span></p>
                    <h2 class="cart__good-name">${item.title}</h2>
                    <button class="cart-good__button-delete">Удалить</button>

                </div>

                <div class="count-buttons">
                    <button class="count-buttons__button count-buttons__button_minus">-</button>
                    <input id="${item.id}"  value="${item.count}" class="count-buttons__input">
                    <button class="count-buttons__button count-buttons__button_plus">+</button>
                </div>

                <p class="cart__good-price">${item.price}</p>
            </div>`

        cart.append(div);
    }
    // Counter
    const counterGood = async () => {
        const maxItemInDataBase = 100;

        const minusBtn = document.querySelectorAll('.count-buttons__button_minus');
        const plusBtn = document.querySelectorAll('.count-buttons__button_plus');
        const input = document.querySelector('.count-buttons__input');
        const data = await fetch(urlCart);
        const response = await data.json()

        minusBtn.forEach((item) => {
            item.addEventListener('click', async e => {
                let inputValue = e.target.nextElementSibling.value
                const id = e.target.nextElementSibling.id
                if (inputValue > 1) {
                    inputValue--
                    e.target.nextElementSibling.value--;
                    await submit('PATCH', {
                        count: inputValue,
                    }, urlCart + `/${id}`)
                }
            })
        })

        plusBtn.forEach((item) => {
            item.addEventListener('click', async e => {
                let inputValue = e.target.previousElementSibling.value
                const id = e.target.previousElementSibling.id
                if (inputValue <= maxItemInDataBase) {
                    inputValue++;
                    e.target.previousElementSibling.value++;
                    await submit('PATCH', {
                        count: inputValue,
                    }, urlCart + `/${id}`)
                }
            })
        })
    }

    counterGood()

    // Total price
    const totalPrice = () => {
        const totalPriceValueSelectors = Array.from(document.querySelectorAll('.cart__good-price'));
        let totalPriceValue = 0;

        if (totalPriceValueSelectors.length === 0) {
            const h2 = document.createElement('h2');
            h2.innerHTML = 'Корзина пуста!';
            cart.append(h2)
        }

        for (const item of totalPriceValueSelectors) {
            const arrValue = +item.innerHTML.match(/(\d)/g).join('')
            totalPriceValue += arrValue
        }

        document.querySelector('.cart__total-count').innerHTML = totalPriceValueSelectors.length;
        document.querySelector('.cart__total-value').innerHTML = totalPriceValue + " ₽";
    }
    totalPrice()
    // Total price

    // Delete item from DB
    const deleteItem = () => {
        const deleteItem = Array.from(document.querySelectorAll('.cart-good__button-delete'))
        for (const btn of deleteItem) {
            btn.addEventListener('click', async event => {
                const parentBox = event.target.closest('.cart__good-info');
                const item = event.target.closest('.cart__inner');
                item.remove()
                totalPrice()
                const id = parentBox.querySelector('.cart__good-id-value').innerHTML;
                await deleteData(id, urlCart);
            })
        }
    }
    deleteItem();
}

const totalPriceItem = (price, factor) => {
    const result = price.match(/(\d)/g).join('') * factor;
    return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' P'
}

async function deleteData(item, url) {
    return await fetch(url + '/' + item, {
        method: 'delete'
    })
}

const getOrder = async () => {
    const btn = document.querySelector('.cart__total-btn');
    btn.addEventListener('click', async e => {
        const response = await fetch(urlCart)
        const data = await response.json()
        for (const item of data) {
            const obj = {
                "title": item.title,
                "id": item.id,
                "price": item.price,
                "count": item.count,
            }
            await submit('POST', obj, urlOrder)
        }
    })
}

getOrder()

// const getPatch = async (count, id) => {
//     await submit('PATCH', {
//         count: count,
//     }, urlCart + `/${id}`)
// }


cartDataRender()
