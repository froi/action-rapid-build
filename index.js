const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const allowedUser = core.getInput('allowedUser')
    const sender = github.context.payload.sender.login;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const issueNumber = github.context.issue.number;
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    let body = `Hey @${sender}. Why you label me?

    ![](https://media.giphy.com/media/DfTZWmFpLx3os/source.gif)`;

    if(sender === allowedUser) {
      body = 'OK ... fineeee\n\n' +
        '![](https://media.giphy.com/media/fQoxwZBVWq5jhLXRty/source.mp4)';
    }

    await octokit.issues.createComment({
      owner,
      repo,
      body,
      issue_number: issueNumber
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
