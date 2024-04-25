function showError(msg) {
    let errorbox = document.getElementById("error")
    errorbox.textContent = "Error: " + msg

    setTimeout(() => {
        errorbox.textContent = ""
    }, 2000);
}

function saveFile(text) {
    const saveBlob = new Blob([text], {type: "text/plain"})
    let download = document.createElement("a")
    download.href = URL.createObjectURL(saveBlob)
    download.download = "result.txt"
    document.body.appendChild(download)
    download.click()
    document.body.removeChild(download)
}

function convertFile() {
    let files = document.getElementById("file").files

    if (files.length <= 0) { 
        showError("No file selected.") 
    } else {
        let file = document.getElementById("file").files[0]
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
                    }

                    saveFile(text)
                }
            })
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit").addEventListener("click", convertFile)
})