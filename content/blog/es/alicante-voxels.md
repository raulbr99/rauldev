---
title: Alicante en cubos de 1 metro
description: He reconstruido Alicante en vóxeles con datos abiertos del IGN, el Catastro y OpenStreetMap. Así lo hice y esto es lo que tuve que arreglar porque los datos no lo cuentan.
date: 2026-11-05
tags: [datos-abiertos, 3d, claude-code]
---

He reconstruido Alicante en cubos de 1 metro y se puede recorrer en el navegador: [raulbr99.github.io/alicante-voxels](https://raulbr99.github.io/alicante-voxels/). Se ve mejor en un ordenador.

![El castillo de Santa Bárbara y la playa del Postiguet en cubos de 1 metro](/blog/alicante-voxels/castillo-postiguet.jpg)

## De dónde sale cada cubo

Todo sale de datos abiertos, sin claves de API y sin coste:

- **El terreno y las fotos aéreas**, del IGN: el modelo de elevaciones MDT05 y la ortofoto del PNOA.
- **La altura de los edificios**, del Catastro. El Catastro no da alturas, da número de plantas, así que cada planta cuenta 3,1 m y encima va un metro de pretil.
- **Las calles, el tranvía y los árboles**, de OpenStreetMap.

El motor que convierte todo eso en cubos no es mío: es [Warsaw in voxels](https://github.com/stared/warsaw-vibe-voxel), de Piotr Migdał, con licencia MIT. Lo monté con Claude Code en una tarde.

## Lo que los datos no cuentan

Los datos no lo cuentan todo, y hubo que completar a mano unas cuantas cosas:

- **El mar** sale de la foto aérea.
- **El mosaico de la Explanada y sus filas de palmeras** están dibujados en código. En la primera versión las bandas del mosaico iban a lo largo del paseo; en la ortofoto de 10 cm se ve que lo cruzan, así que las giré.
- **El castillo** tuvo que convertirse en piedra.
- **Los tejados son planos.** No hay LiDAR, así que no hay forma de saber cómo es cada cubierta.

Y una cosa que parece un error y no lo es: en la costa hay una torre marrón sin ventanas que destaca sobre todo lo demás. Según el Catastro tiene entre 22 y 26 plantas, mientras que OpenStreetMap le da 15. El visor pinta esa fachada sin ventanas, pero la altura es la que dice el Catastro.

![Alicante entera desde el mar, con el puerto, la Explanada, el castillo y el estadio](/blog/alicante-voxels/ciudad.jpg)

## Qué se puede hacer en la web

- Volar sobre la Explanada, el Postiguet, el puerto y el castillo con el teclado, como en un videojuego.
- Cambiar el día, la hora y el tiempo. Las sombras se mueven con el sol.
- Seguir un tranvía, un coche o un peatón, o bajar a una calle y recorrerla a pie.

## Créditos

- Motor: [Warsaw in voxels](https://github.com/stared/warsaw-vibe-voxel), de Piotr Migdał (MIT).
- Datos: © IGN/CNIG (PNOA y MDT05, CC BY 4.0), Dirección General del Catastro y © colaboradores de OpenStreetMap (ODbL). El clima, de Open-Meteo.
