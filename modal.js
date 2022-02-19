export default handlerBuyProduct

const initModal = async () => {
    setUpModal()
    const storeCart = document.querySelector('.toggle-cart')
    const closeModalBtn = document.querySelector('.close-modal-btn')
    if (storeCart) storeCart.onclick = toggleActiveModal
    if (closeModalBtn) closeModalBtn.onclick = toggleActiveModal
}

window.addEventListener('load', initModal)

function setUpModal () {
    const body = document.body
    const modal = document.createElement('div')
    modal.setAttribute('class', 'modal')
    modal.innerHTML = `
        <div class="modal-container">
            <div class="close-modal-btn">
                <i class="fas fa-times"></i>
            </div>
            <h3 class="modal-title">Your Bag</h3>
            <div class="modal-store-cart">

            </div>
            <footer>
                <div class="modal-total-price">
                    Total: $
                    <span>0.00</span>
                </div>
                <button class="modal-checkout">Checkout</button>
            </footer>
        </div>
    `
    body.append(modal)
    modal.onclick = (e) => {
        e.stopPropagation()
        if (e.target.matches('.modal')) toggleActiveModal()
    }
    setupUIProducts()
}

function toggleActiveModal() {
    const modal = document.querySelector('.modal')
    modal.classList.toggle('activeModal')
}

function handlerBuyProduct (followers, product, number) {
    // handler buy product by button buy
    if (followers) {
        const buyBtns = document.querySelectorAll('.product-cart-btn.product-icon')
        Array.from(buyBtns).forEach(btn => {
            btn.onclick = (e) => {
                const parent = getParentElement(e.target)
                if (parent) { 
                    const { url, name, price} = getDataFromProductByIdParent(followers, parent.getAttribute('id'))
                    addProductIntoStoreModalCart(parent.getAttribute('id'), url, name, price)
                    updateStoreInfo()
                    handlerChangeNumberProduct()
                    toggleActiveModal()
                }
            }
        })
    }

    if (product) {
        const { image, name, price } = product.fields
        addProductIntoStoreModalCart(product.id, image[0].url, name, (price / 100).toFixed(2), number)
        updateStoreInfo()
        handlerChangeNumberProduct()
        toggleActiveModal()
    }
}

function handlerChangeNumberProduct () {
    // increase, decrease and remove number of product 
    const modalStoreCart = document.querySelector('.modal-store-cart')
    const carts = modalStoreCart.querySelectorAll('article.modal-cart')
    if (carts.length > 0) {
        Array.from(carts).forEach(cart => {
            cart.onclick = (e) => {
                if (e.target.matches('.modal-cart-btn-increase i')) {
                    increaseProduct(cart)
                    updateStoreInfo()
                }
                if (e.target.matches('.modal-cart-btn-decrease i')) {
                    decreaseProduct(cart)
                    updateStoreInfo()
                }
                if (e.target.matches('.modal-cart-remove')) {
                    cart.remove()
                    updateStoreInfo()
                    removeProductToLocalStorage(cart.getAttribute('id'))
                }
            }
        })
    }
}

function getParentElement (element) {
    while (element.parentElement) {
        if (element.parentElement.matches('article')) return element.parentElement
        else element = element.parentElement
    }
}

function getDataFromProductByIdParent (followers, id) {
    const productArray = followers.filter(product => {
        if (product.id === id) {
            return product.fields
        }
    })
    const { name, price, image } = productArray[0].fields
    return { url: image[0].url, name, price: (price / 100).toFixed(2) }
}

