import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Set your Google Gemini API key
GOOGLE_API_KEY = "AIzaSyDBMitXXYpl_iU6zRkm6BJjMTb56lOAUc8"

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Gemini model
model = genai.GenerativeModel('gemini-1.5-flash')

# Medical system prompt for comprehensive health advice
MEDICAL_SYSTEM_PROMPT = """You are a knowledgeable medical AI assistant specializing in providing comprehensive health advice, diet plans, and lifestyle recommendations. 

## Your Expertise:
- Medical conditions and their management
- Nutritional guidance and diet planning
- Exercise and lifestyle recommendations
- Symptom analysis and when to seek medical care
- Preventive healthcare measures

## Response Format Guidelines:
**CRITICAL: Structure your responses with clear formatting using markdown-style formatting:**

1. **Use Headers**: Start with a clear title using ## or ###
2. **Use Bullet Points**: Use • or - for lists
3. **Use Bold Text**: Use **text** for important points
4. **Use Numbered Lists**: Use 1. 2. 3. for step-by-step instructions
5. **Use Line Breaks**: Add blank lines between sections for readability
6. **Keep Sections Short**: Break long responses into digestible sections

## Response Structure Template:
```
## [Condition/Topic Title]

**Brief Explanation** (1-2 sentences)

### 🍎 **Dietary Recommendations**
• Food 1 - reason
• Food 2 - reason
• Food 3 - reason

### ❌ **Foods to Avoid**
• Avoid food 1 - reason
• Avoid food 2 - reason

### 🏃 **Lifestyle Changes**
• Change 1
• Change 2

### ⚠️ **When to See a Doctor**
• Symptom 1
• Symptom 2

### 💡 **Additional Tips**
• Tip 1
• Tip 2
```

## Safety Notice:
Always include a brief disclaimer that your advice is informational and users should consult healthcare professionals for medical diagnosis and treatment.

**IMPORTANT**: Always format your response using the structure above with proper markdown formatting, bullet points, and clear sections. Make it easy to read and scan.

Now, provide comprehensive, helpful medical advice based on the user's query using the structured format above."""

# Chat history storage (simple in-memory storage)
chat_history = {}

def get_chat_history(user_id="default"):
    """Get chat history for a user"""
    return chat_history.get(user_id, [])

def add_to_chat_history(user_id, user_message, ai_response):
    """Add a conversation turn to chat history"""
    if user_id not in chat_history:
        chat_history[user_id] = []
    
    chat_history[user_id].append({
        "timestamp": datetime.now().isoformat(),
        "user": user_message,
        "ai": ai_response
    })
    
    # Keep only last 10 conversations to manage memory
    if len(chat_history[user_id]) > 10:
        chat_history[user_id] = chat_history[user_id][-10:]

def clear_chat_history(user_id="default"):
    """Clear chat history for a user"""
    chat_history[user_id] = []

@app.route("/api/health")
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "ai_enabled": True,
        "message": "Medical chatbot backend is running with Gemini AI"
    })

@app.route("/api/chat", methods=["POST"])
def chat():
    """Main chat endpoint for medical advice"""
    try:
        data = request.json
        user_message = data.get("message", "").strip()
        user_id = data.get("user_id", "default")
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        print(f"User Input: {user_message}")

        # Get chat history for context
        history = get_chat_history(user_id)
        
        # Build context from recent chat history
        context = ""
        if history:
            context = "Previous conversation:\n"
            for turn in history[-3:]:  # Last 3 conversations for context
                context += f"User: {turn['user']}\nAI: {turn['ai']}\n\n"
        
        # Create the full prompt with system instructions and context
        full_prompt = f"{MEDICAL_SYSTEM_PROMPT}\n\n{context}User Query: {user_message}"
        
        # Generate response using Gemini
        response = model.generate_content(full_prompt)
        
        ai_response = response.text
        
        # Add to chat history
        add_to_chat_history(user_id, user_message, ai_response)
        
        print(f"AI Response: {ai_response}")
        
        return jsonify({
            "response": ai_response,
            "ai_enabled": True,
            "status": "success"
        })

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            "error": "Sorry, I encountered an error processing your request. Please try again.",
            "ai_enabled": True,
            "status": "error"
        }), 500

@app.route("/api/clear-history", methods=["POST"])
def clear_chat_history_endpoint():
    """Clear chat history endpoint"""
    try:
        data = request.json
        user_id = data.get("user_id", "default")
        clear_chat_history(user_id)
        return jsonify({"status": "success", "message": "Chat history cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/nearby-hospitals", methods=["POST"])
def nearby_hospitals():
    """Get nearby hospitals (mock implementation)"""
    try:
        data = request.json
        location = data.get("location", "Unknown")
        
        # Mock hospital data - in a real app, you'd use Google Places API or similar
        hospitals = [
            {
                "name": "City General Hospital",
                "address": "123 Main St, " + location,
                "phone": "(555) 123-4567",
                "distance": "2.3 km",
                "rating": 4.2
            },
            {
                "name": "Metro Medical Center",
                "address": "456 Health Ave, " + location,
                "phone": "(555) 987-6543",
                "distance": "3.7 km",
                "rating": 4.5
            },
            {
                "name": "Community Health Clinic",
                "address": "789 Care Blvd, " + location,
                "phone": "(555) 456-7890",
                "distance": "1.8 km",
                "rating": 4.0
            }
        ]
        
        return jsonify({
            "hospitals": hospitals,
            "location": location,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Medical Chatbot Backend with Gemini AI...")
    print("   AI Model: Gemini 1.5 Flash")
    print("   Server running on: http://localhost:5001")
    print("   Ready to provide medical advice, diet plans, and health guidance!")
    app.run(host="0.0.0.0", port=5001, debug=True)
