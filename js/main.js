const grid = document.getElementById("imageGrid");
const paginationTop = document.getElementById("pagination-top");
const paginationBottom = document.getElementById("pagination-bottom");
const previewImage = document.getElementById("randomPreview");

const cardsPerPage = 50;
let currentPage = 1;

function removeExtension(filename) {
    return filename.replace(/\.[^/.]+$/, "");
}

function displayImages(page) {
    grid.innerHTML = "";
    currentPage = page;

    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const paginatedItems = imageData.slice(start, end);

    paginatedItems.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = `assets/images/${item.file}`;

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

/* RANDOM PREVIEW */

function changePreview() {
    if (!imageData || imageData.length === 0) return;

    const randomIndex = Math.floor(Math.random() * imageData.length);
    const randomImage = imageData[randomIndex].file;

    previewImage.style.opacity = 0;

    setTimeout(() => {
        previewImage.src = `assets/images/${randomImage}`;
        previewImage.style.opacity = 1;
    }, 400);
}

changePreview();
setInterval(changePreview, 4000);

/* PREVIEW MODAL */

const previewModal = document.getElementById("previewModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

previewImage.addEventListener("click", () => {
    if (!previewImage.src) return;

    modalImage.src = previewImage.src;
    previewModal.classList.add("active");
});

closeModal.addEventListener("click", () => {
    previewModal.classList.remove("active");
});

previewModal.addEventListener("click", (e) => {
    if (e.target === previewModal) {
        previewModal.classList.remove("active");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        previewModal.classList.remove("active");
    }
});
