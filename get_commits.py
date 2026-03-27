import subprocess
import os

def get_commits(output_file):
    try:
        # Get all hashes first
        result = subprocess.run(
            ['git', 'rev-list', '--all'],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        if result.returncode != 0:
            print(f"Error getting hashes: {result.stderr}")
            return
            
        hashes = result.stdout.strip().split('\n')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("# Full Commit History\n\n")
            f.write("Here is the complete chronological history of the project:\n\n")
            f.write("| Hash | Author | Date | Message |\n")
            f.write("| :--- | :--- | :--- | :--- |\n")
            
            for h in hashes:
                # Get details for each hash
                details = subprocess.run(
                    ['git', 'log', '-1', '--pretty=format:%h|%an|%ad|%s', '--date=short', h],
                    capture_output=True,
                    text=True,
                    encoding='utf-8'
                )
                if details.returncode == 0:
                    parts = details.stdout.strip().split('|')
                    if len(parts) == 4:
                        f.write(f"| {parts[0]} | {parts[1]} | {parts[2]} | {parts[3]} |\n")
                    else:
                        f.write(f"| {h} | Error parsing | | |\n")
                else:
                    f.write(f"| {h} | Error retrieving | | |\n")
                    
        print(f"Commit history written to {output_file}")
                
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    # Use the walkthrough path provided by the system
    path = r"C:\Users\NAGAR\.gemini\antigravity\brain\581a70fa-7d04-4b11-b5bf-b912f22765b0\all_commits_report.md"
    get_commits(path)
