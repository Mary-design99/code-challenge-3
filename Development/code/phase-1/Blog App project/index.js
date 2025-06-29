function displayPosts() {
    fetch('http://localhost:3000/posts')
        .then(response => response.json()) 
        .then(posts => {
            const postListDiv = document.getElementById('post-list');
            postListDiv.innerHTML = ''; 
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-item'); 

                const titleElement = document.createElement('h3');
                titleElement.textContent = post.title;
                titleElement.style.cursor = 'pointer';

                titleElement.addEventListener('click', () => {
                    handlePostClick(post.id);
                });

                postElement.appendChild(titleElement);
                postListDiv.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
}

function handlePostClick(postId) {
    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const detailDiv = document.getElementById('post-detail');
            detailDiv.innerHTML = `
                <h2>${post.title}</h2>
                <img src="${post.image}" alt="${post.title}" style="max-width:150px;height:auto;">
                <p>${post.content}</p>
                <p><strong>Author:</strong> ${post.author}</p>
                <button id="delete-btn">Delete</button>
                <button id="edit-btn">Edit</button>
            `;

            // Delete functionality
            document.getElementById('delete-btn').onclick = function() {
                fetch(`http://localhost:3000/posts/${postId}`, { method: 'DELETE' })
                    .then(() => {
                        detailDiv.innerHTML = '';
                        displayPosts();
                    });
            };

            // Edit functionality
            document.getElementById('edit-btn').onclick = function() {
                detailDiv.innerHTML = `
                    <form id="edit-post-form">
                        <input name="title" value="${post.title}" required>
                        <input name="author" value="${post.author}" required>
                        <textarea name="content" required>${post.content}</textarea>
                        <input name="image" value="${post.image || ''}">
                        <button type="submit">Save</button>
                    </form>
                `;
                document.getElementById('edit-post-form').onsubmit = function(e) {
                    e.preventDefault();
                    fetch(`http://localhost:3000/posts/${postId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: this.title.value,
                            author: this.author.value,
                            content: this.content.value,
                            image: this.image.value
                        })
                    })
                    .then(() => {
                        handlePostClick(postId);
                        displayPosts();
                    });
                };
            };
        })
        
}

document.addEventListener('DOMContentLoaded', () => {
    displayPosts(); 
    
});