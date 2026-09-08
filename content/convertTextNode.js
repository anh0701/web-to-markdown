function convertTextNode(
    node,
    context
) {

    const text =
        node.nodeValue || "";

    if (context.preserveWhitespace) {
        return text;
    }

    if (!text.trim()) {

        const previous =
            node.previousSibling;

        const next =
            node.nextSibling;


        const previousInline =
            isInlineElement(previous);

        const nextInline =
            isInlineElement(next);


        if (
            previousInline &&
            nextInline
        ) {
            return " ";
        }


        return "";
    }

    let result =
        text.replace(
            /\s+/g,
            " "
        );

    if (
        node.previousSibling &&
        node.previousSibling.nodeType ===
            Node.ELEMENT_NODE &&
        node.previousSibling.tagName
            .toLowerCase() === "br"
    ) {

        result =
            result.trimStart();
    }

    if (
        node.nextSibling &&
        node.nextSibling.nodeType ===
            Node.ELEMENT_NODE &&
        node.nextSibling.tagName
            .toLowerCase() === "br"
    ) {

        result =
            result.trimEnd();
    }


    return result;
}
