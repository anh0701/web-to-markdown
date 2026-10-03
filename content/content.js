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

