import {urlCart, url, submit} from "./url.js";

(async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        document.querySelector('.cart__count').innerHTML = await getCountGood();
        await renderInfo(data)
    } catch (e) {
        console.log(e)
    }
})();


const checkGoodInCart = async (id) => {
    try {
        const response = await fetch(urlCart);
        const data = await response.json();
        return !!data.find((item) => String(item.id) === String(id))
    } catch (e) {
        console.log(e);
    }
};

const getCountGood = async () => {
    const response = await fetch(urlCart);
    const data = await response.json();
    return data.length
}

const renderInfo = async (products) => {
    const product = document.querySelector('.product');
    const maxItems = 6;
    const loadItems = 6;

    // Render good
    for (const item of products) {
        const index = products.indexOf(item);
        // console.log('При рендере id ' + item.id)

        const div = document.createElement('div');
        div.id = item.id

        if (index > maxItems - 1) {
            div.classList.add('product__wrapper')
            div.classList.add('product__wrapper--hidden')

        } else {
            div.classList.add('product__wrapper')
        }

        div.innerHTML = `
        <div class="product__img-wrapper">
            <img class="product__img" src="img/${item.photo}" alt="${item.title}">
        </div>

        <div class="product__info">
            <h2 class="product__title">${item.title}</h2>
            <p class="product__price"><span class="product__price__value">${setRubles(item.price)}</span></p>
            <p class="product__size">${item.size}</p>
        </div>

        <div class="product__photos">

              ${getProductPhotos(item.productPhotos)}
            <div class="product__button__wrapper">
                ${await checkGoodInCart(item.id)
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

    // Pagination
    const btn = document.createElement('button');
    btn.classList.add('product__add-more')
    btn.innerHTML = 'Показать еще';
    product.append(btn)

    btn.addEventListener('click', function () {
        [].forEach.call(document.querySelectorAll(".product__wrapper--hidden"),
            function (item, index) {
                if (index < loadItems) {
                    item.classList.remove("product__wrapper--hidden");
                }

                if (document.querySelectorAll('.product__wrapper--hidden').length === 0) {
                    btn.style.display = 'none';
                }
            })
    })

    const itemBox = document.querySelectorAll('.product__wrapper');

    itemBox.forEach((good) => {
        good.addEventListener('click', async e => {
            if (e.target.className === 'product__cart' && e.target.tagName === 'BUTTON') {
                const parentBox = e.target.closest('.product__wrapper');
                const itemId = parentBox.getAttribute('id');
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
                cartCount.innerHTML = await getCountGood()
                itemBtn.innerHTML = 'В корзине';
            }

        })
    })
}





//Фичи

const getProductPhotos = (similarPhoto) => {
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
                        <span>+${similarPhoto.length}</span>
                   </a>`
    }
    return result;
}

const setRubles = (rubles) => {
    const reformatRubles = rubles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return reformatRubles + ' ₽'
}
