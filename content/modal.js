function showMarkdownModal(markdown) {
    const host =
        document.createElement("div");

    const shadow =
        host.attachShadow({
            mode: "open"
        });

    const style =
        document.createElement("link");

    style.rel = "stylesheet";

    style.href =
        chrome.runtime.getURL(
            "content/modal.css"
        );

    shadow.appendChild(style);

    const overlay =
        document.createElement("div");

    overlay.className =
        "markdown-modal-overlay";

    overlay.innerHTML = `
        <div class="markdown-modal">

            <div class="markdown-modal-title">
                Markdown Result
            </div>

            <textarea
                class="markdown-modal-textarea"
            ></textarea>

            <div class="markdown-modal-actions">

                <button
                    class="markdown-modal-close"
                >
                    Close
                </button>

                <button
                    class="markdown-modal-copy"
                >
                    Copy
                </button>

            </div>

        </div>
    `;

    shadow.appendChild(overlay);

    const textarea =
        shadow.querySelector(
            ".markdown-modal-textarea"
        );

    const copyButton =
        shadow.querySelector(
            ".markdown-modal-copy"
        );

    const closeButton =
        shadow.querySelector(
            ".markdown-modal-close"
        );

    textarea.value = markdown;

    copyButton.addEventListener(
        "click",
        async () => {
            await navigator.clipboard.writeText(
                textarea.value
            );

            copyButton.textContent =
                "Copied!";

            setTimeout(() => {
                copyButton.textContent =
                    "Copy";
            }, 1500);
        }
    );

    closeButton.addEventListener(
        "click",
        () => {
            host.remove();
        }
    );

    document.body.appendChild(host);
}