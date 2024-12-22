$(document).ready(function() {
  // Scroll to top button ----------------------------------------------------------
  // When the user scrolls down 350px from the top of the document, show the button
  window.onscroll = function() {
    scrollFunction();
  };

  function scrollFunction() {
    if (document.body.scrollTop > 350 || document.documentElement.scrollTop > 350) {
      document.getElementById("topper").style.display = "block";
    } else {
      document.getElementById("topper").style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  $("#topper").on("click", function() {
    $("html, body").animate({ scrollTop: 0 }, 400);
  });

  // Initialize tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // Initially hide the read more div
  $("#read-more").css("display", "none");

  // Show more/less on click
  $("#badge-more").on("click", function() {
    // Show/hide the div
    $("#read-more").fadeToggle("fast");
    // Toggle the button text between "more" and "less"
    if ($(this).text() === "more") {
      $(this).text("less");
    } else {
      $(this).text("more");
    }
  });

  // Popover function
  $('[data-toggle="popover"]').popover();

  // Toggle all accordion panels for printing
  // - Single handler for .expander
  $(".expander").on("click", function() {
    if ($(this).text() === "show all") {
      $(this).text("hide all");
      // Show all accordions
      $(".panel-collapse").collapse('show');
      // Alternatively, if needed: $(".panel-collapse").addClass("in");
    } else {
      $(this).text("show all");
      // Hide all accordions
      $(".panel-collapse").collapse('hide');
      // Alternatively, if needed: $(".panel-collapse").removeClass("in");
    }
  });

  // Load navbar
  $("#navbar-include").load("navbar.html", function() {
    $("#home").removeClass("active");
    $("#vitae").addClass("active");
  });

  // Smooth scrolling for navigation links
  $('a[href*="#"]').on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top - 60
    }, 500, 'linear');
  });

  // Scroll to top when #topper is clicked (this duplicates the earlier #topper handler but is okay if consistent)
  $('#topper').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 500);
    return false;
  });

  // Immediately show first section blocks
  // Select the first .block-timeline and add 'in-view' to all .resume-block inside it
  $('.block-timeline:first .resume-block').addClass('in-view');

  // Add 'in-view' on scroll for subsequent sections
  $(window).on('scroll', function() {
    $('.resume-block').each(function() {
      var elementTop = $(this).offset().top;
      var viewportBottom = $(window).scrollTop() + $(window).height();
      if (elementTop < viewportBottom - 100) {
        $(this).addClass('in-view');
      }
    });
  });
});
