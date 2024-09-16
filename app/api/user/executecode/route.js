import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { spawn, exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

//NOTE: Remove dockerode and execute code directly into the backend.
const TEMP_DIR = path.join(process.cwd(), "temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}
//function to make a unique directory
const createTempDirectory = async () => {
  const uniquedir = path.join(TEMP_DIR, uuidv4());
  await fs.promises.mkdir(uniquedir, { recursive: true });
  return uniquedir;
};

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

const runPythonCode = async (code, input) => {
  const tempdir = await createTempDirectory();
  const pythonfilename = "mypython.py";
  const pythonfilepath = path.join(tempdir, pythonfilename);

  try {
    await fs.promises.writeFile(pythonfilepath, code);
    const path = pythonfilepath.toString();
    const result = await new Promise((resolve, reject) => {
      const child = spawn("python", [path], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let output = "";
      let erroroutput = "";

      //writing output to the string
      child.stdout.on("data", (data) => {
        output += data.toString();
      });
      //writing stderr to the string
      child.stderr.on("data", (data) => {
        erroroutput += data.toString();
      });

      //handling wht happens after the execution
      child.on("close", (code) => {
        if (code == 0) {
          console.log("the output is ", output);
          resolve({ output, status: 200 });
        } else {
          console.log("the output is ", erroroutput);
          reject({ error: erroroutput, status: 500 });
        }
      });

      //Writing input to the binary executable
      child.stdin.write(input || "");
      child.stdin.end();
    });
    return result;
  } catch (error) {
    console.log("the error from the catch block is ", error.error);
    return NextResponse.json({ output: error.error || "runtime error" });
  } finally {
    try {
      await fs.promises.rm(tempdir, { recursive: true });
      console.log("the temp dir is removed successfully");
    } catch (error) {
      console.log("error removing dir", error);
    }
  }
};

const runJavaProgram = async (code, input) => {
  //create a temp dir for writing code to a file
  const tempdir = await createTempDirectory();
  const javaFileName = "MainClass.java";
  const classFileName = "MainClass.class";
  const javaFilePath = path.join(tempdir, javaFileName);
  const classFilePath = path.join(tempdir, classFileName);
  try {
    //this will compile the java file and generate a .class bytecode executable
    await fs.promises.writeFile(javaFilePath, code);
    //compiling the java file
    await execPromise(`javac "${javaFilePath}"`);
    console.log("the compilation is successfull");

    const result = await new Promise((resolve, reject) => {
      const child = spawn("java", ["-cp", tempdir, "MainClass"], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let output = "";
      let erroroutput = "";

      child.stdout.on("data", (data) => {
        output += data.toString();
      });

      child.stderr.on("data", (data) => {
        erroroutput += data.toString();
      });

      //handle process completion
      child.on("close", (code) => {
        if (code === 0) {
          resolve({ output, status: 200 });
        } else {
          reject({ error: erroroutput, status: 500 });
        }
      });

      child.stdin.write(input || "");
      child.stdin.end();
    });
    return result;
  } catch (error) {
    return { output: error.error || "execution failed", status: 500 };
  } finally {
    try {
      await fs.promises.rm(tempdir, { recursive: true });
      console.log("the temp dir is removed successfully");
    } catch (error) {
      console.log("error removing dir", error);
    }
  }
};

//execPromise for compiled languages like c++
const compileAndRunCPlusPlus = async (code, input) => {
  //Setting up path for output file
  const tempdir = await createTempDirectory();
  const cppfilename = "myprogram.cpp";
  const outputname = "myprogram";
  const cppfilepath = path.join(tempdir, cppfilename);
  const outputfilepath = path.join(tempdir, outputname);
  //Determining the correct command to execute the binary based on OS
  const executable =
    process.platform === "win32" ? `${outputfilepath}.exe` : outputfilepath;

  console.log("the path is", cppfilepath);
  try {
    await fs.promises.writeFile(cppfilepath, code);
    await execPromise(`g++ -o "${outputfilepath}" "${cppfilepath}"`);
    console.log("compilation is complete");
    // Ensure binary was created
    if (!fs.existsSync(executable)) {
      throw new Error("Executable file not created");
    }
    console.log("binary is created successfully");
    //Spawn the compiled binary and input directly
    const result = await new Promise((resolve, reject) => {
      const child = spawn(executable, [], {
        stdio: ["pipe", "pipe", "pipe"],
      });
      // init empty strings to store output and error
      let output = "";
      let erroroutput = "";

      //capturing event of successful execution
      child.stdout.on("data", (data) => {
        output += data.toString();
      });

      //capturing event of error
      child.stderr.on("data", (data) => {
        erroroutput += data.toString();
      });

      //handling wht happens after the execution
      child.on("close", (code) => {
        if (code == 0) {
          console.log("the output is ", output);
          resolve({ output, status: 200 });
        } else {
          console.log("the output is ", erroroutput);
          reject({ error: erroroutput, status: 500 });
        }
      });

      //Writing input to the binary executable
      child.stdin.write(input || "");
      child.stdin.end();
    });

    return result;
  } catch (error) {
    console.log("error from the catch block", error.error);
    return { output: error.error || "compilation custom error", status: 500 };
  } finally {
    try {
      await fs.promises.rm(tempdir, { recursive: true });
      console.log("the temp dir is removed successfully");
    } catch (error) {
      console.log("error removing dir", error);
    }
  }
};

const runJavascript = async (code, input) => {
  const tempdir = await createTempDirectory();
  const jsfilename = "myjavascript.js";
  const jsfilepath = path.join(tempdir, jsfilename);
  try {
    await fs.promises.writeFile(jsfilepath, code);
    const result = await new Promise((resolve, reject) => {
      const child = spawn("node", [jsfilepath], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let output = "";
      let erroroutput = "";

      child.stdout.on("data", (data) => {
        output += data.toString();
      });

      child.stderr.on("data", (data) => {
        erroroutput += data.toString();
      });
      child.on("close", (code) => {
        if (code == 0) {
          resolve({ output, status: 200 });
        } else {
          reject({ error: erroroutput, status: 500 });
        }
      });

      child.stdin.write(input || "");
      child.stdin.end();
    });
    return result;
  } catch (error) {
    console.log("the error is :", error.error);
    return { output: error.error || "compilation error" };
  } finally {
    try {
      await fs.promises.rm(tempdir, { recursive: true });
      console.log("cleanup complete");
    } catch (error) {
      console.log("error while cleaning upo", error);
    }
  }
};

export async function POST(req) {
  try {
    const { code, input, selectedLanguage } = await req.json();
    console.log(input);
    // const languageConfig = {
    //   python: {
    //     extension: "py",
    //   },
    //   nodejs: {
    //     extension: "js",
    //   },
    //   cpp: {
    //     extension: "cpp",
    //   },
    //   java: {
    //     extension: "java",
    //   },
    // };

    // const { extension } = languageConfig[selectedLanguage];
    // console.log("the extension is ", extension);

    // //setting up filenames for storing code for execution
    // const codeFileName = `script.${extension}`;
    // const inputFileName = "input.txt";
    // //Generating the file paths
    // const codeFilePath = path.join(TEMP_DIR, codeFileName);
    // const inputFilePath = path.join(TEMP_DIR, inputFileName);

    // //writing the code to the file
    // await fs.promises.writeFile(codeFilePath, code);
    // await fs.promises.writeFile(inputFilePath, input || "");

    //NOTE: not a good approach
    // if (selectedLanguage === "python") {
    //   try {
    //     const result = await execPromise(
    //       `python "${codeFilePath}" "${input || ""}"`
    //     );
    //     console.log("the result si", result);
    //     return NextResponse.json(result);
    //   } catch (error) {
    //     console.log("the error is", error);
    //     return NextResponse.json({
    //       status: 200,
    //       output: error.stderr || error.error || "Compilation failed",
    //     });
    //   }

    if (selectedLanguage === "java") {
      try {
        console.log(codeFilePath);
        const result = await runJavaProgram(code, input);
        console.log("the result is", result);
        return NextResponse.json(result);
      } catch (error) {
        console.log("the error is", error);
        return NextResponse.json({
          status: 200,
          output: error.stderr || error.error || "Compilation failed",
        });
      }
    }

    if (selectedLanguage === "python") {
      try {
        const result = await runPythonCode(code, input);
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

    if (selectedLanguage === "nodejs") {
      try {
        const result = await runJavascript(code, input);
        console.log("the result is", result);
        return NextResponse.json(result);
      } catch (error) {
        console.log("the error is", error);
        return NextResponse.json({
          status: 200,
          output: error.stderr || error.error || "Compilation failed",
        });
      }
    }
    if (selectedLanguage === "cpp") {
      try {
        const result = await compileAndRunCPlusPlus(code, input);
        console.log("the result is", result);
        return NextResponse.json(result);
      } catch (error) {
        console.log("the error is", error);
        return NextResponse.json({
          status: 200,
          output: error.stderr || error.error || "Compilation failed",
        });
      }
    }
  } catch (error) {
    console.log("the error from the server is", error);
    return NextResponse.json({ status: 500, output: "Internal server error" });
  }
}
