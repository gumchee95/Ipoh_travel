(function () {
  document.addEventListener("DOMContentLoaded", () => {
    IpohI18n.applyTranslations();
    document.getElementById("languageToggle").addEventListener("click", () => {
      IpohI18n.toggleLanguage();
    });

    const form = document.getElementById("contributionForm");
    const output = document.getElementById("draftOutput");
    const clearButton = document.getElementById("clearDraft");
    const copyButton = document.getElementById("copyDraft");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const draft = {
        type: "manual_review_contribution",
        created_at: new Date().toISOString(),
        name: formData.get("name"),
        area: formData.get("area"),
        category: formData.get("category"),
        map_url: formData.get("map_url"),
        why_visit: formData.get("why"),
        verification_note: formData.get("verification"),
        reminder: "Do not write directly to CSV until manually reviewed."
      };
      output.value = JSON.stringify(draft, null, 2);
    });

    clearButton.addEventListener("click", () => {
      form.reset();
      output.value = "";
    });

    copyButton.addEventListener("click", async () => {
      if (!output.value) return;
      try {
        await navigator.clipboard.writeText(output.value);
        copyButton.textContent = "Copied";
        setTimeout(() => {
          copyButton.textContent = IpohI18n.t("copyDraft");
        }, 1200);
      } catch (error) {
        output.select();
      }
    });
  });
})();
