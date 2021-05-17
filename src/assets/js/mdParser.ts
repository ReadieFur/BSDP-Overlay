export class MarkdownParser
{
    public static async ParseFromURL(url: string): Promise<string | false>
    {
        var markdown: string | false = await jQuery.ajax(
        {
            url: url,
            method: "GET",
            dataType: "text",
        })
        .catch((ex) => { return false; });

        if (typeof(markdown) !== "string") { return false; }

        return MarkdownParser.Parse(markdown, url);
    }

    public static Parse(markdown: string, relativeURL?: string): string | false
    {
        //var relativeURLSplit = relativeURL !== undefined ? relativeURL.split('/') : null;

        //This table parser currently will only be able to make one type of table (| --- |)
        var lines = markdown.split(/\r?\n/);
        var newLines: string[] = [];
        var replaceIDs: [string, string][] = []; //ID, value.
        for (let i = 0; i < lines.length; i++)
        {
            //Convert the lines to a table.
            if (
                (
                    lines[i].startsWith("| --- |") ||
                    lines[i].startsWith("| :-- |") ||
                    lines[i].startsWith("| --: |")
                ) &&
                lines[i - 1].startsWith("|") &&
                lines[i + 1].startsWith("|")
            )
            {
                var mdHeaderColumn = lines[i - 1].split("|").filter(column => column !== "");
                var mdColumnLayout = lines[i].split("|").filter(column => column !== "");
                var mdRows: string[] = [];
                while (lines[++i].startsWith("|")) { mdRows.push(lines[i]); }

                var columnLayout: ("left" | "center" | "right")[] = [];
                mdColumnLayout.forEach(position =>
                {
                    switch (position)
                    {
                        /*case " :-- ":
                            //Left
                            rowLayout.push("left");
                            break;*/
                        case " --- ":
                            //Center
                            columnLayout.push("center");
                            break;
                        case " --: ":
                            //Right
                            columnLayout.push("right");
                            break;
                        default:
                            columnLayout.push("left");
                            break;
                    }
                });

                var counter = 0;
                var headerRow = document.createElement("tr");
                mdHeaderColumn.forEach(columnContent =>
                {
                    var cell = document.createElement("th");
                    cell.style.textAlign = columnLayout[counter];
                    cell.innerHTML = marked.parse(columnContent);
                    headerRow.appendChild(cell);

                    if (++counter >= columnLayout.length) { counter = 0; }
                });

                counter = 0;
                var columns: HTMLTableDataCellElement[] = [];
                mdRows.forEach(rowsString =>
                {
                    var mdColumns = rowsString.split("|").filter(column => column !== "");
                    
                    mdColumns.forEach(columnContent =>
                    {
                        var cell = document.createElement("td");
                        cell.style.textAlign = columnLayout[counter];
                        cell.innerHTML = marked.parse(columnContent);
                        columns.push(cell);

                        if (++counter >= columnLayout.length) { counter = 0; }
                    });
                });

                var tbody = document.createElement("tbody");
                tbody.appendChild(headerRow);

                counter = 0;
                var row: HTMLTableRowElement = document.createElement("tr");
                columns.forEach(column =>
                {
                    row.appendChild(column);

                    if (++counter >= columnLayout.length)
                    {
                        counter = 0;
                        tbody.appendChild(row);
                        row = document.createElement("tr");
                    }
                });

                var table = document.createElement("table");
                table.appendChild(tbody);

                var id: string
                while(true)
                {
                    id = Math.ceil(Math.random() * Date.now()).toString();
                    var match = true;
                    for (const line of lines) { match = line.indexOf(id) == -1 ? false : true; }
                    if (!match) { break; }
                }
                replaceIDs.push([id, table.outerHTML]);
                newLines.push(id);
                //newLines.push(table.outerHTML);
            }
            //Skip because the next line is a table.
            else if (
                (lines[i + 1] !== undefined && lines[i + 2] !== undefined) &&
                (
                    lines[i + 1].startsWith("| --- |") ||
                    lines[i + 1].startsWith("| :-- |") ||
                    lines[i + 1].startsWith("| --: |")
                ) &&
                lines[i + 2].startsWith("|")
            )
            { continue; }
            //Add the unchanged line to the array.
            else { newLines.push(lines[i]); }
        }
        markdown = newLines.join("\n");

        var parsedReadme = marked.parse(markdown);
        replaceIDs.forEach(keyValue => { parsedReadme = parsedReadme.replace(keyValue[0], keyValue[1]); });

        var tmpContainer = document.createElement("div");
        tmpContainer.innerHTML = parsedReadme;

        tmpContainer.querySelectorAll("img").forEach(element =>
        {
            /*if (relativeURLSplit !== undefined && (element.getAttribute("src")??"").startsWith("./"))
            {
                //Not yet implemented.
            }*/

            if (element.previousElementSibling !== null) { (<HTMLElement>element.previousElementSibling).style.marginBottom = "0"; }
            
            element.insertAdjacentElement("beforebegin", document.createElement("br"));
        });

        return tmpContainer.innerHTML;
    }
}