'use strict' //"строгий режим"

const cartButton = document.querySelector("#cart-button"); //кнопка "Корзина"
const modal = document.querySelector(".modal"); //окно корзины
const close = document.querySelector(".close"); //"Закрыть" окно корзины
const buttonAuth = document.querySelector('.button-auth'); //кнопка "Войти" главной страницы
const modalAuth = document.querySelector('.modal-auth'); //окно авторизации
const closeAuth = document.querySelector('.close-auth'); //кнопка "Закрыть" в окне авторизации
const logInForm = document.querySelector('#logInForm'); //форма авторизации
const logInInput = document.querySelector('#login'); //поле ввода логина
const userName = document.querySelector('.user-name'); //поле вывода имени пользователя
const buttonOut = document.querySelector('.button-out'); //кнопка "Выход"
const errorLogin = document.querySelector('#errorLogin'); //поле ошибки ввода логина
const cardsRestaurants = document.querySelector('.cards-restaurants'); //карточки ресторанов
const containerPromo = document.querySelector('.container-promo'); //поле баннера
const restaurants = document.querySelector('.restaurants'); //поле ресторанов
const menu = document.querySelector('.menu'); //блок меню
const logo = document.querySelector('.logo'); //лого
const cardsMenu = document.querySelector('.cards-menu'); //меню ресторана

let login = localStorage.getItem('gloDelivery'); //получение логина из локального хранилища

//переключение окна корзины
function toggleModal() {
  modal.classList.toggle("is-open");
}

//Переключение окна авторизации
function toggleModalAuth(){
  modalAuth.classList.toggle("is-open")
}

//Действия при авторизованном пользователе
function authorized(){
  //функция выхода
  function logOut(){
    login = null;
    localStorage.removeItem('gloDelivery'); //удаление логина из локального хранилища
    buttonAuth.style.display = ''; //показываем кнопку "Войти"
    userName.style.display = ''; //прячем имя пользователя
    buttonOut.style.display = ''; //прячем кнопку "Выход"
    buttonOut.removeEventListener('click', logOut); //удаляем событие кнопки "Выход"
    checkAuth();
  }

  userName.textContent = login; //запоминаем логин

  buttonAuth.style.display = 'none'; //прячем кнопку "Войти"
  userName.style.display = 'inline'; //показываем имя пользователя
  buttonOut.style.display = 'block'; //Показываем кнопку "Выход"

  buttonOut.addEventListener('click', logOut); //Назначение события кнопке "Выход"
}

//Действия при неавторизованном пользователе
function notAuthorized(){
  //авторизация
  function logIn(event){
    event.preventDefault(); //отключение действия по-умолчанию (в данном случае - для отключения перезапуска страницы и отправки данных на сервер)
    login = logInInput.value; //получение введеного логина

    if(!login.trim()){
      errorLogin.style.display = 'block'; //показ сообщения об ошибке ("Не введен логин")
      logInInput.style.backgroundColor = 'red'; //изменения цвета поля ввода логина
    } else {
      errorLogin.style.display = 'none'; //скрытие сообщения об ошибке ("Не введен логин")
      logInInput.style.backgroundColor = 'white'; //изменение цвета поля ввода логина

      localStorage.setItem('gloDelivery', login) //запись логина в локальное хранилище

      toggleModalAuth(); //показ окна авторизации
      //удаление событий с кнопок
      buttonAuth.removeEventListener('click', toggleModalAuth); //кнопка "Войти" на главной странице
      closeAuth.removeEventListener('click', toggleModalAuth); //кнопка "Закрыть на форме авторизации"
      logInForm.removeEventListener('submit', logIn); //кнопка "Войти" на окне авторизации
      
      logInForm.reset();//возврат формы к исхдному виду
      checkAuth()
    }
  }

  //Добавление событий кнопкам
  buttonAuth.addEventListener('click', toggleModalAuth); //кнопка "Войти" на главной странице
  closeAuth.addEventListener('click', toggleModalAuth); //кнопка "Закрыть на форме авторизации"
  logInForm.addEventListener('submit', logIn); //кнопка "Войти" на окне авторизации
}

//Функция проверки авторизации
function checkAuth(){
  if(login){
    authorized();
  } else {
    notAuthorized();
  }
}

//создание карточки ресторана
function createCardRestaurant(){
  const card = `
          <a class="card card-restaurant">
						<img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">Тануки</h3>
								<span class="card-tag tag">60 мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									4.5
								</div>
								<div class="price">От 1 200 ₽</div>
								<div class="category">Суши, роллы</div>
							</div>
						</div>
          </a>
        `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

//добавление карточки товара
function createCardGood(){
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend',  `
          <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">Пицца Классика</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
									грибы.
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">510 ₽</strong>
							</div>
						</div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

//открытие меню ресторанов
function openGoods(event){
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if(restaurant){
    if(!login){
      toggleModalAuth();
    } else {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      createCardGood();
    }
  }
}

cartButton.addEventListener("click", toggleModal); //событие кнопки "Корзина"

close.addEventListener("click", toggleModal); //событие кнопки "Закрыть" окна корзины

cardsRestaurants.addEventListener('click', openGoods); //нажатие на карточку ресторана

//функция воврата на главный экран по нажатию лого
logo.addEventListener('click', function(){
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})

checkAuth()
createCardRestaurant();
createCardGood();