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
const inputSearch = document.querySelector('.input-search'); //строка поиска
const modalBody = document.querySelector('.modal-body'); //список товаров в корзине
const modalPrice = document.querySelector('.modal-pricetag'); //общая стоимость корзины
const buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('deliveryLogin'); //получение логина из локального хранилища

const cart = getCart();

//получение данных 
const getData = async function(url) {
  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url},
    статус ошибки ${response.status}`);
  }

  return await response.json();
};

//переключение окна корзины
function toggleModal() {
  modal.classList.toggle("is-open");
}

//Переключение окна авторизации
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open")
}

//Действия при авторизованном пользователе
function authorized() {
  //функция выхода
  function logOut() {
    login = null;
    localStorage.removeItem('deliveryLogin'); //удаление логина из локального хранилища
    buttonAuth.style.display = ''; //показываем кнопку "Войти"
    userName.style.display = ''; //прячем имя пользователя
    buttonOut.style.display = ''; //прячем кнопку "Выход"
    cartButton.style.display = ''; //прячем кнопку "Корзина"
    buttonOut.removeEventListener('click', logOut); //удаляем событие кнопки "Выход"
    checkAuth();
  }

  userName.textContent = login; //выводим логин

  buttonAuth.style.display = 'none'; //прячем кнопку "Войти"
  userName.style.display = 'inline'; //показываем имя пользователя
  buttonOut.style.display = 'flex'; //показываем кнопку "Выход"
  cartButton.style.display = 'flex'; //показываем кнопку "Корзина"

  buttonOut.addEventListener('click', logOut); //Назначение события кнопке "Выход"
}

//Действия при неавторизованном пользователе
function notAuthorized() {
  //авторизация
  function logIn(event) {
    event.preventDefault(); //отключение действия по-умолчанию (в данном случае - для отключения перезапуска страницы и отправки данных на сервер)
    login = logInInput.value; //получение введеного логина

    if(!login.trim()) {
      errorLogin.style.display = 'block'; //показ сообщения об ошибке ("Не введен логин")
      logInInput.style.backgroundColor = 'red'; //изменения цвета поля ввода логина
    } else {
      errorLogin.style.display = 'none'; //скрытие сообщения об ошибке ("Не введен логин")
      logInInput.style.backgroundColor = 'white'; //изменение цвета поля ввода логина

      localStorage.setItem('deliveryLogin', login) //запись логина в локальное хранилище

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
function checkAuth() {
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }
}

//создание карточки ресторана
function createCardRestaurant({ image, kitchen, name, price,
  products, stars, time_of_delivery: timeOfDelivery }) {

  const card = `
          <a class="card card-restaurant" data-products="${products}"
            data-restaurant='{
              "name": "${name}",
              "stars": "${stars}",
              "price": "${price}",
              "kitchen": "${kitchen}"
            }'>
						<img src="${image}" alt="${name}" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery} мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
          </a>
        `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

//добавление карточки товара
function createCardGood({ description, id, image, name, price }) {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend',  `
          <img src="${image}" alt="${name}" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
							</div>
						</div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

//открытие меню ресторанов
function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant'); //поиск родителя с классом '.card-restaurant'

  if(restaurant) {
    if(!login) {
      toggleModalAuth();
    } else {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      let restInfo = JSON.parse(restaurant.dataset.restaurant); //получаем данные ресторана и преобразуем в json

      getData(`./db/${restaurant.dataset.products}`).then(function(data){
        data.forEach(createCardGood);
      });

      changeTitleRestaurant(restInfo);
    }
  }
}

//функция изменения заголовка ресторана
function changeTitleRestaurant({ name, kitchen, price, stars }) {
  let priceStr = '';
  if(price){
    priceStr = `<div class="price">От ${price} ₽</div>`;
  }

  const title = `
           <h2 class="section-title restaurant-title">${name}</h2>
					<div class="card-info">
						<div class="rating">
							${stars}
						</div>
						${priceStr}
						<div class="category">${kitchen}</div>
					</div>
        `

  const restaurantTitle = document.querySelector('.restaurant-title');
  const titleArea = restaurantTitle.closest('.section-heading');
  titleArea.innerHTML='';
  titleArea.insertAdjacentHTML('beforeend', title);
}

