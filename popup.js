const convertPageButton =
    document.getElementById(
        "convertPage"
    );


const selectContentButton =
    document.getElementById(
        "selectContent"
    );


const resultContainer =
    document.getElementById(
        "resultContainer"
    );


const resultTextarea =
    document.getElementById(
        "result"
    );


const copyButton =
    document.getElementById(
        "copy"
    );

async function getActiveTab() {

    const tabs =
        await chrome.tabs.query({
            active: true,
            currentWindow: true
        });


    return tabs[0];
}

convertPageButton.addEventListener(
    "click",
    async () => {

        const tab =
            await getActiveTab();


        chrome.tabs.sendMessage(
            tab.id,
            {
                type:
                    "GET_PAGE_CONTENT"
            },
            response => {

                if (
                    chrome.runtime.lastError
                ) {

                    console.error(
                        chrome.runtime.lastError.message
                    );

                    return;
                }


                if (!response) {
                    return;
                }


                resultContainer.classList.remove(
                    "hidden"
                );


                resultTextarea.value =
                    response.markdown;
            }
        );
    }
);

selectContentButton.addEventListener(
    "click",
    async () => {

        const tab =
            await getActiveTab();


        chrome.tabs.sendMessage(
            tab.id,
            {
                type:
                    "START_SELECTION_MODE"
            }
        );


        // Popup đóng để user
        // quay lại trang web chọn nội dung
        window.close();
    }
);

copyButton.addEventListener(
    "click",
    async () => {

        const markdown =
            resultTextarea.value;


        if (!markdown) {
            return;
        }


        await navigator.clipboard.writeText(
            markdown
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
