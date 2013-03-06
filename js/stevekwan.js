var SteveKwan = SteveKwan || {};





SteveKwan.sections       = $(".panel");
SteveKwan.currentSection = $("#header");





SteveKwan.scrollTo = function(element)
{
  $("html, body").animate
  (
    {
      scrollTop: $(element).offset().top
    },
    500
  );
};





SteveKwan.handleScroll = function()
{
  var currentY = $(window).scrollTop();
  var fuzzFactor = $(window).height()/1.8;

  SteveKwan.sections.each
  (
    function(index, element)
    {
      // If we are close to the edge of a panel, trigger a transition from
      // the old one into the new one.
      var elementY = $(element).offset().top;
      var deltaY = currentY-elementY;
      if (deltaY < 0) deltaY *= -1;
      if (deltaY > fuzzFactor) return;

      // We've scrolled into (or close to) a new section!
      if (SteveKwan.currentSection[0] != element)
      {
        var oldSelection = SteveKwan.currentSection;
        var beforeNewSelection = SteveKwan.sections.slice(0,index);
        var afterNewSelection = SteveKwan.sections.slice(index);

        SteveKwan.currentSection = $(element);

        $(afterNewSelection).children().not('.transitory-arrow').animate({'opacity':1});

        if (SteveKwan.isMobile()) return;

        $(beforeNewSelection).children().not('.transitory-arrow').animate({'opacity':0});
        $(oldSelection).trigger('SteveKwan.exitPanel');
        $(element).trigger('SteveKwan.enterPanel');
      }
    }
  );
};





SteveKwan.addTransitoryArrow = function(container, to, color)
{
  if (color === undefined) color = 'dark';

  var transitoryArrow = $('<a href="'+to+'" class="transitory-arrow '+color+' hidden-phone ir">Scroll down</a>');

  transitoryArrow.click
  (
    function(e)
    {
      e.preventDefault();
      SteveKwan.scrollTo(to);
    }
  );

  $(container).append(transitoryArrow);

};





SteveKwan.handleEnterPanel = function(e)
{
  var element = $(e.target);
  var id = element.attr('id');

  if (id === 'expertise')
  {
    element.addClass('bg');
    element.addClass('animate');
  }

  console.log("Enter #" + id);
};





SteveKwan.handleExitPanel = function(e)
{
  var element = $(e.target);
  var id = element.attr('id');

  if (id === 'expertise')
  {
    element.removeClass('animate');
  }

  console.log("Exit #" + id);
};





SteveKwan.initColorBox = function()
{
  $('#interests').find('.gallery').colorbox({rel:'jiu-jitsu'});
};





SteveKwan.handleEnterMobile = function()
{
  console.log("Enter mobile");

  $.colorbox.remove();
};





SteveKwan.handleExitMobile = function()
{
  console.log("Exit mobile");

  SteveKwan.initColorBox();
};






SteveKwan.jRespond;
SteveKwan.defineBreakpoints = function()
{
  // call jRespond and add breakpoints
  SteveKwan.jRespond = jRespond
  (
    [
      {
          label: 'mobile',
          enter: 0,
          exit: 767
      },
      {
          label: 'tablet',
          enter: 768,
          exit: 979
      },
      {
          label: 'desktop',
          enter: 980,
          exit: 10000
      }
    ]
  );

  SteveKwan.jRespond.addFunc
  (
    {
      breakpoint: 'mobile',
      enter: SteveKwan.handleEnterMobile,
      exit: SteveKwan.handleExitMobile
    }
  );
};





SteveKwan.isMobile = function()
{
  return SteveKwan.jRespond.getBreakpoint() === 'mobile';
};





SteveKwan.handleReady = function()
{
  // JavaScript triggers when switching between breakpoints
  SteveKwan.defineBreakpoints();

  // Set up transitory arrows that point to the next content region
  SteveKwan.addTransitoryArrow('#header .fixed-region', '#expertise');
  SteveKwan.addTransitoryArrow('#expertise', '#career', 'light');
  SteveKwan.addTransitoryArrow('#career', '#portfolio');
  SteveKwan.addTransitoryArrow('#portfolio', '#interests', 'light');
  SteveKwan.addTransitoryArrow("#interests", "#footer");

  // No scroll when page loads...initialize that behaviour manually
  SteveKwan.handleScroll();

  $(window).scroll
  (
    $.debounce
    (
      100,
      SteveKwan.handleScroll
    )
  );

  // Trap custom events when entering/exiting a major section/panel of the site
  $(SteveKwan.sections).bind('SteveKwan.enterPanel', SteveKwan.handleEnterPanel);
  $(SteveKwan.sections).bind('SteveKwan.exitPanel', SteveKwan.handleExitPanel);

  $('img.lazy').lazyload
  (
    {
      effect: "fadeIn"
    }
  );

  if (!SteveKwan.isMobile()) SteveKwan.initColorBox();

};





$(SteveKwan.handleReady);