/**
 * Code for copy button that changes from "Copy" to checkmark
*/
document.getElementById("buttonCopy").addEventListener("click", function () {
    const textToCopy = document.getElementById("textOutput").value;
    navigator.clipboard.writeText(textToCopy).then(() => {
        changeDesc("buttonCopy", "✔︎", 200);
    }).catch((err) => {
        console.error("Fehler beim Kopieren:", err);
    });
});

function changeDesc(element, text, timeout) {
    const elem = document.getElementById(element);
    if (!elem) {
        console.error(`Element mit ID ${element} nicht gefunden.`);
        return;
    }
    const desc = elem.innerHTML;
    elem.innerHTML = text;
    setTimeout(() => {
        elem.innerHTML = desc;
    }, timeout);
}

/**
 * Code for Go-Button and i/o handling
 * Functions are pretty much self-explanatory, so no detailed comments
 * Class io has one set of input and one set of output variables even though replacing input for output would work (keeping extendable here)
*/

class io {
    type = "";

    input = "";
    inputCharCount = "";
    inputEven1 = "";
    inputEven2 = "";
    inputSymmetrical1 = "";
    inputSymmetrical2 = "";

    output = "";
    outputCharCount = 0;
    outputEven1 = true;
    outputEven2 = true;
    outputSymmetrical1 = true;
    outputSymmetrical2 = true;
}

document.getElementById("buttonGo").addEventListener("click", main);

function main() {
    let checks = new io();

    console.log(manageInput(checks));
    console.log(manageFormat(checks))
    console.log(manageOutput(checks))
}

function manageInput(io) {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        alert("Missing selection!");
        return;
    }
    io.type = selectedOption.value;

    io.input = document.getElementById("textInput").value;

    io.inputCharCount = document.getElementById("inputCharCount").value || "none";

    io.inputEven1 = document.getElementById("inputEven1").value || "'";
    io.inputEven2 = document.getElementById("inputEven2").value || "\"";

    io.inputSymmetrical2 = document.getElementById("inputSymmetrical2").value || "{}";
    io.inputSymmetrical2 = (inputSymmetrical2.length == 1) ? "{}" : io.inputSymmetrical2;

    io.inputSymmetrical1 = document.getElementById("inputSymmetrical1").value || "()";
    io.inputSymmetrical1 = (inputSymmetrical1.length == 1) ? "()" : io.inputSymmetrical1;
    
    return "Input successful";
} // Gets input

function manageFormat(io) {
    if (io.type == "c") {
        io.output = clean(io.input);
    } else {
        io.output = reformat(clean(io.input));
    }

    io.outputCharCount = countChar(io.input, io.inputCharCount);

    io.outputEven1 = oneCharSymmetry(io.input, io.inputEven1[0]);
    io.outputEven2 = oneCharSymmetry(io.input, io.inputEven2[0]);

    io.outputSymmetrical1 = twoCharSymmetry(io.input, io.inputSymmetrical1[0], io.inputSymmetrical1[1]);
    io.outputSymmetrical2 = twoCharSymmetry(io.input, io.inputSymmetrical2[0], io.inputSymmetrical2[1]);

    return "Format successful";
} // Changes formats and counts characters, main thing

function manageOutput(io) {
    document.getElementById("textOutput").value = io.output;

    document.getElementById("outputCharCount").innerHTML = `${io.outputCharCount}`;

    document.getElementById("outputEven1").innerHTML = `${io.outputEven1}`;
    document.getElementById("outputEven2").innerHTML = `${io.outputEven2}`;

    document.getElementById("outputSymmetrical1").innerHTML = `${io.outputSymmetrical1}`;
    document.getElementById("outputSymmetrical2").innerHTML = `${io.outputSymmetrical2}`;

    return "Output successful";
} // Writes output

function twoCharSymmetry(text, charOne, charTwo) {
    return countChar(text, charOne) === countChar(text, charTwo);
}

function oneCharSymmetry(text, char) {
    return countChar(text, char) % 2 === 0;
}

function countChar(text, char) {
    if (!char || char === "none") {
        return text.length;
    }
    return text.split(char).length - 1;
}

function clean(text) {
    text = text.replace(/\n/g, "");
    text = text.trim();
    return text.replace(/'([^']*)'|\s+/g, (match, quotedText) => {
        if (quotedText !== undefined) {
            return `'${quotedText}'`;
        }
        return '';
    });
}

function reformat(text) {
    let temp = "";
    let indentLevel = 0;
    for (const char of text) {
        if (char === "(") {
            indentLevel++;
            temp += `(\n${"    ".repeat(indentLevel)}`;
        } else if (char === ")") {
            indentLevel = Math.max(0, indentLevel - 1);
            temp += `\n${"    ".repeat(indentLevel)})`;
        } else {
            temp += char;
        }
    }
    return temp;
}

function reformatWithRegex(text, openChar = "(", closeChar = ")") {
    const regex = new RegExp(`[${openChar}${closeChar}]`, "g");
    let temp = "";
    let indentLevel = 0;
    for (const char of text.replace(regex, match => match)) {
        if (char === openChar) {
            indentLevel++;
            temp += `${openChar}\n${"    ".repeat(indentLevel)}`;
        } else if (char === closeChar) {
            indentLevel = Math.max(0, indentLevel - 1);
            temp += `\n${"    ".repeat(indentLevel)}${closeChar}`;
        } else {
            temp += char;
        }
    }
    return temp;
} // Reformat utilizing RegEx (ChatGPT and NOT IN USE)