const convertButton =
    document.getElementById("convert");

const result =
    document.getElementById("result");


convertButton.addEventListener(
    "click",
    async () => {

        const tabs =
            await chrome.tabs.query({
                active: true,
                currentWindow: true
            });


        const tab =
            tabs[0];


        if (!tab || !tab.id) {
            return;
        }


        chrome.tabs.sendMessage(
            tab.id,
            {
                type: "GET_PAGE_CONTENT"
            },
            (response) => {

                if (chrome.runtime.lastError) {

                    console.error(
                        chrome.runtime.lastError.message
                    );

                    return;
                }


                result.value =
                    response.markdown;
            }
        );
    }
);