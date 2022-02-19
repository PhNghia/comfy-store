import handlerBuyProduct from './modal.js'
import viewProduct from './viewProducts.js'
const allProductsUrl = 'https://course-api.com/javascript-store-products'


const init = async () => {
    const follwers = await fetchFollowers()
    const introductionListLoadingHeading = document.querySelector('.introduction-list h3')
    introductionListLoadingHeading.style.display = 'none'
    await displayProductsIntroduction(follwers)
    viewProduct(follwers)
    handlerSlideModeProducts()
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
        if (newFollowersToIntroduction.length >= 9) break
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
        <div class="introduction-slide-btn prev-btn">⇐</div>
        <div class="introduction-slide-btn next-btn">⇒</div>
    `
    // append 2 button slide
    document.querySelector('.introduction-content').append(div)
    return 
}

function handlerSlideModeProducts () {
    const buttons = document.querySelectorAll('.introduction-slide-btn')
    const introductionListContainer = document.querySelector('.introduction-list')
    const articles = document.querySelectorAll('.introduction-list article')
    let width
    let margin = 20// margin css style of article

    articles.forEach(article => {
        width = article.offsetWidth
    })

    buttons.forEach(button => {
        button.onclick = (e) => {
            if (e.target.matches('.next-btn')) {
                introductionListContainer.scrollBy({ 
                    left: width + margin, behavior: 'smooth' 
                })
                return
            }

            introductionListContainer.scrollBy({ 
                left: -(width + margin), behavior: 'smooth' 
            })
        }
    })
    makeEffectScrollByMouse()
}

function makeEffectScrollByMouse () {
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
                if (x - e.x >= 100 && isMouseDown) {
                    endPoint++
                    introductionListContainer.scrollLeft += 15
                }
                // run from left to right
                if (-(x - e.x) >= 100 && isMouseDown) {
                    endPoint++
                    introductionListContainer.scrollLeft -= 15
                }
                // escape scroll effect
                if (endPoint >= 20) isMouseDown = false
            }
        }
    }

    introductionListContainer.onmouseup = () => {
        isMouseDown = false
        introductionListContainer.classList.remove('mouseDown')
    }
}

window.addEventListener('load', init)