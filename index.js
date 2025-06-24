const postList = document.getElementById("post-list");
const postFormContainer = document.getElementById("p");
const createBtn = document.querySelector("#new-post-section button");
const cancelBtn = document.getElementById("cancel-post");
const form = document.getElementById("new-post-form");
const detail = document.getElementById("detail");
const r =document.querySelector(".post-count");


function updatePost(){
  const items=document.querySelector("#post-list li");
  const f=items.length;

  if(f>0){
    f +=1;
    r.textContent=`posts ${f}`;

  }
  else{
    r.textContent="no posts yet";
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

  fetch("http://localhost:3000/posts", {
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

      // ✅ Add this here:
      updatePost();
    });
});


// Show post details
function displayPostDetails(post) {
  detail.innerHTML = `
  <form>
    <h3>${post.title}</h3>
    <p><strong>Author:</strong> ${post.author}</p>
    ${post.image ? `<img src="${post.image}" width="200">` : ""}
    <p>${post.content}</p>
    <button id="delete-post">Delete</button>
    </form>
  `;

  document.getElementById("delete-post").addEventListener("click", function () {
    if (confirm("do you want to delete this post?")) {
      deletePost(post.id);
    }
  });
}

// Show post in list
function displayPostInList(post) {
  const li = document.createElement("li"); // ✅ create <li> instead of <div>
  li.textContent = post.title;             // ✅ only show title
  li.style.cursor = "pointer";

  // Show full post details when clicked
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
      postList.innerHTML = ""; // clear old
      data.forEach(displayPostInList);
    })
    .catch((err) => console.error("Load error:", err));
}

// Delete post
function deletePost(id) {
  fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" })
    .then(() => {
      detail.innerHTML = "";
      loadPosts();
      updatePost();
    })
    .catch((err) => console.error("Delete error:", err));
}

// Initial load
loadPosts();



