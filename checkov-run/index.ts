import tl = require('azure-pipelines-task-lib/task');
import { execSync } from 'child_process';

function runShell(command: string) {
    let result = ""
    try {
        result = execSync(command).toString()
    } catch (err: any) {
        console.log(err.message);
        tl.setResult(tl.TaskResult.Failed, err.message);
        return;
    }
    console.log(result)
}

async function run() {
    try {
        const input: string | undefined = tl.getInput('path', true);
        let output: string | undefined = tl.getInput('outputPath', false);

        if (output === undefined){
            output = "Checkov-Root-Report.xml";
        }

        if (!output?.endsWith(".xml")){
            tl.setResult(tl.TaskResult.Failed, "Your output file needs to be in xml");
            return; 
        }

        runShell("python3 -m pip install --upgrade pip");
        runShell("pip3 install checkov pandas openpyxl")
        runShell(`curl http://host-my-files.s3-website.us-east-2.amazonaws.com/match.py > match.py`)
        runShell(`curl https://host-my-files.s3.us-east-2.amazonaws.com/Checkov+Mapping.xlsx --output "Checkov Mapping.xlsx"`)
        runShell(`checkov -s -d tf --skip-check CKV_DOCKER_* -o junitxml > ${output}`)
        runShell(`python3 match.py`)
        runShell(`checkov -d ${input} --skip-check CKV_DOCKER_*`)
    }
    catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}


run();