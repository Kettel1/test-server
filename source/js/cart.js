import {urlCart, submit, url, urlOrder} from "./url.js";

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
                    <input id="${item.id}" value="${item.count}" class="count-buttons__input">
                    <button class="count-buttons__button count-buttons__button_plus">+</button>
                </div>

                <p class="cart__good-price">${totalPriceItem(item.price, item.count)}</p>
            </div>`

        cart.append(div);
    }
    // Counter
    const counterGood = async () => {
        const maxItemInDataBase = 100;
        const minusBtn = document.querySelectorAll('.count-buttons__button_minus');
        const plusBtn = document.querySelectorAll('.count-buttons__button_plus');

        minusBtn.forEach((item) => {
            item.addEventListener('click', async e => {
                let inputValue = e.target.nextElementSibling.value
                const id = e.target.nextElementSibling.id
                if (inputValue > 1) {
                    inputValue--
                    await submit('PATCH', {
                        count: inputValue,
                    }, urlCart + `/${id}`)
                    e.target.nextElementSibling.value--;

                }
            })
        })

        plusBtn.forEach((item) => {
            item.addEventListener('click', async e => {
                let inputValue = e.target.previousElementSibling.value
                const id = e.target.previousElementSibling.id;

                let startPrice = '';

                const response = await fetch(urlCart)
                const data = await response.json();

                for (const item of data) {
                    if(item.id === id) {
                        startPrice = item.price;
                    }
                }

                const wrapper = e.target.closest('.cart__good-wrapper');

                if (inputValue <= maxItemInDataBase) {
                    inputValue++;

                    await submit('PATCH', {
                        count: inputValue,
                    }, urlCart + `/${id}`)

                    e.target.previousElementSibling.value++;
                    const result = startPrice.match(/(\d)/g).join('') * inputValue;
                    wrapper.querySelector('.cart__good-price').innerHTML = result;
                    totalPrice();
                }
            })
        })
    }

    counterGood()

    // Total price
    const totalPrice = () => {
        const totalPriceValueSelectors = Array.from(document.querySelectorAll('.cart__good-price'));
        const totalCountGoodSelectors = Array.from(document.querySelectorAll('.count-buttons__input'));

        if (totalPriceValueSelectors.length === 0) {
            const h2 = document.createElement('h2');
            h2.innerHTML = 'Корзина пуста!';
            cart.append(h2)
        }

        let totalCountGood = 0;

        for(const value of totalCountGoodSelectors) {
            totalCountGood += +value.value
        }


        let totalPriceValue = 0;

        for (const item of totalPriceValueSelectors) {
            const arrValue = +item.innerHTML.match(/(\d)/g).join('')
            totalPriceValue += arrValue
        }

        document.querySelector('.cart__total-count').innerHTML = "Количество товара: " + totalCountGood;
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
    return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
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


cartDataRender()
