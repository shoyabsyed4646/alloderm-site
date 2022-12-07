//OMI integration Popup 
$(document).ready(function () {
    var sdate = $('.remediationBanner-start-date').data('start-date').split('/');
    var edate = "";

    /* Popup End date hardcoded, it has to be changed as per the wave implementation*/
    edate = "2023/01/15".split("/");
    var startdate = new Date(sdate[0], sdate[1] - 1, sdate[2]);
    var enddate = new Date(edate[0], edate[1] - 1, edate[2]);
    var curdate = new Date();
    var currentdate = new Date(curdate.getFullYear(), curdate.getMonth(), curdate.getDate());

    if (((currentdate >= startdate) && (currentdate <= enddate)) && (sessionStorage.getItem('remediationBanner') == null || sessionStorage.getItem('remediationBanner') == undefined)) {
        if ($(window).width() < 1024) {
            $('#remediationBanner .wrapper-block').css('top', $('header.mainMenu-Hdr').outerHeight());
        }
        $('#remediationBanner').show();
        $('body').addClass('r-banner-open');
    }

    $('#remediationBanner .close-icon').on('click', function () {
        sessionStorage.setItem('remediationBanner', 'true');
        $('#remediationBanner').hide();
        $('body').removeClass('r-banner-open');
    });
});

$(window).on("scroll", function (event) {
  var scrollValue = $(window).scrollTop();

  if (scrollValue > 100) {
    $(".navbar").addClass("fixed-top");
    if ($(window).width() < 768) {
      $(".ordernowpopup").css("position", "fixed");
      $(".ordernowpopup").css("top", $(".navbar").height() + 15);
    }
  } else {
    $(".navbar").removeClass("fixed-top");

    if ($(window).width() < 768) {
      $(".ordernowpopup").css("position", "relative");
      $(".ordernowpopup").css("top", "0");
    }
  }
});

