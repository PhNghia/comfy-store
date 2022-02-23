export default function animationMenuPage () {
    const menuContainer = document.querySelector('.list-link-menu-mobile')
    menuContainer.onclick = () => {
        menuContainer.classList.toggle('menu-open')
    }
}