import subprocess

def get_aliases():
    try:
        result = subprocess.run(
            'vercel alias ls',
            capture_output=True,
            text=True,
            encoding='utf-8',
            shell=True
        )
        if result.returncode == 0:
            with open('aliases_full.txt', 'w', encoding='utf-8') as f:
                f.write(result.stdout)
            print("Aliases written to aliases_full.txt")
        else:
            print(f"Error: {result.stderr}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    get_aliases()
