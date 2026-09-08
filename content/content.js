console.log("Web to Markdown content script loaded");

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (
            message.type ===
            "GET_PAGE_CONTENT"
        ) {

            const selection =
                window.getSelection();

            let root;

            // Có bôi đen
            if (
                selection &&
                !selection.isCollapsed
            ) {

                const container =
                    document.createElement("div");

                const range =
                    selection.getRangeAt(0);

                container.appendChild(
                    range.cloneContents()
                );

                root = container;

                console.log(
                    "Converting selected content"
                );

            }

            // Không bôi đen
            else {

                root =
                    document.body;

                console.log(
                    "Converting whole page"
                );
            }


            const markdown =
                convertNode(
                    root,
                    {
                        listDepth: 0
                    }
                );


            sendResponse({
                title: document.title,
                markdown
            });
        }

        return true;
    }
);
