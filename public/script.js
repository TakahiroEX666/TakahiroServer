$(document).ready(function () {
    $(".regione").on("click", function () {
        let regionName = $(this).data("nome-regione");

        // เพิ่มชื่อของเขตที่คลิกเข้าไปในรายการ
        let labelContainer = $("#region-names");
        labelContainer.append(`<div class="region-label">${regionName}</div>`);
    });
});
