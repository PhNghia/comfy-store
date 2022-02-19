import handlerBuyProduct from './modal.js'

export default function viewProduct (followers) {
    const searchIconProducts = document.querySelectorAll('a.product-icon')
    searchIconProducts.forEach(icon => {
        icon.onclick = (e) => {
            e.preventDefault();
            const followerParent = parentElement(e.target)
            const product = followers.filter(item => {
                return item.id == followerParent.getAttribute('id')
            })[0]
            renderProductByModal(product)
        }
    })
}

function parentElement (element) {
    while (element.parentElement) {
        if (element.parentElement.matches('article.product'))
            return element.parentElement
        else element = element.parentElement 
    }
}

function renderProductByModal (product){
    const { name, price, company, colors, image } = product.fields
    const modal = document.createElement('div')
    modal.classList.add('modal-product')
    modal.innerHTML = `
        <div class="modal-product-container">
            <div class="modal-product-close">&times</div>
            <img src="${image[0].url}" alt="">
            <div class="modal-product-content">
                <h5 class="modal-product-name">${name}</h5>
                <p class="modal-product-company">by ${company}</p>
                <p class="modal-product-cost">$${(price / 100).toFixed(2)}</p>
                ${colors.map(color => {
                    return `<span class="modal-product-color" style="background-color: ${color}"></span>`
                }).join('')}
                <p class="modal-product-description">Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge</p>
                <button class="modal-product-add-button">Add to cart</button>
            </div>
        </div>
    `
    const modalProduct = document.querySelector('.modal-product')
    if (modalProduct) modalProduct.remove()
    // open modal
    document.body.append(modal)
    // close modal
    const closeButton = document.querySelector('.modal-product-close')
    closeButton.onclick = () => {
        modal.remove()
    }
    // add product
    const addButtonCart = document.querySelector('.modal-product-add-button')
    addButtonCart.onclick = () => {
        handlerBuyProduct(null, product)
        modal.remove()
    }
}
