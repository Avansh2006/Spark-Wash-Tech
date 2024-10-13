const postForm = document.getElementById('postForm');
const postsList = document.getElementById('posts');

document.addEventListener('DOMContentLoaded', loadPosts);

// Add new post
postForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const description = document.getElementById('description').value;
    const itemImage = document.getElementById('itemImage').files[0];

    const post = {
        id: Date.now(),
        itemName,
        description,
        itemImage: itemImage ? URL.createObjectURL(itemImage) : ''
    };

    addPost(post);
    savePostToLocal(post);
    postForm.reset(); 
});

function addPost(post) {
    const listItem = document.createElement('li');
    listItem.classList.add('post');

    listItem.innerHTML = `
        <h3>${post.itemName}</h3>
        <p>${post.description}</p>
        ${post.itemImage ? `<img src="${post.itemImage}" alt="${post.itemName}" style="max-width: 100px;">` : ''}
    `;

    postsList.appendChild(listItem);
    console.log('Post added:', post); 
}

function savePostToLocal(post) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    console.log('Posts saved to localStorage:', posts); 
}

// Loading posts from localStorage
function loadPosts() {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    posts.forEach(post => {
        addPost(post);
    });
    console.log('Posts loaded from localStorage:', posts); 
}
