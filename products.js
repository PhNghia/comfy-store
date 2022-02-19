import handlerBuyProduct from './modal.js'
import viewProduct from './viewProducts.js'
import animationLoading from './animationLoadingWait.js'

const allProductsUrl = 'https://course-api.com/javascript-store-products'
let followersElement
let activeCompany = 'all'

const init = async () => {
    const storeLoadingContainer = document.querySelector('.store-loading h3')
    animationLoading(storeLoadingContainer)
    const followers = await fetchFollowers()
    await displayFollowers(followers)
    viewProduct(followers)
    handlerBuyProduct(followers)
    followersElement = document.querySelectorAll('article.product')
    followersElement = [...followersElement]  
    displayStoreContainer()
    scrollTopToFixedStoreCategory()
    displayListCompanyRenderTotal(followers)
    displayLiCompanyStyle()
    handlerSearchFollowers()
}

function displayStoreContainer() {
    const storeContainer = document.querySelector('.store-container')
    const storeLoading = document.querySelector('.store-loading')

    storeLoading.style.display = 'none'
    storeContainer.style.visibility = 'visible'
}

function scrollTopToFixedStoreCategory () {
    const storeCategory = document.querySelector('.store-category')
    const storeProducts = document.querySelector('.store-products')
    const localTop = storeCategory.offsetTop - 26
    window.onscroll = () => {
        if (window.scrollY >= localTop) {
            storeCategory.classList.add('topFixed')
            storeProducts.classList.add('topFixed')
        }
        if (window.scrollY < localTop) {
            storeCategory.classList.remove('topFixed')
            storeProducts.classList.remove('topFixed')
        }        
    }
}


function displayListCompanyRenderTotal (followers) {
    const formCompanyTypeList = document.querySelector('.form-type-list')
    const totalCompanyHas = ['all']
    followers.forEach(product => {
        const { company } = product.fields
        if (!totalCompanyHas.includes(company)) totalCompanyHas.push(company)
    })

    formCompanyTypeList.innerHTML = totalCompanyHas.map(company => {
        return `<li>${company}</li>`
    }).join('')
}

async function fetchFollowers () {
    const res = await fetch(allProductsUrl)
    const data = await res.json()
    return data
}

async function displayFollowers (followers) {
    const storeProduct = document.querySelector('.store-products')
    storeProduct.innerHTML = followers.map(product => {
        const { company, image, name, price } = product.fields
        const imageUrl = image[0].url
        const newPrice = (price / 100).toFixed(2)
        return `
            <article id="${product.id}" class="product" data-company="${company}" data-name="name" data-cost="cost">
                <div class="product-container type-store">
                    <img src="${imageUrl}" alt="high-back bench">
                    <div class="product-icons">
                        <a href="product.html?id=${product.id}" class="product-icon">
                            <i class="fas fa-search"></i>
                        </a>
                        <button class="product-cart-btn product-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <footer>
                    <p class="product-name">${name}</p>
                    <h4 class="product-cost">$${newPrice}</h4>
                </footer>
            </article>
        `
    }).join('')
    return true
}

function handlerSearchFollowers () {
    const inputName = document.querySelector('.form-input input')
    const inputCostRange = document.querySelector('.form-range input')
    const inputCompany = document.querySelector('.form-type-list')
    // filter products by name 
    inputName.addEventListener('input', () => {
        filterFollowersByName(inputName.value)
    })

    // filter products by cost
    inputCostRange.addEventListener('input', () => {
        filterFollowersByName(inputName.value)
        // change value hihi 
        let valueMessageRender = document.querySelector('.form-range-value span')
        valueMessageRender.innerText = (inputCostRange.value * 0.8).toFixed(0)
        // filter products
        filterFollowersByCost((inputCostRange.value * 0.8).toFixed(0))
    })

    // filter products by company
    inputCompany.addEventListener('click', filterFollowersByCompany) 
}

function filterFollowersByName (valueName) {
    followersElement.forEach(product => {
        const productName = product.querySelector('.product-name')
        const isVisible = productName.innerText.toUpperCase().includes(valueName.toUpperCase())
        if (isVisible || valueName == '') {
            product.dataset.name = 'name'
        }
        if (!isVisible) {
            product.dataset.name = 'nonName'
        }
        if (product.dataset.name == 'nonName' && isVisible) {
            product.dataset.name = 'name'
        }
    })

    followersElement.forEach(product => {
        if (activeCompany == 'all') {
            if (product.dataset.cost == 'cost' && product.dataset.name == 'name') {
                product.style.display = 'block'
            } else {
                product.style.display = 'none'
            }
            return
        }
        if (product.dataset.cost == 'cost' && 
            product.dataset.name == 'name' &&
            product.dataset.company.toLowerCase() == activeCompany
        ) {
            product.style.display = 'block'
        } 
        else {
            product.style.display = 'none'
        }
    })
}

function filterFollowersByCost (value) {
    followersElement.forEach(product => {
        const productCost = product.querySelector('.product-cost')
        const cost = Number(productCost.innerText.slice(1))
        if (cost <= value) {
            product.dataset.cost = 'cost'
        }
        if (cost > value) {
            product.dataset.cost = 'nonCost'
        }
        if (product.dataset.cost = 'nonCost' && cost <= value) {
            product.dataset.cost = 'cost'
        }
    })

    followersElement.forEach(product => {
        if (activeCompany == 'all') {
            if (product.dataset.cost == 'cost' && product.dataset.name == 'name') {
                product.style.display = 'block'
            } else {
                product.style.display = 'none'
            }
            return
        }
        if (product.dataset.cost == 'cost' && 
            product.dataset.name == 'name' &&
            product.dataset.company.toLowerCase() == activeCompany
        ) {
            product.style.display = 'block'
        } 
        else {
            product.style.display = 'none'
        }
    })
}

function filterFollowersByCompany (e) {
    const li = e.target.closest('li')
    if (li) {
        displayLiCompanyStyle(li)
        activeCompany = li.innerText.toLowerCase()
        followersElement.forEach(product => {
            if (activeCompany == 'all') {
                if (product.dataset.cost == 'cost' && product.dataset.name == 'name') {
                    product.style.display = 'block'
                } else {
                    product.style.display = 'none'
                }
                return
            }

            if (product.dataset.cost == 'cost' && 
                product.dataset.name == 'name' &&
                product.dataset.company.toLowerCase() == activeCompany
            ) {
                product.style.display = 'block'
            } 
            else {
                product.style.display = 'none'
            }
        })
    }
}

function displayLiCompanyStyle(li) {
    const activeCompany = document.querySelector('.activeCompany')
    if (!activeCompany) {
        const lis = document.querySelectorAll('.form-type-list li')
        Array.from(lis).forEach(li => {
            if (li.innerText.toLowerCase().includes('all')) li.classList.add('activeCompany')
        })
        return
    }
    if (activeCompany) {
        activeCompany.classList.remove('activeCompany')
    }
    if (li) li.classList.add('activeCompany')
}

window.addEventListener('load', init)
