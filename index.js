const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    if (github.context.issue?.number === undefined) {
        core.warning('Cannot run the action');
        return;
    }

    const octokit = github.getOctokit(core.getInput('repo-token', { required: true }));
    const commits = octokit.paginate(octokit.rest.pulls.get, {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number
    });

    console.log(commits);
}

run();