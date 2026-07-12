import os
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Load environment variables from .env file
load_dotenv()

# --- Configuration and Initialization ---

# Set API Keys from environment variables
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

if not PINECONE_API_KEY or not GOOGLE_API_KEY or PINECONE_API_KEY == "demo_key" or GOOGLE_API_KEY == "demo_key":
    print("⚠️  WARNING: Missing or demo API keys. Running in demo mode.")
    print("   To enable full AI features, please set real API keys in .env file")
    AI_ENABLED = False
else:
    print("✅ API keys found. Initializing AI system...")
    AI_ENABLED = True

# Demo responses for when AI is not available
DEMO_RESPONSES = {
    "hello": "Hello! I'm GARUN.ai, your AI health assistant. I'm currently running in demo mode. To enable full AI capabilities, please set up your Google API key and Pinecone API key in the .env file.",
    "symptoms": "I can help analyze symptoms, but I need API keys to access my medical knowledge base. Please configure your Google API key and Pinecone API key to enable full AI features.",
    "health": "I'm designed to provide health information and medical advice, but I'm currently running in demo mode. Add your API keys to unlock my full potential!",
    "diabetes": "Diabetes is a chronic condition that affects how your body processes blood sugar. There are two main types: Type 1 and Type 2. For detailed information, please enable AI features with your API keys.",
    "blood pressure": "Blood pressure is the force of blood against your artery walls. Normal blood pressure is typically around 120/80 mmHg. High blood pressure can lead to serious health problems.",
    "fever": "A fever is a body temperature above 100.4°F (38°C). It's usually a sign that your body is fighting an infection. If you have a high fever or other concerning symptoms, consult a healthcare professional.",
    "headache": "Headaches can have many causes including tension, migraines, dehydration, or stress. If you have severe or sudden headaches, seek medical attention immediately.",
    "emergency": "If you're experiencing a medical emergency, call your local emergency number immediately. For non-emergency concerns, I'm here to help with general health questions.",
    "default": "I'm GARUN.ai, your AI health assistant. I'm currently in demo mode. To enable full AI capabilities with medical knowledge base, please add your Google API key and Pinecone API key to the .env file."
}

# --- Flask Routes ---

@app.route("/")
def index():
    return jsonify({
        "message": "GARUN.ai Medical Chatbot API is running",
        "status": "healthy",
        "ai_enabled": AI_ENABLED,
        "endpoints": {
            "health": "/api/health",
            "chat": "/api/chat",
            "clear_history": "/api/clear-history"
        }
    })

@app.route("/api/health")
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "ai_enabled": AI_ENABLED,
        "message": "GARUN.ai Medical Chatbot backend is running",
        "mode": "demo" if not AI_ENABLED else "ai_enabled"
    })

@app.route("/api/chat", methods=["POST"])
def chat():
    """Main chat endpoint for GARUN.ai integration"""
    try:
        data = request.json
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        print(f"User Input: {user_message}")

        if not AI_ENABLED:
            # Demo mode responses
            user_lower = user_message.lower()
            
            # Check for keywords in the message
            response_text = DEMO_RESPONSES["default"]
            for keyword, response in DEMO_RESPONSES.items():
                if keyword in user_lower:
                    response_text = response
                    break
            
            return jsonify({
                "response": response_text,
                "ai_enabled": False,
                "status": "demo_mode"
            })

        # If AI is enabled, this would call the actual AI system
        # For now, return a message about enabling AI
        return jsonify({
            "response": "AI features are enabled but not fully configured. Please check your API keys and vector database setup.",
            "ai_enabled": True,
            "status": "ai_enabled"
        })

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            "error": "Sorry, I encountered an error processing your request.",
            "ai_enabled": AI_ENABLED,
            "status": "error"
        }), 500

@app.route("/api/clear-history", methods=["POST"])
def clear_chat_history():
    """Clear chat history endpoint"""
    try:
        return jsonify({"status": "success", "message": "Chat history cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Main Execution ---

if __name__ == '__main__':
    print("🚀 Starting GARUN.ai Medical Chatbot Backend...")
    print(f"   AI Enabled: {AI_ENABLED}")
    print("   Server running on: http://localhost:5001")
    print("   Frontend: Open chat.html in your browser")
    app.run(host="0.0.0.0", port=5001, debug=True)
