#!/usr/bin/env python3
"""Generate cv-raul.pdf replicating the existing two-column résumé layout.

Run with the project venv: /tmp/cvpdf/bin/python scripts/generate_cv.py
Outputs to public/cv-raul.pdf
"""
import os
from PIL import Image, ImageDraw
from fpdf import FPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")

# ---- palette (sampled from the original CV) ----
SIDEBAR = (151, 141, 134)      # taupe/grey-brown
SIDEBAR_TEXT = (255, 255, 255)
INK = (60, 66, 74)             # dark slate headings
BODY = (90, 96, 104)           # body grey
RULE = (200, 195, 190)

# ---- geometry (A4 = 210 x 297 mm) ----
PAGE_W, PAGE_H = 210, 297
SIDE_W = 68                    # sidebar width
MX = SIDE_W + 10               # main content left margin
MAIN_W = PAGE_W - MX - 12      # usable width in main column


def make_circle_avatar(src, out, size=512):
    """Crop me.png to a circle with transparent corners."""
    im = Image.open(src).convert("RGBA").resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    im.putalpha(mask)
    out_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out_img.paste(im, (0, 0), im)
    out_img.save(out)
    return out


class CV(FPDF):
    def header(self):
        # full-height sidebar
        self.set_fill_color(*SIDEBAR)
        self.rect(0, 0, SIDE_W, PAGE_H, "F")

    def footer(self):
        pass


def sidebar_heading(pdf, text, y):
    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "B", 15)
    pdf.set_text_color(*SIDEBAR_TEXT)
    pdf.cell(SIDE_W - 12, 7, text)
    pdf.set_draw_color(*SIDEBAR_TEXT)
    pdf.set_line_width(0.4)
    pdf.line(6, y + 8.5, SIDE_W - 8, y + 8.5)
    return y + 13


def main_heading(pdf, text, y):
    pdf.set_xy(MX, y)
    pdf.set_font("Helvetica", "B", 17)
    pdf.set_text_color(*INK)
    pdf.cell(MAIN_W, 8, text)
    pdf.set_draw_color(*RULE)
    pdf.set_line_width(0.5)
    pdf.line(MX, y + 9.5, PAGE_W - 12, y + 9.5)
    return y + 14


def bullet(pdf, lead, rest, x, y, w):
    """A bulleted line with a bold lead-in. Wraps within the main column
    (constrained by temporary margins so it never bleeds into the sidebar)."""
    # constrain wrapping to the main column
    pdf.set_left_margin(x + 4)
    pdf.set_right_margin(PAGE_W - (MX + MAIN_W))
    # dot
    pdf.set_xy(x, y)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*BODY)
    pdf.cell(4, 4.5, chr(149))
    # text
    pdf.set_xy(x + 4, y)
    if lead:
        pdf.set_font("Helvetica", "B", 8.7)
        pdf.write(4.5, "{}: ".format(lead))
    pdf.set_font("Helvetica", "", 8.7)
    pdf.write(4.5, rest)
    pdf.ln(4.5)
    new_y = pdf.get_y() + 1.5
    # restore full-page margins
    pdf.set_left_margin(0)
    pdf.set_right_margin(0)
    return new_y


