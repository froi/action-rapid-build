const core = require('@actions/core');
const github = require('@actions/github');


// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(JSON.stringify(github.context.payload, null, 2));
    const sender = github.context.payload.sender.login;
    const owner = github.context.repo.owner.login;
    const repo = github.context.repo.name;
    const issueNumber = github.context.issue.number;

    const octokit = github.getOctokit();

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: `Hey @${sender}. Why you label me?`
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
