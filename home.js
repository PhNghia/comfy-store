import handlerBuyProduct from './modal.js'
import viewProduct from './viewProducts.js'
import animationLoading from './animationLoadingWait.js'
import animationMenuPage from './animationMenuPage.js'

const allProductsUrl = 'https://course-api.com/javascript-store-products'


const init = async () => {
    animationMenuPage()
    const introductionListLoadingHeading = document.querySelector('.introduction-list h3')
    animationLoading(introductionListLoadingHeading)
    const follwers = await fetchFollowers()
    await displayProductsIntroduction(follwers)
    viewProduct(follwers)
    handlerMouseOrHandToWeb()
    handlerBuyProduct(follwers)
}

async function fetchFollowers() {
    const res = await fetch(allProductsUrl)
    const data = await res.json()
    return data
}

async function displayProductsIntroduction (followers) {
    const introductionListContainer = document.querySelector('.introduction-list')
    let newFollowersToIntroduction = []
    while (true) {
        const random = Math.floor(Math.random() * followers.length)
        if (!newFollowersToIntroduction.includes(followers[random])) {
            newFollowersToIntroduction.push(followers[random])
        }
        if (newFollowersToIntroduction.length >= 8) break
    }

    introductionListContainer.innerHTML = newFollowersToIntroduction.map(product => {
        const { name, image, price } = product.fields
        return `
            <article id="${product.id}" class="product">
                <div class="product-container">
                    <img src="${image[0].url}" alt="${name}">
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
                    <h4 class="product-cost">$${(price / 100).toFixed(2)}</h4>
                </footer>
            </article>
        `
    }).join('')

    const div = document.createElement('div')
    div.setAttribute('class', 'introduction-slide-container')
    div.innerHTML = `
        <div class="introduction-slide-btn prev-btn">???</div>
        <div class="introduction-slide-btn next-btn">???</div>
    `
    // append 2 button slide
    document.querySelector('.introduction-content').append(div)
    return 
}

function handlerMouseOrHandToWeb () {
    handlerSlideModeProducts()
}

function handlerSlideModeProducts () {
    const buttons = document.querySelectorAll('.introduction-slide-btn')
    const introductionListContainer = document.querySelector('.introduction-list')
    let range = $('.introduction-list article:last-child').outerWidth(true)
    buttons.forEach(button => {
        button.onclick = (e) => {
            if (e.target.matches('.next-btn')) {
                introductionListContainer.scrollBy({ 
                    left: range, behavior: 'smooth'
                })
                return
            }

            introductionListContainer.scrollBy({ 
                left: -range, behavior: 'smooth'
            })
        }
    })
    makeEffectScrollByMouse(range)
}

function makeEffectScrollByMouse (range) {
    const introductionListContainer = document.querySelector('.introduction-list')
    let isMouseDown = false
    introductionListContainer.onmousedown = (e) => {
        if (!e.target.matches('img')) {
            let x = e.x
            let endPoint = 0
            isMouseDown = true
            introductionListContainer.classList.add('mouseDown')
            introductionListContainer.onmousemove = (e) => {
                // run from right to left
                if (x - e.x >= 10 && isMouseDown) {
                    endPoint++
                    introductionListContainer.scrollLeft += range / 20
                }
                // run from left to right
                if (-(x - e.x) >= 10 && isMouseDown) {
                    endPoint++
                    introductionListContainer.scrollLeft -= range / 20
                }
                // escape scroll effect
                if (endPoint > 20) isMouseDown = false
            }
        }
    }

    introductionListContainer.onmouseleave = () => {
        isMouseDown = false
    }

    introductionListContainer.onmouseup = () => {
        isMouseDown = false
        introductionListContainer.classList.remove('mouseDown')
    }
}
window.addEventListener('load', init)