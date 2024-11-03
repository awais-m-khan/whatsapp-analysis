async function analyzeChat() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert("Please select a file.");
        return;
    }

    const file = fileInput.files[0];
    const text = await file.text();
    const messages = parseMessages(text);
    
    const stats = calculateStats(messages);
    displayStats(stats);
}

function parseMessages(text) {
    const messages = [];
    const lines = text.split('\n');
    lines.forEach(line => {
        const match = line.match(/(\d{2}\/\d{2}\/\d{2,4}), (\d{2}:\d{2}) - (.*?): (.*)/);
        if (match) {
            messages.push({
                date: match[1],
                time: match[2],
                sender: match[3],
                message: match[4]
            });
        }
    });
    return messages;
}

function calculateStats(messages) {
    const stats = {
        messageCount: {},
        wordCount: {},
        firstMessages: {},
    };

    messages.forEach(msg => {
        stats.messageCount[msg.sender] = (stats.messageCount[msg.sender] || 0) + 1;
        stats.wordCount[msg.sender] = (stats.wordCount[msg.sender] || 0) + msg.message.split(" ").length;
    });

    return stats;
}

function displayStats(stats) {
    const output = document.getElementById("output");
    output.innerHTML = `
        <h2>Chat Statistics</h2>
        <p>Message Count:</p>
        <pre>${JSON.stringify(stats.messageCount, null, 2)}</pre>
        <p>Word Count:</p>
        <pre>${JSON.stringify(stats.wordCount, null, 2)}</pre>
    `;
}

function downloadPDF() {
    const statsText = document.getElementById('output').innerText;
    const docDefinition = {
        content: [{ text: 'Chat Analysis', style: 'header' }, statsText]
    };
    pdfMake.createPdf(docDefinition).download('chat_analysis.pdf');
}