$(document).ready(function () {
  if (navigator.userAgent.indexOf("Mac") > 0) $("body").addClass("mac-os");
  if (navigator.userAgent.indexOf("Safari") > 0) $("body").addClass("safari");
  if (navigator.userAgent.indexOf("Chrome") > 0) $("body").addClass("chrome");
  $(
    ".zoom-view-section .multicolumn-section .item .image .default-image"
  ).click(function () {
    var largerImageSrc = $(this).parent().data("zoomed-img-src");
    var largerMobileImageSrc = $(this).parent().data("mobile-zoomed-img-src");
    if ($(window).width() >= 768) {
      $("#showLargerImage .modal-body .popup-img img").attr(
        "src",
        largerImageSrc
      );
    } else {
      $("#showLargerImage .modal-body .popup-img img").attr(
        "src",
        largerMobileImageSrc
      );
    }
  });
  $(
    "#showLargerImage.modal .modal-dialog .modal-content .modal-header .close"
  ).click(function () {
    $("#showLargerImage").modal("hide");
  });
  $("#comingSoonPopup").hide();
  //Adding active class to Navigation Links for active Page
  var pathname = window.location.pathname;
  var splitpathname = pathname.split("#");
  $('nav div.navbar-collapse > ul > li > a[href="' + splitpathname[0] + '"]')
    .parent()
    .addClass("active")
    .children("a")
    .attr("aria-current", "true");

  if ($(window).width() > 767) {
    $(".nav-link").on("click", function (e) {
      e.preventDefault();
      window.location.replace($(this).attr("href"));
    });
  }
  $(".navbar-toggler").on("click", function () {
    if ($(this).attr("aria-expanded") == "false") {
      $(this).parents("header").addClass("navbgoverlay");
    }
  });
  $(document).on("shown.bs.collapse", ".navbar-collapse", function () {
    $(this).parents("body").css("overflow", "hidden");
  });
  $(document).on("hidden.bs.collapse", ".navbar-collapse", function () {
    $(this).parents("header").removeClass("navbgoverlay");
    $(this).parents("body").css("overflow", "");
  });

  $(".ordernowpopup .header-section").on("click", function () {
    if ($(this).parents(".ordernowpopup").hasClass("show")) {
      $(this).parents(".ordernowpopup").removeClass("show");
      $(this).parents(".ordernowpopup").find(".item").hide(400, "easeInSine");
    } else {
      $(this).parents(".ordernowpopup").addClass("show");
      $(this).parents(".ordernowpopup").find(".item").show(400, "easeInSine");
    }
  });
  /* }*/
  $(".ordernowpopup .item").mouseleave(function () {
    $(this).parents(".ordernowpopup").removeClass("show");
    $(this).parents(".ordernowpopup").find(".item").hide(400, "easeInSine");
  });
  if (
    localStorage.getItem("HCPViewed") == undefined ||
    localStorage.getItem("HCPViewed") != "true"
  ) {
    $("#modalHcp").modal("show");
    $("#comingSoonPopup").modal("hide");
  }
  if (
    localStorage.getItem("HCPViewed") == undefined ||
    localStorage.getItem("HCPViewed") != "true"
  ) {
    $("#modalHcp").on("hidden.bs.modal", function () {
      $("#comingSoonPopup").modal("show");
    });
    $("#comingSoonPopup").on("hidden.bs.modal", function () {
      localStorage.setItem("isComingSoonPopupVisible", false);
    });
  }

  $("#modalHcp .modal-btn.white-btn-popup").on("click", function () {
    localStorage.setItem("HCPViewed", "true");
    localStorage.setItem("isComingSoonPopupVisible", true);
    $("#comingSoonPopup").modal("show");
    $("#comingSoonPopup").on("hidden.bs.modal", function () {
      localStorage.setItem("isComingSoonPopupVisible", false);
      $("#comingSoonPopup").modal("hide");
    });
  });

  $("#comingSoonPopup").on("hidden.bs.modal", function () {
    localStorage.setItem("isComingSoonPopupVisible", false);
    $("#comingSoonPopup").modal("hide");
  });
  $("#comingSoonPopup .modal-header .close").click(function () {
    localStorage.setItem("isComingSoonPopupVisible", false);
    $("#comingSoonPopup").modal("hide");
  });
  if (
    localStorage.getItem("isComingSoonPopupVisible") == false &&
    localStorage.getItem("HCPViewed") == true
  ) {
    $("#comingSoonPopup").modal("hide");
    $("#comingSoonPopup").hide();
  }
  //Video Popup on Homepage start
  $(".twocolumnvideo").attr({ tabindex: "0", "aria-haspopup": "true" });
  $(document).on("keyup", ".twocolumnvideo", function (e) {
    if (e.keyCode == 13) {
      $(this).trigger("click");
    }
  });
  $(document).on("click", ".twocolumnvideo", function () {
    if (document.querySelector("#video_popup") != null) {
      var player;
      var options = {
        autoplay: true,
      };
      $("#video_popup #videomodalframe").attr(
        "data-vimeo-url",
        $(this).find("img").data("url")
      );
      player = new Vimeo.Player("videomodalframe", options);
      player.on("play", function () {});
      //player.loadVideo({ url: $(this).find('img').data('url'), autoplay: 1 });
      $("#video_popup").modal("show");
    } else {
      alert("Oops! Please include video popup rendering into this page.");
    }
  });

  $(document).on("click", "#video_popup .close", function () {
    $("#video_popup").modal("hide");
  });

  $("#video_popup").on("hidden.bs.modal", function () {
    var player = new Vimeo.Player("videomodalframe");
    player.on("ended", function () {});
    player.destroy();
    $("#videomodalframe").empty();
  });

  //Video Popup on Homepage End

  //Flip card functioanlity script
  $(".flip-card").each(function () {
    $(".flip-card-inner").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(this).css("transform", "rotateY(360deg)");
        $(this).find(".flip-card-front").css("transform", "rotateY(360deg)");
      } else {
        $(this).addClass("active");
        $(this).css("transform", "rotateY(180deg)");
        $(this).find(".flip-card-front").css({ transform: "rotateY(180deg)" });
      }
    });
  });
  //Flip card functioanlity script Ends
  //Start: Inner page scroll script
  $(".navbar .navbar-nav li ul li a").click(function () {
    var anchor_target = $(this).attr("href").split("#");
    if (document.querySelectorAll(".fixed-top").length == 0) {
      var navheight = 100;
    } else {
      if ($(window).width() > 767) {
        navheight = $("nav.fixed-top").height();
      } else {
        navheight = $("nav.fixed-top").height() + $(".ordernowpopup").height();
      }
    }
    $("html, body").animate(
      {
        scrollTop: $("#" + anchor_target[1]).offset().top - navheight,
      },
      500
    );
    if ($(".navbar-collapse").hasClass("show")) $(".navbar-toggler").click();
  });
  //End: Inner page scroll script
  $(
    "header nav.navbar .navigationLinks .top-nav .top-nav-link li:nth-child(2) a,.resources-sec a"
  ).click(function () {
    var anchor_target = $(this).attr("href").split("#");
    if (document.querySelectorAll(".fixed-top").length == 0) {
      if ($(window).width() > 767) {
        var navheight = 150;
      } else {
        navheight = 320;
      }
    } else {
      if ($(window).width() > 767) {
        navheight = $("nav.fixed-top").height() + 15;
      } else {
        navheight =
          $("nav.fixed-top").height() + 15 + $(".ordernowpopup").height();
      }
    }
    $("html, body").animate(
      {
        scrollTop: $("#" + anchor_target[1]).offset().top - navheight,
      },
      500
    );
  });

  if (window.location.hash.substr(1) == "productportfolio") {
    setTimeout(function () {
      if ($(window).width() < 768) {
        $("html, body").animate(
          {
            scrollTop: $("#productportfolio").offset().top - 150,
          },
          500
        );
      } else {
        $("html, body").animate(
          {
            scrollTop: $("#productportfolio").offset().top - 50,
          },
          500
        );
      }
    }, 500);
  }
  if (window.location.hash.substr(1) == "AlloDermRTMGuarantee") {
    setTimeout(function () {
      if ($(window).width() < 768) {
        $("html, body").animate(
          {
            scrollTop: $("#AlloDermRTMGuarantee").offset().top - 150,
          },
          500
        );
      } else {
        $("html, body").animate(
          {
            scrollTop: $("#AlloDermRTMGuarantee").offset().top - 50,
          },
          500
        );
      }
    }, 500);
  }
  $(".modal .modal-content .modal-body h5").replaceWith(function () {
    return $("<h2>", {
      id: this.id,
      class: this.className,
      html: $(this).html(),
    });
  });
  if ($(".top-nav a").hasClass("socialfb")) {
    $(".socialfb").attr("aria-label", "Facebook Link");
  }
  if ($(".top-nav a").hasClass("socialtw")) {
    $(".socialtw").attr("aria-label", "Twitter Link");
  }
  if ($(".top-nav a").hasClass("socialinstagram")) {
    $(".socialinstagram").attr("aria-label", "Instagram Link");
  }
  if ($(".top-nav a").hasClass("socialemail")) {
    $(".socialemail").attr("aria-label", "Social Mail");
  }

  if ($(window).width() < 767) {
    $(".biology-of-repair-hero .block2")
      .find("h2")
      .insertBefore($(".biology-of-repair-hero .block1 img:first-child"));
  }
  $(".whitebg-portitem1 .item:first-child .item-img a").attr(
    "aria-label",
    "Contour Preforated"
  );
  $(".whitebg-portitem1 .item:nth-child(2) .item-img a").attr(
    "aria-label",
    "Contour"
  );
  $(".whitebg-portitem1 .item:nth-child(3) .item-img a").attr(
    "aria-label",
    "Perforated Rectangle"
  );
  $(".whitebg-portitem1 .item:nth-child(4) .item-img a").attr(
    "aria-label",
    "Rectangle"
  );

  $(".hc-mode-select").on("click", function () {
    var attr = $(this).attr("data-contrast-mode");
    if (typeof attr !== typeof undefined && attr !== false) {
      if ($(this).attr("data-contrast-mode") == "off") {
        $(this).attr({
          "data-contrast-mode": "on",
          "aria-pressed": "true",
        });

        $("body").addClass("adastyle");
      } else {
        $(this).attr({
          "data-contrast-mode": "off",
          "aria-pressed": "false",
        });
        $("body").removeClass("adastyle");
      }
    }

    highContrastCheck();
    highContrast();
  });

  $("#modalHcp-peforated")
    .find(".close")
    .on("click", function (event) {
      $("#modalHcp-peforated").modal("hide");
    });

  /*ADA updates*/
  if (window.location.href.includes("portfolio")) {
    document
      .querySelector(
        ".splitter.implantable .multicolumn.perforated .item:first-child .item-img a"
      )
      .setAttribute("title", "Preforated Contour");
    document
      .querySelector(
        ".splitter.implantable .multicolumn.perforated .item:last-child .item-img a"
      )
      .setAttribute("title", "Preforated Rectangle");
    document
      .querySelector(
        ".splitter.implantable .multicolumn.nonperforated .item:first-child .item-img a"
      )
      .setAttribute("title", "Contour");
    document
      .querySelector(
        ".splitter.implantable .multicolumn.nonperforated .item:last-child .item-img a"
      )
      .setAttribute("title", "Rectangle");
    document
      .querySelector(".multicolumn.graftable .item:first-child .item-img a")
      .setAttribute("title", "Fenestrated");
    document
      .querySelector(".multicolumn.graftable .item:nth-child(2) .item-img a")
      .setAttribute("title", "Meshed");
    document
      .querySelector(".multicolumn.graftable .item:last-child .item-img a")
      .setAttribute("title", "Nonmeshed");
  }

  /*ADA updates*/
});

