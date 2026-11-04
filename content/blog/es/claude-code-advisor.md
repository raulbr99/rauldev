---
title: El «truco» del advisor de Claude Code, comprobado
description: Un post viral vendía una combinación de Sonnet, Haiku y Opus en Claude Code como algo que Anthropic acababa de compartir. Lo he contrastado con la documentación y he probado el comando. Casi todo es cierto; algunas cosas, no.
date: 2026-11-05
tags: [claude-code, ia, agentes]
---

Esta semana se hizo viral un post que presentaba como recién compartido por Anthropic un «filón» para Claude Code: Sonnet lleva la sesión, unos subagentes con Haiku buscan en el repositorio y Opus revisa como «advisor» (asesor). Lo he contrastado con la documentación oficial y he probado el comando. Casi todo se sostiene; algunas cosas, no.

## Lo que es verdad

El comando funciona:

```bash
claude --model sonnet --advisor opus
```

La opción `--advisor` no sale en `claude --help`; la propia documentación lo dice. Pero dentro de la sesión, `/advisor` contesta con el modelo que hace de asesor.

El asesor tiene que ser al menos igual de capaz que el modelo principal. Si pruebas `--advisor haiku` con Sonnet, Claude Code lo rechaza:

```text
"haiku" cannot advise "claude-sonnet-5-5" (the advisor must be at least as capable as the main model). The advisor will not be used for the main model.
```

Los subagentes con Haiku también existen: basta con poner `model: haiku` en la cabecera de un subagente. Eso sí, el subagente Explore que trae Claude Code usa el modelo de tu sesión, no Haiku.

## Lo que no cuadra

- **No es nuevo.** Anthropic publicó [«The advisor strategy»](https://claude.com/blog/the-advisor-strategy) el 9 de abril, y el advisor aparece en el [changelog de Claude Code](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) desde la versión 2.1.117, de abril.
- **Opus no entra en «tres momentos fijos».** Según la [documentación](https://code.claude.com/docs/en/advisor), Claude tiende a consultar antes de decidir un enfoque, cuando un error se repite y antes de dar algo por terminado, pero cuándo lo hace es decisión del modelo y no una regla: «model-driven rather than rule-based».
- **El subagente de auditoría puede no ver tus cambios.** Con `isolation: worktree`, la copia del repositorio sale de tu rama por defecto, no del HEAD de tu sesión ([documentación de subagentes](https://code.claude.com/docs/en/sub-agents)). Si no lo cambias, su copia no tiene el diff que se supone que debe revisar.
- **«JEV» no es de Anthropic.** Es Jev, un producto de [TypeSafe](https://typesafe.ai/), metido en el prompt como quinto paso.
- **Más barato que Opus toda la sesión, pero no gratis.** Cada llamada al asesor procesa la conversación entera, sin caché. Al arrancar, el propio Claude Code avisa de que «may use more tokens». La documentación dice que emparejar un modelo rápido con un asesor más fuerte suele costar menos que usar el fuerte todo el rato.

## Dos detalles más

- El advisor solo funciona con la API de Anthropic: ni Bedrock, ni Vertex, ni Foundry.
- Se apaga si tienes `DISABLE_TELEMETRY` activado.

## Lo que probé y lo que no

Probé el comando, `/advisor` y el rechazo de Haiku. Lo de los momentos de consulta, el worktree y el coste sale de la documentación: no he medido una tarea real con el asesor.

¿Lo has probado? ¿Con qué combinación de modelos?
