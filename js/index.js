const BASE_URL = "http://localhost:3000/books";

document.addEventListener("DOMContentLoaded", function () {
  getBooks();
});

const getBooks = () => {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((bookData) => bookData.forEach(renderBooks));
};

const renderBooks = (book) => {
  let bookList = document.createElement("li");
  bookList.innerText = book.title;
  Object.keys(book).forEach((key) => {
    bookList.dataset[key] =
      typeof book[key] === "object" ? JSON.stringify(book[key]) : book[key];
  });
  bookList.addEventListener("click", bookDetail);

  document.getElementById("list").append(bookList);
};

const bookDetail = (event) => {
  console.log(event.target.dataset);

  showPanel = document.getElementById("show-panel");
  showPanel.innerHTML = "";

  let title = document.createElement("li");
  title.innerText = event.target.dataset.title;

  let subtitle = document.createElement("li");
  subtitle.innerText = event.target.dataset.subtitle;

  let author = document.createElement("li");
  author.innerText = event.target.dataset.author;

  let description = document.createElement("li")
  description.textContent = event.target.dataset.description;

  let img = document.createElement("img");
  img.src = event.target.dataset.img_url;

  let ul = document.createElement("ul");
  let users = JSON.parse(event.target.dataset.users);
  users.forEach((user) => {
    let li = document.createElement("li");
    li.innerText = user.username;
    ul.appendChild(li);
  });

  const isLiked = !!users.find((user) => user.id === 1)
  const button = document.createElement("button");
  button.innerText = isLiked ? "UNLIKE" : "LIKE";

  button.addEventListener("click", (ev) => {
    let newLikes;

    if (isLiked) {
      newLikes = {
        users: users.filter((user) => user.id !== 1),
      };
    } else {
      newLikes = {
        users: [...users, { id: 1, username: "pouros" }],
      };
    }

    const reqObj = {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify(newLikes),
    };

    fetch(BASE_URL + "/" + event.target.dataset.id, reqObj)
      .then((res) => res.json())
      .then((book) => {
        event.target.dataset.users = JSON.stringify(book.users);
        bookDetail({ target: event.target });
      });
  });

  showPanel.append(img, title, subtitle, author, description);
  showPanel.appendChild(ul);
  showPanel.appendChild(button);
};
