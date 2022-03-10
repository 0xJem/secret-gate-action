const core = require('@actions/core');

try {
  console.error("inputs " + core.getInput('inputs-to-check'));
  console.error("fail " + core.getInput('failOnMissing'));
  const inputsToCheck = core.getInput('inputs-to-check').split(',');
  const failOnMissing = core.getInput('failOnMissing') == 'true';

  let missingInputs = [];

  if (failOnMissing || (inputsToCheck.length === 0 || (inputsToCheck.length === 1 && inputsToCheck[0] === ''))) {
    throw new Error(`'inputs-to-check' is missing, please include it in your workflow section 'with' as inputs-to-check: 'input1,input2,...'`)
  }

  core.startGroup(`Checking ${inputsToCheck.length} inputs:`)
  inputsToCheck.forEach((input) => {
    const val = process.env[input] || core.getInput(input);
    if (!val || val === '') {
      missingInputs.push(input);
      core.warning(` - ❌ '${input}' is empty`)
    } else {
      core.info(` - ✅ '${input}' has a value`)
    }
  })
  core.endGroup();

  // Set the output
  core.setOutput('inputsChecked', missingInputs.length === 0);

  if (missingInputs.length > 0) {
    core.warning(`Missing ${missingInputs.length} inputs out of ${inputsToCheck.length} inputs`);
    if (failOnMissing) {
      core.setFailed(`Some inputs missing ${missingInputs.length}`)
    }
  }

} catch (error) {
  core.setFailed(error.message);
}