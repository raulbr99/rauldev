---
title: Callosa de Segura en cubos de 1 metro
description: Después de Alicante, la ciudad donde nací. Esta vez con LiDAR, así que cada tejado, cada árbol y la sierra tienen su altura real.
date: 2026-11-06
tags: [datos-abiertos, 3d, lidar, claude-code]
---

Hace unos días reconstruí [Alicante en cubos de 1 metro](/blog/alicante-voxels). Ahora le ha tocado a Callosa de Segura, la ciudad donde nací, y también se puede recorrer en el navegador: [raulbr99.github.io/callosa-voxels](https://raulbr99.github.io/callosa-voxels/). Se ve mejor en un ordenador. El vuelo entero, desde la huerta hasta el Pico del Águila, está en vídeo [en X](https://x.com/sr_rauldev/status/2118725316088643693).

![El casco antiguo de Callosa de Segura en cubos de 1 metro](/blog/callosa-voxels/casco.jpg)

## Lo que cambia respecto a Alicante

En Alicante los tejados salían planos: no había LiDAR y no había forma de saber cómo era cada cubierta. En Callosa sí lo hay. El LiDAR es un escaneo láser desde un avión, y aquí son 26 millones de puntos. Cada celda de medio metro se queda con el punto más alto, así que los tejados, los árboles y los cortados de la sierra tienen su altura de verdad.

## De dónde sale cada cubo

Todo sale de datos abiertos, sin claves de API y sin coste:

- **El relieve, los tejados y los árboles**, del LiDAR del PNOA (IGN/CNIG), del vuelo de 2023-2024. En una esquina al noroeste no hay puntos, y ahí el relieve sale del MDT05 del IGN, a 5 metros.
- **Qué es verde y qué no**, de la ortofoto de 2024 del Institut Cartogràfic Valencià, a 25 cm. Tiene una banda de infrarrojo, y la vegetación brilla en el infrarrojo: con eso decido qué celdas se pintan de verde.
- **Los edificios**, del Catastro. OpenStreetMap tenía menos de una cuarta parte (1.674 de 7.589 piezas de edificio), así que el resto los añadí del Catastro.
- **Las calles**, de OpenStreetMap.

El motor es el mismo que usé para Alicante: [Warsaw in voxels](https://github.com/stared/warsaw-vibe-voxel), de Piotr Migdał, con licencia MIT. Lo monté con Claude Code en una noche.

## Lo que hubo que hacer a mano

- **El castillo.** Las ruinas no salen bien de ningún dato, así que las dibujé en código a partir de fotos: 594 cubos de piedra. Su tamaño es una estimación, no una medición.
- **Las fachadas** son cajas de un solo color. Ahí no he trabajado.

![El mapa entero: la sierra de Callosa a la izquierda y el pueblo y la huerta a la derecha](/blog/callosa-voxels/mapa.jpg)

## Qué se puede hacer en la web

- Volar sobre el pueblo, el castillo y la sierra con el teclado, como en un videojuego.
- Cambiar el día, la hora y el tiempo. Las sombras se mueven con el sol.
- Buscar un sitio por su nombre, como la iglesia de San Martín, el santuario de San Roque o el Pico del Águila.

## Créditos

- Motor: [Warsaw in voxels](https://github.com/stared/warsaw-vibe-voxel), de Piotr Migdał (MIT).
- Datos: © IGN/CNIG (PNOA-LiDAR y MDT05), Institut Cartogràfic Valencià (ortofoto de 2024, CC BY 4.0), Dirección General del Catastro y © colaboradores de OpenStreetMap (ODbL). El clima, de Open-Meteo.
