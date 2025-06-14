import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/theme.css'

// Add global styles
const style = document.createElement('style')
style.textContent = `
  html, body, #root {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  * {
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.5);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(128, 128, 128, 0.8);
  }

  .theme-glass ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
  }

  .theme-glass ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
  
  /* Ensure full height layouts */
  .h-full, .h-screen {
    height: 100% !important;
  }
  
  /* Fix for transparent components in glass theme */
  .theme-glass input::placeholder,
  .theme-glass textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  /* Fix for components in glass theme */
  .theme-glass .bg-card,
  .theme-glass .bg-background {
    background-color: rgba(30, 30, 40, 0.6);
    backdrop-filter: blur(8px);
  }
  
  /* Glassmorphism effects */
  .glass-panel {
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }
  
  /* Fix the Index page scrolling */
  body {
    overflow: auto;
  }
`
document.head.appendChild(style)

createRoot(document.getElementById("root")!).render(<App />);