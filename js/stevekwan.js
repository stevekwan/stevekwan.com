/**
 * The JavaScript powering stevekwan.com.
 *
 * @class SteveKwan
 *
 * Author:
 *     Steve Kwan
 *     mail@stevekwan.com
 *     http://www.stevekwan.com
 */
var SteveKwan = SteveKwan || {};





SteveKwan.sections       = $(".panel");
SteveKwan.currentSection = $("#header");





/**
 * Scrolls the page to a specified element.
 *
 * @method scrollTo
 * @param {String} element A jQuery selector string/object to scroll to.
 */
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





/**
 * Switch to a new panel and trigger events/animations.
 *
 * @method switchPanel
 * @param {Object} panel The new element representing the panel.
 */
SteveKwan.switchPanel = function(panel)
{
  var newSelection       = $(panel);
  var newIndex           = SteveKwan.sections.index(newSelection);
  var oldSelection       = SteveKwan.currentSection;
  var beforeNewSelection = SteveKwan.sections.slice(0,newIndex);
  var afterNewSelection  = SteveKwan.sections.slice(newIndex);

  SteveKwan.currentSection = newSelection;

  $(afterNewSelection).find('.panel-inner').each
  (
    function(index, element)
    {
      // Don't trigger a fade-in animation unless we actually need to
      if ($(element).hasClass('fade-out'))
      {
        $(element).removeClass('fade-out').addClass('fade-in');
      }
    }
  );

  // These animations shouldn't occur on mobile
  if (!SteveKwan.isMobile())
  {
    $(beforeNewSelection)
      .find('.panel-inner')
      .removeClass('fade-in')
      .addClass('fade-out');
    }

  // Trigger some custom events
  $(oldSelection).trigger('SteveKwan.exitPanel');
  $(newSelection).trigger('SteveKwan.enterPanel');
};





/**
 * Event handler fired upon user scrolling.
 *
 * @method handleScroll
 */
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
        SteveKwan.switchPanel(element);
      }
    }
  );
};





/**
 * Adds the teaser "down" arrow that informs the user there's more content
 * below.  Clicking that arrow scrolls to that section.
 *
 * @method addTransitoryArrow
 * @param {Object} container Display the arrow at the bottom of this element.
 * @param {Object} to Clicking the arrow scrolls to this element.
 * @param {String} [color='dark'] Color of the transitory arrow.  Either: light|dark
 */
SteveKwan.addTransitoryArrow = function(container, to, color)
{
  if (color === undefined) color = 'dark';

  var transitoryArrow = $
  (
    '<a href="'+to+'" ' +
    'class="transitory-arrow ui-sprite ui-sprite-transitory-arrow-'+color +
    ' hidden-phone ir">Scroll down</a>'
  );

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





/**
 * Event handler fired when entering a new panel.  Activated by scrolling.
 *
 * @method handleEnterPanel
 * @param {Object} e The event.  Target is the panel being entered.
 */
SteveKwan.handleEnterPanel = function(e)
{
  var element = $(e.target);
  var id = element.attr('id');

  element.addClass('enter-panel-first-time');
  element.addClass('enter-panel');
};





/*
 * Event handler fired when exiting a new panel.  Activated by scrolling.
 *
 * @method handleExitPanel
 * @param {Object} e The event.  Target is the panel being exited.
 */
SteveKwan.handleExitPanel = function(e)
{
  var element = $(e.target);
  var id = element.attr('id');

  element.removeClass('enter-panel');
};





/**
 * Initialize all colorbox overlays for image galleries.
 *
 * @method initColorBox
 */
SteveKwan.initColorBox = function()
{
  $('#portfolio').find('.gallery').colorbox({rel:'portfolio', maxWidth:'80%'});
  $('#interests').find('.gallery').colorbox({rel:'jiu-jitsu', maxWidth:'80%'});
};





/**
 * Event handler fired when browser is resized into mobile viewport size.
 *
 * @method handleEnterMobile
 */
SteveKwan.handleEnterMobile = function()
{
  $.colorbox.remove();
};





/**
 * Event handler fired when browser is resized out of mobile viewport size.
 *
 * @method handleExitMobile
 */
SteveKwan.handleExitMobile = function()
{
  SteveKwan.initColorBox();
};






/**
 * Triggered when the jquery.lazyload "appear" function is called for the
 * careers section.
 *
 * We need this right now because we are manually lazy loading the images.
 * jquery.lazyload does not yet support lazy loading on background images.
 *
 * @method handleCareerAppear
 */
SteveKwan.handleCareerAppear = function()
{
  $('#career').find('.career-sprite').addClass('lazyloaded');
};





// Holds the jRespond object.
SteveKwan.jRespond;

/**
 * Define the various responsive breakpoints.  Events are fired when
 * transitioning across these breakpoints.
 *
 * @method defineBreakpoints
 */
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





/**
 * Is the user in mobile viewport size or not?
 *
 * @method isMobile
 * @return {Boolean} true if mobile viewport size, false otherwise
 */
SteveKwan.isMobile = function()
{
  return SteveKwan.jRespond.getBreakpoint() === 'mobile';
};





/**
 * Event handler fired when DOM has been parsed.
 *
 * @method handleReady
 */
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

  // Don't fire the scroll handler too often...
  $(window).scroll
  (
    $.debounce
    (
      100,  // Poll at this interval
      SteveKwan.handleScroll
    )
  );

  // Trap custom events when entering/exiting a major section/panel of the site
  $(SteveKwan.sections).bind('SteveKwan.enterPanel', SteveKwan.handleEnterPanel);
  $(SteveKwan.sections).bind('SteveKwan.exitPanel', SteveKwan.handleExitPanel);

  var lazyLoadOptions =
  {
    effect: 'fadeIn',
    threshold: $(window).height(), // Fetch only a page's worth
    skip_invisible: false
  };

  // Lazy load images further down the page
  SteveKwan.sections
    .find('img.lazy')
    .show()
    .lazyload
    (
      lazyLoadOptions
    );

  // Careers images need to be loaded differently because they're background
  // images, and jquery.lazyload does not yet support this.
  $('#career')
    .find('.clients')
    .prepend('<img class="client-logo" src="images/blank.png"/>')
    .find('img.client-logo')
    .show()
    .lazyload
    (
      $.extend
      (
        {},
        lazyLoadOptions,
        {
          appear: SteveKwan.handleCareerAppear
        }
      )
    );

  // Mobile doesn't use overlays
  if (!SteveKwan.isMobile()) SteveKwan.initColorBox();

};





$(SteveKwan.handleReady);