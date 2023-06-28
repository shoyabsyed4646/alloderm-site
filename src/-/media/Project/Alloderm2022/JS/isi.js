$(document).ready(function () {
// isi section
if ($(".isi-area.on-page").length != 0) {

    var originalWarning = $(".isi-area.on-page"),
        stickyWarning = $(".isi-area.fixed").not(".placeholder"),
        stickyWarningPlaceholder = $(".isi-area.fixed"),
        stickyButton = stickyWarning.find(".isi-header"),
        stickyContent = stickyWarning.find(".isi-content"),
        stickyAnimationTime = 0.5;

    function toggleSticky(expandedStatus) {
        // var buttonText = stickyButton.find(".text");
        if (expandedStatus) {
            stickyWarning.removeClass("enlarged");
        } else {
            stickyWarning.addClass("enlarged");
        }
        stickyWarning.data("enlarged", !expandedStatus);

        stickyContent.scrollTop(0);

    }

    function getStickyOffset() {
        if ($("body").data('pagename') == "Home") {
            return stickyWarningPlaceholder.offset().top - 100;
        }
        else {
            return stickyWarningPlaceholder.offset().top;
        }

    }
    window.checkStickyWarning = function () {

        if (getStickyOffset() >= originalWarning.offset().top) {

            stickyWarning.addClass("collapsed");

            if (stickyWarning.data("enlarged")) {
                toggleSticky(true);
            }

        } else {
            stickyWarning.removeClass("collapsed");

        }

    };


    stickyWarning.data("enlarged", false);


    setTimeout(function () {
        window.checkStickyWarning();
    }, 250);


    stickyButton.on("click", function (e) {
        e.preventDefault();
        toggleSticky(stickyWarning.data("enlarged"));
    });

    $(window).on("scroll", function () {
        window.checkStickyWarning();
    });


    $(window).on("resize", function () {
        window.checkStickyWarning();
    });



}
    // isi section
});