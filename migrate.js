import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const FROM_ORG = process.env.FROM_ORG;
const TO_ORG = process.env.TO_ORG;
const TEAM_ID = Number(process.env.TEAM_ID);
const API_VERSION = "2022-11-28";
const DRY_RUN = process.env.DRY_RUN === "1"; // set to "1" for dry run

async function listAllRepos(org) {
    return await octokit.paginate("GET /orgs/{org}/repos", {
        org,
        type: "all",
        per_page: 100,
        headers: { "X-GitHub-Api-Version": API_VERSION },
    });
}

async function transferOne(repoName) {
    if (DRY_RUN) {
        console.log(`[DRY RUN] Would transfer ${FROM_ORG}/${repoName} -> ${TO_ORG}/${repoName} with team_ids=[${TEAM_ID}]`);
        return;
    }
    await octokit.request("POST /repos/{owner}/{repo}/transfer", {
        owner: FROM_ORG,
        repo: repoName,
        new_owner: TO_ORG,
        team_ids: [TEAM_ID],
        headers: { "X-GitHub-Api-Version": API_VERSION },
    });
}

(async () => {
    const all = await listAllRepos(FROM_ORG);
    // Optional: filter here for pilot runs
    const repos = all; // or .filter(r => r.name === "loveholidays-greece-in-film")

    if (DRY_RUN) {
        console.log(`[DRY RUN] ${repos.length} repositories selected. No changes will be made.`);
    }

    let ok = 0, err = 0;
    for (const r of repos) {
        try {
            await transferOne(r.name);
            if (!DRY_RUN) console.log(`Transferred ${FROM_ORG}/${r.name} -> ${TO_ORG}/${r.name}`);
            else console.log(`[DRY RUN] Planned: ${FROM_ORG}/${r.name} -> ${TO_ORG}/${r.name}`);
            ok++;
        } catch (e) {
            console.error(`Failed ${r.name}: ${e.status} ${e.message}`);
            err++;
        }
    }

    console.log(`${DRY_RUN ? "[DRY RUN] " : ""}Done. Success: ${ok}, Errors: ${err}`);
    if (DRY_RUN && repos.length === 0) process.exit(2);
})();
