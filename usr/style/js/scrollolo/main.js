(function($){

var ScrolloloMethods = {
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// ИНИЦИАЛИЗАЦИЯ (РИСУЕМ и СЛУШАЕМ)
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    init : function( opts ) {
	
		return this.each(function(){
			 
			var $this = $(this);
			var params = $this.data('scrollolo-params');
			var helpers = $this.data('scrollolo-helpers');
				
			// Если плагин еще не был инициализирован
			// расставляем наши параметры
			//
			if ( ! params )
				{
					if (!opts) opts = false;
					
					// Если параметры не указаны, расставляем умолчания
					//
					$(this).data('scrollolo-params', {

						resultsOnPage          : ( parseInt(opts.onpage)         || parseInt($this.attr("data-onpage"))        ) || 1,
						resultsPosition        : ( parseInt(opts.position)       || parseInt($this.attr("data-position"))      ) || 1,
						
												// 'max','min','auto'
						resultsHeight          : ( opts.height                   || $this.attr("data-height")                  ) || 'auto',
						
												 // 'slide','scroll','fade','none'
						resultsAnimationType   : ( opts.type                     || $this.attr("data-type")                    ) || 'slide',
						resultsAnimationTime   : ( parseInt(opts.time)           || parseInt($this.attr("data-time"))          ) || 500,

												 // 'horizontal','vertical'
						resultsDirection       : ( opts.direction                || $this.attr("data-direction")               ) || 'horizontal',
						
						resultsFlexible        : ( Boolean(opts.flexible)        || Boolean($this.attr("data-flexible"))       ) || false,
						resultsResponsive      : ( Boolean(opts.responsive)      || Boolean($this.attr("data-responsive"))     ) || false,
							
						resultsSupportDotted   : ( Boolean(opts.dotted)          || Boolean($this.attr("data-dotted"))         ) || false,
						resultsSupportArrows   : ( Boolean(opts.arrows)          || Boolean($this.attr("data-arrows"))         ) || false,
						resultsSupportCounter  : ( Boolean(opts.counter)         || Boolean($this.attr("data-counter"))        ) || false,
						
						resultsPlaceForCounter : ( Boolean(opts.placeforCounter) || Boolean($this.attr("data-placeforCounter"))) || false,
							
						resultsSupportKeyboard : ( Boolean(opts.supportKeyboard) || Boolean($this.attr("data-supportKeyboard"))) || false,
						resultsSupportMouse    : ( Boolean(opts.supportMouse)    || Boolean($this.attr("data-supportMouse"))   ) || false,
						resultsSupportTouch    : ( Boolean(opts.supportTouch)    || Boolean($this.attr("data-supportTouch"))   ) || false,
							
						resultsSupportHash     : ( Boolean(opts.supportHash)     || Boolean($this.attr("data-supportHash"))    ) || false,
						resultsSupportGetClass : ( opts.supportGetClass          || $this.attr("data-supportGetClass")         ) || false,
						resultsSupportClass    : ( opts.supportClass             || $this.attr("data-supportClass")            ) || false,
							
						resultsLooped          : ( Boolean(opts.looped)          || Boolean($this.attr("data-looped"))         ) || false,
						resultsAutoPlay        : ( parseInt(opts.autoplay)       || parseInt($this.attr("data-autoplay"))      ) || 0
							
					});
					
				}
				
			// Если плагин еще не был инициализирован
			// расставляем наши хелперы
			//
			if ( ! helpers )
				{
				
					$(this).data('scrollolo-helpers', {
					
						ul             : $(this),
						rememberLi     : false,
						li             : false,
						
						pagesNumber    : 1,
						pageCurrent    : 1,
						
						parentScrollolo: false,
						parentWidth    : 0,
						
						maxHeight      : 0,
						minHeight      : 10000,
						
						scrolloloWidth : 0,
						tmpHeight      : 0,
						totalWidth     : 0,
						totalHeight    : 0,

						scrolloloContainer     : false,
						scrolloloVertContainer : false,
						scrolloloPages         : false,
						
						scrolloloNavigation    : false,
						navDottedControls      : $('<div class="nav-dotted">'),
						navArrowsPrev          : $('<div class="nav-arrows nav-arrow-prev">'),
						navArrowsNext          : $('<div class="nav-arrows nav-arrow-next">'),
						navDots                : false,
						navCounter             : false,
						
						myPlayer               : 0,
						AutoPlayTime           : 0,
						AutoPlayStatus         : true,
						HalfAutoPlayTime       : 0,
						
						currentClassContainer  : $this.attr('class'),

						someParam          : false
							
					});
				}
			
/**************/ // $('body').append('init(), ');
				$this.attr("data-ScrolloloActive","yes");
				$this.Scrollolo('draw');
				$this.Scrollolo('listen');


		});

    },
	
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// РИСУЕМ СЛАЙДЕР
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    draw : function( ) {
	
		return this.each(function(){

			var $this = $(this);
			var params = $this.data('scrollolo-params');
			var helpers = $this.data('scrollolo-helpers');

			// --------------------------------------------------------------------------------
			// Получаем элементы списка для Листалки
			// и дополняем наш хелпер
			
			// вначале помещаем их в клона
			helpers.rememberLi = helpers.ul.find('div.item-scrollolo');

			// а из клона копируем в список
			helpers.li = helpers.rememberLi;

			// считаем количество страничек
			helpers.pagesNumber = Math.ceil ( helpers.li.length / params.resultsOnPage );

			// ----------------------------------------------------------------------------------------
			// ----------------------------------------------------------------------------------------
			// Если страниц нет — выходим, делать нечего
			// иначе рисуем слайдер
			//
			if ( helpers.pagesNumber > 1 )
				{
				
					// узнаем и указываем ширину слайдера
					helpers.ul.width('auto');
					helpers.scrolloloWidth = helpers.ul.width();
					helpers.ul.width(helpers.scrolloloWidth);

					
					// Если есть автоплеер,
					// то выставляем и его параметры
					if ( params.resultsAnimationType == 'slide' || params.resultsAnimationType == 'fade' ) helpers.AutoPlayTime = params.resultsAnimationTime;
					
					// узнаем половину времени анимации
					//
					helpers.HalfAutoPlayTime = params.resultsAnimationTime / 2;
					
					// если указан респонсив
					// захватываем родителя и его ширину
					//
					if ( params.resultsResponsive || params.resultsFlexible ) 
						{
							helpers.parentScrollolo = helpers.ul.parent();
							helpers.parentWidth = helpers.parentScrollolo.width();
						}

/**************/ // $('body').append('draw(), ');
			
					// --------------------------------------------------------------------------------
					// Делим все на странички
					// Делаем блок для постраничной навигации:
					//

					for( var i = 0; i < helpers.pagesNumber ; i++ )
						{
							// Делим на порции элементы списка
							// и оборачиваем каждую порцию в div.scrollolo-page
							helpers.li.slice( i * params.resultsOnPage, (i+1) * params.resultsOnPage ).wrapAll('<div class="scrollolo-page" />');
							
							// получаем элемент
							page = helpers.ul.find('.scrollolo-page').eq(i);
							page.append('<div class="scrollolo-clear" />').width(helpers.scrolloloWidth);
							
							// и узнаем его высоту
							helpers.tmpHeight= page.outerHeight();
							
							// прописываем в атрибут
							// значения высоты каждой странички
							page.attr('scrollolo-page-height',helpers.tmpHeight);

							// определяем максимальное и минимальное
							// значения высоты страничек
							if( helpers.tmpHeight > helpers.maxHeight ) helpers.maxHeight = helpers.tmpHeight;
							if( helpers.tmpHeight < helpers.minHeight ) helpers.minHeight = helpers.tmpHeight;
							
							// вычисляем суммарную ширину
							helpers.totalWidth+= helpers.scrolloloWidth;
							// и высоту
							helpers.totalHeight+= helpers.tmpHeight;
							
							// Формируем навигацию
							// в div.nav-dotted
							helpers.navDottedControls.append('<a href="#/' + (i+1) + '/" rel="'+(i+1)+'" class="nav-dot"><span>'+(i+1)+'</span></a>');
						}

						
					// --------------------------------------------------------------------------------
					// Находим наши странички
					// строим навигацию точками
					//
					helpers.scrolloloPages = helpers.ul.find('.scrollolo-page');
					
					//  сравниваем по параметру
					//  какую высоту берем за основу
					//
						if ( params.resultsHeight == "max" ) helpers.tmpHeight = helpers.maxHeight;
						else if ( params.resultsHeight == "min" ) helpers.tmpHeight = helpers.minHeight;
						else
							{
								if ( params.resultsPosition && params.resultsPosition > 0 && (helpers.pagesNumber+1) > params.resultsPosition) helpers.tmpHeight =  helpers.scrolloloPages.eq(params.resultsPosition-1).height();
								else helpers.tmpHeight =  helpers.scrolloloPages.eq(params.resultsPosition-1).height();
							}
					
					//  оборачиваем все наши странички
					//  в общий контейнер div.scrollolo-container
					//
						helpers.scrolloloPages.wrapAll('<div class="scrollolo-container" />');
					//  и хватаем его переменной
						helpers.scrolloloContainer = helpers.ul.find('.scrollolo-container');
					
					
					if ( params.resultsDirection != 'vertical' )
						{
							//  ставим общую распорку понизу
								helpers.scrolloloContainer.append('<div class="scrollolo-clear" />').width( helpers.totalWidth + 1000 );
								
							//  Устанавливаем ширину контейнера
								helpers.scrolloloContainer.width( helpers.totalWidth + 1000 );
								
							// Устанавливаем высоту контейнера
								helpers.ul.height(helpers.tmpHeight);
								helpers.scrolloloContainer.height(helpers.tmpHeight);
								
							// Устанавливаем параметры страничек
								helpers.scrolloloPages.css({'float':'left', 'height': helpers.tmpHeight, 'width': helpers.scrolloloWidth});
						}
					else
						{
							// Устанавливаем высоту контейнера
								helpers.ul.height(helpers.tmpHeight);
								helpers.scrolloloContainer.height(helpers.totalHeight+1000);

							// Устанавливаем параметры страничек
								helpers.scrolloloPages.css({'height': helpers.tmpHeight, 'width': helpers.scrolloloWidth});
								
							// Создаем дополнительную обертку
							//
								helpers.scrolloloContainer.wrapAll('<div class="scrollolo-vertical-container" />');
							// хватаем ее переменной
								helpers.scrolloloVertContainer = helpers.ul.find('.scrollolo-vertical-container');
							// ставим ей высоту по первому элементу
								helpers.scrolloloVertContainer.height(helpers.tmpHeight);
						}

					// --------------------------------------------------------------------------------
					//  Создаем блок для навигации
					//
						helpers.ul.append('<div class="scrollolo-navigation" />');
					//  и хватаем его переменной
					helpers.scrolloloNavigation = helpers.ul.find('.scrollolo-navigation');
					
					//  помещаем наши точки в блок навигации
						helpers.scrolloloNavigation.append(helpers.navDottedControls);
					
					if ( params.resultsDirection != 'vertical' )
						{
							helpers.navDottedControls.css({'margin-left':-(helpers.navDottedControls.width()/2)});
						}
					else
						{
								helpers.scrolloloNavigation.addClass('scrollolo-vertical-navigation');
								helpers.scrolloloNavigation.height(helpers.tmpHeight);
							//  центрируем точки:
								helpers.navDottedControls.css({'margin-top':-(helpers.navDottedControls.height()/2)});
							
							//  ставим дополнительный распор
								helpers.ul.append('<div class="scrollolo-clear" />').width(helpers.scrolloloWidth);
							// расставляем высоту и ширину
								helpers.scrolloloVertContainer.height(helpers.tmpHeight);
								helpers.scrolloloNavigation.css({'height' : helpers.tmpHeight, 'top' : -helpers.tmpHeight}); 
						}
						
					// --------------------------------------------------------------------------------
					// Делаем блок стрелок:

						if ( params.resultsDirection != 'vertical' )
							{
								helpers.navArrowsPrev.append('<a href="#/prev" rel="prev"><span>&#9668;</span></a>');
								helpers.navArrowsNext.append('<a href="#/next" rel="next"><span>&#9658;</span></a>');
								
								helpers.navArrowsPrev.height(helpers.tmpHeight).css({'top':-helpers.tmpHeight});
								helpers.navArrowsNext.height(helpers.tmpHeight).css({'top':-helpers.tmpHeight});
							}
						else
							{
								helpers.navArrowsPrev.append('<a href="#/prev" rel="prev"><span>&#9650;</span></a>');
								helpers.navArrowsNext.append('<a href="#/next" rel="next"><span>&#9660;</span></a>');

								helpers.navArrowsPrev.width(helpers.scrolloloWidth).css({'left':-helpers.scrolloloWidth});
								helpers.navArrowsNext.width(helpers.scrolloloWidth).css({'left':-helpers.scrolloloWidth});
							}
							
						helpers.scrolloloNavigation.prepend(helpers.navArrowsPrev);
						helpers.scrolloloNavigation.append(helpers.navArrowsNext);
						
						
					// --------------------------------------------------------------------------------
					// --------------------------------------------------------------------------------
					// Итоговая инициализация слайдера
					//
					var goToPosition = 1;
					if( params.resultsPosition && params.resultsPosition > 0 ) goToPosition = params.resultsPosition;
					
					// Подхватываем все наши точки
					// в один массив
					//
					helpers.navDots  = helpers.navDottedControls.find('a.nav-dot');
					
					// Скрываем точки, если они не показываются
					//
					if ( ! params.resultsSupportDotted )
						{
							helpers.navDottedControls.css({'display':'none'});
						}

					// Скрываем навигационные стрелки, если они не показываются
					//
					if ( ! params.resultsSupportArrows )
						{
							helpers.navArrowsPrev.find('a').css({'display':'none'});
							helpers.navArrowsNext.find('a').css({'display':'none'});
						}

					// Если поддерживается HASH — выставляем всё в нужную позицию
					//
					if ( params.resultsSupportHash && document.location.hash )
						{
							goToPosition = document.location.hash.replace("#", "").replace("/", "").replace("/", "").replace("/", "");
							if(!goToPosition) goToPosition = 1;
						}

					$this.Scrollolo( 'movepage' , goToPosition , 'fast' );
				}

       });

    },
	
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// СЛУШАЕМ СОБЫТИЯ
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    listen : function( ) {
	
		return this.each(function(){

			var $this = $(this);
			var params = $this.data('scrollolo-params');
			var helpers = $this.data('scrollolo-helpers');

			// ----------------------------------------------------------------------------------------
			// ----------------------------------------------------------------------------------------
			// Если страниц нет — выходим, делать нечего
			// иначе слушаем слайдер
			//
			if ( helpers.pagesNumber > 1 )
				{
				
/**************/ // $('body').append('listen(), ');

					// Если КЛИКАЕМ по страничкам
					helpers.navDots.bind('click.scrollolo', function(e){ $this.Scrollolo( 'movepage' , parseInt($(this).attr('rel')) , 'slow' ); return false; });

						
					// Если КЛИКАЕМ по СТРЕЛКАМ 
					if ( params.resultsSupportArrows )
						{
							// Если мышка наведена на наш слайдер
							// навешиваем hover-process
							helpers.ul.mouseover( function(){ $this.addClass('hover-process'); });
							helpers.ul.mouseout( function(){ $this.removeClass('hover-process'); });

							// Кликаем Вперед
							helpers.navArrowsNext.find('a').bind('click.scrollolo', function(e){ $this.Scrollolo( 'movepage' , helpers.pageCurrent+1 , 'slow' ); return false; });

							// Кликаем Назад
							helpers.navArrowsPrev.find('a').bind('click.scrollolo', function(e){ $this.Scrollolo( 'movepage' , helpers.pageCurrent-1 , 'slow' ); return false; });
						}


					// Если КЛИКАЕМ по Специальному Классу
					if ( params.resultsSupportClass && $('a' + params.resultsSupportClass).length > 0 )
						{
							$('a' + params.resultsSupportClass).click(function(e){
							
							goToPosition = parseInt($(this).attr('rel'));
							
								switch( $(this).attr('type') )
									{
									
										case 'first': 	goToPosition = 1;
														break;
														
										case 'last' : 	goToPosition = helpers.pagesNumber;
														break;
														
										case 'prev': 	goToPosition = helpers.pageCurrent-1;
														break;
														
										case 'next' : 	goToPosition = helpers.pageCurrent+1;
														break;
														
										case 'stop' :  	if ( params.resultsAutoPlay > 0 ) helpers.AutoPlayStatus = false;
														if(!goToPosition) goToPosition = helpers.pageCurrent;
														break;

										case 'play' :   if ( params.resultsAutoPlay > 0 ) helpers.AutoPlayStatus = true;
														if(!goToPosition) goToPosition = helpers.pageCurrent;
														break;
														
										case 'pause' :  if ( params.resultsAutoPlay > 0 )
															{
																if ( helpers.AutoPlayStatus ) helpers.AutoPlayStatus = false;
																else helpers.AutoPlayStatus = true;
															}
																
														if(!goToPosition) goToPosition = helpers.pageCurrent;
														break;
														
										case 'goto' :
										
										default:    	goToPosition = parseInt($(this).attr('rel'));
														break;
									}
								
								if ( params.resultsLooped )
									{
										if ( goToPosition > helpers.pagesNumber ) goToPosition = 1;
										if ( goToPosition < 1 ) goToPosition = helpers.pagesNumber;
									}
								
								if( goToPosition < ( helpers.pagesNumber+1 ) && goToPosition > 0 ) $this.Scrollolo( 'movepage' , goToPosition , 'slow' );

								return false;
							});
						}

					// Поддерживаем КОЛЕСО МЫШИ
					if ( params.resultsSupportMouse )
						{
							helpers.ul.bind('mousewheel.scrollolo', function(event,delta) {

								var dir = delta > 0 ? 'Up' : 'Down',
								vel = Math.abs(delta);

								if ( dir == "Down" ) $this.Scrollolo( 'movepage' , helpers.pageCurrent-1 , 'slow' );
								if ( dir == "Up" ) $this.Scrollolo( 'movepage' , helpers.pageCurrent+1 , 'slow' );
								
								return false;
							});
						}

						
					// Поддерживаем TOUCH-SCREEN
					if ( params.resultsSupportTouch )
						{
							var PathSizeDrag = 75;
							var directionDrag = "x";
							var pathDrag = 0;
						
							if( params.resultsDirection != 'vertical' ) PathSizeDrag = 75;
							else{
									PathSizeDrag = 100;
									directionDrag = "y";
								}

							helpers.scrolloloContainer.draggable({
									cursor: "move",
									axis: directionDrag,
									revert: false,
									drag: function() { helpers.ul.addClass('mooving-process'); },
									stop: function(event, ui) {
												
										helpers.ul.removeClass('mooving-process');

										if( params.resultsDirection != 'vertical' ) pathDrag = ( ui.offset.left - helpers.ul.offset().left );
										else pathDrag = ( ui.offset.top - helpers.ul.offset().top );
												
										if( Math.abs(pathDrag) > PathSizeDrag )
											{
												if( pathDrag < 0 ) $this.Scrollolo( 'movepage' , helpers.pageCurrent+1 , 'slow' );
												else $this.Scrollolo( 'movepage' , helpers.pageCurrent-1 , 'slow' );
											}
										else $this.Scrollolo( 'movepage' , helpers.pageCurrent , 'slow' );
									}
								});
						}

					// Поддерживаем КЛАВИАТУРУ
					if ( params.resultsSupportKeyboard )
						{
								$(document).bind("keydown.scrollolo", function(evt) {
								
									var keyDir = 1;
									
									if ( params.resultsDirection != 'vertical' ) keyDir--;
									
									// отсекаем клавиши,
									// которые нас не касаются
									if( evt.keyCode != (39+keyDir) && evt.keyCode != (37+keyDir) && evt.altKey || evt.ctrlKey || $(evt.target).is(":input") ) { return; }

									if (evt.keyCode == (37+keyDir)) $this.Scrollolo( 'movepage' , helpers.pageCurrent-1 , 'slow' );
									if (evt.keyCode == (39+keyDir)) $this.Scrollolo( 'movepage' , helpers.pageCurrent+1 , 'slow' );
										
									return false;
								});
						}
				}

		});
 
    },

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// ПЕРЕМЕЩАЕМ
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    movepage : function ( goPage , speed ) {
	
		return this.each(function(){

			var $this = $(this);
			var params = $this.data('scrollolo-params');
			var helpers = $this.data('scrollolo-helpers');
			
			var goStep = 0;
			var pageLast, pageFirst;
			
/**************/ // $('body').append('movepage('+ helpers.pageCurrent + ' > '+ goPage + ', '+ speed +'), ');

		// обнуляем счетчик автовозпроизведения
		//
		if ( params.resultsAutoPlay > 0 ) { window.clearTimeout(helpers.myPlayer); }

			
			if ( ! params.resultsLooped )
				{
					if ( goPage > helpers.pagesNumber )
						{
							goPage = helpers.pagesNumber;
							pageLast = true;
						}
					if ( goPage < 1 )
						{
							goPage = 1;
							pageFirst = true;
						}
				}
			else
				{
					if ( goPage > helpers.pagesNumber ) goPage = 1;
					if ( goPage < 1 ) goPage = helpers.pagesNumber;
				}
			
					
			var pagePrev = goPage-1;
			var pageNext = goPage+1;
					
				if ( pageNext > helpers.pagesNumber )
					{
						pageNext = helpers.pagesNumber;
						pageLast = true;
					}
				if ( pagePrev < 1 )
					{
						pagePrev = 1;
						pageFirst = true;
					}
					
				if ( params.resultsLooped )
					{
						if ( pageLast ) pageNext = 1;
						if ( pageFirst ) pagePrev = helpers.pagesNumber;
					}
				
				
				// узнаем текущую страницу
				//
				helpers.pageCurrent = parseInt(helpers.navDottedControls.find('a.active').attr('rel'));
				if ( ! helpers.pageCurrent ) helpers.pageCurrent = 1;
				
				// узнаем высоту слайдера
				//
				var sliderHeight = helpers.ul.height();
				
				// высчитываем путь для смещения слайдера
				//
				if ( params.resultsDirection != 'vertical' ) goStep = (goPage-1) * helpers.scrolloloWidth;
				else goStep = (goPage-1) * sliderHeight;
				
				
			// Если переход на самое себя
			//
			if ( goPage == helpers.pageCurrent )
				{
					// helpers.ul.addClass('mooving-process');
					
					if ( params.resultsDirection != 'vertical' )
						{
							helpers.scrolloloContainer.stop().animate({'margin-left':-goStep, 'left' : 0},{queue:false, duration: helpers.HalfAutoPlayTime, complete:function(){ helpers.ul.removeClass('mooving-process'); }});
						}
					else
						{
							helpers.scrolloloNavigation.css({'height' : helpers.scrolloloPages.eq(goPage-1).height(), 'top': -helpers.scrolloloPages.eq(goPage-1).height()});
							helpers.scrolloloContainer.stop().animate({'margin-top':-goStep, 'top' : 0},{queue:false, duration: helpers.HalfAutoPlayTime, complete:function(){ helpers.ul.removeClass('mooving-process'); }});
						}
				}
			else
				{
				
					// --------------------------------------------------------------------------------
					// Поехали!
					//
				
					// Разбираемся с высотой слайдера
					//
					if ( params.resultsHeight == "auto" ) {
					
							var animateHeight = parseInt(helpers.scrolloloPages.eq(goPage-1).attr('scrollolo-page-height'));

							if ( params.resultsDirection != 'vertical' ) 
								{
								
									helpers.ul.stop().animate({'height' : animateHeight},{queue:false, duration: helpers.HalfAutoPlayTime, complete:function(){
											
											helpers.ul.css({'height' : animateHeight});
											helpers.scrolloloContainer.css({'height' : animateHeight});
											
											helpers.navArrowsPrev.css({'top' : -animateHeight});
											helpers.navArrowsNext.css({'top' : -animateHeight});
											
											}});
									
									helpers.scrolloloPages.stop().animate({'height' : animateHeight},helpers.HalfAutoPlayTime);
											
									helpers.navArrowsPrev.stop().animate({'height' : animateHeight}, helpers.HalfAutoPlayTime);
									helpers.navArrowsNext.stop().animate({'height' : animateHeight}, helpers.HalfAutoPlayTime);

								}
							else
								{
									helpers.ul.stop().animate({'height' : animateHeight},{queue:false, duration: helpers.HalfAutoPlayTime, complete:function(){ /*helpers.ul.css({'height' : animateHeight});*/ }});
									helpers.scrolloloPages.stop().animate({'height' : animateHeight},{queue:false, duration: helpers.HalfAutoPlayTime, complete:function(){ /*helpers.scrolloloPages.css({'height' : animateHeight});*/ }});
									
									goStep = (goPage-1)*animateHeight;
									
									helpers.scrolloloNavigation.stop().animate({'height' : animateHeight, 'top':-animateHeight},1);
									helpers.scrolloloVertContainer.stop().animate({'height' : animateHeight},1);
								}
								
						}
					else if ( params.resultsDirection == 'vertical' ) helpers.scrolloloNavigation.css({'height' : helpers.tmpHeight, 'top':-(helpers.tmpHeight)});
					
					// Раcсчитываем смещение слайдера
					// направлени и тип анимации
					//
					if ( speed == 'slow' )
						{
							switch( params.resultsAnimationType )
								{
									case 'slide':	helpers.ul.addClass('mooving-process');
									
													if ( params.resultsDirection != 'vertical' ) 
														helpers.scrolloloContainer
															.stop()
															.animate({'margin-left':-goStep, 'left' : 0},{queue:false, duration: params.resultsAnimationTime, complete: function(){ helpers.ul.removeClass('mooving-process'); }});
													else
														helpers.scrolloloContainer
															.stop()
															.animate({'margin-top':-goStep, 'top' : 0},{queue:false, duration: params.resultsAnimationTime, complete:function(){ helpers.ul.removeClass('mooving-process'); }});
													break;
									case 'fade' : 
													helpers.ul.addClass('mooving-process');
													
													if ( params.resultsDirection != 'vertical' )
														{
															helpers.scrolloloContainer.stop().animate({'margin-left':-goStep, 'left' : 0},0);

															helpers.scrolloloPages
																.eq(helpers.pageCurrent-1)
																.clone()
																.addClass('clone')
																.prependTo(helpers.ul)
																.css({'top' : helpers.ul.offset().top})
																.css({'left' : helpers.ul.offset().left})
																.stop()
																.animate({opacity: 0, 'top' : helpers.ul.offset().top, 'left' : helpers.ul.offset().left},{queue:false, duration: params.resultsAnimationTime, complete:function() {
																
																	helpers.ul.find('.clone').remove();
																	helpers.ul.removeClass('mooving-process');

																}});
														}
													else
														{
															helpers.scrolloloContainer.stop().animate({'margin-top':-goStep, 'top' : 0},0);
															
															helpers.scrolloloPages
																.eq(helpers.pageCurrent-1)
																.clone()
																.addClass('clone')
																.prependTo(helpers.ul)
																.css({'top' : helpers.ul.offset().top})
																.css({'left' : helpers.ul.offset().left})
																.stop()
																.animate({opacity: 0, 'top' : helpers.ul.offset().top, 'left' : helpers.ul.offset().left},{queue:false, duration: params.resultsAnimationTime, complete:function() {
																
																	helpers.ul.find('.clone').remove();
																	helpers.ul.removeClass('mooving-process');

																}});
														}
														
													break;
													
									case 'none' :
									
									default:        if ( params.resultsDirection != 'vertical' ) helpers.scrolloloContainer.stop().animate({'margin-left':-goStep, 'left' : 0},0);
													else helpers.scrolloloContainer.stop().animate({'margin-top':-goStep, 'top' : 0},0);
													break;
								}
						}
					else
						{
							if ( params.resultsDirection != 'vertical' ) helpers.scrolloloContainer.stop().animate({'margin-left':-goStep, 'left' : 0},0);
							else helpers.scrolloloContainer.stop().animate({'margin-top':-goStep, 'top' : 0},0);
						}

				}
				
					// Переотображаем наши "точки"
					helpers.navDots.siblings().removeClass('active');
					helpers.navDots.eq(goPage-1).addClass('active');
				
					// Пересчитываем URL для стрелок
					if ( params.resultsSupportArrows )
						{
							helpers.navArrowsPrev.find('a').attr('href', '#/' + pagePrev + '/');
							helpers.navArrowsNext.find('a').attr('href', '#/' + pageNext + '/');
						}
						
					
					// Скрываем стрелки если дошли в конец или в начало
					if ( params.resultsSupportArrows && !params.resultsLooped )
						{
							helpers.scrolloloNavigation.find('.nav-arrows a').removeClass('hidden');
							
							if ( pageFirst ) { helpers.navArrowsPrev.find('a').addClass('hidden'); }
							if ( pageLast ){ helpers.navArrowsNext.find('a').addClass('hidden'); }
						}
						
					// Если указано получать классы от страничек
					// 
					if ( params.resultsSupportGetClass )
						{
							var getClass = helpers.scrolloloPages.eq(goPage-1).find('.item-scrollolo').eq(0).attr('data-SetClass');
							
							// приводим к первоначальному состоянию
							$this.attr('class', helpers.currentClassContainer);

							// ставим уласс
							if(getClass) $this.addClass(getClass);
						}
						
						
					// Заносим наши похождения в History
					if ( params.resultsSupportHash && history )
						{
							if (location.hash) location.hash = '/' + goPage + '/';
						}
						
					// после того, как сместились
					// указываем, новую текущую позицию
					//
					helpers.pageCurrent = goPage;
						
					// Автовоспроизведение			
					if ( params.resultsAutoPlay > 0 ) { $this.Scrollolo( 'autoplay' , (goPage+1) ); }

       });

    },
	
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// ПЕРЕМЕЩАЕМ
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    autoplay : function ( goTo ) {
	
		return this.each(function(){
		
			var $this = $(this);
			var params = $this.data('scrollolo-params');
			var helpers = $this.data('scrollolo-helpers');

			if ( helpers.pagesNumber > 1 && helpers.AutoPlayStatus )
				{
				
/**************/ // $('body').append('autoplay('+ goTo +'), ');

					window.clearTimeout(helpers.myPlayer);

					helpers.myPlayer = window.setTimeout(function(){

						if ( ! helpers.ul.hasClass('mooving-process') ) $this.Scrollolo( 'movepage' , goTo , 'slow' );

					}, ( params.resultsAutoPlay + helpers.AutoPlayTime ) );
				}

		});
    },
	
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// ВОЗВРАЩАЕМ ВНЕШНИЙ ВИД СЛАЙДЕРА В ИСХОДНОЕ СОСТОЯНИЕ
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    undraw : function( ) {
	
		return this.each(function(){

			var $this = $(this);
			var params = $this.data('scrollolo-params');
			var helpers = $this.data('scrollolo-helpers');
			
/**************/ // $('body').append('<br />undraw(), ');

			// перестаем слушать
			//
			helpers.ul.unbind('.scrollolo');
			helpers.navDots.unbind('.scrollolo');
			$(document).unbind('.scrollolo');

			if ( params.resultsSupportArrows )
				{
					helpers.navArrowsNext.find('a').unbind('.scrollolo');
					helpers.navArrowsPrev.find('a').unbind('.scrollolo');
				}
			
			// если был автоплеер
			// разрушаем его
			//
			if ( params.resultsAutoPlay > 0 ) window.clearTimeout(helpers.myPlayer);
		

			// приводим хелперы в прежнее значение
			//
			helpers.li                     = false;
			helpers.scrolloloContainer     = false;
			helpers.scrolloloVertContainer = false;
			helpers.scrolloloPages         = false;
						
			helpers.scrolloloNavigation    = false;
			helpers.navDottedControls      = false;
			helpers.navDottedControls      = $('<div class="nav-dotted">');
			helpers.navArrowsPrev          = $('<div class="nav-arrows nav-arrow-prev">');
			helpers.navArrowsNext          = $('<div class="nav-arrows nav-arrow-next">');
			helpers.navDots                = false;
			
			
			// опустошаем
			//
			helpers.ul.empty();
			helpers.ul.height('auto');
			helpers.ul.width('auto');

			// вставляем копию исходного содержимого
			//
			helpers.ul.append(helpers.rememberLi);

       });

    },
	
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// УНИЧТОЖАЕМ СЛАЙДЕР
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    destroy : function( ) {
	
		return this.each(function(){

			var $this = $(this);
			var params = $this.data('scrollolo-params');
			var helpers = $this.data('scrollolo-helpers');
			
			// если был автоплеер
			// разрушаем его
			//
			if ( params.resultsAutoPlay > 0 ) window.clearTimeout(helpers.myPlayer);
			
			// перерисовываем слайдер в прежнее состояние
			//
			$this.Scrollolo('undraw');
			$this.attr("data-ScrolloloActive",false);

			// удаляем все данные
			//
			data.params.remove();
			data.helpers.remove();
			$this.removeData('scrollolo-params');
			$this.removeData('scrollolo-helpers');

       });

    },
	
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// МЕНЯЕМ РАЗМЕР
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    resize : function(){
	
		return this.each(function(){

			var $this = $(this);
			var params = $this.data('scrollolo-params');
			var helpers = $this.data('scrollolo-helpers');

			if ( helpers.parentWidth != helpers.parentScrollolo.width() && ( params.resultsResponsive || params.resultsFlexible ) )
				{

					// ----------------------------------------------------------------------------------------
					// ----------------------------------------------------------------------------------------
					// Если страниц нет — выходим, делать нечего
					// иначе рисуем слайдер
					//
					if ( helpers.pagesNumber > 1 )
						{
					
/**************/ // $('body').append('<br />resize(), ');
		
							// если есть текущая страничка
							// указываем ее как стартовую при перерисовке
							//
							if ( helpers.pageCurrent > 0 ) params.resultsPosition = helpers.pageCurrent;

							// обнуляем счетчик автовозпроизведения
							if ( params.resultsAutoPlay > 0 ) { window.clearTimeout( helpers.myPlayer ); }

							// обнуляем хелперы
							// высоты и ширины
							helpers.maxHeight      = 0;
							helpers.minHeight      = 10000;
								
							helpers.scrolloloWidth = 0;
							helpers.tmpHeight      = 0;
							helpers.totalWidth     = 0;
							helpers.totalHeight    = 0;

							// узнаем и указываем ширину слайдера
							helpers.ul.width('auto');
							helpers.scrolloloWidth = helpers.ul.width();
							helpers.ul.width(helpers.scrolloloWidth);

							helpers.scrolloloPages.height('auto');


									// --------------------------------------------------------------------------------
									// Делим все на странички
									// Делаем блок для постраничной навигации:
									//

									for( var i = 0; i < helpers.pagesNumber ; i++ )
										{
											// получаем элемент
											page = helpers.scrolloloPages.eq(i);
											page.width(helpers.scrolloloWidth);
											page.find('.scrollolo-clear').width(helpers.scrolloloWidth);
											
											// и узнаем его высоту
											helpers.tmpHeight= page.outerHeight();
											
											// прописываем в атрибут
											// значения высоты каждой странички
											page.attr('scrollolo-page-height',helpers.tmpHeight);

											// определяем максимальное и минимальное
											// значения высоты страничек
											if( helpers.tmpHeight > helpers.maxHeight ) helpers.maxHeight = helpers.tmpHeight;
											if( helpers.tmpHeight < helpers.minHeight ) helpers.minHeight = helpers.tmpHeight;
											
											// вычисляем суммарную ширину
											helpers.totalWidth+= helpers.scrolloloWidth;
											// и высоту
											helpers.totalHeight+= helpers.tmpHeight;
											
										}


									//  сравниваем по параметру
									//  какую высоту берем за основу
									//
										if ( params.resultsHeight == "max" ) helpers.tmpHeight = helpers.maxHeight;
										else if ( params.resultsHeight == "min" ) helpers.tmpHeight = helpers.minHeight;
										else
											{
												if ( params.resultsPosition && params.resultsPosition > 0 && (helpers.pagesNumber+1) > params.resultsPosition) helpers.tmpHeight =  helpers.scrolloloPages.eq(params.resultsPosition-1).height();
												else helpers.tmpHeight =  helpers.scrolloloPages.eq(params.resultsPosition-1).height();
											}

									if ( params.resultsDirection != 'vertical' )
										{
											//  указываем размер общей распорки понизу
												helpers.scrolloloContainer.find('.scrollolo-clear').width( helpers.totalWidth + 1000 );
												
											//  Устанавливаем ширину контейнера
												helpers.scrolloloContainer.width( helpers.totalWidth + 1000 );
												
											// Устанавливаем высоту контейнера
												helpers.ul.height(helpers.tmpHeight);
												helpers.scrolloloContainer.height(helpers.tmpHeight);
												
											// Устанавливаем параметры страничек
												helpers.scrolloloPages.css({'float':'left', 'height': helpers.tmpHeight, 'width': helpers.scrolloloWidth});
										}
									else
										{
											// Устанавливаем высоту контейнера
												helpers.ul.height(helpers.tmpHeight);
												helpers.scrolloloContainer.height(helpers.totalHeight+1000);

											// Устанавливаем параметры страничек
												helpers.scrolloloPages.css({'height': helpers.tmpHeight, 'width': helpers.scrolloloWidth});
												
											// ставим ей высоту
												helpers.scrolloloVertContainer.height(helpers.tmpHeight);
										}

									
									if ( params.resultsDirection != 'vertical' )
										{
											helpers.navDottedControls.css({'margin-left':-(helpers.navDottedControls.width()/2)});
										}
									else
										{
												helpers.scrolloloNavigation.height(helpers.tmpHeight);
											//  центрируем точки:
												helpers.navDottedControls.css({'margin-top':-(helpers.navDottedControls.height()/2)});
											
											//  ставим дополнительный распор
												helpers.scrolloloContainer.find('.scrollolo-clear').width(helpers.scrolloloWidth);
											// расставляем высоту и ширину
												helpers.scrolloloVertContainer.height(helpers.tmpHeight);
												helpers.scrolloloNavigation.css({'height' : helpers.tmpHeight, 'top' : -helpers.tmpHeight}); 
										}
										
									// --------------------------------------------------------------------------------
									// Пересчитываем блок стрелок:

										if ( params.resultsDirection != 'vertical' )
											{

												helpers.navArrowsPrev.height(helpers.tmpHeight).css({'top':-helpers.tmpHeight});
												helpers.navArrowsNext.height(helpers.tmpHeight).css({'top':-helpers.tmpHeight});
											}
										else
											{
												helpers.navArrowsPrev.width(helpers.scrolloloWidth).css({'left':-helpers.scrolloloWidth});
												helpers.navArrowsNext.width(helpers.scrolloloWidth).css({'left':-helpers.scrolloloWidth});
											}

							// --------------------------------------------------------------------------------
							// высчитываем путь для смещения слайдера
							//
							if ( params.resultsDirection != 'vertical' ) goStep = (params.resultsPosition-1) * helpers.scrolloloWidth;
							else goStep = (params.resultsPosition-1) * helpers.ul.height();
						
							// перемещаем в нужную позицию
							//
							if ( params.resultsDirection != 'vertical' )
								{
									helpers.scrolloloContainer.css({'margin-left':-goStep, 'left' : 0});
								}
							else
								{
									helpers.scrolloloNavigation.css({'height' : helpers.scrolloloPages.eq(goPage-1).height(), 'top': -helpers.scrolloloPages.eq(goPage-1).height()});
									helpers.scrolloloContainer.css({'margin-top':-goStep, 'top' : 0});
								}


							helpers.parentWidth = helpers.parentScrollolo.width();
						}
				}

       });

    }
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------	
  };

// Создаем Scrollolo jQuery плагин:
$.fn.Scrollolo = function(method){

    if ( ScrolloloMethods[method] ) return ScrolloloMethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    else if ( typeof method === 'object' || ! method ) return ScrolloloMethods.init.apply( this, arguments );
    else alert( 'Метод ' +  method + ' не существует в jQuery.Scrollolo' );

return this;
	
}})(jQuery);


$(document).ready(function(){

	if($("div.scrollolo").length > 0)
		{
			$("div.scrollolo").each(function(index){ if($(document).width() > 479) $(this).Scrollolo(); });
		}

});


$(window).bind("resize", function(e) {
// TODO
// перекинуть в LISTEN
	if($("div.scrollolo").length > 0)
		{
			$("div.scrollolo").each(function(index){
			
				if ( $(document).width() < 480 )
					{
						if  ( $(this).attr("data-ScrolloloActive") == "yes" ) { $(this).Scrollolo('destroy'); }
					}
				else
					{
						if  ( $(this).attr("data-ScrolloloActive") == "yes") { $(this).Scrollolo('resize'); }
						else { $(this).Scrollolo(); }
					}
				
			});
		}

});
