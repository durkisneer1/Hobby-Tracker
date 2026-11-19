"use strict";
const pageTitle = document.querySelector("title");
const issueTitle = document.querySelector("#issue-title");
const issueDescription = document.querySelector("#issue-description");
const statusMsg = document.querySelector("#status");
async function displayIssue(issueId) {
    statusMsg.textContent = "Loading...";
    try {
        const response = await fetch("/api/issues/" + issueId);
        if (!response.ok) {
            if (response.status == 404) {
                statusMsg.textContent = "Issue not found.";
                pageTitle.textContent = "Hobby Tracker - Not Found";
                return;
            }
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        pageTitle.textContent = "Hobby Tracker - " + data.title;
        issueTitle.textContent = data.title;
        const noDesc = data.description === null || data.description.length == 0;
        issueDescription.textContent = noDesc
            ? "No description provided."
            : data.description;
        statusMsg.textContent = "";
    }
    catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        statusMsg.textContent = `Could not load issue: ${detail}`;
        pageTitle.textContent = "Hobby Tracker - Error";
    }
}
// Read issue id from url
const url = new URL(document.location.href);
const issueId = url.searchParams.get("id");
if (issueId?.match(/^\d+$/)) {
    displayIssue(issueId);
}
else {
    statusMsg.textContent = "No issue selected.";
    pageTitle.textContent = "Hobby Tracker - Not Selected";
}
//# sourceMappingURL=issue.js.map