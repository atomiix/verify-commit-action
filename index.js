const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    /*const octokit = github.getOctokit(core.getInput('token'));
    const pullRequest = await octokit.rest.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
    });

    console.log(pullRequest);*/

    console.log(github.context.payload.commits);
}

run();