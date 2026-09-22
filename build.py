#!/usr/bin/env python3
"""
Genera las páginas estáticas del sitio de Werchow a partir de los partials en /partials.
Uso: python3 build.py
Para agregar una página nueva: crear su contenido en partials/<nombre>.html,
agregar una entrada a PAGES abajo, y sumarla a las listas de NAV_KEYS / footer si corresponde.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(ROOT, 'partials')

def read(name):
    with open(os.path.join(P, f'{name}.html'), encoding='utf-8') as f:
        return f.read()

nav_tpl = read('nav')
footer_tpl = read('footer')
whatsapp = read('whatsapp')
theme_inline = read('theme_inline')

HREFS = {
    'HOME': 'index.html',
    'NOSOTROS': 'nosotros.html',
    'RESENAS': 'resenas.html',
    'HOMENAJES': 'homenajes.html',
    'CONVENIOS': 'convenios.html',
    'PLANES': 'planes.html',
    'CONTACTO': 'contacto.html',
}

NAV_KEYS = ['INICIO', 'NOSOTROS', 'CONVENIOS', 'PLANES', 'HOMENAJES', 'CONTACTO']
KEY_TO_HREF_KEY = {
    'INICIO': 'HOME', 'NOSOTROS': 'NOSOTROS', 'CONVENIOS': 'CONVENIOS',
    'PLANES': 'PLANES', 'HOMENAJES': 'HOMENAJES', 'CONTACTO': 'CONTACTO',
}

def render_nav(active_key):
    html = nav_tpl
    for href_key, href_val in HREFS.items():
        html = html.replace(f'__{href_key}__', href_val)
    for key in NAV_KEYS:
        token = f'__CUR_{key}__'
        html = html.replace(token, ' aria-current="page"' if key == active_key else '')
    return html

def render_footer():
    html = footer_tpl
    for href_key, href_val in HREFS.items():
        html = html.replace(f'__{href_key}__', href_val)
    return html

def page_meta(num, title):
    """Encabezado corrido calcado del manual: filete, número y versalitas espaciadas."""
    return f"""<div class="page-meta">
  <div class="container page-meta-inner">
    <span class="pm-num">{num}</span>
    <span class="pm-rest">
      <span class="pm-title">{title}</span>
      <span class="pm-right">Werchow</span>
    </span>
  </div>
</div>

"""

def head(title, description, og_title=None, og_description=None):
    og_title = og_title or title
    og_description = og_description or description
    return f'''<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{description}">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{og_description}">
<meta property="og:type" content="website">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="preload" href="assets/fonts/Larken-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/styles.css">
</head>
'''

def render_links(html):
    for href_key, href_val in HREFS.items():
        html = html.replace(f'__{href_key}__', href_val)
    return html

def assemble(active_key, title, description, main_html, extra_scripts=''):
    main_html = render_links(main_html)
    out = []
    out.append(head(title, description))
    out.append('<body>\n')
    out.append(theme_inline)
    out.append('\n\n<!-- ============ PROGRESS BAR ============ -->\n<div class="progress-bar" id="progressBar"></div>\n\n')
    out.append(render_nav(active_key))
    out.append('\n\n')
    out.append(whatsapp)
    out.append('\n\n')
    out.append(main_html)
    out.append('\n')
    out.append(render_footer())
    out.append('\n\n<script src="assets/site.js"></script>\n')
    if extra_scripts:
        out.append(extra_scripts)
    out.append('\n</body>\n</html>\n')
    return ''.join(out)

def main():
    hero = read('hero')
    ribbon = read('ribbon')
    moments = read('moments')
    marquee = read('marquee')
    testimonios = read('testimonios')
    nosotros = read('nosotros')
    homenajes = read('homenajes')
    convenios = read('convenios')
    planes = read('planes')
    contacto = read('contacto')

    pages = {
        'index.html': dict(
            active='INICIO',
            title='Werchow',
            description='Werchow — Sepelios, Memorial y Salas y Servicios Sociales en Jujuy. Nuestra vocación es estar.',
            main=hero + '\n\n' + ribbon + '\n\n' + moments + '\n\n' + marquee,
            extra_scripts='<script src="assets/hero.js"></script>\n',
        ),
        'nosotros.html': dict(
            active='NOSOTROS',
            title='Nosotros — Werchow',
            description='Quiénes somos en Werchow: más de cinco décadas acompañando familias en Jujuy con transparencia, cercanía y profesionalismo.',
            main=page_meta('02', 'Nosotros') + nosotros,
        ),
        'resenas.html': dict(
            active='',
            title='Reseñas — Werchow',
            description='Familias que ya confiaron en Werchow — reseñas reales en Google, con nombre, tal cual figuran en nuestra ficha.',
            main=page_meta('07', 'Reseñas') + testimonios,
        ),
        'homenajes.html': dict(
            active='HOMENAJES',
            title='Homenajes virtuales — Werchow',
            description='Un espacio para recordar: cada familia puede compartir un homenaje virtual a quienes ya no están.',
            main=page_meta('05', 'Homenajes virtuales') + homenajes,
            extra_scripts='<script src="assets/homenajes.js"></script>\n',
        ),
        'convenios.html': dict(
            active='CONVENIOS',
            title='Convenios — Werchow',
            description='Beneficios pensados para cada familia: convenios médicos, descuentos en farmacias y ópticas, cartilla de prestadores y planes de sepelios en Jujuy.',
            main=page_meta('03', 'Convenios') + convenios,
        ),
        'planes.html': dict(
            active='PLANES',
            title='Planes Sepelios — Werchow',
            description='Planes de sepelio de Werchow en Jujuy: qué incluye la asistencia de sepelio integral, edades de adhesión y cómo hablar con un asesor.',
            main=page_meta('04', 'Planes Sepelios') + planes,
        ),
        'contacto.html': dict(
            active='CONTACTO',
            title='Contacto — Werchow',
            description='Contacto de Werchow: guardia de sepelios 24 horas, teléfonos, WhatsApp de adhesiones y cobranzas, y las direcciones y horarios de las cinco sucursales en Jujuy.',
            main=page_meta('06', 'Contacto') + contacto,
        ),
    }

    for filename, cfg in pages.items():
        html = assemble(cfg['active'], cfg['title'], cfg['description'], cfg['main'], cfg.get('extra_scripts', ''))
        with open(os.path.join(ROOT, filename), 'w', encoding='utf-8') as f:
            f.write(html)
        print('wrote', filename, len(html), 'bytes')

if __name__ == '__main__':
    main()
