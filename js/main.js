const grid = document.getElementById("imageGrid");
const paginationTop = document.getElementById("pagination-top");
const paginationBottom = document.getElementById("pagination-bottom");
const previewImage = document.getElementById("randomPreview");

const previewModal = document.getElementById("previewModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const cardsPerPage = 50;
let currentPage = 1;
let currentImageIndex = 0;

/* ---------- UTIL ---------- */

function removeExtension(filename) {
    return filename.replace(/\.[^/.]+$/, "");
}

/* ---------- DISPLAY GALLERY ---------- */

function displayImages(page) {
    grid.innerHTML = "";
    currentPage = page;

    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const paginatedItems = imageData.slice(start, end);

    paginatedItems.forEach((item, index) => {
        const realIndex = start + index;

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = `assets/images/${item.file}`;
        img.style.cursor = "pointer";

        // 🔥 CLICK CARD IMAGE TO OPEN MODAL
        img.addEventListener("click", () => {
            openModal(realIndex);
        });

        const title = document.createElement("h3");
        title.textContent = removeExtension(item.file);

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

/* ---------- PAGINATION ---------- */

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

displayImages(1);

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

/* ---------- MODAL SYSTEM ---------- */

function openModal(index) {
    currentImageIndex = index;
    modalImage.src = `assets/images/${imageData[index].file}`;
    previewModal.classList.add("active");
}

function closeModalFunc() {
    previewModal.classList.remove("active");
}

function showNext() {
    currentImageIndex = (currentImageIndex + 1) % imageData.length;
    modalImage.src = `assets/images/${imageData[currentImageIndex].file}`;
}

function showPrev() {
    currentImageIndex =
        (currentImageIndex - 1 + imageData.length) % imageData.length;
    modalImage.src = `assets/images/${imageData[currentImageIndex].file}`;
}

/* ---------- EVENTS ---------- */

// Preview click
previewImage.addEventListener("click", () => {
    openModal(currentImageIndex);
});

// Close
closeModal.addEventListener("click", closeModalFunc);

// Arrows
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

// Keyboard
document.addEventListener("keydown", (e) => {
    if (!previewModal.classList.contains("active")) return;

    if (e.key === "Escape") closeModalFunc();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
});

// Swipe (mobile)
let touchStartX = 0;

previewModal.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

previewModal.addEventListener("touchend", (e) => {
    let touchEndX = e.changedTouches[0].screenX;

    if (touchEndX < touchStartX - 50) showNext();
    if (touchEndX > touchStartX + 50) showPrev();
});

// Click outside to close
previewModal.addEventListener("click", (e) => {
    if (e.target === previewModal) closeModalFunc();
});
