import {urlCart, urlProducts, submit} from "./url.js";

export const obj = {
    init() {
        if (location.href.includes('index')) {
            this.starting()
        }
    },

    async starting() {
        try {
            const response = await fetch(urlProducts);
            const data = await response.json();
            document.querySelector('.cart__count').innerHTML = await this.getCountGood();
            await this.renderInfo(data)
        } catch (e) {
            console.error(e)
        }
    },

    async checkGoodInCart(id) {
        try {
            const response = await fetch(urlCart);
            const data = await response.json();
            return !!data.find((item) => String(item.id) === String(id))
        } catch (e) {
            console.error(e)
        }
    },

    async getCountGood() {
        try {
            const response = await fetch(urlCart);
            const data = await response.json();
            return data.length
        } catch (e) {
            console.error(e)
        }

    },

    async renderInfo(products) {
        const product = document.querySelector('.product');
        const maxItems = 6;

        // Render good
        for (const item of products) {
            const index = products.indexOf(item);
            const div = document.createElement('div');

            if (maxItems > index) {
                div.classList.add('product__wrapper')
                div.id = item.id;
                div.innerHTML = `
                <div class="product__img-wrapper">
                    <img class="product__img" src="img/${item.photo}" alt="${item.title}">
                </div>

                <div class="product__info">
                    <h2 class="product__title">${item.title}</h2>
                <p class="product__price"><span class="product__price__value">${this.setRubles(item.price)}</span></p>
                    <p class="product__size">${item.size}</p>
                </div>

                <div class="product__photos">
                    ${this.getProductPhotos(item.productPhotos)}
                    <div class="product__button__wrapper">
                ${await this.checkGoodInCart(item.id)
                    .then(r => {
                        if (r) {
                            return '<button type="submit" class="product__cart--added">В корзине</button>'
                        } else {
                            return '<button type="submit" class="product__cart"><span class="visually-hidden">Добавить в корзину</span></button>'
                        }
                    })}
                    </div>
                </div>`
                product.append(div);
            }
        }
        await this.addToCartBtn()
        await this.paginationButton(product, maxItems)
    },


    async paginationButton(product, currentIndex) {
        let currentItem = currentIndex;
        //Сколько айтемов нужно загружать при нажатии кнопки "Показать еще"
        const loadItems = 1;

        const btn = document.createElement('button');
        btn.classList.add('product__add-more');
        btn.innerHTML = 'Показать еще';

        product.append(btn)

        await this.checkItems()

        btn.addEventListener('click', async e => {
            const response = await fetch(urlProducts);
            const data = await response.json()
            const nextRender = data.slice(currentItem, currentItem + loadItems);
            currentItem += loadItems;


            for (const item of nextRender) {
                const div = document.createElement('div');
                div.classList.add('product__wrapper')
                div.id = item.id;

                div.innerHTML = `
                <div class="product__img-wrapper">
                    <img class="product__img" src="img/${item.photo}" alt="${item.title}">
                </div>

                <div class="product__info">
                    <h2 class="product__title">${item.title}</h2>
                <p class="product__price"><span class="product__price__value">${this.setRubles(item.price)}</span></p>
                    <p class="product__size">${item.size}</p>
                </div>

                <div class="product__photos">
                    ${this.getProductPhotos(item.productPhotos)}
                    <div class="product__button__wrapper">
                ${await this.checkGoodInCart(item.id)
                    .then(r => {
                        if (r) {
                            return '<button type="submit" class="product__cart--added">В корзине</button>'
                        } else {
                            return '<button type="submit" class="product__cart"><span class="visually-hidden">Добавить в корзину</span></button>'
                        }
                    })}
                    </div>
                </div>`
                product.append(div);
            }
            await this.addToCartBtn()
            await this.checkItems()
        })
    },

    async checkItems() {
        const productWrapper = document.querySelectorAll('.product__wrapper');
        const response = await fetch(urlProducts);
        const data = await response.json();

        if (productWrapper.length >= data.length) {
            document.querySelector('.product__add-more').remove();
        }
    },

    async addToCartBtn() {
        const itemBox = document.querySelectorAll('.product__wrapper');
        itemBox.forEach((good) => {
            good.addEventListener('click', async e => {
                if (e.target.className === 'product__cart' && e.target.tagName === 'BUTTON') {
                    const parentBox = e.target.closest('.product__wrapper');
                    const itemId = parentBox.getAttribute('id');
                    console.log(itemId)
                    const itemTitle = parentBox.querySelector('.product__title').innerHTML;
                    const itemPrice = parentBox.querySelector('.product__price__value').innerHTML
                    const itemBtn = parentBox.querySelector('.product__cart')
                    const itemImage = parentBox.querySelector('.product__img').getAttribute('src')
                    itemBtn.classList.replace('product__cart', 'product__cart--added')

                    await submit('POST', {
                        "id": itemId,
                        "title": itemTitle,
                        "price": itemPrice,
                        "count": 1,
                        "itemImage": itemImage,
                    }, urlCart)

                    const cartCount = document.querySelector('.cart__count');
                    cartCount.innerHTML = await this.getCountGood()
                    itemBtn.innerHTML = 'В корзине';
                }

            })
        })
    },

    getProductPhotos(similarPhoto) {
        let result = '';
        if (similarPhoto.length <= 3) {
            for (const item of similarPhoto) {
                result += `<a class="product__photos__link">
                                <img src="img/${item}" class="product_photos__img">
                           </a>`
            }
        } else if (similarPhoto.length > 3) {
            for (let i = 0; i < similarPhoto.length; i++) {
                if (3 > i) {
                    result += `<a class="product__photos__link">
                                    <img src="img/${similarPhoto[i]}" class="product_photos__img">
                               </a>`
                }
            }

            result += `<a class="product__photos__frame">
                            <span>+${similarPhoto.length - 3}</span>
                       </a>`
        }
        return result;
    },

    setRubles(rubles) {
        const reformatRubles = rubles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return reformatRubles + ' ₽'
    }
};

