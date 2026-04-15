# Al-Mufassir: Audio Diarization Service

Al-Mufassir is a sophisticated web application designed specifically for the transcription and speaker diarization of Quranic Tafseer audio. Leveraging the power of Google's **Gemini 1.5 Pro**, the service accurately distinguishes between three distinct roles: Arabic Recitation, Translation, and Tafseer (Explanation).

## ✨ Key Features

- **3-Speaker Diarization**: Specialized AI logic to identify and separate Arabic recitation, translation, and scholarly explanation.
- **Gemini 1.5 Pro Engine**: High-fidelity transcription and speaker identification using state-of-the-art multimodal AI.
- **Sophisticated Dark UI**: A premium, "Studio" aesthetic designed for focus and readability, featuring elegant typography and glassmorphism.
- **Interactive Transcript**:
  - **Color-coded Speakers**: Visual badges and dots for quick identification.
  - **Time-stamped Segments**: Precise timing for every spoken part.
  - **Arabic Support**: Right-to-left (RTL) rendering with specialized serif fonts for Quranic text.
- **Export Options**: Download full transcripts as `.txt` files or copy segments/full text to the clipboard.
- **Integrated Audio Player**: Listen to the source audio while reviewing the transcript.
- **Processing History**: Local storage integration to revisit past diarization results.

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4 (Utility-first)
- **Components**: Shadcn UI (Radix UI primitives)
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **AI Integration**: `@google/genai` (Gemini API)
- **Fonts**: Inter (Sans) & Noto Serif Arabic (Serif)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository** (or download the source).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open the app**: Navigate to `http://localhost:3000` in your browser.

## 📐 Architecture & Workflow

1. **Upload**: User provides an audio file (MP3, WAV, M4A) via a drag-and-drop interface.
2. **Process**: The file is converted to Base64 (for files < 20MB) and sent to the Gemini 1.5 Pro model.
3. **Diarize**: A specialized prompt instructs the model to analyze linguistic patterns and frequencies to identify the three speaker roles.
4. **Display**: The structured JSON response is parsed into a scrollable, interactive transcript view.
5. **Persist**: Results are saved to `localStorage` for quick access in the "History" tab.

## 📝 License

This project is for educational and scholarly purposes.

---
*Built with ❤️ for the Quranic Research Community.*