//возврат на главное окно
function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

//функция поиска
function search(event){
  if(event.keyCode===13) {
    const target = event.target;
    const value = target.value.toLowerCase().trim();

    if(!value || value.length > 4){
      target.style.backgroundColor = 'red';
      setTimeout(function(){
        target.style.backgroundColor = '';
      }, 2000)

      return;
    }

    target.value = '';

    const goods = [];

    getData('./db/partners.json')
      .then(function(data){
        const products = data.map(function(item){
          return item.products;
        });

        products.forEach(function(product){
          getData('./db/' + product)
            .then(function(data){
              goods.push(...data);

              const serachGoods = goods.filter(function(item){
                return item.name.toLowerCase().includes(value);
              })
              cardsMenu.textContent = '';
              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');

              let restInfo = JSON.parse(`{
                "name": "Результат поиска",
                "stars": "",
                "price": "",
                "kitchen": ""
              }`);

              // goods.forEach(createCardGood);
              changeTitleRestaurant(restInfo);

              return serachGoods;
            })
            .then(function(data){
              data.forEach(createCardGood)
            });
        });
      });
  };
}

//добавить в корзину
function addToCart(event){
  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart');

  if(buttonAddToCart){
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function(item){
      return item.id === id;
    })

    if(food) {
      food.count++;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }

    //запись в localStorage
    setCart();
  }
}

//формирование корзины
function renderCart(){
  modalBody.textContent = '';

  cart.forEach(function({ id, title, cost, count }){
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML('beforeend', itemCart);

    
  })

  const totalPrice = cart.reduce(function(result, item){
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';

}

//изменение количества продуктов в корзине
function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function(item){
      return item.id === target.dataset.id;
    });

    if(target.classList.contains('counter-minus')) {
      food.count--; 

      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if(target.classList.contains('counter-plus')) food.count++; 

    renderCart();
    setCart();
  }
}

//получение корзины из localStorage
function getCart(){
  const cartLS = localStorage.getItem('deliveryCart');
  const cartJsonGet = JSON.parse(cartLS);

  if(!cartJsonGet){
    return [];
  } else {
    return cartJsonGet;
  }

}

//сохранение корзины в localStorage
function setCart(){
  const cartJsonSet = cart.reduce(function(result, item){
    return result + '\n {\n  "id": "' + item.id + '",\n  "title": "' + item.title + '",\n  "cost": "' + item.cost + '",\n  "count": "' + item.count + '"\n },';
  }, '');

  localStorage.setItem('deliveryCart', '[' + cartJsonSet.replace(/\,$/, '') + '\n]');
}

//функция запуска
function init () {
  //получение данных о ресторанах
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant);
  });

  //событие кнопки "Корзина"
  cartButton.addEventListener("click", function(){
    renderCart();
    toggleModal();
  });
  
  //кнопка "Отмена" в корзине
  buttonClearCart.addEventListener('click', function() {
    cart.length = 0;
    renderCart();
    localStorage.removeItem('deliveryCart');
  })
  //событие для изменения количества для товаров в корзине
  modalBody.addEventListener('click', changeCount);

  //событие для кнопки "В корзину"
  cardsMenu.addEventListener('click', addToCart);

  //событие кнопки "Закрыть" окна корзины
  close.addEventListener("click", toggleModal);

  //нажатие на карточку ресторана
  cardsRestaurants.addEventListener('click', openGoods);

  //функция возврата на главный экран по нажатию лого
  logo.addEventListener('click', returnMain);

  //перехват события нажатия кнопки в поле поиска
  inputSearch.addEventListener('keydown', search);

  checkAuth()
}

init();