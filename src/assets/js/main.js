export class Main {
    constructor() {
        Main.WEB_ROOT = WEB_ROOT;
        Main.urlParams = new URLSearchParams(location.search);
        window.addEventListener("DOMContentLoaded", () => { this.DOMContentLoadedEvent(); });
        window.addEventListener("load", () => { this.WindowLoadEvent(); });
    }
    DOMContentLoadedEvent() {
        Main.header = Main.ThrowIfNullOrUndefined(document.querySelector("#header"));
        Main.footer = Main.ThrowIfNullOrUndefined(document.querySelector("#footer"));
        if (Main.RetreiveCache("READIE-DARK") != "false") {
            Main.DarkTheme(true);
        }
        else {
            Main.DarkTheme(false);
        }
        document.querySelector("#darkMode").addEventListener("click", () => {
            var cachedValue = Main.RetreiveCache("READIE-DARK");
            if (cachedValue == undefined || cachedValue == "false") {
                Main.DarkTheme(true);
            }
            else {
                Main.DarkTheme(false);
            }
        });
        this.HighlightActivePage();
    }
    WindowLoadEvent() {
        let staticStyles = document.createElement("style");
        staticStyles.innerHTML = `
            *
            {
                transition:
                    background 400ms ease 0s,
                    background-color 400ms ease 0s,
                    color 100ms ease 0s;
            }
        `;
        document.head.appendChild(staticStyles);
    }
    HighlightActivePage() {
        let path = window.location.pathname.split("/").filter((el) => { return el != ""; });
        for (let i = 0; i < path.length; i++) {
            path[i] = path[i].replace("_", "");
        }
        Main.ThrowIfNullOrUndefined(document.querySelector("#header")).querySelectorAll("a").forEach((element) => {
            if (element.href == window.location.href) {
                element.classList.add("accentText");
                let whyIsThisSoFarBack = element.parentElement?.parentElement?.parentElement;
                if (whyIsThisSoFarBack !== null || whyIsThisSoFarBack !== undefined) {
                    if (whyIsThisSoFarBack.classList.contains("naviDropdown")) {
                        whyIsThisSoFarBack.firstElementChild.classList.add("accentText");
                    }
                }
            }
        });
    }
    static ThrowIfNullOrUndefined(variable) {
        if (variable === null || variable === undefined) {
            throw new TypeError(`${variable} is null or undefined`);
        }
        return variable;
    }
    static DarkTheme(dark) {
        Main.SetCache("READIE-DARK", dark ? "true" : "false", 365);
        var darkButton = Main.ThrowIfNullOrUndefined(document.querySelector("#darkMode"));
        var themeColours = Main.ThrowIfNullOrUndefined(document.querySelector("#themeColours"));
        if (dark) {
            darkButton.classList.add("accentText");
        }
        else {
            darkButton.classList.remove("accentText");
        }
        themeColours.innerHTML = `
            :root
            {
                --foregroundColour: ${dark ? "255, 255, 255" : "0, 0, 0"};
                --backgroundColour: ${dark ? "13, 17, 23" : "255, 255, 255"};
                --backgroundAltColour: ${dark ? "22, 27, 34" : "225, 225, 225"};
                --accentColour: 100, 0, 255;
            }
        `;
    }
    static RetreiveCache(cookie_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == cookie_name) {
                return unescape(y);
            }
        }
        return "";
    }
    static SetCache(cookie_name, value, time, path = '/') {
        var hostSplit = window.location.host.split(".");
        var domain = `readie.global-gaming.${hostSplit[hostSplit.length - 1]}`;
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + time);
        document.cookie = `${cookie_name}=${value}; expires=${expDate.toUTCString()}; path=${path}; domain=${domain};`;
    }
    static ThrowAJAXJsonError(data) { throw new TypeError(`${data} could not be steralised`); }
    static Alert(message) {
        window.alert(message);
    }
}
//# sourceMappingURL=main.js.map