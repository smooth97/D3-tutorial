// DOM elements
const btns = document.querySelectorAll("button");
const form = document.querySelector("form");
const formAct = document.querySelector("form span");
const input = document.querySelector("input");
const error = document.querySelector(".error");

let activity = "cycling";

btns.forEach(btn => {
  btn.addEventListener("click", e => {
    // get data activity
    activity = e.target.dataset.activity;

    // remove active class
    btns.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    // set id of input
    input.setAttribute("id", activity);

    // set text of form span
    formAct.textContent = activity;

    // call the update function
    update(data);
  });
});

// form submit
form.addEventListener("submit", e => {
  e.preventDefault();

  const distance = parseInt(input.value); // string타입 number타입으로 변환
  if (distance) {
    db.collection("activities")
      .add({
        distance,
        activity,
        date: new Date().toString()
      })
      .then(() => {
        error.textContent = "";
        input.value = "";
      });
  } else {
    error.textContent = "Please enter a valid distance";
  }
});
