import os
from flask import Flask, request, jsonify
from autogen.coding import DockerCommandLineCodeExecutor

app = Flask(__name__)

current_directory = os.getcwd()
work_dir = os.path.join(current_directory, "work_dir")
os.makedirs(work_dir, exist_ok=True)

# Create a Docker command line code executor.
executor = DockerCommandLineCodeExecutor(
    image="python:3.12-slim",  # Execute code using the given docker image name.
    timeout=60,  # Timeout for each code execution in seconds.
    work_dir=work_dir,
    stop_container=False
)

@app.route('/execute', methods=['POST'])
def execute_code():
    try:
        # Get the code from the request.
        code = request.json.get('code')

        # Sample python code block (markdown) that returns the sum of two numbers.
#         code = """
# ```python
# a = 10
# b = 20
# sum = a + b
# print(sum)
# ```
#         """

        # Ensure code is provided
        if not code:
            return jsonify({"error": "No code provided"}), 400
        
        # Log the code to the console.
        print(code)

        code_extractor = executor.code_extractor

        # Extract code blocks from the code.
        code_blocks = code_extractor.extract_code_blocks(code)

        # Log the number of code blocks extracted.
        print(f"Extracted {len(code_blocks)} code blocks")

        # Ensure code blocks are provided
        if not code_blocks:
            return jsonify({"error": "No code blocks found"}), 400
        
        # Execute the code blocks.
        result = executor.execute_code_blocks(code_blocks)

        # Log the result of the code execution.
        print(result)

        # Return the result as a JSON response.
        return jsonify({"result": result.output})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)