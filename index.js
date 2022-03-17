const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    if (github.context.issue?.number === undefined) {
        core.warning('Cannot run the action');
        return;
    }

    const token = core.getInput('repo-token', { required: true });
    const checkMembers = core.getInput('only-organization', { required: true });

    const octokit = github.getOctokit(token);

    const commits = await octokit.paginate(octokit.rest.pulls.listCommits, {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
        per_page: 100
    });

    let membersNames = [];

    if (checkMembers === 'true') {
        const allMembers = await octokit.paginate(octokit.rest.orgs.listMembers, {
            org: github.context.repo.owner,
            per_page: 100
        });
        allMembers.forEach(member => {
            membersNames.push(member.login);
        });
    }

    commits.forEach(({commit, html_url}) => {
        if (commit.verification.verified === true) {
            core.info(`Commit ${html_url} is signed.`);
        } else {
            if (checkMembers !== 'true' || membersNames.indexOf(commit.author.login)) {
                core.setFailed(`Commit ${html_url} is not signed.`);
            } else {
                core.info(`Commit ${html_url} is not signed. But the author is not part of the organization`);
            }
        }
    });
}

run();