"""PDF and DOCX text extraction with cleaning."""

import re
import unicodedata

import fitz  # PyMuPDF
from docx import Document

from config import MIN_EXTRACTED_TEXT_LENGTH


class ParseError(Exception):
    """Raised when text extraction or cleaning fails."""

    pass


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract all text from a PDF file using PyMuPDF."""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        pages: list[str] = []
        for page in doc:
            pages.append(page.get_text())
        doc.close()
        return "\n".join(pages)
    except Exception as exc:
        raise ParseError(f"Failed to parse PDF: {exc}") from exc


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract all text from a DOCX file using python-docx."""
    try:
        doc = Document(stream=file_bytes)
        paragraphs: list[str] = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paragraphs)
    except Exception as exc:
        raise ParseError(f"Failed to parse DOCX: {exc}") from exc


def clean_text(text: str) -> str:
    """Normalise whitespace, strip non-printable characters, validate length."""
    # Normalise unicode (NFC)
    text = unicodedata.normalize("NFC", text)

    # Remove non-printable / control characters except newline and tab
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)

    # Collapse 3+ consecutive newlines into 2
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Collapse 3+ consecutive spaces into 1
    text = re.sub(r" {3,}", " ", text)

    # Replace non-breaking spaces with regular spaces
    text = text.replace("\u00a0", " ")

    # Trim
    text = text.strip()

    if len(text) < MIN_EXTRACTED_TEXT_LENGTH:
        raise ParseError(
            "Insufficient text extracted — the file may be image-based or empty. "
            "Please upload a text-based document."
        )

    return text