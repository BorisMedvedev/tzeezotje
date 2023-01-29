const form = document.getElementById("contactForm");
const success = document.getElementById("success");
const error = document.getElementById("error");
const errorsHolder = document.getElementById("errorsHolder");

console.log(form);

form.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("SUBMIT!!!!!");

  success.hidden = true;
  error.hidden = true;
  errorsHolder.innerHTML = "";

  const formData = $(this).serialize();
  console.log(decodeURI(formData));

  jQuery
    .ajax({
      method: "POST",
      url: 'http://localhost:3000/mail.php',
      data: formData,
    })
    .done(function (msg) {
      console.log("Сработает В СЛУЧАЕ УСПЕХА.");

      msg = JSON.parse(msg); // JS object
      console.log(msg);

      console.log(msg.status);
      console.log(msg.message);

      if (msg.status) {
        // УСПЕХ
        success.hidden = false;
        form.reset();
      } else {
        // ОШИБКА
        if (Array.isArray(msg.message)) {
          // Распечатываем ошибки по одному
          console.log("ARRAY");
          console.log(msg.message);

          msg.message.forEach(function (item) {
            const html = `<div id="error" class="alert alert-danger" role="alert">${item}</div>`;
            errorsHolder.insertAdjacentHTML("beforeend", html);
          });
        } else {
          // Произошла ошибка при отправке письма
          error.hidden = false;
        }
      }
    });
  form.reset()
});



const btns = document.querySelectorAll(".hero__btn");
const modalOverlay = document.querySelector(".modal-overlay ");
const modals = document.querySelectorAll(".modal");

btns.forEach((el) => {
  el.addEventListener("click", (e) => {
    let path = e.currentTarget.getAttribute("data-path");

    modals.forEach((el) => {
      el.classList.remove("modal--visible");
    });

    document
      .querySelector(`[data-target="${path}"]`)
      .classList.add("modal--visible");
    modalOverlay.classList.add("modal-overlay--visible");
  });
});

modalOverlay.addEventListener("click", (e) => {
  console.log(e.target);

  if (e.target == modalOverlay) {
    modalOverlay.classList.remove("modal-overlay--visible");
    modals.forEach((el) => {
      el.classList.remove("modal--visible");
    });
  }
});
