document.addEventListener("DOMContentLoaded", () => {

const grid = document.getElementById("imageGrid");
const paginationTop = document.getElementById("pagination-top");
const paginationBottom = document.getElementById("pagination-bottom");

const layoutToggleBtn = document.getElementById("layoutToggleBtn");

const previewImage = document.getElementById("randomPreview");
const previewModal = document.getElementById("previewModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imageCounter = document.getElementById("imageCounter");

let cardsPerPage = 50;
let currentPage = 1;
let currentImageIndex = 0;
let isCompact = true; // SHOW LESS default

/* Zoom & Drag */
let scale = 1, isDragging = false, startX, startY, translateX = 0, translateY = 0;

/* ---------- DISPLAY ---------- */
function displayImages(page) {
    grid.innerHTML = "";
    currentPage = page;
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const paginatedItems = imageData.slice(start, end);

    paginatedItems.forEach((item, idx) => {
        const realIndex = start + idx;
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = `assets/images/${item.file}`;
        img.draggable = false;
        img.addEventListener("click", () => openModal(realIndex));
        img.addEventListener("contextmenu", e => e.preventDefault());

        const title = document.createElement("h3");
        title.textContent = item.file.replace(/\.[^/.]+$/, "");

        const link = document.createElement("a");
        link.href = item.link;
        link.target = "_blank";
        link.classList.add("view-btn");
        link.textContent = "View";

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(link);
        grid.appendChild(card);
    });
    setupPagination();
}

function setupPagination() {
    paginationTop.innerHTML = "";
    paginationBottom.innerHTML = "";

    const pageCount = Math.ceil(imageData.length / cardsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const btnTop = document.createElement("button");
        const btnBottom = document.createElement("button");

        btnTop.textContent = i;
        btnBottom.textContent = i;

        if (i === currentPage) {
            btnTop.classList.add("active");
            btnBottom.classList.add("active");
        }

        btnTop.addEventListener("click", () => displayImages(i));
        btnBottom.addEventListener("click", () => displayImages(i));

        paginationTop.appendChild(btnTop);
        paginationBottom.appendChild(btnBottom);
    }
}

/* ---------- LAYOUT TOGGLE ---------- */
function toggleLayout() {
    if (isCompact) {
        cardsPerPage = 200;
        grid.classList.remove("compact");
        grid.classList.add("extended");
        layoutToggleBtn.textContent = "SHOW LESS";
        isCompact = false;
    } else {
        cardsPerPage = 50;
        grid.classList.remove("extended");
        grid.classList.add("compact");
        layoutToggleBtn.textContent = "SHOW MORE";
        isCompact = true;
    }
    displayImages(1);
}
layoutToggleBtn.addEventListener("click", toggleLayout);

/* ---------- RANDOM PREVIEW ---------- */
function changePreview() {
    if (!imageData.length) return;
    currentImageIndex = Math.floor(Math.random() * imageData.length);
    previewImage.style.opacity = 0;
    setTimeout(() => {
        previewImage.src = `assets/images/${imageData[currentImageIndex].file}`;
        previewImage.style.opacity = 1;
    }, 400);
}
changePreview();
setInterval(changePreview, 4000);

/* ---------- MODAL ---------- */
function openModal(index) {
    currentImageIndex = index;
    modalImage.className = "modal-image active";
    modalImage.src = `assets/images/${imageData[index].file}`;
    previewModal.classList.add("active");
    updateCounter();
    resetZoom();
}

function closeModalFunc() { previewModal.classList.remove("active"); }

/* ---------- SLIDE NAVIGATION ---------- */
function slideTo(nextIndex, direction) {
    const oldImage = modalImage.cloneNode();
    oldImage.src = modalImage.src;
    oldImage.className = `modal-image ${direction === "left" ? "slide-left" : "slide-right"}`;
    previewModal.appendChild(oldImage);

    currentImageIndex = nextIndex;
    modalImage.src = `assets/images/${imageData[currentImageIndex].file}`;
    modalImage.className = "modal-image active";
    updateCounter();

    setTimeout(() => {
        if (oldImage.parentNode) oldImage.remove();
        resetZoom();
    }, 500);
}

function showNext() {
    let nextIndex = (currentImageIndex + 1) % imageData.length;
    slideTo(nextIndex, "left");
}

function showPrev() {
    let prevIndex = (currentImageIndex - 1 + imageData.length) % imageData.length;
    slideTo(prevIndex, "right");
}

function updateCounter() { imageCounter.textContent = `${currentImageIndex+1} / ${imageData.length}`; }

/* ---------- ZOOM ---------- */
function resetZoom() { scale=1; translateX=0; translateY=0; updateTransform(); }
function updateTransform() { modalImage.style.transform=`scale(${scale}) translate(${translateX}px, ${translateY}px)`; }

previewModal.addEventListener("wheel", e => { e.preventDefault(); scale += e.deltaY*-0.001; scale=Math.min(Math.max(1,scale),4); updateTransform(); });
modalImage.addEventListener("dblclick", ()=>{ scale = scale===1?2:1; updateTransform(); });
modalImage.addEventListener("mousedown", e=>{ if(scale<=1) return; isDragging=true; startX=e.clientX-translateX; startY=e.clientY-translateY; });
window.addEventListener("mousemove", e=>{ if(!isDragging) return; translateX=e.clientX-startX; translateY=e.clientY-startY; updateTransform(); });
window.addEventListener("mouseup", ()=>{ isDragging=false; });

/* ---------- EVENTS ---------- */
previewImage.addEventListener("click", ()=>openModal(currentImageIndex));
closeModal.addEventListener("click", closeModalFunc);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);
previewModal.addEventListener("click", e=>{ if(e.target===previewModal) closeModalFunc(); });

document.addEventListener("keydown", e=>{
    if(e.ctrlKey && e.key==="s") e.preventDefault();
    if(!previewModal.classList.contains("active")) return;
    if(e.key==="Escape") closeModalFunc();
    if(e.key==="ArrowRight") showNext();
    if(e.key==="ArrowLeft") showPrev();
});

/* SWIPE SUPPORT */
let touchStartX=0;
previewModal.addEventListener("touchstart", e=>{ touchStartX=e.changedTouches[0].screenX; });
previewModal.addEventListener("touchend", e=>{
    let touchEndX=e.changedTouches[0].screenX;
    if(touchEndX<touchStartX-50) showNext();
    if(touchEndX>touchStartX+50) showPrev();
});

/* ---------- INIT ---------- */
grid.classList.add("compact");
displayImages(1);

});
