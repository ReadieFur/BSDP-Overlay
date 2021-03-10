export class Main
{
    public static urlParams: URLSearchParams;

    constructor()
    {
        Main.urlParams = new URLSearchParams(location.search);
    }

    public static ThrowIfNullOrUndefined(variable: any): any
    {
        if (variable === null || variable === undefined) { throw new TypeError(`${variable} is null or undefined`); }
        return variable;
    }
}