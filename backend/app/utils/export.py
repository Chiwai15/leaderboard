import csv
import io
import os
from flask import send_file
from fpdf import FPDF
from datetime import datetime

EXPORT_DIR = "exports"

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))  # /app
EXPORT_DIR = os.path.join(BASE_DIR, "exports")


def ensure_export_dir():
    if not os.path.exists(EXPORT_DIR):
        os.makedirs(EXPORT_DIR)


def export_csv(users):
    proxy = io.StringIO()
    writer = csv.writer(proxy)
    writer.writerow(["UUID", "First Name", "Last Name", "Score", "Gender", "Created At"])

    for user in users:
        writer.writerow([
            user.uuid,
            user.firstname,
            user.lastname,
            user.score,
            user.gender,
            user.created_at.strftime("%Y-%m-%d")
        ])

    # Encode to bytes and wrap in BytesIO for Flask
    mem = io.BytesIO()
    mem.write(proxy.getvalue().encode("utf-8"))
    mem.seek(0)
    proxy.close()

    return send_file(
        mem,
        mimetype="text/csv",
        as_attachment=True,
        download_name=f"leaderboard_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    )


def export_pdf(users) -> str:
    ensure_export_dir()
    filename = os.path.join(EXPORT_DIR, f"leaderboard_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf")

    pdf = FPDF()
    pdf.add_page()
    pdf.set_left_margin(14)
    pdf.set_right_margin(14)

    # Title
    pdf.set_font("Helvetica", "B", 28)
    title = "Leaderboard"
    title_width = pdf.get_string_width(title) + 6
    page_width = pdf.w - pdf.l_margin - pdf.r_margin
    pdf.set_x((page_width - title_width) / 2 + pdf.l_margin)
    pdf.cell(title_width, 15, title, ln=True, align="C")
    pdf.ln(10)

    # Table setup
    pdf.set_font("Arial", "B", 12)
    pdf.set_draw_color(200)              # light gray borders
    pdf.set_fill_color(40, 81, 91)        # dark blue background (#00008B)
    pdf.set_text_color(255, 255, 255)    # white text

    header = ["UUID", "First Name", "Last Name", "Score", "Gender", "Created At"]
    col_widths = [30, 35, 35, 20, 20, 35]
    table_width = sum(col_widths)

    # Center the table
    pdf.set_x((pdf.w - table_width) / 2)

    # Header row
    for i, col in enumerate(header):
        pdf.cell(col_widths[i], 10, col, border=1, align="C", fill=True)
    pdf.ln()

    # Rows
    pdf.set_font("Arial", "", 11)
    pdf.set_text_color(0)  # reset to black text
    pdf.set_fill_color(255, 255, 255)  # reset fill

    for user in users:
        row = [
            user.uuid,
            user.firstname,
            user.lastname,
            str(user.score),
            user.gender,
            user.created_at.strftime("%Y-%m-%d")
        ]
        pdf.set_x((pdf.w - table_width) / 2)
        for i, item in enumerate(row):
            pdf.cell(col_widths[i], 10, item, border=1, align="C")
        pdf.ln()

    # Output to in-memory buffer
    mem = io.BytesIO()
    pdf_bytes = pdf.output(dest='S').encode('latin1')
    mem.write(pdf_bytes)
    mem.seek(0)
    
    return send_file(
        mem,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"leaderboard_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    )

