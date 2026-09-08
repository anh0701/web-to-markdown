function escapeTableCell(
    content
) {

    return content.replace(
        /\|/g,
        "\\|"
    );
}

function getHeaderType(
    cell
) {

    if (!cell.isHeader) {
        return "none";
    }


    if (cell.headerType) {
        return cell.headerType;
    }


    if (cell.scope === "col") {
        return "column";
    }


    if (cell.scope === "row") {
        return "row";
    }


    if (cell.section === "thead") {
        return "column";
    }


    return "unknown";
}

function convertTableToGrid(
    tableNode,
    context
) {

    const grid = [];

    const rows = [];

    for (
        const child of tableNode.children
    ) {

        const tag =
            child.tagName.toLowerCase();

        if (tag === "thead") {

            for (
                const row of child.children
            ) {

                if (
                    row.tagName.toLowerCase() ===
                    "tr"
                ) {

                    rows.push({
                        node: row,
                        section: "thead"
                    });
                }
            }
        }

        else if (tag === "tbody") {

            for (
                const row of child.children
            ) {

                if (
                    row.tagName.toLowerCase() ===
                    "tr"
                ) {

                    rows.push({
                        node: row,
                        section: "tbody"
                    });
                }
            }
        }

        else if (tag === "tfoot") {

            for (
                const row of child.children
            ) {

                if (
                    row.tagName.toLowerCase() ===
                    "tr"
                ) {

                    rows.push({
                        node: row,
                        section: "tfoot"
                    });
                }
            }
        }

        else if (tag === "tr") {

            rows.push({
                node: child,
                section: "direct"
            });
        }
    }

    for (
        let rowIndex = 0;
        rowIndex < rows.length;
        rowIndex++
    ) {

        const rowInfo =
            rows[rowIndex];


        const row =
            rowInfo.node;


        if (!grid[rowIndex]) {
            grid[rowIndex] = [];
        }


        let columnIndex = 0;

        for (
            const cell of row.children
        ) {

            const tag =
                cell.tagName.toLowerCase();


            if (
                tag !== "td" &&
                tag !== "th"
            ) {
                continue;
            }

            while (
                grid[rowIndex][
                columnIndex
                ] !== undefined
            ) {

                columnIndex++;
            }

            const content =
                convertNode(
                    cell,
                    context
                );

            const isHeader =
                tag === "th";

            const scope =
                cell.getAttribute(
                    "scope"
                );

            const colspan =
                Math.max(
                    1,
                    parseInt(
                        cell.getAttribute(
                            "colspan"
                        ) || "1",
                        10
                    )
                );

            const rowspan =
                Math.max(
                    1,
                    parseInt(
                        cell.getAttribute(
                            "rowspan"
                        ) || "1",
                        10
                    )
                );

            const cellData = {

                content,

                isHeader,

                scope,

                section:
                    rowInfo.section,

                originalColumn:
                    columnIndex,

                originalRow:
                    rowIndex
            };

            grid[rowIndex][
                columnIndex
            ] = cellData;

            for (
                let c = 1;
                c < colspan;
                c++
            ) {

                grid[rowIndex][
                    columnIndex + c
                ] = {

                    content: "",

                    isHeader: false,

                    scope: null,

                    section:
                        rowInfo.section,

                    originalColumn:
                        columnIndex + c,

                    originalRow:
                        rowIndex,

                    spanned: true,

                    spanSource:
                        cellData
                };
            }

            for (
                let r = 1;
                r < rowspan;
                r++
            ) {

                const targetRow =
                    rowIndex + r;


                if (!grid[targetRow]) {
                    grid[targetRow] = [];
                }

                for (
                    let c = 0;
                    c < colspan;
                    c++
                ) {

                    const targetColumn =
                        columnIndex + c;


                    grid[targetRow][
                        targetColumn
                    ] = {

                        content: "",

                        isHeader: false,

                        scope: null,

                        section:
                            rowInfo.section,

                        originalColumn:
                            targetColumn,

                        originalRow:
                            targetRow,

                        spanned: true,

                        spanSource:
                            cellData
                    };
                }
            }

            columnIndex += colspan;
        }
    }


    return grid;
}

function tableGridToMarkdown(
    grid
) {

    if (!grid.length) {
        return "";
    }

    let columnCount = 0;


    for (const row of grid) {

        columnCount =
            Math.max(
                columnCount,
                row.length
            );
    }


    for (const row of grid) {

        while (
            row.length <
            columnCount
        ) {

            row.push({

                content: "",

                isHeader: false,

                scope: null,

                section: null,

                originalColumn:
                    row.length,

                originalRow:
                    grid.indexOf(row),

                spanned: false,

                spanSource: null
            });
        }
    }

    for (
        let rowIndex = 0;
        rowIndex < grid.length;
        rowIndex++
    ) {

        const row =
            grid[rowIndex];


        for (
            let columnIndex = 0;
            columnIndex < row.length;
            columnIndex++
        ) {

            const cell =
                row[columnIndex];


            if (
                getHeaderType(cell) !==
                "unknown"
            ) {
                continue;
            }

            if (rowIndex === 0) {

                cell.headerType =
                    "column";

                continue;
            }

            if (columnIndex === 0) {

                cell.headerType =
                    "row";

                continue;
            }

            cell.headerType =
                "column";
        }
    }

    let headerIndex = -1;

    for (
        let rowIndex = 0;
        rowIndex < grid.length;
        rowIndex++
    ) {

        const row =
            grid[rowIndex];


        const hasThead =
            row.some(
                cell =>
                    cell.section ===
                    "thead"
            );


        if (hasThead) {

            headerIndex =
                rowIndex;
        }
    }

    if (headerIndex === -1) {

        for (
            let rowIndex = 0;
            rowIndex < grid.length;
            rowIndex++
        ) {

            const row =
                grid[rowIndex];


            const hasColumnHeader =
                row.some(
                    cell =>
                        getHeaderType(cell) ===
                        "column"
                );


            if (hasColumnHeader) {

                headerIndex =
                    rowIndex;

                break;
            }
        }
    }

    if (headerIndex === -1) {

        // Table has no real header.
        // Create a synthetic header row instead
        // of modifying the first data row.

        const generatedHeader = [];

        for (
            let columnIndex = 0;
            columnIndex < columnCount;
            columnIndex++
        ) {

            generatedHeader.push({
                content: `Column ${columnIndex + 1}`,
                section: "generated",
                headerType: "column"
            });
        }

        // Insert generated header BEFORE
        // all real data rows.
        grid.unshift(generatedHeader);

        headerIndex = 0;
    }

    let result = "";


    for (
        let rowIndex = 0;
        rowIndex < grid.length;
        rowIndex++
    ) {

        const row =
            grid[rowIndex];


        const values =
            row.map(cell => {

                return escapeTableCell(
                    cell.content.trim()
                );
            });


        result +=
            "| " +
            values.join(" | ") +
            " |\n";

        if (
            rowIndex === headerIndex
        ) {

            result +=
                "| " +
                row.map(
                    () => "---"
                ).join(" | ") +
                " |\n";
        }
    }


    return result + "\n";
}
