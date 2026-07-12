"""
Script to populate the Pinecone vector database with medical knowledge.
This script processes the medical PDF and creates embeddings for RAG.
"""

import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
import pinecone

# Load environment variables
load_dotenv()

def setup_pinecone():
    """Initialize Pinecone connection"""
    api_key = os.environ.get('PINECONE_API_KEY')
    if not api_key:
        raise ValueError("PINECONE_API_KEY not found in environment variables")
    
    pinecone.init(api_key=api_key)
    return pinecone

def create_or_get_index(index_name="medical-chatbot"):
    """Create or get existing Pinecone index"""
    try:
        # Check if index exists
        if index_name in pinecone.list_indexes():
            print(f"✅ Index '{index_name}' already exists")
            return pinecone.Index(index_name)
        else:
            # Create new index
            print(f"🔄 Creating new index '{index_name}'...")
            pinecone.create_index(
                name=index_name,
                dimension=768,  # Dimension for text-embedding-004
                metric="cosine"
            )
            print(f"✅ Index '{index_name}' created successfully")
            return pinecone.Index(index_name)
    except Exception as e:
        print(f"❌ Error with Pinecone index: {e}")
        raise

def load_and_process_documents(pdf_path="data/Medical_book.pdf"):
    """Load and process the medical PDF document"""
    if not os.path.exists(pdf_path):
        print(f"⚠️  PDF file not found: {pdf_path}")
        print("   Creating a sample medical knowledge base...")
        
        # Create sample medical content
        sample_content = """
        Medical Knowledge Base - Sample Content
        
        Common Symptoms and Conditions:
        
        1. Fever: A body temperature above 100.4°F (38°C). Common causes include infections, inflammatory conditions, and certain medications. Treatment depends on the underlying cause.
        
        2. Headache: Pain or discomfort in the head or neck area. Can be caused by tension, migraines, sinus issues, or more serious conditions. Seek medical attention for severe or sudden headaches.
        
        3. Chest Pain: Can indicate various conditions from heartburn to heart attack. Any chest pain should be evaluated by a healthcare professional, especially if accompanied by shortness of breath or nausea.
        
        4. High Blood Pressure: Blood pressure consistently above 140/90 mmHg. Risk factors include age, family history, obesity, and lifestyle factors. Management includes lifestyle changes and medication.
        
        5. Diabetes: A condition where blood sugar levels are too high. Type 1 diabetes requires insulin, while Type 2 can often be managed with diet, exercise, and medication.
        
        Emergency Symptoms - Seek Immediate Medical Attention:
        - Severe chest pain
        - Difficulty breathing
        - Sudden severe headache
        - Loss of consciousness
        - Severe abdominal pain
        - Signs of stroke (facial drooping, arm weakness, speech difficulties)
        
        General Health Tips:
        - Maintain a balanced diet rich in fruits, vegetables, and whole grains
        - Exercise regularly (at least 150 minutes of moderate activity per week)
        - Get adequate sleep (7-9 hours for adults)
        - Stay hydrated by drinking plenty of water
        - Avoid smoking and limit alcohol consumption
        - Regular health check-ups and screenings
        """
        
        # Split the sample content into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        from langchain_core.documents import Document
        documents = [Document(page_content=sample_content, metadata={"source": "sample_medical_knowledge"})]
        return text_splitter.split_documents(documents)
    
    # Load PDF if it exists
    print(f"📖 Loading PDF: {pdf_path}")
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    
    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    split_documents = text_splitter.split_documents(documents)
    print(f"✅ Processed {len(split_documents)} document chunks")
    
    return split_documents

def main():
    """Main function to set up the vector database"""
    try:
        print("🚀 Setting up GARUN.ai Medical Knowledge Base...")
        
        # Check for API keys
        google_api_key = os.environ.get('GOOGLE_API_KEY')
        pinecone_api_key = os.environ.get('PINECONE_API_KEY')
        
        if not google_api_key:
            print("❌ GOOGLE_API_KEY not found. Please set it in your .env file")
            return
        
        if not pinecone_api_key:
            print("❌ PINECONE_API_KEY not found. Please set it in your .env file")
            return
        
        # Initialize Pinecone
        pinecone = setup_pinecone()
        
        # Create or get index
        index = create_or_get_index()
        
        # Initialize embeddings
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            task_type="RETRIEVAL_DOCUMENT",
            google_api_key=google_api_key
        )
        
        # Load and process documents
        documents = load_and_process_documents()
        
        # Create vector store and add documents
        print("🔄 Creating vector embeddings...")
        vector_store = PineconeVectorStore.from_documents(
            documents=documents,
            embedding=embeddings,
            index_name="medical-chatbot"
        )
        
        print("✅ Medical knowledge base setup complete!")
        print("   Your GARUN.ai chatbot is ready to use medical knowledge.")
        
    except Exception as e:
        print(f"❌ Error setting up knowledge base: {e}")
        print("   Please check your API keys and try again.")

if __name__ == "__main__":
    main()
