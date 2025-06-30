const url = "http://localhost:3000/posts";//this is also my api
const postList = document.getElementById("post-list");
const postFormContainer = document.getElementById("p");
const createBtn = document.querySelector("#new-post-section button");
const cancelBtn = document.getElementById("cancel-post");
const form = document.getElementById("new-post-form");
const detail = document.getElementById("detail");
const r = document.querySelector(".post-count");

function updatePost() {
  const items = document.querySelectorAll("#post-list li");
  const f = items.length;

  if (f > 0) {
    r.textContent = `Posts: ${f}`;
  } else {
    r.textContent = "No posts yet";
  }
}


// Show form
createBtn.addEventListener("click", () => {
  postFormContainer.classList.remove("hidden");
});

// Hide form
cancelBtn.addEventListener("click", () => {
  postFormContainer.classList.add("hidden");
});

// Submit new post
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const image = document.getElementById("image").value;
  const content = document.getElementById("content").value;

  const newPost = { title, author, image, content };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Post added:", data);
      form.reset();
      postFormContainer.classList.add("hidden");
      displayPostInList(data);
      displayPostDetails(data);
      updatePost();
    });
});

// Show post details
function displayPostDetails(post) {
  detail.innerHTML = `
    <div id="post-view">
      <h3>${post.title}</h3>
      <p><strong>Author:</strong> ${post.author}</p>
      ${post.image ? `<img src="${post.image}" style="width:100%; max-width:600px; height:auto; margin: 10px 0;"><br>` : ""}
      <p id="content-text">${post.content}</p>
      <button id="delete-post">Delete</button>
      <button id="edit-post">Edit</button>
    </div>

    <form id="edit-form" class="hidden">
      <input type="text" id="edit-title" value="${post.title}" /><br>
      <textarea id="edit-content">${post.content}</textarea><br>
      <button type="button" id="save-post">Save Changes</button>
      <button type="button" id="cancel-edit">Cancel</button>
    </form>
  `;

  document.getElementById("delete-post").addEventListener("click", function () {
    if (confirm("Do you want to delete this post?")) {
      deletePost(post.id);
    }
  });

  document.getElementById("edit-post").addEventListener("click", function () {
    document.getElementById("post-view").classList.add("hidden");
    document.getElementById("edit-form").classList.remove("hidden");
  });

  document.getElementById("cancel-edit").addEventListener("click", function () {
    displayPostDetails(post);
  });

  document.getElementById("save-post").addEventListener("click", function () {
    const updatedPost = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value
    };

    fetch(`http://localhost:3000/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Post updated:", data);
        loadPosts();
        displayPostDetails(data);
      })
      .catch(err => console.error("Update error:", err));
  });
}

// Show post in list
function displayPostInList(post) {
  const li = document.createElement("li");
  li.textContent = post.title;
  li.style.cursor = "pointer";

  li.addEventListener("click", () => {
    displayPostDetails(post);
  });

  postList.appendChild(li);
}

// Load all posts
function loadPosts() {
  fetch("http://localhost:3000/posts")
    .then((res) => res.json())
    .then((data) => {
      postList.innerHTML = "";
      data.forEach(displayPostInList);
      updatePost(); // Add this line
    })
    .catch((err) => console.error("Load error:", err));
}


function saveChanges(id, updatedPost) {
  fetch(`http://localhost:3000/posts/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Post updated:", data);
      loadPosts();
      displayPostDetails(data);
    })
    .catch(err => console.error("Update error:", err));
}

function deletePost(id) {
  fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" })
    .then(() => {
      detail.innerHTML = "";
      loadPosts();
      updatePost();
    })
    .catch((err) => console.error("Delete error:", err));
}

loadPosts();
