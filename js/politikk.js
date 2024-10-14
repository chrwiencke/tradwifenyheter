// Define the HTML content that will be appended repeatedly
const articleHTML = `
    <a href="/politikk/grunnloven.html" class="linktilnyheter">
        <div class="big-article">
            <img src="/media/grunnloven.jpg" alt="">
            <h1>Grunnloven</h1>
            <p>Drømmesammfunnet</p>
        </div>
    </a>
    <a href="/politikk/skillelinjer.html" class="linktilnyheter">
        <div class="big-article">
            <img src="/media/skillelinjer.webp" alt="Tradwife i 2024">
            <h1>Skillelinjer</h1>
            <p>Politiske skillelinjer og ideologier i norsk politikk</p>
        </div>
    </a>
`;

// Function to append new articles to the container
function appendNewArticles(count = 1) {
    const articleList = document.getElementById('article-list');
    for (let i = 0; i < count; i++) {
        const newArticle = document.createElement('div');
        newArticle.classList.add('article-container');
        newArticle.innerHTML = articleHTML;
        articleList.appendChild(newArticle);
    }
}

// Variables to control the infinite scroll
let isLoading = false;
const loadThreshold = 1000; // Increased threshold for earlier loading
let debounceTimer;

// Function to check if we need to load more content
function checkForNewContent() {
    if (isLoading) return;

    const scrollPosition = window.innerHeight + window.pageYOffset;
    const pageBottom = document.documentElement.offsetHeight - loadThreshold;

    if (scrollPosition >= pageBottom) {
        isLoading = true;
        // Load multiple articles at once for faster scrolling
        appendNewArticles(3);
        isLoading = false;
    }
}

// Debounce function to handle rapid scrolling
function debounce(func, delay) {
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// Function to handle scroll events
function handleScroll() {
    checkForNewContent();
    debounce(checkForNewContent, 100)();
}

// Initialize with multiple articles and add the scroll event listener
window.addEventListener('load', function() {
    appendNewArticles(5); // Start with more articles
    window.addEventListener('scroll', handleScroll);
});

// Ensure it works when the window is resized
window.addEventListener('resize', debounce(checkForNewContent, 100));

// Intersection Observer to trigger content load
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            checkForNewContent();
        }
    });
}, observerOptions);

// Observe the last article container
function observeLastArticle() {
    const articleContainers = document.querySelectorAll('.article-container');
    if (articleContainers.length > 0) {
        observer.observe(articleContainers[articleContainers.length - 1]);
    }
}

// Call this function after appending new articles
const originalAppendNewArticles = appendNewArticles;
appendNewArticles = function(count = 1) {
    originalAppendNewArticles(count);
    observeLastArticle();
};

// Initial observation
window.addEventListener('load', observeLastArticle);