def main():
    avatar = make_circle_avatar(
        os.path.join(PUBLIC, "me.png"), os.path.join("/tmp", "avatar_circle.png")
    )

    pdf = CV(format="A4", unit="mm")
    pdf.set_auto_page_break(False)
    pdf.set_margins(0, 0, 0)
    pdf.add_page()

    # ---------------- SIDEBAR ----------------
    # avatar circle, centered in sidebar
    av_d = 44
    av_x = (SIDE_W - av_d) / 2
    pdf.image(avatar, x=av_x, y=14, w=av_d, h=av_d)

    y = 14 + av_d + 8

    # Contacto
    y = sidebar_heading(pdf, "Contacto", y)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*SIDEBAR_TEXT)
    contacts = [
        ("GitHub", "github.com/raulbr99"),
        ("LinkedIn", "linkedin.com/in/raulbr99"),
        ("Web", "rauldev.dev"),
    ]
    for label, val in contacts:
        pdf.set_xy(6, y)
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(SIDE_W - 12, 4.6, label)
        y += 4.6
        pdf.set_xy(6, y)
        pdf.set_font("Helvetica", "", 8)
        pdf.cell(SIDE_W - 12, 4.6, val)
        y += 6.8

    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(SIDE_W - 12, 4.6, "Telefono")
    y += 4.6
    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(SIDE_W - 12, 4.6, "+34 680 359 990")
    y += 6.8

    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(SIDE_W - 12, 4.6, "Email")
    y += 4.6
    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "", 7.5)
    pdf.cell(SIDE_W - 12, 4.6, "raulbernariera99@gmail.com")
    y += 11

    # Educacion
    y = sidebar_heading(pdf, "Educacion", y)
    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(*SIDEBAR_TEXT)
    pdf.multi_cell(
        SIDE_W - 12, 4.4,
        "Estudios en Ingenieria Informatica\nUniversidad de Alicante",
    )
    y = pdf.get_y() + 9

    # Idiomas
    y = sidebar_heading(pdf, "Idiomas", y)
    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.cell(SIDE_W - 12, 4.6, "Espanol")
    y += 4.6
    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(SIDE_W - 12, 4.6, "Nativo")
    y += 6.5
    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.cell(SIDE_W - 12, 4.6, "Ingles")
    y += 4.6
    pdf.set_xy(6, y)
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(SIDE_W - 12, 4.6, "Profesional")

    # ---------------- MAIN COLUMN ----------------
    # name
    pdf.set_xy(MX, 16)
    pdf.set_text_color(*INK)
    pdf.set_font("Helvetica", "B", 30)
    pdf.write(12, "Raul ")
    pdf.set_font("Helvetica", "", 30)
    pdf.write(12, "Berna")
    pdf.set_xy(MX, 29)
    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(*BODY)
    pdf.cell(MAIN_W, 8, "Fullstack Developer")

    # summary
    pdf.set_xy(MX, 40)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*BODY)
    pdf.multi_cell(
        MAIN_W, 4.6,
        "Desarrollador de software de Alicante, apasionado por la tecnologia y el "
        "aprendizaje continuo. Especializado en aplicaciones web e IA conversacional "
        "(chat y voz), construyendo plataformas SaaS de extremo a extremo. Valoro la "
        "constancia y la orientacion a resultados, con el objetivo de aportar impacto "
        "real al negocio.",
    )

    y = pdf.get_y() + 4
    y = main_heading(pdf, "Experiencia", y)

    # --- experience 1: current ---
    pdf.set_xy(MX, y)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*INK)
    pdf.cell(MAIN_W, 5, "Oct 2025 - Actualidad")
    y += 5
    pdf.set_xy(MX, y)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*BODY)
    pdf.cell(MAIN_W, 4.6, "Nanonino SL | Alicante, Espana  -  Fullstack Developer")
    y += 6
    exp1 = [
        ("TalkRev", "plataforma SaaS de IA conversacional multi-tenant con chat y voz en tiempo real (dashboard del agente y suite de reservas)."),
        ("Pipeline RAG", "para dar contexto a los agentes sobre la base de conocimiento de cada cliente."),
        ("Agentes", "conversacionales y de voz en tiempo real, e integraciones con otros agentes de IA."),
        ("PartsNow.ai", "marketplace de recambios con busqueda por chat, voz, foto o VIN sobre +50.000 piezas y checkout unificado."),
        ("Pagos y envios", "integracion de pasarelas de pago y envios automatizados, con backend y despliegue continuo en la nube."),
    ]
    for lead, rest in exp1:
        y = bullet(pdf, lead, rest, MX, y, MAIN_W)

    y += 2
    # --- experience 2 ---
    pdf.set_xy(MX, y)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*INK)
    pdf.cell(MAIN_W, 5, "Sep 2022 - Jun 2024")
    y += 5
    pdf.set_xy(MX, y)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*BODY)
    pdf.cell(MAIN_W, 4.6, "Nanonino SL | Alicante, Espana  -  Fullstack Developer")
    y += 6
    exp2 = [
        ("Aplicaciones web", "progresivas con buen rendimiento gestionando grandes volumenes de datos."),
        ("Contratos inteligentes", "optimizando interacciones y transacciones digitales en blockchain."),
        ("Sistema de reservas con IA", "para campos de golf con interacciones por voz y chat."),
        ("E-commerce", "de productos CBD con landing, catalogo y buscador avanzado con Algolia."),
    ]
    for lead, rest in exp2:
        y = bullet(pdf, lead, rest, MX, y, MAIN_W)

    y += 2
    # --- experience 3 ---
    pdf.set_xy(MX, y)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*INK)
    pdf.cell(MAIN_W, 5, "Ene 2022 - May 2022")
    y += 5
    pdf.set_xy(MX, y)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*BODY)
    pdf.cell(MAIN_W, 4.6, "Evvant SL | Murcia, Espana  -  Fullstack Developer")
    y += 6
    exp3 = [
        ("Sistema de reservas", "completo con ReactJS y NodeJS optimizado para escalabilidad y seguridad."),
        ("Mapa interactivo", "dinamico que facilitaba la eleccion y reserva de unidades."),
    ]
    for lead, rest in exp3:
        y = bullet(pdf, lead, rest, MX, y, MAIN_W)

    y += 3
    y = main_heading(pdf, "Skills", y)
    skills = [
        ("Lenguajes", "JavaScript, TypeScript, Python, Node.js, HTML, CSS"),
        ("Frameworks", "React, Next.js, NestJS, FastAPI, Express, Tailwind CSS"),
        ("IA", "OpenAI, LangChain / LangGraph, RAG, agentes de chat y voz"),
        ("Bases de datos", "PostgreSQL, Supabase, MongoDB, Redis, Qdrant"),
        ("Cloud & DevOps", "Vercel, Google Cloud, AWS, Docker, Git, GitHub"),
        ("Soft skills", "trabajo en equipo, comunicacion, autonomia, aprendizaje continuo"),
    ]
    for lead, rest in skills:
        y = bullet(pdf, lead, rest, MX, y, MAIN_W)

    out = os.path.join(PUBLIC, "cv-raul.pdf")
    pdf.output(out)
    print("WROTE", out, "y_end=", round(y, 1))


if __name__ == "__main__":
    main()
