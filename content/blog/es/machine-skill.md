---
title: machine-skill, una línea de texto y una máquina 3D que funciona
description: Describí un freno de aire de camión en una línea y Claude Code lo construyó en 3D, lo abrió en corte y lo rompió. La skill que lo hace es de código abierto y se llama machine-skill.
date: 2026-11-05
tags: [claude-code, three-js, skills]
---

Describí un freno de aire de camión en una línea. Claude Code lo construyó en 3D, lo abrió en corte y lo rompió.

La skill que hay detrás es de código abierto. Se llama [machine-skill](https://github.com/AirsupHQ/machine-skill).

![El freno de aire abierto en corte, con cada pieza etiquetada y el par de frenado a la derecha](/blog/machine-skill/corte.jpg)

## Cómo funciona

Escribes algo como `/machine a mechanical watch movement` y Claude construye una simulación 3D de esa máquina en un solo archivo HTML, con three.js y sin paso de build.

Qué hace:

- Primero busca cómo es la máquina real y la construye a tamaño real, con el nombre de cada pieza.
- Usa materiales reales: acero, titanio, cobre, latón, vidrio.
- Mueve todo con un modelo físico pequeño, así que cada movimiento y cada número de la pantalla están calculados, y te enseña las ecuaciones.
- Puedes despiezarla, abrirla en corte, verla en rayos X, ponerla a cámara lenta y romperla.
- Con un comando graba una película de 28 segundos, en 1080×1350 para el feed.

## Mi prueba

La línea que le di es la que se ve arriba en la imagen: un freno de tambor con leva en S del eje motriz de un camión, abierto en corte, que se rompe cuando el ajustador de holgura se queda sin carrera.

Claude estuvo unos 50 minutos trabajando solo, contando lo que tardó en grabar la película. La película está en [mi post de X](https://x.com/sr_rauldev/status/2117274125848703025).

## Antes de usarla

Tiene licencia MIT. Funciona en Claude Code, y otros agentes que leen skills, como Codex o Cursor, también pueden usarla. Los autores lo dicen claro: la física es «a small honest model, not CFD or FEA», un modelo pequeño y honesto, no una simulación de ingeniería.

En su galería todas las máquinas funcionan en directo: [airsup.ai/lab/skill](https://airsup.ai/lab/skill).

¿Qué máquina construirías tú?
