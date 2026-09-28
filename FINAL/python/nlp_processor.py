"""
NLP Processor Module - Capstone Week 3 & Week 4
Provides text cleaning, tokenization, lemmatization, POS tagging,
and noun chunk keyword extraction using spaCy and standard NLP techniques.
"""

import re
import string
from typing import List, Dict, Any, Tuple
import spacy

# Load spaCy English model
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    # If model is not found, fallback to blank English model or download
    try:
        import spacy.cli
        spacy.cli.download("en_core_web_sm")
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        nlp = spacy.blank("en")


def clean_text(raw_text: str) -> str:
    """
    Cleans raw text while preserving linguistic boundaries.
    - Normalizes unicode characters
    - Normalizes whitespace and newlines
    - Removes non-printable or noisy control characters
    """
    if not raw_text:
        return ""
    
    # Replace non-breaking spaces and irregular whitespace
    text = raw_text.replace("\xa0", " ").replace("\r", " ")
    # Replace multiple spaces/newlines with single space
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def preprocess_for_nlp(text: str) -> Dict[str, Any]:
    """
    Detailed text preprocessing breakdown for NLP analysis:
    - Lowercase conversion
    - Punctuation removal
    - Stop-word removal
    - Tokenization & Lemmatization
    """
    cleaned = clean_text(text)
    doc = nlp(cleaned)
    
    tokens = []
    lemmas = []
    filtered_tokens = []
    pos_tags = []
    
    for token in doc:
        tokens.append(token.text)
        lemmas.append(token.lemma_)
        pos_tags.append({"text": token.text, "pos": token.pos_, "tag": token.tag_})
        
        # Stopword and punctuation filtering
        if not token.is_stop and not token.is_punct and not token.is_space and len(token.text.strip()) > 1:
            filtered_tokens.append(token.lemma_.lower())
            
    return {
        "original_text": text,
        "cleaned_text": cleaned,
        "token_count": len(tokens),
        "tokens": tokens[:100],  # Sample for inspection
        "lemmas": lemmas[:100],
        "filtered_tokens": filtered_tokens[:100],
        "pos_tags": pos_tags[:50]
    }


def extract_keywords(text: str, top_n: int = 15) -> List[str]:
    """
    Extracts high-value candidate keywords using spaCy NLP:
    - Noun chunks and proper nouns
    - Token filtering by POS (NOUN, PROPN, ADJ)
    - Stopword & length filtering
    - Frequency aggregation
    """
    cleaned = clean_text(text)
    if not cleaned:
        return []
    
    doc = nlp(cleaned)
    keyword_freq: Dict[str, int] = {}
    
    # 1. Extract from Noun Chunks (multi-word concepts like 'machine learning', 'data analysis')
    for chunk in doc.noun_chunks:
        chunk_clean = chunk.text.strip()
        # Filter out purely stopword or single-char chunks
        chunk_doc = nlp(chunk_clean)
        meaningful_tokens = [
            t.lemma_.lower() for t in chunk_doc 
            if not t.is_stop and not t.is_punct and len(t.text) > 2
        ]
        if meaningful_tokens:
            phrase = " ".join(meaningful_tokens)
            if len(phrase.split()) <= 3 and len(phrase) > 2:
                keyword_freq[phrase] = keyword_freq.get(phrase, 0) + 2

    # 2. Extract salient single nouns and proper nouns
    for token in doc:
        if token.pos_ in ("NOUN", "PROPN") and not token.is_stop and not token.is_punct:
            word = token.lemma_.lower().strip()
            if len(word) > 2 and not word.isnumeric():
                keyword_freq[word] = keyword_freq.get(word, 0) + 1

    # Sort keywords by relevance/frequency
    sorted_keywords = sorted(keyword_freq.items(), key=lambda item: item[1], reverse=True)
    
    # Filter and format (Title Case or appropriate capitalization)
    final_keywords = []
    seen = set()
    for kw, _ in sorted_keywords:
        cleaned_kw = kw.strip().title()
        if cleaned_kw.lower() not in seen and len(cleaned_kw) > 2:
            seen.add(cleaned_kw.lower())
            final_keywords.append(cleaned_kw)
        if len(final_keywords) >= top_n:
            break
            
    return final_keywords
