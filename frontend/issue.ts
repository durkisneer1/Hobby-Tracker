const pageTitle = document.querySelector<HTMLTitleElement>("title")!;
const issueTitle = document.querySelector<HTMLHeadingElement>("#issue-title")!;
const issueDescription = document.querySelector<HTMLParagraphElement>("#issue-description")!;
const statusMsg = document.querySelector<HTMLParagraphElement>("#status")!;

interface Issue {
  title: string;
  description: string | null;
}

async function displayIssue(issueId: string) {
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

        const data: Issue = await response.json();

        pageTitle.textContent = "Hobby Tracker - " + data.title;
        issueTitle.textContent = data.title;

        const noDesc = data.description === null || data.description.length == 0;
        issueDescription.textContent = noDesc
            ? "No description provided."
            : data.description;

        statusMsg.textContent = "";
    } catch(error) {
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
} else {
    statusMsg.textContent = "No issue selected.";
    pageTitle.textContent = "Hobby Tracker - Not Selected";
}

