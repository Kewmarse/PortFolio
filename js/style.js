let currentPosition = 0;
let itemWidth = 0;
const itemsToShow = 2;

function initializeCarousel() {
    const track = document.getElementById('blogjorisContainer');
    const blogItems = Array.from(track.children);

    if (blogItems.length === 0) {
        console.warn("Aucun article n'est disponible dans le carrousel.");
        return;
    }

    itemWidth = blogItems[0].offsetWidth + 20;
    document.querySelector('.left-arrow').addEventListener('click', moveLeft);
    document.querySelector('.right-arrow').addEventListener('click', moveRight);
}

function moveLeft() {
    const track = document.getElementById('blogjorisContainer');
    if (currentPosition > 0) {
        currentPosition -= itemsToShow;
        track.style.transform = `translateX(-${currentPosition * itemWidth}px)`;
    }
}

function moveRight() {
    const track = document.getElementById('blogjorisContainer');
    const maxPosition = track.children.length - itemsToShow;

    if (currentPosition < maxPosition) {
        currentPosition += itemsToShow;
        track.style.transform = `translateX(-${currentPosition * itemWidth}px)`;
    }
}
