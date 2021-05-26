// තොරණේ එක් එක් කොටුවට පිවිසීමෙන් එදා විශාලා මහනුවර තුන් බිය දුරු කෙරූ කතාව ඔබට මෙතැන් සිට නැරඹිය හැකිය

document.getElementById('spinner').style.display = 'block';
let rctoken = "";
document.getElementById('pause').style.display = 'none';
document.getElementById('play').style.display = 'none';

window.onload = function () {
    document.getElementById('spinner').style.display = 'none';
    swal({
        title: "",
        text: "තොරණේ එක් එක් කොටුවට පිවිසීමෙන් එදා විශාලා මහනුවර තුන් බිය දුරු කෙරූ කතාව ඔබට මෙතැන් සිට නැරඹිය හැකිය",
        // icon:,
        button:  "හරි",
    }).then((value) => {
        if(value){
            playAudio('./audio-tracks/00.mp3');
        }
    });
    checkLoginStatus();
    // checkButton ();
};

//check if access token exists
function checkLoginStatus() {
    let authResult = checkAuthHandler();
    if (!authResult) {
        getWishesWithoutLogin();
    } else {
        getWishesWithLogin();

    }
};

/**
 * check character length
 */
$(function() {
    $('#wish').keyup(function() {
        var txtlen = $(this).val().length;
        $('#length').text(txtlen);
    });
});

//-----------------get wishes without login-----------------------------
function getWishesWithoutLogin() {
    $.ajax({
        url: `${BASE_URL}/${BASE_PATH}/wish/get`,
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
        data:{index:0, size: 100},
    }).done((res) => {
        if (res.success) {
            const wishesWithoutLoginArray = res.body.thoran_wish_list;
            let wishesWithoutUser;
            let username;
            let wish;
            console.log(wishesWithoutLoginArray);

            let wishString = "";
            for (i = 0; i < wishesWithoutLoginArray.length; i++) {
                username = wishesWithoutLoginArray[i].userName;
                wishesWithoutUser =  wishesWithoutLoginArray[i].wish;
                wish = wishesWithoutUser+ " "+"-" +" "+ username+" "+"|";
                wishString = wishString+  "&nbsp&nbsp" + wish;

                console.log('without login wishes', wish)
            }
             document.getElementById('pathum').innerHTML = wishString;

        } else {

        }
    }).fail(() => {

    });
    document.getElementById('spinner').style.display = 'none';
}
//-----------------get wishes with login-----------------------------
function getWishesWithLogin() {
    $.ajax({
        url: `${BASE_URL}/${BASE_PATH}/wish/user/wish`,
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            index: 0,
            size: 100,
        },
        headers: { "Authorization": `Bearer ${getCurrentTokenHandler()}`
        }
    }).done((res) => {
        if (res.success) {
            const wishesWithLoginArray = res.body.thoran_wish_list;
            let wishesUser;
            let username;
            let wish;
            console.log(wishesWithLoginArray);

            let wishString = "";
            for (i = 0; i < wishesWithLoginArray.length; i++) {
                username = wishesWithLoginArray[i].userName;
                wishesUser =  wishesWithLoginArray[i].wish;
                wish = wishesUser+ " "+"-" +" "+ username+" "+"|";
                wishString = wishString + "&nbsp&nbsp" + wish;
            }
            document.getElementById('pathum').innerHTML = wishString;
            //console.log(document.getElementById('pathum').innerHTML);
        } else {

        }
    }).fail(() => {

    });
}


function checkStatus() {
    let authResult = checkAuthHandler();
    if (!authResult) {
        loginHandler();
    } else {
        $("#submitAWishModel").modal();
    }

}

//------------------ Submit a wish ---------------------------------------
function submitWish() {
    const wish = document.getElementById("wish").value;
    if(wish.trim().length === 0) {
        swalHandler(3, 'සුභ පැතීම එක් කිරීම අනිවාර්ය වේ.');
        return;
    }
    if(wish.trim().length > 100) {
        swalHandler(3, 'වචන සීමාව ඉක්මවා ඇත.');
        return;
    }
        // grecaptcha.ready(function () {
        //     grecaptcha
        //         .execute(`${RECAPTURE_SITE_KEY}`, {
        //             action: "validate_captcha",
        //         })
        //         .then(function (rctoken) {
                    spinnerHandler(true);
                    $.ajax({
                        url: `${BASE_URL}/${BASE_PATH}/wish/upload`,
                        type: "PUT",
                        method: "PUT",
                        dataType: "json",
                        async: true,
                        tryCount: 0,
                        retryLimit: 3,
                        data: JSON.stringify({
                            wish: wish
                        }),
                        headers: {
                            "Rctoken": "",
                            "Authorization": `Bearer ${getCurrentTokenHandler()}`,
                            'Content-Type': 'application/json',
                        },
                        success: function (resp) {
                            if(resp.success){
                                $("#submitAWishModel").modal('hide');
                                swalHandler(1, resp.message);
                                getWishesWithLogin();
                            }else{
                                swalHandler(2, resp.errorContent);
                            }
                        },
                        error: function (err) {
                            swalHandler(2, "අසාර්ථකයි! නැවත උත්සාහ කරන්න");
                        },
                        complete: function () {
                            spinnerHandler(false);
                        }
                    });
        //         })
        //         .catch(err => {
        //             console.log("grecaptcha err",err);
        //             spinnerHandler(false);
        //             swalHandler(2, "ඔබව තහවුරු කරගැනීමට නොහැක. නැවත උත්සාහ කරන්න");
        //         })
        // });
}

var audio = document.getElementById('audio');
var source = document.getElementById('audioSource');
var path = "";

function playAudio(pathName) {
    if (audio.paused) {
        source.src = pathName;
        path = pathName;
        audio.load();
        audio.play();
        document.getElementById('play').style.display = 'none';
        document.getElementById('pause').style.display = 'block';
    } else if (path != pathName) {
        audio.pause();
        source.src = pathName;
        path = pathName;
        audio.load();
        audio.play();
        document.getElementById('play').style.display = 'none';
        document.getElementById('pause').style.display = 'block';
    } else {
        audio.pause();
        document.getElementById('play').style.display = 'block';
        document.getElementById('pause').style.display = 'none';
    }


}
function pauseAudio() {
    document.getElementById('play').style.display = 'block';
    document.getElementById('pause').style.display = 'none';
    audio.pause();
}
