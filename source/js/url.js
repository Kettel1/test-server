export const url = 'http://localhost:8000/products';
export const urlCart = 'http://localhost:8000/cart';
export const urlOrder = 'http://localhost:8000/order';

export const submit = async (method, body, url) => {
    return await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(body),
    })
}