function addProductIntoStoreModalCart (id, url, name, price, number = 1) {
    const modalStoreCart = document.querySelector('.modal-store-cart')
    const carts = modalStoreCart.querySelectorAll('article.modal-cart')
    let isNew = true
    if (carts.length > 0) {
        Array.from(carts).forEach(cart => {
            if (cart.getAttribute('id') == id) {
                isNew = false
                increaseProduct(cart, number)
            }
        })
    }
    if (isNew) {
        const article = document.createElement('article')
        article.setAttribute('class', 'modal-cart')
        article.setAttribute('id', id)
        article.innerHTML = `
            <img src="${url}">
            <div class="modal-cart-info">
                <h5 class="modal-cart-name">${name}</h5>
                <p class="modal-cart-price">$${price}</p>
                <button class="modal-cart-remove">remove</button>
            </div>
            <div class="modal-cart-quantity">
                <button class="modal-cart-btn modal-cart-btn-increase">
                    <i class="fas fa-chevron-up"></i>
                </button>
                <p class="modal-cart-number">${number}</p> 
                <button class="modal-cart-btn modal-cart-btn-decrease">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        `
        modalStoreCart.append(article)
        addProductToLocalStorage(id, url, name, price, number)
    }
}

function increaseProduct (cart, number = 1) {
    const numberCarts = cart.querySelector('.modal-cart-number')
    let numberBefore = Number(numberCarts.textContent)
    numberBefore += number
    numberCarts.textContent = numberBefore
    updateNumberProductToLocalStorage(cart.getAttribute('id'), numberBefore)
}

function decreaseProduct (cart) {
    const numberCarts = cart.querySelector('.modal-cart-number')
    let number = Number(numberCarts.textContent)
    if (number > 1) number--
    numberCarts.textContent = number
    updateNumberProductToLocalStorage(cart.getAttribute('id'), number)
}

function updateStoreInfo () {
    const modalCarts = document.querySelectorAll('article.modal-cart')
    let length = 0
    let price = 0
    if (modalCarts.length > 0) {
        Array.from(modalCarts).forEach(cart => {
            const numberCarts = cart.querySelector('.modal-cart-number')
            const priceElement = cart.querySelector('.modal-cart-price')
            length += Number(numberCarts.textContent)
            price += (Number(priceElement.textContent.slice(1)) * 100) * Number(numberCarts.textContent)
        })
    }
    
    updateTotalNumberProducts(length)
    updateTotalPriceProducts(price)
}

function updateTotalNumberProducts (number) {
    const cartItemCount = document.querySelector('.cart-item-count')
    cartItemCount.textContent = number
}

function updateTotalPriceProducts (price) {
    const containerTotalPrice = document.querySelector('.modal-total-price span')
    containerTotalPrice.textContent = (price / 100).toFixed(2)
}

function getLocalStorage () {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
}

function addProductToLocalStorage (id, url, name, price, number = 1) {
    const list = getLocalStorage()
    const article = { id, url, name, price, number }
    list.push(article)
    localStorage.setItem('list', JSON.stringify(list))
}

function updateNumberProductToLocalStorage (id, number) {
    const list = getLocalStorage()
    list.forEach(item => {
        if (item.id == id) item.number = number
    })
    localStorage.setItem('list', JSON.stringify(list))
}

function removeProductToLocalStorage (id) {
    const list = getLocalStorage()
    list.forEach((item, index) => {
        if (item.id === id) list.splice(index, 1)
    })
    localStorage.setItem('list', JSON.stringify(list))
}

// setupUI products has in local storage when modal is init
function setupUIProducts () {
    const modalStoreCart = document.querySelector('.modal-store-cart')
    const list = getLocalStorage()
    list.map(item => {
        const article = document.createElement('article')
        article.setAttribute('class', 'modal-cart')
        article.setAttribute('id', item.id)
        article.innerHTML = `
            <img src="${item.url}">
            <div class="modal-cart-info">
                <h5 class="modal-cart-name">${item.name}</h5>
                <p class="modal-cart-price">$${item.price}</p>
                <button class="modal-cart-remove">remove</button>
            </div>
            <div class="modal-cart-quantity">
                <button class="modal-cart-btn modal-cart-btn-increase">
                    <i class="fas fa-chevron-up"></i>
                </button>
                <p class="modal-cart-number">${item.number}</p> 
                <button class="modal-cart-btn modal-cart-btn-decrease">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        `
        modalStoreCart.append(article)
    })
    updateStoreInfo()
    handlerChangeNumberProduct()
}

