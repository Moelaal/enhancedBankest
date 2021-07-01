'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

// Open modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
// Close modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScroll.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('current scroll (x/y)', window.pageXOffset, pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //scrolling

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

////// Page navigation \\\\\\\

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Gaurd clause

  if (!clicked) return;

  // Remove classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  //active tab
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//handler function

const handler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Menu fade animation
nav.addEventListener('mouseover', handler.bind(0.5));

nav.addEventListener('mouseout', handler.bind(1));

// // Sticky navigation
// const initCoords = section1.getBoundingClientRect();

// console.log(initCoords);

// window.addEventListener('scroll', function () {
//   // console.log(this.window.scrollY);
//   if (window.scrollY > initCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation: Intersection Observer API
// const obscallback = function (entries, observer) {
//   entries.forEach(obs => {
//     console.log(obs);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obscallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSections = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(sections => {
  sectionObserver.observe(sections);
  // sections.classList.add('section--hidden');
});

// Lazy load img
const AllImg = document.querySelectorAll('img[data-src]');

const loadimg = (entries, observer) => {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadimg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

AllImg.forEach(img => imgObserver.observe(img));

const slider = function () {
  // Sliders
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlides = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlides(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlides(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    goToSlides(0);
    createDots();
    activateDots(0);
  };

  init();

  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlides(slide);
      activateDots(slide);
    }
  });
};

slider();
/////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     console.log('Legend');
//     e.preventDefault();
//   });
// });

// 1. Add event listner to common parent element
// 2. Determine what  element originated the event

//secting elements
console.log(document.documentElement);
console.log(document.body);
console.log(document.head);

const features = document.querySelector('.features');
console.log(features);

const allSections = document.querySelectorAll('section');
console.log(allSections);

const header = document.querySelector('.header');
document.getElementById('section--1');

document.getElementsByClassName('btn');
const allbtns = document.getElementsByTagName('button');
console.log(allbtns);

const section = document.querySelector('.section');

// creating and inserting elements
const msg = document.createElement('div');

msg.classList.add('cookie-message');

msg.innerHTML =
  'We glad to have you here <button class="btn btn--close-cookie">Click Here</button>';

header.append(msg);

// section.prepend(msg);

// section.prepend(msg.cloneNode(true));

// section.before(msg);
// section.after(msg);

// deleting elements

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    msg.remove();
  });

//styles

msg.style.backgroundColor = '#383249';
msg.style.width = '140%';

console.log(msg.style.color);
console.log(msg.style.backgroundColor);

console.log(getComputedStyle(msg).color);
console.log(getComputedStyle(msg).backgroundColor);

document.documentElement.style.setProperty('--color-primary', 'cyan');

const img = document.querySelector('.header__img');

console.log(img.src);
console.log(img.alt);
console.log(img.className);

img.alt = 'her we are yasta';

// NON-standred
console.log(img.king);
console.log(img.getAttribute('king'));

img.setAttribute('name', 'Abdelaal');

const link = document.querySelector('.btn--show-modal');

console.log(link.href);
console.log(link.getAttribute('href'));
*/
/*


let img = document.querySelector('.header__img');

// img.addEventListener('mouseenter', function (e) {
//   alert('jjfjjfjjfjjfjjfj');
// });

// const alerthere = function (e) {
//   alert('mhsd');
// };

// img.addEventListener('mouseenter', alerthere);

// setTimeout(() => img.removeEventListener('mouseenter', alerthere), 3000);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('link', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  //stop propagation

  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('container', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('nav', e.target, e.currentTarget);
});


//

// Going downwards: child
const h1 = document.querySelector('h1');

console.log(h1.querySelectorAll('.highlight'));

console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'dodgerblue';
h1.lastElementChild.style.color = 'var(--color-primary)';

// Goning upwards: parents
console.log(h1.parentElement);
console.log(h1.parentNode);

// h1.closest('.header').style.background = 'var(--gradient-primary)';

// h1.closest('h1').style.background = 'var(--gradient-secondary)';

// goning sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.width = '200%';
// });
*/

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML');
});
