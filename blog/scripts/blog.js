document.addEventListener('DOMContentLoaded', () => {
    const featuredLink = document.querySelector('.featured-link');
    const featuredImage = document.querySelector('.featured-image-side img');
    const featuredDate = document.querySelector('.featured-content-side time');
    const featuredReadTime = document.querySelector('.featured-content-side .read-time');
    const featuredTitle = document.querySelector('.featured-content-side h2');
    const featuredExcerpt = document.querySelector('.featured-content-side p');
    const grid = document.querySelector('.blog-grid');
    const searchBox = document.querySelector('.search-box');

    let posts = [];

    fetch('/blog/posts.json')
        .then(res => res.json())
        .then(data => {
            posts = data;
            renderPosts(posts);
        })
        .catch(err => {
            console.error('Failed to load posts.json', err);
        });

    function renderPosts(list) {
        if (!list.length) return;

        const [featured, ...rest] = list;

        if (featuredLink) {
            featuredLink.href = featured.url;
            featuredImage.src = featured.image;
            featuredImage.alt = featured.title;
            featuredDate.textContent = featured.date;
            featuredReadTime.textContent = featured.readTime;
            featuredTitle.textContent = featured.title;
            featuredExcerpt.textContent = featured.excerpt;
        }

        if (grid) {
            grid.innerHTML = '';
            rest.forEach(post => {
                const card = document.createElement('article');
                card.className = 'blog-card';
                card.innerHTML = `
                    <a href="${post.url}" class="card-link">
                        <div class="blog-image-wrapper">
                            <img src="${post.image}" alt="${post.title}" class="blog-thumb">
                        </div>
                        <div class="blog-meta">
                            <time>${post.date}</time>
                            <span class="read-time">${post.readTime}</span>
                        </div>
                        <h2>${post.title}</h2>
                        <p>${post.excerpt}</p>
                        <span class="read-more">Read article →</span>
                    </a>
                `;
                grid.appendChild(card);
            });
        }
    }

    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(term) ||
                post.excerpt.toLowerCase().includes(term) ||
                (post.tags && post.tags.join(' ').toLowerCase().includes(term))
            );
            renderPosts(filtered);
        });
    }
});