// pagination
let currentPage = 1;
let totalPage = 1;
$('#pagination-next').hide();
$('#pagination-pre').hide();
function refreshPaginationButtons() {
    $('#pagination-next').show();
    $('#pagination-pre').show();
    ////ALL_ADD | NEXT | PREVIOUS
    let paginationStatus = "";
    if(currentPage === 0){
        currentPage = 1;
    }

    if (totalPage > 1 && currentPage === 1) { //example: total: 5 , current: 1
        paginationStatus = "PREVIOUS";
    } else if (totalPage === 1 && currentPage === 1) { //example: total:1 , current 1 (only one page)
        paginationStatus = "ALL_ADD";
    } else if (totalPage > 1 && currentPage === totalPage) { //example: total: 5 , current 5 (last page)
        paginationStatus = "NEXT";
    } else if( totalPage < currentPage ){ //invalid logic
        paginationStatus = "ALL_ADD";
    }

    if (totalPage > 0) {
        $('#pagination-text').text(`පිටු ගණන ${currentPage}/${totalPage}`);
    }

    let buttonNext = $('#pagination-next');
    buttonNext.removeClass('disabled-btn');
    buttonNext.prop('disabled', false);

    let buttonPre = $('#pagination-pre');
    buttonPre.prop('disabled', false);
    buttonPre.removeClass('disabled-btn');


    if (paginationStatus === "ALL_ADD") {
        buttonNext.addClass('disabled-btn');
        buttonNext.prop('disabled', true);

        buttonPre.prop('disabled', true);
        buttonPre.addClass('disabled-btn');
        return;
    }
    if (paginationStatus === "NEXT") {
        buttonNext.prop('disabled', true);
        buttonNext.addClass('disabled-btn');
        return;
    }
    if (paginationStatus === "PREVIOUS") {
        buttonPre.prop('disabled', true);
        buttonPre.addClass('disabled-btn');
    }
}
