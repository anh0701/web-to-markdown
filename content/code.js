function getCodeLanguage(preNode) {

    for (const child of preNode.children) {

        if (
            child.tagName.toLowerCase() !== "code"
        ) {
            continue;
        }

        const className =
            child.getAttribute("class") || "";

        const match =
            className.match(
                /(?:^|\s)(?:language|lang)-([a-zA-Z0-9_+-]+)/
            );

        if (match) {
            return match[1];
        }
    }

    return "";
}