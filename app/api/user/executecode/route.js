import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { NextResponse } from "next/server";
import streams from 'memory-streams';


const docker = new Docker();
const TEMP_DIR = path.join(process.cwd(), 'temp');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const languageConfigs = {
  python : {
    dockerImage: 'my-python-env',
    command : 'python3 script.py < input.txt',
    extenstion: 'py'
  },
  nodejs : {
    dockerImage: 'my-nodejs-app',
    command : 'node script.js < input.txt',
    extenstion: 'js'
  }
}

export async function POST(req) {
  try {
    const { code, input, selectedLanguage } = await req.json();

    if (!languageConfigs[selectedLanguage]) {
      return NextResponse.json({ status: 400, message: 'Unsupported language' });
    }

    const { dockerImage, command, extenstion } = languageConfigs[selectedLanguage];

    const codeFileName = `script.${extenstion}`;
    const inputFileName = 'input.txt';
    const codeFilePath = path.join(TEMP_DIR, codeFileName);
    const inputFilePath = path.join(TEMP_DIR, inputFileName);

    await fs.promises.writeFile(codeFilePath, code);
    await fs.promises.writeFile(inputFilePath, input || '');
    //declaring writable streams to get output outside the docker
    const stdout = new streams.WritableStream();
    const stderr = new streams.WritableStream();

await new Promise(async(resolve, reject)=> {
      docker.run(
      dockerImage,
      ['sh', '-c', command],

      [stdout, stderr],
      { Tty: false, HostConfig: { Binds: [`${TEMP_DIR}:/app`] } },
      ( err, data, container) => {
        if (err) {
          console.error('Error executing Docker container:', err);
            reject(new Error("Internal server error"));
        }
        
        container.remove(() => {
          console.log('Container removed');
            resolve();
        });
      }
       
    );
    })

      const output = stdout.toString();
      const error = stderr.toString();

     if (error) {
      console.error('Execution error:', error);
      return NextResponse.json({ status: 401, error });
     }

    return NextResponse.json({ status: 200, output });

  } catch (error) {
    
    return NextResponse.json({ status: 500, message: 'Internal server error' });
  }
}
