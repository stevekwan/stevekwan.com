var SteveKwan = SteveKwan || {};

SteveKwan.sections = $("#header, #content, #footer");
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
      var elementY = $(element).offset().top;
      var deltaY = currentY-elementY;
      if (deltaY < 0) deltaY *= -1;
      if (deltaY > fuzzFactor) return;

      // We've scrolled into (or close to) a new section!
      if (SteveKwan.currentSection[0] != element)
      {
        var beforeNewSelection = SteveKwan.sections.slice(0,index);
        var afterNewSelection = SteveKwan.sections.slice(index);
        $(beforeNewSelection).children().fadeOut();
        $(afterNewSelection).children().fadeIn();
        SteveKwan.currentSection = $(element);
      }
    }
  );
};

SteveKwan.handleReady = function()
{
  $('#header').find('.transitory-arrow').click
  (
    function(e)
    {
      e.preventDefault();
      SteveKwan.scrollTo("#content");
    }
  );

  $('#content').find('.transitory-arrow').click
  (
    function(e)
    {
      e.preventDefault();
      SteveKwan.scrollTo("#footer");
    }
  );

  //SteveKwan.sections.not(SteveKwan.currentSection).children().hide();
  SteveKwan.handleScroll();

  $(window).scroll
  (
    $.debounce
    (
      100,
      SteveKwan.handleScroll
    )
  );

};

$(SteveKwan.handleReady);