$(function () {
  $(".navbar .navbar-nav li").hover(
    function () {
      $(this).addClass("show");
      $(this).children("a").attr({ "aria-pressed": "true" });
      $(this).children(".dropdown-menu").addClass("show");
    },
    function () {
      $(this).removeClass("show");
      $(this).children(".dropdown-menu").removeClass("show");
      $(this).children("a").attr({ "aria-pressed": "false" });
    }
  );
});

// ADA link

function highContrastCheck() {
  if ($(".hc-mode-select").attr("data-contrast-mode") == "on") {
    sessionStorage.setItem("highContrast", "true");
  } else {
    sessionStorage.removeItem("highContrast");
  }
}
function highContrast() {
  if (sessionStorage.getItem("highContrast")) {
    $(".hc-mode-select").attr({
      "data-contrast-mode": "on",
      "aria-pressed": "true",
    });
    //$('.switch input').attr('checked', 'true');
    $("body").addClass("adastyle");
  } else {
    $(".hc-mode-select").attr({
      "data-contrast-mode": "off",
      "aria-pressed": "false",
    });
    $("body").removeClass("adastyle");
  }
}
highContrast();
// ADA link
//social share
var y = window.location.href;
function fbShare() {
  var shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + y;
  var win = window.open(shareUrl, "Share On Facebook", getWindowOptions());
  win.opener = null; // 2
}

