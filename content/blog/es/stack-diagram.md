---
title: Una frase y un diagrama de arquitectura
description: Le di a Claude Code una frase sobre un stack web y me devolvió un diagrama de arquitectura con los logos reales. Probé stack-diagram, una skill de código abierto. Cómo funciona, qué falló y qué mirar antes de instalarla.
date: 2026-11-05
tags: [claude-code, skills, diagramas]
---

Le di a Claude Code una frase sobre un stack web y me devolvió este diagrama, con los logos reales. Fueron dos renders y unos minutos.

![Diagrama de arquitectura con Next.js y Hono en Vercel, Neon, Clerk, Stripe y GitHub Actions](/blog/stack-diagram/diagrama.jpg)

La frase era el ejemplo del README del proyecto:

> Next.js and a Hono API on Vercel. Postgres on Neon, auth with Clerk, payments with Stripe. GitHub Actions deploys.

La herramienta es [stack-diagram](https://github.com/caru-ini/stack-diagram), una skill de código abierto (MIT) para Claude Code, Codex y Cursor. Salió el 1 de noviembre y al día siguiente ya tenía más de 800 estrellas en GitHub. Se añade a un proyecto con un comando:

```bash
npx skills add caru-ini/stack-diagram
```

## Cómo funciona

- Descarga el archivo del logo oficial de cada marca, y a propósito no usa colecciones de iconos redibujados.
- El agente coloca cada caja y cada flecha él mismo, en coordenadas de píxel, siguiendo unas reglas de espaciado que apartan las líneas de las etiquetas.
- Todo va en un solo archivo HTML sin dependencias externas, y un Chromium sin interfaz le hace la captura en modo claro y oscuro.
- Después el agente mira el PNG y corrige lo que se solape antes de entregártelo.

## Qué falló en mi prueba

- El primer render pintó la caja de Vercel en naranja, el color por defecto de la plantilla. El segundo lo arregló.
- Probé un segundo stack con whisper.cpp y Piper. Ninguno está en las tres bibliotecas de logos que consulta, así que tuve que buscar los archivos yo.
- Uno de ellos era un JPEG en una URL que no acaba en .jpg, y el script de logos no lo cogió. Lo añadí a mano.

## Antes de instalarla

- Al final, la skill te ofrece publicar tu diagrama en una galería pública. Pregunta dos veces antes de enviar nada. Mira si en la imagen salen nombres de servicios internos antes de decir que sí.
- El CLI de skills envía datos de uso anónimos salvo que pongas `DISABLE_TELEMETRY=1` ([lo explica su README](https://github.com/vercel-labs/skills#telemetry)).

Lo que más me gustó: revisa su propia imagen antes de enseñártela.

¿Qué usas tú hoy para los diagramas de arquitectura?
