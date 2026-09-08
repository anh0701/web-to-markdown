function convertNode(
    node,
    context = {}
) {

    if (
        node.nodeType ===
        Node.TEXT_NODE
    ) {

        return convertTextNode(
            node,
            context
        );
    }

    if (
        node.nodeType !==
        Node.ELEMENT_NODE
    ) {

        return "";
    }


    const tag =
        node.tagName.toLowerCase();

    if (
        tag === "script" ||
        tag === "style" ||
        tag === "noscript" ||
        tag === "template" ||
        tag === "svg"
    ) {

        return "";
    }

    const content =
        convertChildren(
            node,
            context
        );

    if (
        /^h[1-6]$/.test(tag)
    ) {

        const level =
            Number(
                tag.substring(1)
            );


        return (
            "#".repeat(level) +
            " " +
            content.trim() +
            "\n\n"
        );
    }

    if (tag === "p") {

        const value =
            content.trim();


        if (!value) {
            return "";
        }


        return value + "\n\n";
    }

    if (
        tag === "strong" ||
        tag === "b"
    ) {

        return applyInlineMarker(
            content,
            "**"
        );
    }

    if (
        tag === "em" ||
        tag === "i"
    ) {

        return applyInlineMarker(
            content,
            "*"
        );
    }

    if (tag === "a") {

        const href =
            node.getAttribute(
                "href"
            );


        if (!href) {
            return content;
        }


        const url =
            new URL(
                href,
                document.baseURI
            ).href;


        const text =
            content.trim();


        if (!text) {
            return "";
        }


        return `[${text}](${url})`;
    }

    if (tag === "img") {

        const src =
            node.getAttribute(
                "src"
            );


        if (!src) {
            return "";
        }


        const url =
            new URL(
                src,
                document.baseURI
            ).href;


        const alt =
            node.getAttribute(
                "alt"
            ) || "";


        return `![${alt}](${url})`;
    }

    if (tag === "ul") {

        return (
            convertChildren(
                node,
                {
                    ...context,
                    listDepth:
                        (context.listDepth || 0) + 1
                }
            ) +
            "\n"
        );
    }

    if (tag === "ol") {

        return (
            convertChildren(
                node,
                {
                    ...context,
                    listDepth:
                        (context.listDepth || 0) + 1
                }
            ) +
            "\n"
        );
    }

    if (tag === "li") {

        let normalContent = "";
        let nestedContent = "";


        for (
            const child of node.childNodes
        ) {

            if (
                child.nodeType ===
                Node.ELEMENT_NODE
            ) {

                const childTag =
                    child.tagName.toLowerCase();


                if (
                    childTag === "ul" ||
                    childTag === "ol"
                ) {

                    nestedContent +=
                        convertNode(
                            child,
                            context
                        );

                    continue;
                }
            }


            normalContent +=
                convertNode(
                    child,
                    context
                );
        }


        const parent =
            node.parentElement;


        const parentTag =
            parent
                ? parent.tagName.toLowerCase()
                : "";


        const depth =
            Math.max(
                1,
                context.listDepth || 1
            );


        const indent =
            "  ".repeat(
                depth - 1
            );


        let marker;


        if (parentTag === "ol") {

            const items =
                Array.from(
                    parent.children
                ).filter(
                    child =>
                        child.tagName
                            .toLowerCase() ===
                        "li"
                );


            const index =
                items.indexOf(node) + 1;


            marker =
                `${index}.`;
        }
        else {

            marker = "-";
        }


        return (
            indent +
            marker +
            " " +
            normalContent.trim() +
            "\n" +
            nestedContent
        );
    }

    if (tag === "blockquote") {

        const value =
            content.trim();


        if (!value) {
            return "";
        }


        const lines =
            value.split("\n");


        return (
            lines
                .map(
                    line =>
                        `> ${line}`
                )
                .join("\n") +
            "\n\n"
        );
    }

    if (tag === "br") {
        return "\n";
    }

    if (tag === "hr") {
        return "---\n\n";
    }

    if (tag === "code") {

        if (
            node.parentElement &&
            node.parentElement.tagName
                .toLowerCase() === "pre"
        ) {

            return (
                node.textContent || ""
            );
        }

        return escapeInlineCode(
            node.textContent || ""
        );
    }

    if (tag === "pre") {

        const language =
            getCodeLanguage(
                node
            );


        const rawCode =
            node.textContent || "";


        const code =
            rawCode
                .replace(
                    /^\n/,
                    ""
                )
                .replace(
                    /\n$/,
                    ""
                );


        return (
            "```" +
            language +
            "\n" +
            code +
            "\n" +
            "```\n\n"
        );
    }

    if (tag === "table") {

        const grid =
            convertTableToGrid(
                node,
                context
            );


        return tableGridToMarkdown(
            grid
        );
    }

    if (
        tag === "td" ||
        tag === "th"
    ) {

        return content.trim();
    }

    if (tag === "tr") {

        const cells =
            Array.from(
                node.children
            )
                .filter(
                    child => {

                        const childTag =
                            child.tagName
                                .toLowerCase();

                        return (
                            childTag === "td" ||
                            childTag === "th"
                        );
                    }
                )
                .map(
                    child =>
                        convertNode(
                            child,
                            context
                        )
                );


        return (
            "| " +
            cells.join(" | ") +
            " |\n"
        );
    }

    if (
        tag === "div" ||
        tag === "section" ||
        tag === "article" ||
        tag === "main" ||
        tag === "header" ||
        tag === "footer" ||
        tag === "aside"
    ) {

        const value =
            content.trim();

        if (!value) {
            return "";
        }

        return value + "\n\n";
    }

    return content;
}
