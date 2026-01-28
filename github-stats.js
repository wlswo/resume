document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.github-card');

  cards.forEach(async (card) => {
    const href = card.getAttribute('href');
    if (!href) return;

    // Extract owner/repo from href (e.g., https://github.com/owner/repo)
    const match = href.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return;

    const owner = match[1];
    const repo = match[2];
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      const data = await response.json();

      // Find the star count element
      // It's the text node inside the span that contains the star icon
      const starIcon = card.querySelector('.octicon-star');
      if (starIcon) {
        const starMeta = starIcon.closest('.github-card__meta');
        if (starMeta) {
          // Replace the text node (assumes the structure is <svg>...Number)
          // We filter for text nodes to avoid removing the SVG
          const textNode = Array.from(starMeta.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
          if (textNode) {
             textNode.textContent = ` ${data.stargazers_count}`;
          } else {
             // If no text node found (e.g. empty), append it
             starMeta.appendChild(document.createTextNode(` ${data.stargazers_count}`));
          }
        }
      }

      // Find the fork count element
      const forkIcon = card.querySelector('.octicon-repo-forked');
      if (forkIcon) {
        const forkMeta = forkIcon.closest('.github-card__meta');
        if (forkMeta) {
          const textNode = Array.from(forkMeta.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
          if (textNode) {
            textNode.textContent = ` ${data.forks_count}`;
          } else {
             forkMeta.appendChild(document.createTextNode(` ${data.forks_count}`));
          }
        }
      }

    } catch (error) {
      console.error(`Failed to fetch stats for ${owner}/${repo}:`, error);
      // Optional: Leave the manually hardcoded numbers as fallback
    }
  });
});
