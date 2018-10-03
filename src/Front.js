import React from 'react';
import {connect} from 'react-redux';

@connect(state => ({
	location: state.location,
	dir: state.lang.dir,
}))
export default class Front extends React.Component {

	toggleMap = () => {
		$('.map-wrapper').toggleClass('is-showing');
		if($('.map-wrapper').hasClass('is-showing')) {
			$(this).find('span').text('hide map');
		} else {
			$(this).find('span').text('See map');
		}
	};

	slickPrev = () => $('.customer-slider').slick('slickPrev');
	slickNext = () => $('.customer-slider').slick('slickNext');

	addEvents = () => {
		$('.scroll-top').on('click', scrollTopClick);
		$(window).on('resize', windowResize);
		$(document).on('click', '.menu-icon', menuIconClick);
		$('.customer-slider').slick({
			dots: true,
			arrows: false,
			fade: true,
			speed: 800,
			infinite: true,
			touchThreshold: 100,
			autoplay: true,
			autoplaySpeed: 5000,
			rtl: this.props.dir === 'rl'
		});
		$(document).on('click', '.customer-slider-wrapper .slider-action .slide-prev', this.slickPrev);
		$(document).on('click', '.customer-slider-wrapper .slider-action .slide-next', this.slickNext);
		$(document).on('click', '.map-btn', this.toggleMap);
		$(window).on('scroll', onScroll.bind(null, this.props.dir));

		windowResize();
		onScroll();
	};

	removeEvents = () => {
		$('.scroll-top').off('click', scrollTopClick);
		$(window).off('resize', windowResize);
		$(document).off('click', '.menu-icon', menuIconClick);
		$(document).off('click', '.customer-slider-wrapper .slider-action .slide-prev', this.slickPrev);
		$(document).off('click', '.customer-slider-wrapper .slider-action .slide-next', this.slickNext);
		$(document).off('click', '.map-btn', this.toggleMap);
		$(window).off('scroll', onScroll);
	};

	componentDidMount() {
		this.addEvents();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location.pathname !== this.props.location.pathname) {
			this.removeEvents();
			this.addEvents();
		}
		$(window).scrollTop(0);
	}

	render() {
		return this.props.children;
	}

	componentWillUnmount() {
		this.removeEvents();
		$('body').css({'padding-top' : ''});
	}
}

