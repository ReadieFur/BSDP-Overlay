window.addEventListener('DOMContentLoaded', (event) =>
{
    var head = document.querySelector("#head");
    $.ajax(
    {
        url: "/bsdp-overlay/assets/html/head.html",
        dataType: "html",
        success: (data) => { head.innerHTML = head.innerHTML + data; }
    });
    $("#header").load("/bsdp-overlay/assets/html/header.html");
    $("#footer").load("/bsdp-overlay/assets/html/footer.html");
});