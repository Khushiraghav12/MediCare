from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.chat_history import BaseChatMessageHistory
from typing import List
import json

class SimpleChatHistory(BaseChatMessageHistory):
    """Simple in-memory chat history implementation"""
    
    def __init__(self):
        self.messages: List = []
    
    def add_message(self, message):
        """Add a message to the history"""
        self.messages.append(message)
    
    def clear(self):
        """Clear all messages from history"""
        self.messages = []

# Global chat history instance
_chat_history = SimpleChatHistory()

def get_chat_history() -> BaseChatMessageHistory:
    """Get the current chat history"""
    return _chat_history

def add_to_history(user_input: str, ai_response: str):
    """Add a conversation turn to the history"""
    _chat_history.add_message(HumanMessage(content=user_input))
    _chat_history.add_message(AIMessage(content=ai_response))

def clear_history():
    """Clear the chat history"""
    _chat_history.clear()

def get_history_length() -> int:
    """Get the number of messages in history"""
    return len(_chat_history.messages)

def get_recent_messages(count: int = 10) -> List:
    """Get the most recent messages"""
    return _chat_history.messages[-count:] if _chat_history.messages else []
