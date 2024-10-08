import os
from flask import Flask, request, jsonify
from autogen.coding import DockerCommandLineCodeExecutor

app = Flask(__name__)

current_directory = os.getcwd()
work_dir = os.path.join(current_directory, "work_dir")
os.makedirs(work_dir, exist_ok=True)

executor = DockerCommandLineCodeExecutor(
    image="python:3.12-slim",
    timeout=60,
    work_dir=work_dir,
    stop_container=False
)

@app.route('/execute', methods=['POST'])
def execute_code():
    try:
        code = request.json.get('code')
        language = request.json.get('language')

        code_block_string = f"```{language}\n{code}\n```"

        if not code_block_string:
            return jsonify({"error": "No code provided"}), 400

        code_extractor = executor.code_extractor
        code_blocks = code_extractor.extract_code_blocks(code_block_string)

        if not code_blocks:
            return jsonify({"error": "No code blocks found"}), 400
        
        result = executor.execute_code_blocks(code_blocks)
        return jsonify({"result": result.output})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)