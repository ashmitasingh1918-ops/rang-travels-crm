import io

def generate_pdf_quotation(quotation_data: dict) -> bytes:
    # Generates standard PDF stubs for tours and quotes
    pdf_buffer = io.BytesIO()
    pdf_buffer.write(b"%PDF-1.4 Mock PDF Content representing Rang Travels quotation details")
    return pdf_buffer.getvalue()
