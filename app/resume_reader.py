from pypdf import PdfReader
from pathlib import Path

resume_path = Path("data/resume.pdf")
reader = PdfReader(resume_path)

text = ""

for page in reader.pages:
    text += page.extract_text() or ""


print(text)
print("Resume text extracted successfully!")


def get_resume_text():
    reader = PdfReader(resume_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    return text