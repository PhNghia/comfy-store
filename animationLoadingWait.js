export default function animationLoading (element) {
    const text = 'Loading...'
    let i = 0
    element.innerText = text
    setInterval(() => {
        i++
        element.innerText += '.'
        if (i > 3) {
            element.innerText = text
            i = 0
        }
    }, 100)
}