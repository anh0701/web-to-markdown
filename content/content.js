console.log(
    "Web to Markdown content script loaded"
);


let selectionMode = false;

let floatingButton = null;

let selectionHint = null;

chrome.runtime.onMessage.addListener(
    (
        message,
        sender,
        sendResponse
    ) => {

        if (
            message.type ===
            "GET_PAGE_CONTENT"
        ) {

            const markdown =
                cleanMarkdown(
                    convertNode(
                        document.body,
                        {
                            listDepth: 0
                        }
                    )
                );


            sendResponse({
                title:
                    document.title,

                markdown
            });
        }

        if (
            message.type ===
            "START_SELECTION_MODE"
        ) {

            startSelectionMode();
        }


        return true;
    }
);

function startSelectionMode() {

    selectionMode = true;


    showSelectionHint();


    document.body.style.cursor =
        "text";


    console.log(
        "Selection mode started"
    );
}

function showSelectionHint() {

    removeSelectionHint();


    selectionHint =
        document.createElement(
            "div"
        );


    selectionHint.textContent =
        "Select the content you want to convert";


    selectionHint.style.position =
        "fixed";

    selectionHint.style.top =
        "20px";

    selectionHint.style.left =
        "50%";

    selectionHint.style.transform =
        "translateX(-50%)";

    selectionHint.style.zIndex =
        "999999999";

    selectionHint.style.padding =
        "10px 18px";

    selectionHint.style.background =
        "#1e293b";

    selectionHint.style.color =
        "white";

    selectionHint.style.borderRadius =
        "8px";

    selectionHint.style.fontSize =
        "14px";

    selectionHint.style.fontFamily =
        "Arial, sans-serif";

    selectionHint.style.boxShadow =
        "0 4px 15px rgba(0,0,0,0.25)";


    document.body.appendChild(
        selectionHint
    );
}

function removeSelectionHint() {

    if (selectionHint) {

        selectionHint.remove();

        selectionHint = null;
    }
}

document.addEventListener(
    "mouseup",
    event => {

        if (!selectionMode) {
            return;
        }


        // Chờ browser cập nhật selection
        setTimeout(
            () => {

                const selection =
                    window.getSelection();


                if (
                    !selection ||
                    selection.isCollapsed
                ) {

                    removeFloatingButton();

                    return;
                }


                const text =
                    selection
                        .toString()
                        .trim();


                if (!text) {

                    removeFloatingButton();

                    return;
                }


                showFloatingButton(
                    event.clientX,
                    event.clientY
                );

            },
            10
        );
    }
);

function showFloatingButton(
    x,
    y
) {

    removeFloatingButton();


    floatingButton =
        document.createElement(
            "button"
        );


    floatingButton.textContent =
        "Convert to Markdown";


    floatingButton.style.position =
        "fixed";


    floatingButton.style.left =
        `${x}px`;


    floatingButton.style.top =
        `${y + 15}px`;


    floatingButton.style.zIndex =
        "999999999";


    floatingButton.style.padding =
        "10px 16px";


    floatingButton.style.border =
        "none";


    floatingButton.style.borderRadius =
        "8px";


    floatingButton.style.background =
        "#2563eb";


    floatingButton.style.color =
        "white";


    floatingButton.style.cursor =
        "pointer";


    floatingButton.style.fontWeight =
        "bold";


    floatingButton.style.fontSize =
        "13px";


    floatingButton.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.25)";


    floatingButton.addEventListener(
        "mousedown",
        event => {

            event.preventDefault();
        }
    );


    floatingButton.addEventListener(
        "click",
        () => {

            convertSelectedContent();
        }
    );


    document.body.appendChild(
        floatingButton
    );
}

function removeFloatingButton() {

    if (floatingButton) {

        floatingButton.remove();

        floatingButton = null;
    }
}

