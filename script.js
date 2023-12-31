'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('nav');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

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

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('.nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  const clicked = e.target.closest('button.operations__tab');

  // Guard clause
  if (!clicked) return;

  tabs.forEach(it => it.classList.remove('operations__tab--active'));
  tabsContent.forEach(it => it.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => {
  imgObserver.observe(img);
});

///////////////////////////////////////
// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

class Slider {
  constructor(slides, dotContainer) {
    this._slides = slides;
    this._dotContainer = dotContainer;
    this._init();
  }

  get maxSlide() {
    return this._slides.length;
  }

  get curSlide() {
    return this._curSlide;
  }

  set curSlide(slide) {
    this._curSlide = slide;
    this._goToSlide();
    this._activateDot();
  }

  _init() {
    this._createDots();
    this.curSlide = 0;
  }

  _activateDot() {
    this._dotContainer.querySelectorAll('button.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    this._dotContainer
      .querySelector(`.dots__dot[data-slide="${this.curSlide}"]`)
      .classList.add('dots__dot--active');
  }

  _goToSlide() {
    this._slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - this.curSlide)}%)`;
    });
  }

  _createDots() {
    this._slides.forEach((_, i) => {
      this._dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });

    this._dotContainer.addEventListener('click', e => {
      if (e.target.matches('button.dots__dot')) {
        const { slide } = e.target.dataset;
        this.goTo(+slide);
      }
    });
  }

  next() {
    if (this.curSlide === this.maxSlide - 1) {
      this.curSlide = 0;
    } else {
      this.curSlide++;
    }
  }

  prev() {
    if (this.curSlide === 0) {
      this.curSlide = this._slides.length - 1;
    } else {
      this.curSlide--;
    }
  }

  goTo(index) {
    this.curSlide = index;
  }
}

const slider = new Slider(slides, dotContainer);
btnRight.addEventListener('click', () => slider.next());
btnLeft.addEventListener('click', () => slider.prev());

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') slider.prev();
  if (e.key === 'ArrowRight') slider.next();
});
