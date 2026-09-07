# Kudupudi Yuvaraj Portfolio

A dependency-free portfolio built with HTML, CSS, and JavaScript.

## Projects

### Automated Road Damage Detection
- GitHub: https://github.com/Yuvaraj9121/Automated-Road-Damage
- Live demo: https://automated-road-damage-jymhfucep3reckzxvycsft.streamlit.app/
- The web demo performs image-based YOLO inference. It should not be described as continuous webcam/video real-time detection unless that capability is separately benchmarked.

### Fake Face Detection Using LBPNET
- GitHub: https://github.com/Yuvaraj9121/Fake-Image_Detection
- The model classifies fake/non-fake face images for the project dataset. It should not be presented as a general-purpose deepfake detector.

### AI-Assisted APT Detection (RANK)
- GitHub: https://github.com/Yuvaraj9121/AI-Assisted-APT-Detection-RANK-
- The repository contains the project implementation and documentation; a public live demo is not currently claimed.

## Accessibility
The portfolio is implemented with semantic navigation, labelled form controls, keyboard-visible focus styles, a skip link, mobile menu state, and reduced-motion support. These are implementation measures; browser-level WCAG testing should still be performed before making a formal accessibility conformance claim.

## Contact form / privacy
The contact form uses IndexedDB only as a local browser demo. Messages are stored on the visitor's device and are **not sent to the portfolio owner**. No server-side database or email delivery is implemented by the form.

## Add your photo
Put your photo in this folder with the exact filename `profile.jpg` if you want to replace the placeholder portrait.

## Run
Open `index.html` in a browser. For the most reliable IndexedDB behavior, serve the folder with any local static server.

## Local database
The contact form creates an IndexedDB database named `yuvarajPortfolio` with a `messages` object store. Data is stored locally in the browser and is not sent to a server.
