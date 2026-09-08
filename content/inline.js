function wrapInlineMarkdown(
    marker,
    content
) {

    const value =
        content.trim();

    if (!value) {
        return "";
    }

    return `${marker}${value}${marker}`;
}

function isInlineElement(node) {

    if (
        !node ||
        node.nodeType !==
            Node.ELEMENT_NODE
    ) {
        return false;
    }


    const inlineTags = new Set([
        "a",
        "abbr",
        "b",
        "bdi",
        "bdo",
        "cite",
        "code",
        "del",
        "em",
        "i",
        "img",
        "ins",
        "kbd",
        "mark",
        "q",
        "s",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "time",
        "u",
        "var"
    ]);


    return inlineTags.has(
        node.tagName.toLowerCase()
    );
}

function escapeInlineCode(
    content
) {

    const value =
        content.trim();


    if (!value) {
        return "";
    }

    const matches =
        value.match(/`+/g) || [];


    let maxBackticks = 0;


    for (const match of matches) {

        maxBackticks =
            Math.max(
                maxBackticks,
                match.length
            );
    }

    const delimiter =
        "`".repeat(
            maxBackticks + 1
        );
        
    const needsPadding =
        value.startsWith(" ") ||
        value.endsWith(" ");


    const contentWithPadding =
        needsPadding
            ? ` ${value} `
            : value;


    return (
        delimiter +
        contentWithPadding +
        delimiter
    );
}

function applyInlineMarker(
    content,
    marker
) {

    const value =
        content.trim();


    if (!value) {
        return "";
    }


    return (
        marker +
        value +
        marker
    );
}
