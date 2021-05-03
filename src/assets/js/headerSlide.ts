import { Main } from "./main.js";

export class HeaderSlide
{
    constructor()
    {
        let style = document.createElement("style");
        style.innerHTML = `
            #header
            {
                transition: top ease 100ms, background-color ease 400ms;
                position: fixed;
                background-color: rgba(var(--backgroundAltColour), 1) !important;
            }
    
            .dropdownContent > :last-child { background-color: rgba(var(--backgroundAltColour), 0.5) !important; }
        `;
        document.head.appendChild(style);
    
        Main.header.addEventListener("mouseleave", () => { this.HideHeader(); });
        this.HideHeader();
    
        document.querySelectorAll(".slideMenu, ._slideMenu").forEach((e: Element) => { e.addEventListener("click", () => { this.ShowHeader(); }); });
    }

    private ShowHeader()
    {
        Main.header.style.top = "0px";
    }

    private HideHeader()
    {
        Main.header.style.top = "-100px";
    }
}