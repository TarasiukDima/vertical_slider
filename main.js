document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    class SimpleSlider {
        constructor(classContainer) {
            this.slider = document.querySelector(classContainer);
            this.sliderBtns = this.slider.querySelector('.slider__buttons');
            this.leftSlider = this.slider.querySelector('.left__slider');
            this.rigthSlider = this.slider.querySelector('.right__slider');
            this.activeSlide = 0;
            this.length = this.leftSlider.querySelectorAll('.slider__item').length;
            this.startY = 0;
            this.endY = 0;
            this.canChange = false;
            this.heightContainer = this.slider.getBoundingClientRect().height;

            this.init = this.init.bind(this);
            this._listenerBtnsParrent = this._listenerBtnsParrent.bind(this);
            this._listenerKeyPress = this._listenerKeyPress.bind(this);
            this._listenerMouseSwipe = this._listenerMouseSwipe.bind(this);
            this._listenerMousewheel = this._listenerMousewheel.bind(this);
            this._startPosition = this._startPosition.bind(this);
            this._endPosition = this._endPosition.bind(this);
            this._swipeDirection = this._swipeDirection.bind(this);
            this._changeSlide = this._changeSlide.bind(this);
            this._cloneSlide = this._cloneSlide.bind(this);
            this._startSlider = this._startSlider.bind(this);
            this._removeTransition = this._removeTransition.bind(this);
        }

        // init simple slider
        init() {
            this._listenerBtnsParrent();
            this._listenerKeyPress();
            this._listenerMousewheel();
            this._listenerMouseSwipe();
            this._startSlider();

            this.leftSlider.addEventListener('transitionend', this._removeTransition);
            this.rigthSlider.addEventListener('transitionend', this._removeTransition);
        }

        //start slider
        _startSlider() {
            this.activeSlide = 1;
            this._cloneSlide(this.leftSlider, 'next');
            this._cloneSlide(this.rigthSlider);
            this.length = this.leftSlider.querySelectorAll('.slider__item').length;

            this.leftSlider.style.top = `-${ 100 * (this.length - 1) }vh`;

            this.leftSlider.style.transform = `translateY(${this.activeSlide * this.heightContainer}px)`;
            this.rigthSlider.style.transform = `translateY(-${this.activeSlide * this.heightContainer}px)`;
        }

        // listener for slider btn
        _listenerBtnsParrent() {
            this.sliderBtns.addEventListener('click', (e) => {
                let target = e.target;

                if (target.classList.contains('prev__btn')) {
                    this._changeSlide('prev')

                } else if (target.classList.contains('next__btn')) {
                    this._changeSlide('next')
                }
            })
        }

        // listener for key press
        _listenerKeyPress() {
            document.addEventListener('keydown', (e) => {
                if (e.code === 'ArrowUp') {
                    this._changeSlide('next');
                } else if (e.code === 'ArrowDown') {
                    this._changeSlide('prev');
                }
            })
        }

        // listener for mousewheel
        _listenerMousewheel() {
            document.addEventListener('mousewheel', (e) => {
                if (e.deltaY > 0) {
                    this._changeSlide('prev');
                } else {
                    this._changeSlide('next');
                }
            })
        }

        // listener for swipe
        _listenerMouseSwipe() {
            this.slider.addEventListener('mousedown', this._startPosition);
            this.slider.addEventListener('touchstart', this._startPosition);

            this.slider.addEventListener('mousemove', this._endPosition);
            this.slider.addEventListener('touchmove', this._endPosition);

            this.slider.addEventListener('mouseup', this._swipeDirection);
            this.slider.addEventListener('touchend', this._swipeDirection);
        }

        // defenition start position touch or mosedown
        _startPosition(e) {
            this.startY = e.clientY || e.changedTouches[0].pageY;
        }

        // defenition end position touch or mosedown
        _endPosition(e) {
            this.endY = e.clientY || e.changedTouches[0].pageY;
        }

        // defenition swipe direction
        _swipeDirection() {
            const yDiff = this.endY - this.startY;

            if (yDiff === 0) return;

            if (yDiff > 0) {
                //down
                this._changeSlide('prev');
            } else {
                //up
                this._changeSlide('next');
            }

            // reset values
            this.startY = 0;
            this.endY = 0;
        }

        // change active slide
        _changeSlide(param = 'next') {
            if (this.canChange) return;

            this.canChange = true;
            this.slider.classList.add('animation');

            if (param === 'prev') {
                this.activeSlide--;
            } else if (param === 'next') {
                this.activeSlide++;
            }

            this.leftSlider.style.transform = `translateY(${this.activeSlide * this.heightContainer}px)`;
            this.rigthSlider.style.transform = `translateY(-${this.activeSlide * this.heightContainer}px)`;
        }

        // remove transition class from slider and check active index
        _removeTransition() {
            this.slider.classList.remove('animation');
            this.canChange = false;

            if (this.activeSlide > this.length - 2) {
                this.activeSlide = 1;
            }
            if (this.activeSlide == 0) {
                this.activeSlide = this.length - 2
            };

            this.leftSlider.style.transform = `translateY(${this.activeSlide * this.heightContainer}px)`;
            this.rigthSlider.style.transform = `translateY(-${this.activeSlide * this.heightContainer}px)`;

        }

        // add last slide on start, and first slide on end
        _cloneSlide(sliderVar, direction = 'next') {
            const firstSlide = sliderVar.querySelectorAll('.slider__item')[0];
            const lastSlide = sliderVar.querySelectorAll('.slider__item')[this.length - 1];
            const cloneFirstSlide = firstSlide.cloneNode(true);
            const cloneLastSlide = lastSlide.cloneNode(true);

            if (direction === 'next') {
                sliderVar.appendChild(cloneFirstSlide);
                sliderVar.insertBefore(cloneLastSlide, firstSlide);
            } else {
                sliderVar.appendChild(cloneLastSlide);
                sliderVar.insertBefore(cloneFirstSlide, firstSlide);
            }
        }
    }

    const slider = new SimpleSlider('.slider__container');
    slider.init();
})
