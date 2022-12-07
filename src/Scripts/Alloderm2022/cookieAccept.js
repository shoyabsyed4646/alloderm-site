$(document).ready(function () {

    $('.cookie-section .close').on('click', function () {
        $(this).parent('.cookie-section').hide();
    });

    //OneTrust Implementation, Instagram feature enabled.
    localStorage.setItem("alert", "true");
    var curdate = new Date();
    localStorage.setItem("CookieExpiry", (curdate.getFullYear() + 1).toString() + "/" + curdate.getMonth().toString() + "/" + curdate.getDate().toString());

    callAnalyticsScript();
    $(".cookie-section").hide();
    callScript();
    //OneTrust Implementation, Instagram feature enabled.

    if (localStorage.getItem("alert") == 'true') {
        var curdate = new Date();
        var currentdate = new Date(curdate.getFullYear(), curdate.getMonth(), curdate.getDate());

        if (localStorage.getItem("CookieExpiry") == null) {
            localStorage.setItem("CookieExpiry", (curdate.getFullYear() + 1).toString() + "/" + curdate.getMonth().toString() + "/" + curdate.getDate().toString());
        }

        var exdate = localStorage.getItem("CookieExpiry").split("/");
        var expireDate = new Date(exdate[0], exdate[1], exdate[2]);


        //As part of Onetrust implementation, we commented the accept feature to enable the instagram
        //if (currentdate >= expireDate) {
        //    localStorage.removeItem("alert");
        //    localStorage.removeItem("CookieExpiry");
        //    $('.cookie-section').show();
        //    $('.embedsocial-instagram').css('display', 'none');
        //    $('#follow-insta').css('display', 'none');
        //    $('.new-insta1').css('display', 'block');
        //}
        //else {
        //    callAnalyticsScript();
        //}
        //As part of Onetrust implementation, we commented the accept feature to enable the instagram
    }
    else {
        $('.embedsocial-instagram').css('display', 'none');
        $('#follow-insta').css('display', 'none');
        $('.new-insta1').css('display', 'block');
        $('.cookie-section').show();

    }

    //cookie enable/disable
    if (localStorage.getItem("alert") == 'true') {
        var curdate = new Date();
        var currentdate = new Date(curdate.getFullYear(), curdate.getMonth(), curdate.getDate());

        if (localStorage.getItem("CookieExpiry") == null) {
            localStorage.setItem("CookieExpiry", (curdate.getFullYear() + 1).toString() + "/" + curdate.getMonth().toString() + "/" + curdate.getDate().toString());
        }

        var exdate = localStorage.getItem("CookieExpiry").split("/");
        var expireDate = new Date(exdate[0], exdate[1], exdate[2]);

        //As part of Onetrust implementation, we commented the accept feature to enable the instagram
        //if (currentdate >= expireDate) {
        //    localStorage.removeItem("alert");
        //    localStorage.removeItem("CookieExpiry");
        //    $('.embedsocial-instagram').css('display', 'none');
        //    $('#follow-insta').css('display', 'none');
        //    $('.new-insta1').css('display', 'block');

        //    $(".cookie-section").show();
        //}
        //else {
        //    callAnalyticsScript();
        //}
        //As part of Onetrust implementation, we commented the accept feature to enable the instagram
    }
    else {
        $('.embedsocial-instagram').css('display', 'none');
        $('#follow-insta').css('display', 'none');
        $('.new-insta1').css('display', 'block');
        $(".cookie-section").show();
    }


    function moreCookieaction() {
        var showChar;
        if ($(window).width() >= 992) {
            showChar = $('#cookiepolicytext').data('desk-char');
        } else if ($(window).width() < 992) {
            showChar = $('#cookiepolicytext').data('mob-char');
        }
        var moretext = $('#readmore').html();
        var lesstext = $('#readless').html();
        var full_content = "";
        var text_to_display = "";
        full_content = $('.cookie-text').find('aside').contents();

        $('.cookie-text').find('aside').each(function (i) {
            text_to_display += $(this).text().trim().substr(0, showChar);
            $(this).empty();
        });

        $('.cookie-text').find('aside').html('<p>' + text_to_display + '</p>')
        $('<a href="javascript:;" class="readmore" role="button" aria-expanded="false" aria-label="Read more about cookie policy">' + moretext + '</a>').appendTo($('.cookie-text').find('aside p:last-child'))

        $(document).on('click', '.readmore', function () {
            $('.cookie-text').find('aside').addClass('cookie-expanded');
            $('.cookie-text').find('aside').html($(full_content));
            $(this).hide();
            $('<a href="javascript:;" class="readless" role="button" aria-expanded="true" aria-label="Read less about cookie policy">' + lesstext + '</a>').appendTo($('.cookie-text').find('aside p:last-child'));
            if ($('.cookie-section').css('position') == 'relative') {
                window.scrollTo(0, document.body.scrollHeight);
            }
        });

        $(document).on('click', '.readless', function () {
            $('.cookie-text').find('aside').removeClass('cookie-expanded');
            $('.cookie-text').find('aside').html('<p>' + text_to_display + '</p>');
            $(this).hide();
            $('<a href="javascript:;" class="readmore" role="button" aria-expanded="false" aria-label="Read more about cookie policy">' + moretext + '</a>').appendTo($('.cookie-text').find('aside p:last-child'))
        });


    }

    if ($('#cookiepolicytext').attr('data-isEEditor') == 0) {
        moreCookieaction();
    }


    $('body').on('click', '.cookie-accept-button', function () {
        localStorage.setItem("alert", "true");
        var curdate = new Date();
        localStorage.setItem("CookieExpiry", (curdate.getFullYear() + 1).toString() + "/" + curdate.getMonth().toString() + "/" + curdate.getDate().toString());

        callAnalyticsScript();
        $(".cookie-section").hide();
        callScript();
    });

    function callAnalyticsScript() {
        $(".cookie-section").hide();
        callScript();
    }
    function callScript() {
        //EmbedSocial
        (function (d, s, id) {
            var js; if (d.getElementById(id)) { return; }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://embedsocial.com/embedscript/in.js"; d.getElementsByTagName("head")[0].appendChild(js);
        }(document, "script", "EmbedSocialInstagramScript"));

        $('.embedsocial-instagram').css('display', 'block');
        $('#follow-insta').css('display', 'inline-block');
        $('.new-insta1').css('display', 'none');

        $(".cookie-section").hide();
    }
    window.IsMobile = function () {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

});




