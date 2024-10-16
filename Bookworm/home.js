function dragOverHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("dropArea").style.backgroundColor = "#EAFFFC";
}

function dragLeaveHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("dropArea").style.backgroundColor = "#FFFFFF";
}

function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("dropArea").style.backgroundColor = "#FFFFFF";

    const file = event.dataTransfer.files[0];

    if (file && file.type === "application/pdf") {
        displayFile(file);
    } else {
        alert("Please upload a valid PDF file.");
    }
}

function fileChangeHandler(event) {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
        displayFile(file);
    } else {
        alert("Please upload a valid PDF file.");
    }
}

function displayFile(file) {
    document.getElementById("uploadSymbol").style.display = "none";
    document.getElementById("uploadText").style.display = "none";
    document.getElementById("uploadButton").style.display = "none";
    document.getElementById("confirmationSymbol").style.display = "block";
    document.getElementById("fileNameDisplay").style.display = "block";
    document.getElementById("fileReadingButton").style.display = "block";
    document.getElementById("fileNameDisplay").innerHTML = file.name;
}