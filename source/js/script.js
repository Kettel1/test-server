const url = 'http://localhost:3000/products';

const fetching = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderInfo(data)
    } catch (e) {
        console.log(e)
    }
}

fetching()

const renderInfo = (data) => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const p = document.createElement('p')
    const product = document.querySelector('.product');


    data.forEach((item, index) => {

        const product = document.querySelector('.product');
        const div = document.createElement('div');
        div.classList.add('product__wrapper')
        div.innerHTML = `
        <div class="product__img-wrapper">
            <img src="img/${item.photo}" alt="${item.title}">
        </div>

        <div class="product__info">
            <h2 class="product__title">${item.title}</h2>
            <p class="product__price"><span>${setRubles(item.price)}</span></p>
            <p class="product__size">${item.size}</p>
        </div>

        <div class="product__photos">
              ${getProductPhotos(item.productPhotos)}
            <div class="product__button__wrapper">
                <button type="submit" class="product__cart"><span class="visually-hidden">Добавить в корзину</span></button>
            </div>
        </div>`
        product.append(div);
    })
}

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

        result += `
        <a class="product__photos__frame">
               <span>+${similarPhoto.length}</span>
        </a>`
    }
    return result;
}
