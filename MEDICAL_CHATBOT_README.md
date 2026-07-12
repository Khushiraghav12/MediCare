# 🤖 GARUN.ai Medical Chatbot Integration

This document explains how to integrate and run the advanced medical chatbot with LLMs, LangChain, Pinecone, and Flask into your existing GARUN.ai chat system.

## 🚀 Features

- **Advanced AI Medical Assistant**: Powered by Google Gemini 1.5 Flash
- **Retrieval-Augmented Generation (RAG)**: Uses medical knowledge base for accurate responses
- **Conversational Memory**: Remembers context throughout conversations
- **Vector Database**: Pinecone for efficient medical knowledge retrieval
- **Modern UI**: Integrated with your existing GARUN.ai chat interface
- **Demo Mode**: Works without API keys for testing

## 📁 Project Structure

```
SIH_frontend/
├── medical_chatbot/           # Medical chatbot backend
│   ├── app.py               # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── env_example.txt      # Environment variables template
│   ├── store_index.py       # Vector database setup
│   ├── start_chatbot.bat    # Windows startup script
│   └── src/
│       ├── __init__.py
│       ├── prompt.py        # System prompts
│       └── memory.py        # Chat history management
├── js/chat.js               # Updated frontend integration
├── css/chat.css             # Updated styles
├── chat.html                # Existing chat interface
└── setup_medical_chatbot.bat # Complete setup script
```

## 🛠️ Setup Instructions

### Option 1: Quick Setup (Recommended)

1. **Run the setup script**:
   ```bash
   setup_medical_chatbot.bat
   ```

2. **Add your API keys** when prompted:
   - Edit `medical_chatbot/.env` file
   - Add your Google API key and Pinecone API key

3. **Run the setup script again** to complete installation

### Option 2: Manual Setup

1. **Navigate to medical chatbot directory**:
   ```bash
   cd medical_chatbot
   ```

2. **Create environment file**:
   ```bash
   copy env_example.txt .env
   ```

3. **Edit `.env` file** with your API keys:
   ```
   GOOGLE_API_KEY="your_google_api_key_here"
   PINECONE_API_KEY="your_pinecone_api_key_here"
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up vector database**:
   ```bash
   python store_index.py
   ```

6. **Start the backend**:
   ```bash
   python app.py
   ```

## 🔑 API Keys Setup

### Google API Key (Required for AI features)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### Pinecone API Key (Required for knowledge base)

1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create a new account or sign in
3. Create a new project
4. Copy the API key to your `.env` file

## 🚀 Running the System

### 1. Start the Medical Chatbot Backend

```bash
cd medical_chatbot
python app.py
```

The backend will run on `http://localhost:5001`

### 2. Open the Frontend

Open `chat.html` in your browser or serve it through a web server.

### 3. Test the Integration

- The chat interface will automatically connect to the medical chatbot backend
- You'll see a notification indicating the connection status
- Start chatting with GARUN.ai about medical topics!

## 🔧 Configuration

### Backend Configuration

The medical chatbot backend (`medical_chatbot/app.py`) can be configured:

- **Port**: Change `port=5001` to use a different port
- **Model**: Change `model="gemini-1.5-flash-latest"` to use a different Gemini model
- **Temperature**: Adjust `temperature=0.3` for response creativity
- **Retrieval**: Modify `search_kwargs={"k": 3}` for more/fewer context chunks

### Frontend Configuration

The frontend (`js/chat.js`) can be configured:

- **API URL**: Change `CHATBOT_API_URL` to point to a different backend
- **Health Check**: Modify `HEALTH_CHECK_URL` for status monitoring
- **Timeout**: Adjust response timeout settings

## 📊 API Endpoints

### Backend Endpoints

- `GET /api/health` - Health check and status
- `POST /api/chat` - Send message to medical chatbot
- `POST /api/clear-history` - Clear chat history

### Example API Usage

```javascript
// Send a message
const response = await fetch('http://localhost:5001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What are the symptoms of flu?' })
});

const data = await response.json();
console.log(data.response); // AI response
```

## 🎯 Usage Examples

### Medical Questions
- "What are the symptoms of diabetes?"
- "How do I manage high blood pressure?"
- "What should I do if I have a fever?"
- "Explain the side effects of aspirin"

### Health Advice
- "Give me tips for a healthy diet"
- "How much exercise should I do daily?"
- "What are the benefits of drinking water?"
- "How can I improve my sleep?"

### Emergency Guidance
- "What are signs of a heart attack?"
- "When should I go to the emergency room?"
- "How do I perform CPR?"

## 🔍 Troubleshooting

### Backend Not Starting
- Check if Python is installed: `python --version`
- Verify dependencies: `pip install -r requirements.txt`
- Check API keys in `.env` file
- Ensure port 5001 is available

### Frontend Not Connecting
- Verify backend is running on `http://localhost:5001`
- Check browser console for errors
- Ensure CORS is enabled (already configured)
- Try refreshing the page

### AI Responses Not Working
- Verify Google API key is valid
- Check Pinecone API key and index setup
- Run `python store_index.py` to rebuild knowledge base
- Check backend logs for error messages

### Demo Mode Issues
- The system runs in demo mode without API keys
- Responses will be basic and not AI-powered
- Add API keys to enable full functionality

## 🚀 Advanced Features

### Custom Medical Knowledge
- Add your own medical PDFs to `medical_chatbot/data/`
- Run `python store_index.py` to update the knowledge base
- The chatbot will use your custom medical information

### Multiple Chat Sessions
- Each browser tab maintains separate chat history
- Backend supports multiple concurrent users
- Chat history is stored in memory (resets on restart)

### Integration with Existing Systems
- The backend can be integrated with your existing medical report analysis
- Combine with your ML models for comprehensive health insights
- Extend the API for custom medical applications

## 📝 Development Notes

### Adding New Features
1. Modify `medical_chatbot/app.py` for backend changes
2. Update `js/chat.js` for frontend integration
3. Test with both demo and AI modes
4. Update this README with new features

### Customizing Responses
- Edit `medical_chatbot/src/prompt.py` for system prompts
- Modify response handling in `medical_chatbot/app.py`
- Customize UI in `css/chat.css` and `js/chat.js`

## 🎉 Success!

Your GARUN.ai medical chatbot is now fully integrated! The system provides:

- ✅ Advanced AI medical assistance
- ✅ Conversational memory
- ✅ Medical knowledge base
- ✅ Modern chat interface
- ✅ Easy setup and configuration

**Happy chatting with GARUN.ai!** 🤖💊

---

*For support or questions, check the troubleshooting section or review the code comments.*
