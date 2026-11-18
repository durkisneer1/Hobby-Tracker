const list = document.querySelector<HTMLUListElement>("#issues")!;
const message = document.querySelector<HTMLParagraphElement>("#message")!;
const refresh = document.querySelector<HTMLButtonElement>("#refresh")!;

const form = document.querySelector<HTMLFormElement>("#create-issue")!;
const titleInput = document.querySelector<HTMLInputElement>("#title")!;
const descriptionInput = document.querySelector<HTMLTextAreaElement>("#description")!;
const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
const createMessage = document.querySelector<HTMLParagraphElement>("#create-message")!;

interface Issue {
  title: string;
}

interface IssuePage {
  items: Issue[];
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  createMessage.textContent = "Creating…";

  try {
    // Send the form values to POST /api/issues.
    const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: titleInput.value,
            description: descriptionInput.value || null,
        }),
    });

    // If the response failed, read its JSON error
    // and throw an Error containing the backend's message.
    if (!response.ok) {
        const problem = await response.json();
        throw new Error(problem.error ?? `HTTP ${response.status}`);
    }

    form.reset();
    await loadIssues();
    createMessage.textContent = "Issue created.";
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    createMessage.textContent = detail;
  } finally {
    submitButton.disabled = false;
  }
});

async function loadIssues() {
  message.textContent = "Loading...";
  refresh.disabled = true;
  list.replaceChildren();

  try {
    const response = await fetch("/api/issues");
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data: IssuePage = await response.json();

    if (data.items.length > 0) {
        data.items.forEach(issue => {
            const item = document.createElement("li");
            item.textContent = issue.title;
            list.append(item);
        });
        message.textContent = `Showing ${data.items.length} issues.`;
    } else {
        message.textContent = "You don't have any issues yet.";
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    message.textContent = `Could not load issues: ${detail}`;
  } finally {
    refresh.disabled = false;
  }
}

refresh.addEventListener("click", loadIssues);
loadIssues();
