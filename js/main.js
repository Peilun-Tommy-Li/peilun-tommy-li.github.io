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

    // -------------------------------
  // Publications tally counter
  // -------------------------------

  // Optional icons for certain venues
  const VENUE_ICONS = {
    "L4DC": "fa-wave-square",
    "ICRA": "fa-robot",
    "IFAC LHMNC": "fa-infinity",
    "ICML": "fa-brain",
    "NeurIPS": "fa-network-wired",
    "RSS": "fa-microchip",
    "CoRL": "fa-cubes"
  };

  // Sort order (others go alphabetically at the end)
  const VENUE_ORDER = ["L4DC", "ICRA", "IFAC Workshop", "RSS", "CoRL", "ICML", "NeurIPS"];

  function buildPubTally() {
    const $items = $('#publications .pub-item');
    const tally = {};
    let total = 0;

    $items.each(function() {
      const v = ($(this).data('venue') || '').trim();
      if (!v) return;
      tally[v] = (tally[v] || 0) + 1;
      total++;
    });

    // Sort venues by VENUE_ORDER, then alphabetically
    const venues = Object.keys(tally).sort((a, b) => {
      const ia = VENUE_ORDER.indexOf(a);
      const ib = VENUE_ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });

    const $list = $('#pub-tally');
    $list.empty();

    venues.forEach(v => {
      const $li = $('<li>');
      const $left = $('<span class="venue-name">');
      const $icon = $('<i>').addClass(`fas ${VENUE_ICONS[v] || 'fa-book'}`);
      const $text = $('<span>').text(v);
      $left.append($icon).append($text);

      const $count = $('<span class="venue-count">').text(tally[v]);

      $li.append($left).append($count);
      $list.append($li);
    });

    $('#pub-total-count').text(total);
  }

  // Run tally builder now
  buildPubTally();

  // -----------------------------------------
  // Publications tally (structured by venue)
  // -----------------------------------------
// Helper: turn label into a safe class (e.g., "IFAC Workshop" -> "IFAC-Workshop")
function venueToClass(label){
  return 'venue-' + label.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$|--+/g,'-');
}
// ===== Structured Publications Tally (with venue coloring) =====
(function buildStructuredPubTally(){
  // Display order & normalization
  const VENUE_ORDER = ["NeurIPS","ICLR","ICML","RSS","CoRL","ICRA","L4DC","IFAC Workshop"];
  const VENUE_ALIAS = {
    "NEURIPS":"NeurIPS","NIPS":"NeurIPS",
    "ICLR":"ICLR",
    "ICML":"ICML",
    "RSS":"RSS",
    "CORL":"CoRL",
    "ICRA":"ICRA",
    "L4DC":"L4DC",
    "IFAC":"IFAC Workshop","IFAC WORKSHOP":"IFAC Workshop",
    "IFAC LHMNC":"IFAC Workshop","LHMNC":"IFAC Workshop",
    "IFAC LHMNC WORKSHOP":"IFAC Workshop"
  };

  // Turn a label into a safe class, e.g. "IFAC Workshop" -> "venue-IFAC-Workshop"
  function venueToClass(label){
    return 'venue-' + label.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$|--+/g,'-');
  }

  const $items = $('#publications .pub-item');
  if ($items.length === 0) return;

  // Count venues and tag each item for CSS
  const counts = {};
  let total = 0;

  $items.each(function(){
    const raw = ($(this).data('venue') || '').toString().trim();
    if (!raw) return;

    const norm = VENUE_ALIAS[raw.toUpperCase()] || raw;
    counts[norm] = (counts[norm] || 0) + 1;
    total++;

    // add venue class to the item so CSS colors kick in
    $(this).addClass(venueToClass(norm));
  });

  // Total line
  $('#pub-total-count').text(total);

  // Build the list in requested order, hiding zeros
  const $list = $('#pub-tally-structured');
  if ($list.length){
    $list.empty();
    VENUE_ORDER.forEach(label=>{
      const n = counts[label] || 0;
      if (n === 0) return; // hide zero-count categories
      const liClass = venueToClass(label);
      $list.append(
        $(`<li class="${liClass}">
            <span class="venue-name">${label}:</span>
            <span class="venue-count">${n}</span>
          </li>`)
      );
    });
  }
})();



});
