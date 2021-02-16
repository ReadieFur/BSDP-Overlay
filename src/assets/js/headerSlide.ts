import { Main } from "./main";

export class HeaderSlide
{
    constructor()
    {
        window.addEventListener("load", () => { this.WindowLoadEvent(); });
    }

    private WindowLoadEvent()
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
    
        Main.header.addEventListener("mouseleave", () => { this.HideHeader(); });
        this.HideHeader();
    
        document.querySelectorAll(".slideMenu").forEach((e: Element) => { e.addEventListener("click", () => { this.ShowHeader(); }); });
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