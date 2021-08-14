export class Main {
    static urlParams;
    constructor() {
        Main.urlParams = new URLSearchParams(location.search);
    }
    static ThrowIfNullOrUndefined(variable) {
        if (variable === null || variable === undefined) {
            throw new TypeError(`${variable} is null or undefined`);
        }
        return variable;
    }
}
//# sourceMappingURL=main.js.map