function twitterShare() {
  var shareUrl = "https://twitter.com/intent/tweet?url=" + y;
  var win = window.open(shareUrl, "Share On Twitter", getWindowOptions());
  win.opener = null; // 2
}

function instagramShare() {
  var shareUrl = "https://www.instagram.com/allodermhcp/?hl=en" + y;
  var win = window.open(shareUrl, "Share On Instagram", getWindowOptions());
  win.opener = null; // 2
}
var getWindowOptions = function () {
  var width = 700;
  var height = 350;
  var left = window.innerWidth / 2 - width / 2;
  var top = window.innerHeight / 2 - height / 2;

  return [
    "resizable,scrollbars,status",
    "height=" + height,
    "width=" + width,
    "left=" + left,
    "top=" + top,
  ].join();
};

//social share ends
if ($(window).width() < 767) {
  $("#item-two").insertAfter("#item-three");
  $(
    ".zoom-view-section.tissue-integrity-zoom .multicolumn-section .row .container .row .col-12 .row .item-heading"
  ).insertAfter(
    ".zoom-view-section.tissue-integrity-zoom .multicolumn-section .item:nth-child(2)"
  );
}

//title tags for ahref
$("#portfolio-one").attr("title", "products");
$("#portfolio-two").attr("title", "contour perforated");
$("#portfolio-three").attr("title", "contour");
$("#portfolio-four").attr("title", "perforated rectangle");
$("#portfolio-five").attr("title", "rectangle");

