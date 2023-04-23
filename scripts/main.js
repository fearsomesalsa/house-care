window.onload = (() => {
    // Animations (wow.js)
    new WOW({
        animateClass: 'animate__animated',
    }).init();

    $('.contacts__image').addClass('animate__pulse').attr('data-wow-iteration', 'infinite');

    $('.technologies__pointer').addClass('animate__fadeIn').attr('data-wow-duration', "1s");

    $('.technology').addClass('animate__zoomIn');

    let startAnimate = 0;
    let duration = 1;

    const steps = $('.step');
    steps.addClass('animate__fadeIn');
    steps.each(function () {
        $(this).attr('data-wow-delay', startAnimate + 's').attr('data-wow-duration', duration + 's');
        startAnimate += 0.2;
    });

    const locations = $('.location');
    locations.addClass('animate__fadeIn');
    locations.each(function () {
        $(this).attr('data-wow-delay', startAnimate + 's').attr('data-wow-duration', duration + 's');
        startAnimate += 0.1;
    });

    // Scroll down
    $('.scroll-down').click(() => {
        linkScrollsTo($('.projects'));
    });

    // Drop menu
    const menu = $('.menu');
    const menuWrapper = $('.menu-wrapper');
    $('#burger').click(() => {
        menu.css({transform: 'translateX(-680px)'});
        menuWrapper.css({zIndex: '9'});
    });

    $('.menu *').click(() => {
        menu.css({transform: 'translateX(-1600px)'});
        setTimeout(() => {
            menuWrapper.css({zIndex: '-1'});
        }, 1000);

    });

    // Menu links scroll to corresponding sections
    const menuLinks = $('.menu__link');
    menuLinks.click(function (e) {
        e.preventDefault();
        switch ($(this).text()) {
            case 'Каталог':
                // нет такого раздела, поэтому ссылка никуда не ведет
                break;
            case 'Технологии':
                linkScrollsTo($('.technologies'));
                break;
            case 'Наши проекты':
                linkScrollsTo($('.projects'));
                break;
            case 'Производство':
                // нет такого раздела, поэтому ссылка никуда не ведет
                break;
            case 'Гарантия':
                linkScrollsTo($('.conditions'));
                break;
            case 'Отзывы':
                linkScrollsTo($('.photos'));
                break;
            default:
                break;
        }
    });

    // Fixed header
    const header = $('.header');
    $(window).scroll(() => {
        if ($(this).scrollTop() > 0) {
            header.css({
                'background': '#18181e',
                'border-color': '#18181e'
            });
        } else {
            header.css({
                'background': 'none',
                'border-color': 'rgb(54, 61, 81)'
            });
        }
    });


    // Scroll to section 'Consultation'
    const consultation = $('.consultation');
    $('.scroll-to-consultation').click((e) => {
        e.preventDefault();
        linkScrollsTo(consultation);
    });

    function linkScrollsTo(elem) {
        $('html,body').animate(
            {
                scrollTop: $(elem).offset().top - header.outerHeight()
            }, 1000);
    }

    // Gallery of project photos (via magnific popup)
    $('.project__images').each(function () {
        $(this).magnificPopup({
            delegate: '.project__image-link',
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    });

    // Show more projects
    const hiddenProjects = $('.project.hidden');
    const seeMoreProjectsText = $('.projects__text');
    const seeMoreProjectsArrow = $('.projects__arrow');
    $('#see-more-projects').click(function (e) {
        e.preventDefault();
        if (hiddenProjects.hasClass('hidden')) {
            hiddenProjects.removeClass('hidden');
            seeMoreProjectsText.text('Скрыть проекты');
            seeMoreProjectsArrow.css({transform: 'rotate(180deg)'});
            linkScrollsTo(hiddenProjects[0]);
        } else {
            hiddenProjects.addClass('hidden');
            seeMoreProjectsText.text('Посмотреть ещё 3 проекта');
            seeMoreProjectsArrow.css({transform: 'none'});
            linkScrollsTo($('.technologies'));
        }
        new WOW({
            animateClass: 'animate__animated',
        }).init();
    });

    // Carousel
    const carousel = $('.carousel');
    carousel.on('init', function (event, slick, currentSlide) {
        let curSlide = $(slick.$slides[slick.currentSlide]);
        changePrevNextSlides(slick, curSlide);
    }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        slick.$prevSlide.removeClass('slick-sprev');
        slick.$nextSlide.removeClass('slick-snext');
        let curSlide = $(slick.$slides[nextSlide]);
        changePrevNextSlides(slick, curSlide);
    });

    function changePrevNextSlides(slick, currentSlide) {
        let nextSlide = $(currentSlide).next();
        const prevSlide = $(currentSlide).prev();
        prevSlide.addClass('slick-sprev');
        nextSlide.addClass('slick-snext');
        currentSlide.removeClass('slick-snext').removeClass('slick-sprev');
        slick.$prevSlide = prevSlide;
        slick.$nextSlide = nextSlide;
    }

    carousel.slick({
        arrows: true,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1000,
        easing: 'ease',
        infinite: true,
        initialSlide: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true,
        variableWidth: true,
        slidesPerRow: 1,
        centerPadding: '0',
        swipe: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                }
            }
        ]
    });

    // Popup
    const popup = $('.popup-wrapper');
    const popupForm = $('.popup__form');
    const popupDescription = $('.popup__description');
    $('#tour').click(() => {
        popup.css({display: 'block'});
    });

    $('.popup__close').click(() => {
        popup.css({display: 'none'});
        popupDescription.html('Пожалуйста, оставьте свои данные, чтобы мы могли связаться с вами и уточнить детали предстоящей экскурсии');
        popupForm.show();
    });

    const loader = $('.loader-wrapper');
    // Form validation
    $('.consultation__form').on('submit', function (e) {
        e.preventDefault();
        if (formIsValid(this)) {
            loader.css('display', 'flex');
            $.ajax({
                method: "POST",
                url: "https://testologia.site/checkout",
                data: formIsValid(this)
            })
                .done(function (msg) {
                    loader.hide();
                    if (msg.success) {
                        consultation[0].scrollIntoView({behavior: 'smooth'});
                        $('.consultation__title').html('Спасибо, мы свяжемся с вами в ближайшее время!');
                        $('.form').fadeOut();
                        setTimeout(() => {
                            $('.consultation__title').html('Получите индивидуальную консультацию');
                            $('.form').fadeIn();
                        }, 2000);
                    } else {
                        alert('Возникла ошибка при оформлении заявки, пожалуйста позвоните нам');
                    }
                });
            this.reset();
        }
    });


    popupForm.on('submit', function (e) {
        e.preventDefault();
        if (formIsValid(this)) {
            loader.css('display', 'flex');
            $.ajax({
                method: "POST",
                url: "https://testologia.site/checkout",
                data: formIsValid(this)
            })
                .done(function (msg) {
                    loader.hide();
                    if (msg.success) {
                        popupForm.hide();
                        popupDescription.html('Спасибо, мы свяжемся с вами в ближайшее время!')
                    } else {
                        alert('Возникла ошибка при оформлении заявки, пожалуйста позвоните нам');
                    }
                });
            this.reset();
        }
    });

    function formIsValid(form) {
        const name = $(form).find('.input-name');
        const phone = $(form).find('.input-phone');
        const agree = $(form).find('.input-agree');
        let hasError = false;

        $(form).find('.form__error-input').hide();
        name.css({borderColor: 'rgb(255, 255, 255)'});
        phone.css({borderColor: 'rgb(255, 255, 255)'});
        agree.next().removeClass('border-red');

        if (!name.val()) {
            hasError = true;
            name.css({borderColor: 'rgb(255, 76, 76)'});
            name.next().next().show();
        }
        if (!phone.val()) {
            hasError = true;
            phone.css({borderColor: 'rgb(255, 76, 76)'});
            phone.next().next().show();
        }

        if (!agree[0].checked) {
            hasError = true;
            agree.next().addClass('border-red');
            agree.next().next().show();
        }
        return (hasError ? false : {name: name.val(), phone: phone.val()});
    }

    // Phone inputmask
    $('.input-phone').inputmask({"mask": "+380 (99) 99-99-999"});

    // Technology hover || active || focus
    const technologyPointers = $('.technology__pointer');
    const pointerPowerNodes = $('.pointer-power-nodes');
    technologyPointers.hover(function() {
        if (pointerPowerNodes.hasClass('technology__pointer_active')) {
            removeActivePointer(pointerPowerNodes);
        } else {
            addActivePointer(pointerPowerNodes)
        }
    }).focus(function() {
        if (pointerPowerNodes.hasClass('technology__pointer_active')) {
            removeActivePointer(pointerPowerNodes);
        } else {
            addActivePointer(pointerPowerNodes)
        }
    });

    function removeActivePointer(pointer) {
        $(pointer).removeClass('technology__pointer_active');
        $(pointer).find('.technology__pointer_inner').removeClass('technology__pointer_inner_active');
        $(pointer).next().removeClass('technology__info_active');
    }
    function addActivePointer(pointer) {
        $(pointer).addClass('technology__pointer_active');
        $(pointer).find('.technology__pointer_inner').addClass('technology__pointer_inner_active');
        $(pointer).next().addClass('technology__info_active');
    }
});


