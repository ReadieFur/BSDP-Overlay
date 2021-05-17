import { Main } from "../assets/js/main.js";
import { MarkdownParser } from "../assets/js/mdParser.js";

class Index
{
    aboutContainer: HTMLElement;

    constructor()
    {
        new Main(); //Must be loaded first on every page.
        
        this.aboutContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#about"));

        MarkdownParser.ParseFromURL("../assets/md/about.md").then((html) => { if (typeof(html) === "string") { this.aboutContainer.innerHTML = html; } });
    }
}
new Index();