$("#res-one").attr("title", "resources");

$("#res-two").attr("title", "our guarantee");

$("#res-three").attr("title", "regulatory licensing documentation");

$("#res-four").attr("title", "return goods policy");

$("#res-five").attr("title", "helpful links");

$("#res-six").attr("title", "downloadable materials");

$("#res-seven").attr("title", "reimbursement");

$(".sociallinks-item .header-section .block-img img").attr(
  "alt",
  "AlloDerm RTM Instagram"
);

//$('.rem-item1, .rem-item2, .rem-item3, .rem-item4, .rem-item5, .rem-item6').hide();

$(".graftable .item-img a, .implantable .item-img a ").click(function () {
  var targetID = $(this).attr("href").split("#")[1];
  if ($(window).width() > 767) {
    var targetST = $("#" + targetID).offset().top - 80;
  } else {
    var targetST = $("#" + targetID).offset().top - 200;
  }
  $("body, html").animate(
    {
      scrollTop: targetST + "px",
    },
    500
  );
});

$(
  ".offwhitebg-item2 .item:first-child .item-content a, .offwhitebg-item2 .item:nth-child(2) .item-content a"
).click(function () {
  var targetID = $(this).attr("href").split("#")[1];
  if ($(window).width() > 767) {
    var targetST = $("#" + targetID).offset().top - 80;
  } else {
    var targetST = $("#" + targetID).offset().top - 200;
  }
  $("body, html").animate(
    {
      scrollTop: targetST + "px",
    },
    500
  );
});
$(".contentportfolio ul a").click(function () {
  var targetID = $(this).attr("href").split("#")[1];
  if ($(window).width() > 767) {
    var targetST = $("#" + targetID).offset().top - 80;
  } else {
    var targetST = $("#" + targetID).offset().top - 200;
  }
  $("body, html").animate(
    {
      scrollTop: targetST + "px",
    },
    500
  );
});
$(".publications-sec .item-content a").click(function () {
  var targetID = $(this).attr("href").split("#")[1];
  if ($(window).width() > 767) {
    var targetST = $("#" + targetID).offset().top - 80;
  } else {
    var targetST = $("#" + targetID).offset().top - 200;
  }
  $("body, html").animate(
    {
      scrollTop: targetST + "px",
    },
    500
  );
});
$(".performance-header .item-content a,.choose-a-topic .item-content a").click(
  function () {
    var targetID = $(this).attr("href").split("#")[1];
    if ($(window).width() > 767) {
      var targetST = $("#" + targetID).offset().top - 80;
    } else {
      var targetST = $("#" + targetID).offset().top - 350;
    }
    $("body, html").animate(
      {
        scrollTop: targetST + "px",
      },
      500
    );
  }
);

//Footer content is wrapped inside a parent div so that the footer links stay aligned in higher resolutions as well

var old_html = $("footer").html();
var new_html =
  "<div id='footer-inner' class='footer-content'>" + old_html + "</div>";
$("footer").html(new_html);

$(
  ".tissue-integrity-zoom .multicolumn-section .row .container .row .col-12 .row:nth-child(2)"
)
  .find(".item-heading")
  .insertBefore(
    $(
      ".tissue-integrity-zoom .multicolumn-section .row .container .row .col-12 .row:nth-child(1) .item-desc"
    )
  );
