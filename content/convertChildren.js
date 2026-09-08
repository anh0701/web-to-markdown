function convertChildren(
    node,
    context
) {

    let result = "";


    for (
        const child of node.childNodes
    ) {

        result +=
            convertNode(
                child,
                context
            );
    }


    return result;
}