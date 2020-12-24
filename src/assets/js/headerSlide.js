let header;

window.addEventListener("load", () =>
{
    let style = document.createElement("style");
    style.innerHTML = `
        #header
        {
            transition: top ease 100ms, background-color ease 100ms;
            position: fixed;
            background-color: rgb(var(--backgroundAlt)) !important;
        }

        .dropdownContent > :last-child { background-color: rgba(var(--background), 0.5) !important; }

        .slideMenuClick
        {
            user-select: none; cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    header = document.querySelector("#header");
    header.addEventListener("mouseleave", hideHeader);
    hideHeader();

    document.querySelectorAll(".slideMenuClick").forEach(e => { e.addEventListener("click", showHeader); });

    function showHeader() { header.style.top = "0px"; }
    function hideHeader() { header.style.top = "-100px"; }
});