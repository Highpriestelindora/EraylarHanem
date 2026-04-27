import os

file_path = r"c:\Users\Administrator\Desktop\Eraylar Hanem React\Eraylar Hanem Moduler\react-app\src\index.css"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace header
content = content.replace(
    ".module-header {\n  padding: 10px 12px 0;\n  border-radius: 0 0 20px 20px;\n  color: white;\n  flex-shrink: 0;\n  margin-bottom: 8px;\n}",
    ".module-header {\n  padding: calc(env(safe-area-inset-top) + 12px) 20px 8px;\n  border-radius: 0 0 24px 24px;\n  color: white;\n  flex-shrink: 0;\n  margin-bottom: 4px;\n  box-shadow: 0 8px 25px rgba(0,0,0,0.08);\n}"
)

# Replace h1
content = content.replace(
    ".header-title h1 {\n  font-size: 20px;\n  color: white;\n  margin: 0;\n  line-height: 1;\n}",
    ".header-title h1 {\n  font-size: 18px;\n  color: white;\n  margin: 0;\n  line-height: 1;\n}"
)

# Replace p
content = content.replace(
    ".header-title p {\n  font-size: 10px;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 2px 0 0;\n  font-weight: 600;\n}",
    ".header-title p {\n  font-size: 9px;\n  color: rgba(255, 255, 255, 0.9);\n  margin: 2px 0 0;\n  font-weight: 700;\n}"
)

# Replace tab-btn font
content = content.replace(
    ".tab-btn {\n  background: transparent;\n  border: none;\n  padding: 4px 8px;\n  border-radius: 10px;\n  color: var(--txt-light);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 2px;\n  font-family: 'Outfit', sans-serif;\n  font-weight: 700;\n  font-size: 10px;\n  white-space: nowrap;\n  position: relative;\n  transition: all 0.3s;\n  cursor: pointer;\n  justify-content: center;\n}",
    ".tab-btn {\n  background: transparent;\n  border: none;\n  padding: 3px 6px;\n  border-radius: 10px;\n  color: var(--txt-light);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 2px;\n  font-family: 'Outfit', sans-serif;\n  font-weight: 700;\n  font-size: 9px;\n  white-space: nowrap;\n  position: relative;\n  transition: all 0.3s;\n  cursor: pointer;\n  justify-content: center;\n}"
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement successful")
