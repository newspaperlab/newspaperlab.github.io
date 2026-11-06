# Privacy integration

All pages must load the shared root assets before </head>:

<link rel="stylesheet" href="/assets/privacy.css?v=2026-11-06.1">
<script src="/assets/privacy.js?v=2026-11-06.1" defer></script>

Keep the .nl-policy-links navigation in the static HTML footer (privacy.html, terms.html,
cookies.html, about.html, contact.html on the root domain, plus a button with
data-nl-open-settings). The shared script adds a fallback navigation when absent.
Do not remove these tags when generating articles, changing editions or rebuilding the home page.

No advertising or analytics code is active. The notice acknowledgement is NOT consent
for advertising or analytics. Never interpret it as an opt-in. Before enabling those services,
update disclosures, verify the actual providers and implement required consent. Personalized
ads in the EEA/UK/Switzerland require an appropriate Google-certified TCF CMP; the local
notice is not a substitute. Keep the meta verification tag and root ads.txt intact.
If data practices change, update policies and the notice version together.
