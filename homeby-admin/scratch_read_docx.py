import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = "/home/nasemul/Documents/Mominul Freelance Project/HomeBy-Admin/homeby-admin-frontend-spec.docx"
txt_out_path = "/home/nasemul/Documents/Mominul Freelance Project/HomeBy-Admin/homeby-admin/scratch_docx_content.txt"

def get_docx_text(path):
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespaces for Word XML elements
            namespaces = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            }
            
            paragraphs = []
            for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [node.text for node in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                if texts:
                    paragraphs.append("".join(texts))
            return "\n".join(paragraphs)
    except Exception as e:
        return f"Error: {str(e)}"

text = get_docx_text(docx_path)
with open(txt_out_path, "w", encoding="utf-8") as f:
    f.write(text)

print(f"Extracted docx text length: {len(text)}")
