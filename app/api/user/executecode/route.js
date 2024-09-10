import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { exec } from "child_process";
//NOTE: Remove dockerode and execute code directly into the backend.
const TEMP_DIR = path.join(process.cwd(), "temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const execPromise = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message });
      } else if (stderr) {
        resolve({ output: stderr, status: 200 });
      } else {
        resolve({ output: stdout, status: 200 });
      }
    });
  });

//execPromise for compiled languages like c++ and java

export async function POST(req) {
  try {
    const { code, input, selectedLanguage } = await req.json();
    console.log(input);
    const languageConfig = {
      python: {
        extension: "py",
      },
      nodejs: {
        extension: "js",
      },
    };

    const { extension } = languageConfig[selectedLanguage];
    console.log("the extension is ", extension);

    //setting up filenames for storing code for execution
    const codeFileName = `script.${extension}`;
    const inputFileName = "input.txt";
    //Generating the file paths
    const codeFilePath = path.join(TEMP_DIR, codeFileName);
    const inputFilePath = path.join(TEMP_DIR, inputFileName);

    //writing the code to the file
    await fs.promises.writeFile(codeFilePath, code);
    await fs.promises.writeFile(inputFilePath, input || "");

    if (selectedLanguage === "python") {
      try {
        const result = await execPromise(
          `python "${codeFilePath}" "${input || ""}"`
        );
        console.log("the result si", result);
        return NextResponse.json(result);
      } catch (error) {
        console.log("the error is", error);
        return NextResponse.json({
          status: 200,
          output: error.stderr || error.error || "Compilation failed",
        });
      }
    } else if (selectedLanguage === "nodejs") {
      try {
        const result = await execPromise(
          `node "${codeFilePath}" "${input || ""}"`
        );
        console.log("the result si", result);
        return NextResponse.json(result);
      } catch (error) {
        console.log("the error is", error);
        return NextResponse.json({
          status: 200,
          output: error.stderr || error.error || "Compilation failed",
        });
      }
    }
    //TODO: add support for c++ and javac
  } catch (error) {
    console.log("the error from the server is", error);
    return NextResponse.json({ status: 500, output: "Internal server error" });
  }
}
