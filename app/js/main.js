document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector(".menu-bar");
  btn.addEventListener("click", function () {
    const nav = document.querySelector(".nav");
    const btn = document.querySelector(".header__container");
    btn.classList.toggle("open");
    nav.classList.toggle("active");
  });
  function navigation() {
    const anchors = document.querySelectorAll(".nav__link");
    for (let anchor of anchors) {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const blockID = anchor.getAttribute("href");
        console.log(blockID);
        document.querySelector(blockID).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }
  navigation();

  const swiper1 = new Swiper(".sfeerfoto-swiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    freeMode: true,
    pagination: {
      el: ".pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".sfeerfoto-swiper-next",
      prevEl: ".sfeerfoto-swiper-prev",
    },
    breakpoints: {
      320: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      440: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

  const swiper2 = new Swiper(".reviews-swiper", {
    navigation: {
      nextEl: ".reviews-swiper__next",
      prevEl: ".reviews-swiper__prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  ymaps.ready(init);
  function init() {
    var myMap = new ymaps.Map("map", {
      center: [55.76, 37.64],
      zoom: 7,
    });
    myMap.behaviors.disable('scrollZoom');
  }
});


function validation(form) {

  function removeError(input) {
    const parent = input.parentNode;

    if (parent.classList.contains('error')) {
      parent.querySelector('.error-label').remove()
      parent.classList.remove('error')
    }
  }

  function createError(input, text) {
    const parent = input.parentNode;
    const errorLabel = document.createElement('label')

    errorLabel.classList.add('error-label')
    errorLabel.textContent = text

    parent.classList.add('error')

    parent.append(errorLabel)
  }


  let result = true;

  const allInputs = form.querySelectorAll('input');

  for (const input of allInputs) {

    removeError(input)

    if (input.dataset.minLength) {
      if (input.value.length < input.dataset.minLength) {
        removeError(input)
        createError(input, `Минимальное кол-во символов: ${input.dataset.minLength}`)
        result = false
      }
    }

    if (input.dataset.maxLength) {
      if (input.value.length > input.dataset.maxLength) {
        removeError(input)
        createError(input, `Максимальное кол-во символов: ${input.dataset.maxLength}`)
        result = false
      }
    }

    if (input.dataset.required == "true") {
      if (input.value == "") {
        removeError(input)
        createError(input, 'Поле не заполнено!')
        result = false
      }
    }

  }

  return result
}


document.getElementById('add-form').addEventListener('submit', function (event) {
  event.preventDefault()

  if (validation(this) == true) {
    alert('Форма проверена успешно!')
  }

})
