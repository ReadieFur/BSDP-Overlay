import { Main } from "./main";
export class HeaderSlide {
    constructor() {
        window.addEventListener("load", () => { this.WindowLoadEvent(); });
    }
    WindowLoadEvent() {
        let style = document.createElement("style");
        style.innerHTML = `
            #header
            {
                transition: top ease 100ms, background-color ease 100ms;
                position: fixed;
                background-color: rgba(var(--backgroundAltColour), 1) !important;
            }
    
            .dropdownContent > :last-child { background-color: rgba(var(--backgroundAltColour), 0.5) !important; }
        `;
        document.head.appendChild(style);
        Main.header.addEventListener("mouseleave", () => { this.HideHeader(); });
        this.HideHeader();
        document.querySelectorAll(".slideMenu").forEach((e) => { e.addEventListener("click", () => { this.ShowHeader(); }); });
    }
    ShowHeader() {
        Main.header.style.top = "0px";
    }
    HideHeader() {
        Main.header.style.top = "-100px";
    }
}
//# sourceMappingURL=headerSlide.js.map