import { ElementsJSON } from "./ui.ts.js";

export class editor
{
    private ImportedElements: ElementsJSON;

    constructor(_importedElements: ElementsJSON)
    {
        this.ImportedElements = _importedElements;
    }
}