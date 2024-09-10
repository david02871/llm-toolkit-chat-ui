An LLM Chat UI that utilizes the OpenAI Assistants API

## Features

- OpenAI Assistants API
- Function calling support
- Confirmation mechanism for function calls (using `__CONFIRM` suffix)
- Custom rendering components for function outputs (using `__{ComponentName}` syntax)
- Python server for code execution using Autogen's DockerCommandLineCodeExecutor

See `src/app/assistants/time-assistant.ts` for an example assistant.

## Setup

### Installation and Configuration

1. Rename `.env.example` to `.env` and set up your OpenAI API key.

2. Install dependencies and launch the Chat UI:

   ```
   npm install
   npm run dev
   ```

3. (Optional) Set up and launch the Python server:

   ```
   npm run install-python-server
   npm run launch-python-server
   ```

   Alternative:

   ```
   python3 -m venv ./.venv && .venv/bin/pip install -r ./requirements.txt
   ./.venv/bin/python ./server.py
   ```

## Usage

After starting the development server, navigate to `http://localhost:3000` in your web browser to access the Chat UI.

Use the refresh button to regenerate assistants. Assistants are currently identified by name - so names must be unique.

## Note

This project is set up for development purposes and is not intended for use in production environments.
