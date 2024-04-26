function showError(msg, timeout = 2) { // Timeout in seconds
    let errorbox = document.getElementById("error")
    errorbox.textContent = "Error: " + msg

    setTimeout(() => {
        errorbox.textContent = ""
    }, timeout * 1000);
}

function saveFile(text) {
    const saveBlob = new Blob([text], { type: "text/plain" })
    let download = document.createElement("a")
    download.href = URL.createObjectURL(saveBlob)
    download.download = "result.txt"
    document.body.appendChild(download)
    download.click()
    document.body.removeChild(download)
}

function dropHandler(event) {
    let files = event.dataTransfer.files
    convertFile(files)
}

function uploadHandler(event) {
    let files = event.target.files
    convertFile(files)
}

function convertFile(files) {
    if (files.length <= 0) {
        showError("No file selected.")
    } else {
        let file = files[0]
        if (file.type != "application/json") {
            showError("Invalid file type!")
        } else {
            // Convert
            file.text().then((raw) => {
                let json = JSON.parse(raw)

                if (!Array.isArray(json) || !json[0].hasOwnProperty("Contents")) {
                    showError("Invalid json file")
                } else {
                    let text = ""

                    for (let i = 0; i < json.length; i++) {
                        let message = json[i].Contents
                        if (!message.includes("https") && message != "" && message !== null) { // Check  message is valid
                            if (i == 0) {
                                text += "{{char}}:" + message
                            } else {
                                text += "\n{{char}}:" + message
                            }
                        }
                        if (text.length >= 32000) {
                            showError("Maximum length reached, only outputted first " + i + " lines of " + json.length, 5)
                            break
                        }
                    }

                    saveFile(text)
                }
            })
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("file").addEventListener("change", uploadHandler)

    let dropzone = document.getElementById("dropzone")
    dropzone.addEventListener("drop", dropHandler)
    dropzone.addEventListener("dragover", (event) => { event.preventDefault() })

})