function onScroll(dir) {
	let wScroll = $(window).scrollTop();

	if(wScroll > $(window).height()) {
		$('.scroll-top').addClass('is-showing');
	} else {
		$('.scroll-top').removeClass('is-showing');
	}

	if ($(window).width() < 768) return;

	if($('.sms-section').length > 0 ) {
		if(wScroll > $('.sms-section').offset().top) {
			$('.scroll-top').addClass('is-showing');
		} else {
			$('.scroll-top').removeClass('is-showing');
		}
	}

	/* Banner Image zoom in */
	$('.banner-section').css({'background-size' :'auto'+wScroll/2+'px'});


	/* Banner Mobile Going Up Fast*/
	$('.banner-mobile-holder').css({'transform' : 'translate(0, -'+ wScroll/10 +'%)'});

	/* Children Coming Up */
	if ($('.banner-mobile-holder').length > 0 ){
		if (wScroll > $('.banner-mobile-holder').offset().top - ($(window).height()/8) ){
			$('.banner-students li').addClass('is-showing');
			let countLi = $('.banner-students li').length;
			for(let count = 1; count <= countLi; count++ ){
				$('.banner-students li:nth-child('+count+')').css({
					'transition-delay': count/4+'s'
				});
			}
		}
	}

	/* Laptop coming in */
	if ($('.sms-section').length > 0 ) {
		let laptopOffset = Math.min(0,wScroll - $('.sms-section').offset().top + $(window).height() - 700);
		$('.sms-section .img-holder').css({ 'transform' : 'translateX('+ laptopOffset +'px)' });
		/* sms-box coming in */
		if (wScroll > $('.sms-section').offset().top - ($(window).height()/4) ){
			$('.sms-box').addClass('is-showing');
			let countBox = $('.sms-box-wrapper .sms-box').length;
			for (let count = 1; count <= countBox; count++ ){
				$('.sms-box-wrapper .sms-box:nth-child('+count+')').css({
					'transition-delay' : count/6+'s'
				});
			}
		}
	}

	/* Education section background */
	if ($('.sms-section').length > 0 ){
		if(wScroll > $('.edu-feature-section').offset().top - ($(window).height()/4)){
			$('.edu-feature-section').css({'background-size':''+(200+wScroll/15)+'px'});
		}
	}

	/* edu-bars coming up */
	if ($('.pateast-education-section').length > 0 ){
		if(wScroll > $('.pateast-education-section').offset().top - ($(window).height()/4)){
			$('.edu-bars').addClass('is-showing');
			let countEduBar = $('.edu-bars').length;
			for(let countBar = 1; countBar <= countEduBar; countBar++ ){
				$('.edu-bars:nth-child('+countBar+')').css({
					'transition-delay' : countBar/6 + 's'
				});
			}
		}
	}

	/* Timeline area coming in */
	if ($('.feature-section').length > 0 ){
		if ($(window).width() > 1024){
			if (wScroll > $('.feature-section').offset().top - $(window).height() ){
				let tlOffset1 = Math.min(0,wScroll - $('.feature-section').offset().top + $(window).height() - 700);
				let tlOffset2 = Math.min(0,wScroll - $('.feature-section').offset().top + $(window).height() - 1200);
				let tlOffset3 = Math.min(0,wScroll - $('.feature-section').offset().top + $(window).height() - 1700);
				let tlOffset4 = Math.min(0,wScroll - $('.feature-section').offset().top + $(window).height() - 2000);

				if (dir === 'rl') {
					$('.timeline-col-2').css({'transform' : 'translate('+ tlOffset1 + 'px,0)'});
					$('.timeline-col-1').css({'transform' : 'translate('+ Math.abs(tlOffset1) + 'px,0)'});

					$('.timeline-col-4').css({'transform' : 'translate('+ Math.abs(tlOffset2) + 'px,0)'});
					$('.timeline-col-3').css({'transform' : 'translate('+ tlOffset2 + 'px,0)'});

					$('.timeline-col-6').css({'transform' : 'translate('+ tlOffset3 + 'px,0)'});
					$('.timeline-col-5').css({'transform' : 'translate('+ Math.abs(tlOffset3) + 'px,0)'});

					$('.timeline-col-8').css({'transform' : 'translate('+ Math.abs(tlOffset4) + 'px,0)'});
					$('.timeline-col-7').css({'transform' : 'translate('+ tlOffset4	+ 'px,0)'});
				} else {
					$('.timeline-col-1').css({'transform' : 'translate('+ tlOffset1 + 'px,0)'});
					$('.timeline-col-2').css({'transform' : 'translate('+ Math.abs(tlOffset1) + 'px,0)'});

					$('.timeline-col-3').css({'transform' : 'translate('+ Math.abs(tlOffset2) + 'px,0)'});
					$('.timeline-col-4').css({'transform' : 'translate('+ tlOffset2 + 'px,0)'});

					$('.timeline-col-5').css({'transform' : 'translate('+ tlOffset3 + 'px,0)'});
					$('.timeline-col-6').css({'transform' : 'translate('+ Math.abs(tlOffset3) + 'px,0)'});

					$('.timeline-col-7').css({'transform' : 'translate('+ Math.abs(tlOffset4) + 'px,0)'});
					$('.timeline-col-8').css({'transform' : 'translate('+ tlOffset4	+ 'px,0)'});
				}
			}
		} else if ($(window).width() <= 1024) {
			if (wScroll > $('.feature-section').offset().top - $(window).height() ){
				var tlOffset1 = Math.min(0,wScroll - $('.feature-section').offset().top + $(window).height() - 600);
				var tlOffset2 = Math.min(0,wScroll - $('.feature-section').offset().top + $(window).height() - 1000);
				var tlOffset3 = Math.min(0,wScroll - $('.feature-section').offset().top + $(window).height() - 1200);
				var tlOffset4 = Math.min(0,wScroll - $('.feature-section').offset().top + $(window).height() - 1600);

				$('.timeline-col-1').css({'transform' : 'translate('+ tlOffset1 + 'px,0)'});
				$('.timeline-col-2').css({'transform' : 'translate('+ Math.abs(tlOffset1) + 'px,0)'});

				$('.timeline-col-3').css({'transform' : 'translate('+ Math.abs(tlOffset2) + 'px,0)'});
				$('.timeline-col-4').css({'transform' : 'translate('+ tlOffset2 + 'px,0)'});

				$('.timeline-col-5').css({'transform' : 'translate('+ tlOffset3 + 'px,0)'});
				$('.timeline-col-6').css({'transform' : 'translate('+ Math.abs(tlOffset3) + 'px,0)'});

				$('.timeline-col-7').css({'transform' : 'translate('+ Math.abs(tlOffset4) + 'px,0)'});
				$('.timeline-col-8').css({'transform' : 'translate('+ tlOffset4	+ 'px,0)'});
			}
		}
	}

	/* Footer Box Fading In */
	if ($('.site-footer').length > 0 ){
		if (wScroll > $('.site-footer').offset().top - ($(window).height())) {
			$('.top-footer-box').addClass('is-showing');
			let tfBox = $('.top-footer-box').length;
			for(let count = 1; count <= tfBox; count++ ){
				$('.top-footer-box:nth-child('+count+')').css({
					'transition-delay' : count/4+'s'
				});
			}
		}
	}
}

function scrollTopClick() {
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		let target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length) {
			$('html,body').animate({
				scrollTop: target.offset().top - 70
			}, 1000);
			return false;
		}
	}
}

function menuIconClick() {
	$('.menu-icon').toggleClass('active');
	$('#front').toggleClass('menu-in');
}

function windowResize() {
	heightAdjust();
	fixHeader();
	if($(window).width() > 767){
		benefitHeight();
	}
}

function heightAdjust() {
	if($(window).width() < 500) {
		$('.edu-bars .edu-content').unSyncHeight();
	} else {
		$('.edu-bars .edu-content').syncHeight({updateOnResize: true});
	}
}

function benefitHeight(){
	let box = $('.benefit-container');
	box.each(function(){
		let boxHeight = box.innerHeight();
		$(this).find('.img-holder').css({'height' : boxHeight + 'px'});
	});
}

function fixHeader(){
	if($(window).width() < 767){
		let headerHeight = $('.site-header').innerHeight();
		$('body').css({'padding-top' : headerHeight + 'px'});
	} else {
		$('body').css({'padding-top' : ''});
	}
}
