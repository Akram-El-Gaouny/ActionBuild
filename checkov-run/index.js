"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const child_process_1 = require("child_process");
function runShell(command) {
    let result = "";
    try {
        result = child_process_1.execSync(command).toString();
    }
    catch (err) {
        console.log(err.message);
        tl.setResult(tl.TaskResult.Failed, err.message);
        return;
    }
    console.log(result);
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const input = tl.getInput('path', true);
            let output = tl.getInput('outputPath', false);
            if (output === undefined) {
                output = "Checkov-Root-Report.xml";
            }
            if (!(output === null || output === void 0 ? void 0 : output.endsWith(".xml"))) {
                tl.setResult(tl.TaskResult.Failed, "Your output file needs to be in xml");
                return;
            }
            runShell("python3 -m pip install --upgrade pip");
            runShell("pip3 install checkov pandas openpyxl");
            runShell(`curl http://host-my-files.s3-website.us-east-2.amazonaws.com/match.py > match.py`);
            runShell(`curl https://host-my-files.s3.us-east-2.amazonaws.com/Checkov+Mapping.xlsx --output "Checkov Mapping.xlsx"`);
            runShell(`checkov -s -d tf --skip-check CKV_DOCKER_* -o junitxml > ${output}`);
            runShell(`python3 match.py`);
            runShell(`checkov -d ${input} --skip-check CKV_DOCKER_*`);
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
