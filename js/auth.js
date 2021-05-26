$('#authVerifyBtn').hide();
$('#auth-otp-input').hide();
$('.auth-resend-otp-wrapper').hide();

let name = "";
let mobile = "";
let timeout = 60;
// enableOTPView(true);

$('#authCheckBtn').click(function () {
    name = $('#auth-name-input').val().trim();
    mobile = $('#auth-mobile-input').val().trim();

    if (name === "") {
        swalHandler(3, "කරුණාකර ඔබේ නම ඇතුලත් කරන්න");
        return;
    }
    if (!mobileNumRegex.test(mobile)) {
        swalHandler(3, "කරුණාකර නිවැරදි ජංගම දුරකථන අංකය ඇතුලත් කරන්න")
        return;
    }
    mobile = mobile.startsWith("0") ? `94${mobile.substr(1, 10)}` : mobile.startsWith("7") ? `94${mobile}` : mobile;
    requestOtpAPIHandler({mobile: mobile, name: name});
});
$('#authVerifyBtn').click(function () {
    name = $('#auth-name-input').val().trim();
    let otpCode = $('#auth-otp-input').val().trim();
    if (name === "") {
        swalHandler(3, "කරුණාකර ඔබේ නම ඇතුලත් කරන්න");
        return;
    }
    if (otpCode === "" || otpCode.length < 4) {
        swalHandler(3, "කරුණාකර නිවැරදි OTP කේතය ඇතුලත් කරන්න");
        return;
    }
    if (!mobileNumRegex.test(mobile)) {
        swalHandler(3, "කරුණාකර නිවැරදි ජංගම දුරකථන අංකය ඇතුලත් කරන්න");
        return;
    }

    authorizeAPIHandler({'username': mobile, 'password': otpCode, 'grant_type': 'password'});
});
$('#authModalCloseBtn').click(function () {
    $('#auth-modal-wrapper').css("display", "none");
    enableOTPView(false);
});

function enableOTPView(condition, message) {
    timeout = 60;
    if (condition) {
        this.timer = setInterval(countDown, 1000);
        $('.auth-resend-otp-wrapper').show();

        $('#authCheckBtn').hide();
        $('#authVerifyBtn').show();

        $('#auth-mobile-input').hide();
        $('#auth-otp-input').show();

        $('#auth-modal-name-text').hide();
        $('#auth-name-input').hide();

        $('#auth-modal-send-otp-text').text(message ? message : OTP_SENT_TEXT);
        $('#auth-modal-send-otp-text').show();
        $('#auth-modal-mob-title').text(`OTP කේතය ඇතුලත් කරන්න`);
    } else {
        clearInterval(this.timer);
        let authResendOTP = $('#auth-resend-otp');
        authResendOTP.removeClass('auth-resend-underline');
        authResendOTP.text(``);
        $('.auth-resend-otp-wrapper').hide();

        $('#authCheckBtn').show();
        $('#authVerifyBtn').hide();

        $('#auth-mobile-input').show();
        $('#auth-otp-input').hide();

        $('#auth-modal-send-otp-text').hide();
        $('#auth-modal-mob-title').text(`ජංගම දුරකථන අංකය ඇතුලත් කරන්න`);

        $('#auth-modal-name-text').show();
        $('#auth-name-input').show();

        // clear fields
        $('#auth-name-input').val("");
        $('#auth-mobile-input').val("");
    }

}

$('#auth-mobile-input').on('focus keyup', function (event) {
    let valueMobile = $(this).val();

    if (digitRegex.test(valueMobile)) {
        if (valueMobile.startsWith("0") || valueMobile.startsWith("7") || valueMobile.startsWith("9")) {
            let length = valueMobile.startsWith("0") ? 10 : valueMobile.startsWith("7") ? 9 : valueMobile.startsWith("9") ? 11 : 10;
            if (valueMobile.length > length) {
                $(this).val($(this).val().substr(0, length));
            }
        } else {
            $(this).val("");
        }

    } else {
        $(this).val($(this).val().replace(/\D/g, ''));
    }
});
$('#auth-otp-input').on('focus keyup', function (event) {
    let value = $(this).val();

    if (!digitRegex.test(value)) {
        $(this).val($(this).val().replace(/\D/g, ''));
    }
});

function swalHandler(status, text, btnText, title) {
    swal({
        title: title ? title : "",
        text: text,
        icon: status === 1 ? "success" : status === 2 ? "error" : "warning",
        button: btnText ? btnText : "හරි",
    });
}

function checkAuthHandler() {
    let token = localStorage.getItem(STORAGE_TOKEN_NAME);
    return !!token;
}
function getCurrentTokenHandler() {
    return localStorage.getItem(STORAGE_TOKEN_NAME);
}

async function logoutHandler() {
    localStorage.removeItem(STORAGE_TOKEN_NAME);
}
async function loginHandler() {
    $('#auth-modal-wrapper').css("display", "flex");
}

async function recordHandler() {
    $('#recorded-modal').css("display", "flex");
}

function requestOtpAPIHandler(data) {
    spinnerHandler(true);
    $.ajax({
        url: `${BASE_URL}/${BASE_PATH}/users/request/otp`,
        type: "POST",
        method: "POST",
        dataType: "json",
        async: true,
        tryCount: 0,
        retryLimit: 3,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (resp) {
            if(!resp.success){
                swalHandler(2, resp.errorContent);
                return;
            }
            enableOTPView(true,resp.message);
        },
        error: function (err) {
            console.log("err",err)
        },
        complete: function () {
            spinnerHandler(false);
        }
    });
}
function authorizeAPIHandler(data) {
    spinnerHandler(true);
    $.ajax({
        type: "POST",
        url: `${BASE_URL}/${BASE_PATH}/authorize`,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic Y2V5ZW50cmE6'
        },
        dataType: "json",
        crossDomain: true,
        data: data,
        async: true,
        success: function (resp) {
            if(resp.access_token){
                localStorage.setItem(STORAGE_TOKEN_NAME,resp.access_token);
                $('#authModalCloseBtn').trigger('click');
                $('#logout-btn img').attr('src','assets/img/iwath-wanna.png')
            }else{
                swalHandler(2, "අසාර්ථකයි! නැවත උත්සාහ කරන්න");
            }
        },
        error: function (resp) {
            let message = resp && resp.responseJSON && resp.responseJSON.message ? resp.responseJSON.message : "අසාර්ථකයි! නැවත උත්සාහ කරන්න";
            if(message.toLowerCase().indexOf("exception") !== -1){
                message = "යම් දෝෂයක් සිදු වී ඇත. කරුණාකර නැවත උත්සහ කරන්න.";
            }
            swalHandler(2, message);
        },
        complete: function () {
            spinnerHandler(false);
        }
    });
}
function spinnerHandler(condition) {
    if(condition){
        $(`#${SPINNER_ID}`).show();
    }else{
        $(`#${SPINNER_ID}`).hide();
    }
}
function countDown() {
    let authResendOTP = $('#auth-resend-otp');
    if(timeout === 0){
        clearInterval(this.timer);
        authResendOTP.text(`OTP කේතය නොලැබුණිනම්, නැවත ඉල්ලීම මෙතැනින්`);
        authResendOTP.addClass('auth-resend-underline');
        return;
    }
    timeout--;
    authResendOTP.removeClass('auth-resend-underline');
    authResendOTP.text(`00:${timeout > 9 ? timeout : `0${timeout}`}`);
}
$('#auth-resend-otp').click(function () {
    if(timeout === 0){
        $('#authCheckBtn').trigger('click');
    }
});
function iOS() {
    return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
