import {submit, urlCart, urlOrder} from "./url.js";

export const cart = {
    async init() {
        if (location.href.includes('cart')) {
            await this.cartDataRender();
            await this.getOrder();
            this.totalPriceAndCountGood();
            this.deleteItemFromCart();
            this.counterGood();
        }
    },

    async cartDataRender() {
        const response = await fetch(urlCart);
        const data = await response.json();

        const cart = document.querySelector('.cart__content');

        for (const item of data) {

            const div = document.createElement('div');
            div.classList.add('cart__inner');
            div.innerHTML = `
            <img src="${item.itemImage}" class="cart__good-img" alt="${item.title}">
            <div class="cart__good-wrapper">

                <div class='cart__good-info'>
                    <p class="cart__good-id">Арткул: <span class="cart__good-id-value">${item.id}</span></p>
                    <h2 class="cart__good-name">${item.title}</h2>
                    <button class="cart-good__button-delete">Удалить</button>
                </div>

                <div class="count-buttons">
                    <button class="count-buttons__button count-buttons__button_minus">-</button>
                    <input type="number" id="${item.id}" value="${item.count}" class="count-buttons__input">
                    <button class="count-buttons__button count-buttons__button_plus">+</button>
                </div>

                <p class="cart__good-price">${this.formatToRubles(item.price, item.count)}</p>
            </div>`

            cart.append(div);
        }

    },

    counterGood() {

        // Максимальное количество товаров в корзине
        const maxItemInDataBase = 100;

        // Находим все кнопки + , - и инпуты на странице
        const minusBtn = document.querySelectorAll('.count-buttons__button_minus');
        const input = document.querySelectorAll('.count-buttons__input');
        const plusBtn = document.querySelectorAll('.count-buttons__button_plus');


        // Навешиваем слушатель на каждую кнопку +
        minusBtn.forEach((item) => {
            item.addEventListener('click', async e => {
                let inputValue = e.target.nextElementSibling.value
                const id = e.target.nextElementSibling.id

                let startPrice = '';

                const response = await fetch(urlCart)
                const data = await response.json();

                for (const item of data) {
                    if (item.id === id) {
                        startPrice = item.price;
                    }
                }

                const wrapper = e.target.closest('.cart__good-wrapper');

                if (inputValue > 1) {
                    inputValue--
                    await submit('PATCH', {
                        count: inputValue,
                    }, urlCart + `/${id}`)
                    e.target.nextElementSibling.value--;

                    wrapper.querySelector('.cart__good-price').innerHTML = this.formatToRubles(startPrice, inputValue);
                    this.totalPriceAndCountGood();
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
                    if (item.id === id) {
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

                    wrapper.querySelector('.cart__good-price').innerHTML = this.formatToRubles(startPrice, inputValue);
                    this.totalPriceAndCountGood();
                }
            })
        })

        input.forEach((field) => {
            field.addEventListener('keydown', async e => {
                if (e.keyCode === 13) {
                    const wrapper = e.target.closest('.cart__good-wrapper');

                    let startPrice = '';

                    const response = await fetch(urlCart)
                    const data = await response.json();

                    for (const item of data) {
                        if (item.id === field.id) {
                            startPrice = item.price;
                        }
                    }

                    await submit('PATCH', {
                        count: field.value,
                    }, urlCart + `/${field.id}`)
                    wrapper.querySelector('.cart__good-price').innerHTML = this.formatToRubles(startPrice, field.value);
                    this.totalPriceAndCountGood();
                }
            })
        })
    },

    totalPriceAndCountGood() {
        const cart = document.querySelector('.cart__content');

        // Находится массивы элементов на странице
        // Находятся все элементы с ценой на странице
        const totalPriceValueSelectors = Array.from(document.querySelectorAll('.cart__good-price'));

        // Находятся все элементы с количеством на странице
        const totalCountGoodSelectors = Array.from(document.querySelectorAll('.count-buttons__input'));

        // В эти переменные после циклов записываются итоговые значения количества товаров, и общей цены
        let totalCountGood = 0;
        let totalPriceValue = 0;

        // Если товаров в корзине нет, то выводится сообщение "Корзина пуста"
        if (totalPriceValueSelectors.length === 0) {
            const h2 = document.createElement('h2');
            h2.innerHTML = 'Корзина пуста!';
            cart.append(h2)
        }
        // Цикл считает общее количество товара в корзине и записывает в переменную
        for (const value of totalCountGoodSelectors) {
            totalCountGood += +value.value
        }

        // Цикл считает общую стоимость корзины
        for (const item of totalPriceValueSelectors) {
            totalPriceValue += +item.innerHTML.match(/(\d)/g).join('')
        }


        // После циклов записывается в HTML общее количество и цена товаров
        document.querySelector('.cart__total-count').innerHTML = "Количество товара: " + totalCountGood;
        document.querySelector('.cart__total-value').innerHTML = this.formatToRubles(totalPriceValue);
    },

    formatToRubles(price, factor) {
        //Если есть умножение при вызове функции, то вернется ее результат
        if(factor) {
            const numbers = price.match(/(\d)/g).join('') * factor
            // Регулярка форматирует строку "1 000 ₽" в '1000' после чего происходит умножение на factor
            return numbers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
            // Регулярка форматирует строку "1000" в "1 000 ₽"
        } else {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
        }
    },

    deleteItemFromCart() {
        // Находятся все кнопки "Удалить"
        const deleteItem = Array.from(document.querySelectorAll('.cart-good__button-delete'))

        // На все кнопки циклом прокидывается слушатель
        for (const btn of deleteItem) {
            btn.addEventListener('click', async event => {

                // Находится родительский блок кнопки "Удалить"
                const parentBox = event.target.closest('.cart__good-info');

                // Находится родительский блок всей карточки товара
                const item = event.target.closest('.cart__inner');
                item.remove()

                // Вызывается пересчет правого блока "В корзине"
                this.totalPriceAndCountGood()

                // Находится id товара
                const id = parentBox.querySelector('.cart__good-id-value').innerHTML;

                // Передается найденный id и url откуда нужно удалить данные с БД
                await this.deleteData(id, urlCart);
            })
        }
    },


    async deleteData(item, url) {
        return await fetch(url + '/' + item, {
            method: 'delete'
        })
    },

    async getOrder() {
        // Находится модальное окно
        const modalOrder = document.querySelector('.modal-order');

        // Находится кнопка "Оформить заказ"
        const btn = document.querySelector('.cart__total-btn');

        // Навешивается слушатель на кнопку "Оформить заказ"
        btn.addEventListener('click', async () => {
            // Запрашивается с сервера информация о состоянии корзины
            const response = await fetch(urlCart)
            const data = await response.json()

            // Если корзина пустая, то после нажатия выводится модальное окно с надписью о том, что корзина пуста
            if (data.length === 0) {
                modalOrder.style.display = 'block';

                // Находится внутри модального окна тег 'p' в который записывается текст
                modalOrder.querySelector('.modal-order__message').innerHTML = 'Для того чтобы оформить заказ, добавьте хотя-бы один товар в корзину'

                // Навешиватся слушатель на все модальное окно
                modalOrder.addEventListener('click', e => {

                    // Если был клик на класс 'modal-fail', или кнопку 'BUTTON', или 'svg', или 'path'
                    if(e.target.className === 'modal-fail' || e.target.tagName === 'BUTTON' || e.target.tagName === 'svg' || e.target.tagName === 'path') {
                        modalOrder.style.display = 'none';
                    }
                })
                // Если корзина не пустая
            } else {
                // Циклом проходимся по каждому элементу корзины
                for (const item of data) {
                    // В переменную obj записывается title, id, price, count определенного айтема
                    const obj = {
                        "title": item.title,
                        "id": item.id,
                        "price": item.price,
                        "count": item.count,
                    }
                    // После записи в переменную отправляется информацию из этой переменной на сервер в заказ.
                    await submit('POST', obj, urlOrder);
                }
                modalOrder.style.display = 'block';
                modalOrder.querySelector('.modal-order__message').innerHTML = 'Вы успешно оформили заказ.';
                modalOrder.addEventListener('click', e => {
                    if(e.target.className === 'modal-success' || e.target.tagName === 'BUTTON' || e.target.tagName === 'svg' || e.target.tagName === 'path') {
                        modalOrder.style.display = 'none';
                    }
                })
            }

        })
    }
}
