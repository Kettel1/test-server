const url = 'http://localhost:3001/products';

const fetching = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderInfo(data, 0, 5)
    } catch (e) {
        console.log(e)
    }
}

fetching()


const renderInfo = (products) => {
    const product = document.querySelector('.product');

    const maxItems = 3;
    const loadItems = 3;

    // Render good
    products.forEach((item, index) => {

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
            <img src="img/${item.photo}" alt="${item.title}">
        </div>

        <div class="product__info">
            <h2 class="product__title">${item.title}</h2>
            <p class="product__price"><span class="product__price__value">${setRubles(item.price)}</span></p>
            <p class="product__size">${item.size}</p>
        </div>

        <div class="product__photos">
              ${getProductPhotos(item.productPhotos)}
            <div class="product__button__wrapper">
                <button type="submit" class="product__cart"><span class="visually-hidden">Добавить в корзину</span></button>
            </div>
        </div>`
        product.append(div);
    });


    // Pagination
    const btn = document.createElement('button');
    btn.classList.add('product__add-more')
    btn.innerHTML = 'Показать еще';
    product.append(btn)

    const hiddenItems = Array.from(document.querySelectorAll(".product__wrapper--hidden"))

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
        good.addEventListener('click', e => {
            good.disabled = true;
            const cartData = getCartData() || {}
            const parentBox = e.target.closest('.product__wrapper');
            const itemId = parentBox.getAttribute('id');
            const itemTitle = parentBox.querySelector('.product__title').innerHTML;
            const itemPrice = parentBox.querySelector('.product__price__value').innerHTML
            console.log(itemId);
            console.log(itemTitle);

            if (cartData.hasOwnProperty(itemId)) {
                cartData[itemId][3] += 1;
            } else {
                cartData[itemId] = [itemTitle, itemPrice, itemId, 1];
            }

            if (!setCartData(cartData)) {
                good.disabled = false;
            }
        })
    })
}

//Корзина
const getCartData = () => {
    return JSON.parse(localStorage.getItem('cart'));
}

const setCartData = (data) => {
    localStorage.setItem('cart', JSON.stringify(data));
    return false;
}

const openCart = () => {
    const cartWrapper = document.querySelector('.cart');
    const table = document.createElement('table');
    table.classList.add('cart__good')
    const cartEmptyMessage = document.querySelector('.cart__empty');
    const cartGood = getCartData();
    let totalItems = ''

    if (cartGood !== null) {
        totalItems = '<tr><th>Наименование</th><th>Цена</th><th>Артикул</th><th>Кол-во</th></tr>';

        for (const good in cartGood) {
            totalItems += '<tr>';
            for (let i = 0; i < cartGood[good].length; i++) {
                totalItems += '<td>' + cartGood[good][i] + '</td>';
            }
            totalItems += '</tr>'
        }

        table.innerHTML = totalItems
        cartWrapper.append(table)
    } else {
        document.querySelector('.cart__good').remove();
    }
}

const addEventClearCart = () => {
    const cartCloseBtn = document.querySelector('.cart__clear');
    cartCloseBtn.addEventListener('click', function() {
        localStorage.removeItem('cart')
        document.querySelector('.cart__good').remove();
        openCart();
    })
}
addEventClearCart();

const addEventOpenCart = () => {
    const cartOpenBtn = document.querySelector('.cart__open');
    cartOpenBtn.addEventListener('click', function () {
        if (cartOpenBtn.innerHTML === 'Открыть корзину') {
            cartOpenBtn.classList.add('open')
            cartOpenBtn.innerHTML = 'Закрыть корзину'
            openCart();
        } else {
            cartOpenBtn.classList.remove('open')
            cartOpenBtn.innerHTML = 'Открыть корзину'
            document.querySelector('.cart__good').remove();
        }
    })
}
addEventOpenCart()


//Фичи
const setRubles = (price) => {
    const result = [];
    for (let i = 0; i < price.length; i++) {
        if (result.length === 0) {
            result.push(price[0] + ' ');
        } else {
            result.push(price[i])
        }

    }
    result.push(' руб.')
    return result.join('');
}


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