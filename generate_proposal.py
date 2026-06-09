from reportlab.lib.pagesizes import LETTER
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

def create_pdf(filename):
    doc = SimpleDocTemplate(filename, pagesize=LETTER)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = styles['Heading1']
    subtitle_style = styles['Heading2']
    body_style = styles['BodyText']

    elements = []

    # Title
    elements.append(Paragraph("HCI Project Proposal: University Shuttle Tracking System", title_style))
    elements.append(Spacer(1, 12))

    # Submission Info
    elements.append(Paragraph("<b>Submission Deadline:</b> Wednesday, 10th June, 2026. 7am Prompt", body_style))
    elements.append(Spacer(1, 12))

    # System Description
    elements.append(Paragraph("System Description", subtitle_style))
    description = (
        "The University Shuttle Tracking System is a web-based and mobile-friendly platform "
        "designed to help students track campus shuttle buses in real-time. The system provides "
        "information about shuttle locations, routes, estimated arrival times, and service updates. "
        "It aims to reduce waiting times, improve transportation planning, and enhance the overall "
        "commuting experience for students."
    )
    elements.append(Paragraph(description, body_style))
    elements.append(Spacer(1, 12))

    # Intended Users
    elements.append(Paragraph("Intended Users", subtitle_style))
    users_text = (
        "<b>Primary Users:</b> University students who use campus shuttle services.<br/>"
        "<b>Secondary Users:</b> Shuttle drivers and University transport coordinators."
    )
    elements.append(Paragraph(users_text, body_style))
    elements.append(Spacer(1, 12))

    # Problem Statements
    elements.append(Paragraph("Problem Statements", subtitle_style))
    problems = [
        "1. <b>Students</b> need a way to <b>track shuttle locations in real-time</b> because <b>they often wait indefinitely at stops due to a lack of schedule certainty.</b>",
        "2. <b>Students</b> need a way to <b>view integrated route maps and schedules</b> because <b>navigating between different shuttle lines is currently confusing and poorly documented.</b>",
        "3. <b>Transport Coordinators</b> need a way to <b>monitor fleet performance and delays</b> because <b>they cannot optimize shuttle distribution or respond to bottlenecks without real-time data.</b>"
    ]
    for prob in problems:
        elements.append(Paragraph(prob, body_style))
        elements.append(Spacer(1, 6))
    elements.append(Spacer(1, 6))

    # Preliminary Usability Problems
    elements.append(Paragraph("Preliminary Usability Problems to Investigate", subtitle_style))
    usability_issues = [
        "Difficulty locating important information such as shuttle arrival times.",
        "Confusing navigation between routes, schedules, and tracking features.",
        "Poor visibility of notifications regarding delays or route changes.",
        "Difficulty understanding map symbols and shuttle locations.",
        "Excessive steps required to access frequently used features.",
        "Information overload caused by displaying too much transport information at once.",
        "Lack of accessibility support for users with visual impairments."
    ]
    for issue in usability_issues:
        elements.append(Paragraph(f"• {issue}", body_style))
    elements.append(Spacer(1, 12))

    # Expected Benefits
    elements.append(Paragraph("Expected Benefits", subtitle_style))
    benefits = [
        "Reduced waiting times for students.",
        "Improved transportation planning.",
        "Better communication between students and shuttle operators.",
        "Increased user satisfaction with campus transportation services."
    ]
    for benefit in benefits:
        elements.append(Paragraph(f"• {benefit}", body_style))
    elements.append(Spacer(1, 12))

    # Group Members
    elements.append(Paragraph("Group Members", subtitle_style))
    data = [
        ["Name", "Index Number"],
        ["REDOFF OPPONG AGYEMANG", "5230100081"],
        ["LLYWELLYN GYAMERA KRA", "5230100082"],
        ["DAVID MPIANI OWUSU", "5230100083"],
        ["BETTY AGYENIM-BOATENG", "5230100084"],
        ["ALEX OPARE", "5230100085"],
        ["JOSEPH AANINNA", "5230100087"],
        ["JOSEPH MENSAH", "5230100089"],
        ["KELVIN ADJEI MENSAH", "5230100090"]
    ]

    table = Table(data, hAlign='LEFT')
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(table)

    # Build PDF
    doc.build(elements)
    print(f"PDF generated successfully: {filename}")

if __name__ == "__main__":
    create_pdf("HCI_Project_Proposal.pdf")