function convertSelectedContent() {

    const selection =
        window.getSelection();


    if (
        !selection ||
        selection.rangeCount === 0 ||
        selection.isCollapsed
    ) {

        return;
    }


    const range =
        selection.getRangeAt(0);


    const container =
        document.createElement(
            "div"
        );

    container.appendChild(
        range.cloneContents()
    );


    const markdown =
        cleanMarkdown(
            convertNode(
                container,
                {
                    listDepth: 0
                }
            )
        );


    console.log(
        "Selected Markdown:",
        markdown
    );

    showMarkdownModal(
        markdown
    );

    selectionMode = false;


    document.body.style.cursor =
        "";


    removeFloatingButton();

    removeSelectionHint();
}

function showMarkdownModal(
    markdown
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.style.position =
        "fixed";

    overlay.style.top =
        "0";

    overlay.style.left =
        "0";

    overlay.style.width =
        "100vw";

    overlay.style.height =
        "100vh";

    overlay.style.zIndex =
        "999999999";

    overlay.style.background =
        "rgba(0, 0, 0, 0.5)";

    overlay.style.display =
        "flex";

    overlay.style.alignItems =
        "center";

    overlay.style.justifyContent =
        "center";


    const modal =
        document.createElement(
            "div"
        );


    modal.style.width =
        "650px";

    modal.style.maxWidth =
        "90vw";

    modal.style.maxHeight =
        "90vh";

    modal.style.padding =
        "20px";

    modal.style.background =
        "white";

    modal.style.borderRadius =
        "12px";

    modal.style.display =
        "flex";

    modal.style.flexDirection =
        "column";

    modal.style.gap =
        "12px";

    const title =
        document.createElement(
            "div"
        );


    title.textContent =
        "Markdown Result";


    title.style.fontSize =
        "18px";


    title.style.fontWeight =
        "bold";

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        markdown;


    textarea.style.width =
        "100%";


    textarea.style.height =
        "400px";


    textarea.style.resize =
        "vertical";


    textarea.style.padding =
        "12px";


    textarea.style.fontFamily =
        "monospace";


    textarea.style.fontSize =
        "13px";

    const actions =
        document.createElement(
            "div"
        );


    actions.style.display =
        "flex";


    actions.style.justifyContent =
        "flex-end";


    actions.style.gap =
        "10px";


    const copyButton =
        document.createElement(
            "button"
        );


    copyButton.textContent =
        "Copy";


    copyButton.style.padding =
        "8px 16px";


    copyButton.style.border =
        "none";


    copyButton.style.borderRadius =
        "6px";


    copyButton.style.background =
        "#2563eb";


    copyButton.style.color =
        "white";


    copyButton.style.cursor =
        "pointer";


    copyButton.addEventListener(
        "click",
        async () => {

            await navigator
                .clipboard
                .writeText(
                    textarea.value
                );


            copyButton.textContent =
                "Copied!";


            setTimeout(
                () => {

                    copyButton.textContent =
                        "Copy";

                },
                1500
            );
        }
    );

    const closeButton =
        document.createElement(
            "button"
        );


    closeButton.textContent =
        "Close";


    closeButton.style.padding =
        "8px 16px";


    closeButton.style.border =
        "1px solid #ddd";


    closeButton.style.borderRadius =
        "6px";


    closeButton.style.background =
        "white";


    closeButton.style.cursor =
        "pointer";


    closeButton.addEventListener(
        "click",
        () => {

            overlay.remove();
        }
    );


    actions.appendChild(
        closeButton
    );


    actions.appendChild(
        copyButton
    );


    modal.appendChild(
        title
    );


    modal.appendChild(
        textarea
    );


    modal.appendChild(
        actions
    );


    overlay.appendChild(
        modal
    );


    document.body.appendChild(
        overlay
    );
}

function cleanMarkdown(
    markdown
) {

    return markdown

        // Xóa khoảng trắng cuối dòng
        .replace(
            /[ \t]+\n/g,
            "\n"
        )

        // Không để quá nhiều dòng trống
        .replace(
            /\n{3,}/g,
            "\n\n"
        )

        .trim();
}

