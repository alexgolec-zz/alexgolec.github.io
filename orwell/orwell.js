// -------------------------------------------------------------------------
// Top-level page state
//  - This is not all of the state in this page. Some state is stored in
//    event handlers.

// A list of linkable elements, ordered by their top-to-bottom appearance on
// the page. Note that these elements are assumed to be vertically
// non-overlapping. This variable will be populated in the ready() function.
window.linkableElements = new Array();

// A searcher for finding elements that have offset position less than or
// equal to the given position.
window.linkableElementSearcher = Searcher(
function(element) {
return element.offset().top + element.height();
}, window.linkableElements
);

// The prefix for the last linkable element key in localStorage.
var localStorageLastLinkableElementPrefix = "last-linkable:";

// Additional data used by this code:
// - localStorage.lastLinkableElement
//   - ID name of the last linkable element that was at the top of the
//     screen.
if (typeof localStorage.lastLinkableElement != "object") {
localStorage.lastLinkableElement = {};
}

// - sessionStorage.isReloaded
//   - In the ready() handler, records if this session has been reloaded.
//     On the first load of the page, this value will the false. On all
//     subsequent loads, this value will be true.
//   - NOTE: This value is only valid to use in the ready() handler. No not
//           use it anywhere else.
if (typeof sessionStorage.isReloaded != "string") {
sessionStorage.isReloaded = "false";
}

// -------------------------------------------------------------------------
// Functions.

// Get the linkable element to which we will want to jump if the top of the
// screen is at the given position. In practice this means:
//  - If we are between the top of the screen or above the first linkable
//    position, return null.
//  - If we are under a linkable element, return the linkable element under
//    that cleared element.
var lastLinkableElementByPosition = function(position) {
var idx =
window.linkableElementSearcher.largestElementLessThanOrEqualTo(
  position);
if (idx == -1) {
return null;
} if (idx == window.linkableElements.length - 1) {
return window.linkableElements[idx];
} else {
return window.linkableElements[idx + 1];
}
}

// For all elements returned by the selector:
//  1. Give them an id attribute of the form idPrefix + [unique number], if
//     they do not have an id attribute already.
//  2. Give them the CSS class linkableClass.
// Note that this method expects to be called after the DOM is ready.
var makeElementsLinkable = function(selector, idPrefix, linkableClass) {
linkable_elements = $(selector);
for (i = 0; i < linkable_elements.length; i++) {
element = $(linkable_elements.get(i));
if (typeof element.attr("id") == "undefined") {
  element.attr("id", idPrefix + i);
}
element.addClass(linkableClass);
}
}

// Save the current linkable element for this page to localStorage. Returns
// true on success.
var setLastLinkableElementId = function(elementId) {
localStorage[localStorageLastLinkableElementPrefix +
           window.location.pathname] = elementId;
}

// Get the current linkable element for this page.
var getLastLinkableElementId = function() {
return localStorage[localStorageLastLinkableElementPrefix +
                  window.location.pathname];
}

// -------------------------------------------------------------------------
// ready() handler

$(document).ready(function() {
linkableClass = "linkable-element"

// Set up ids for all lists and paragraphs directly under the body container.
makeElementsLinkable(
// Selector
".paragraph-container > p, .paragraph-container > ul, .paragraph-container > ol",
// idPrefix
linkableClass + "-",
// linkableClass
linkableClass);

linkables = $("." + linkableClass);
for (i = 0; i < linkables.length; i++) {
window.linkableElements.push($(linkables.get(i)));
}
});

// -------------------------------------------------------------------------
// load() handler

$(window).load(function() {
// Scroll to the last linkable location.
var lastLinkableElementId = getLastLinkableElementId();
if (typeof lastLinkableElementId == "string" &&
  lastLinkableElementId != "" &&
  sessionStorage.isReloaded != "true") {
var scrollDestination = $("#" +
  getLastLinkableElementId()).offset().top;

$('body').animate(
  // properties
  {
    scrollTop: scrollDestination
  },
  // options
  {
    duration: 500,
    easing: "easeInOutCubic",
  }
);
}

// Record that the page has been run at least once.
sessionStorage.isReloaded = "true";
});

// -------------------------------------------------------------------------
// scroll() handler

$(document).scroll(function(event) {
// Only perform position management if the window hasn't been scrolled for
// 250 milliseconds.
clearTimeout($.data(this, 'scrollTimer'));
$.data(this, 'scrollTimer', setTimeout(function() {
if (document.readyState === "complete") {
  // Record the ID of the linkable element that we just cleared. If we
  // haven't cleared any elements yet, save the empty string.
  lastLinkableElement =
    lastLinkableElementByPosition($(window).scrollTop());
  lastLinkableElementId =
    lastLinkableElement != null ?
      lastLinkableElement.attr("id") : "";

  setLastLinkableElementId(lastLinkableElementId);
}
}, 250));
});

