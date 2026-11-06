---
title: Callosa de Segura in 1 m cubes
description: After Alicante, the city where I was born. This time with LiDAR, so every roof, every tree and the sierra have their real height.
date: 2026-11-06
tags: [open-data, 3d, lidar, claude-code]
---

A few days ago I rebuilt [Alicante in 1 m cubes](/en/blog/alicante-voxels). Now it's Callosa de Segura, the city where I was born, and you can explore it in your browser too: [raulbr99.github.io/callosa-voxels](https://raulbr99.github.io/callosa-voxels/). It works best on a computer. The whole flight, from the huerta up to the Pico del Águila, is on video [on X](https://x.com/sr_rauldev/status/2118725316088643693).

![The old town of Callosa de Segura in 1 m cubes](/blog/callosa-voxels/casco.jpg)

## What changed since Alicante

In Alicante the roofs came out flat: there was no LiDAR, so there was no way to know the shape of each roof. Callosa has it. LiDAR is a laser scan from a plane, and here it's 26 million points. Each half-metre cell keeps the highest point, so the roofs, the trees and the cliffs of the sierra have their real height.

## Where each cube comes from

It's all open data, with no API keys and no cost:

- **The terrain, the roofs and the trees** come from the PNOA LiDAR (IGN/CNIG), flown in 2023-2024. One corner in the north-west has no points, and there the terrain comes from IGN's MDT05, at 5 metres.
- **What is green and what isn't** comes from the 2024 orthophoto of the Valencian Cartographic Institute (ICV), at 25 cm. It has an infrared band, and plants glow in infrared: that decides which cells get painted green.
- **The buildings** come from the Catastro. OpenStreetMap had less than a quarter of them (1,674 of 7,589 building parts), so I added the rest from the Catastro.
- **The streets** come from OpenStreetMap.

The engine is the same one I used for Alicante: [Warsaw in voxels](https://github.com/stared/warsaw-vibe-voxel), by Piotr Migdał, under the MIT licence. I built it with Claude Code in one evening.

## What I had to do by hand

- **The castle.** No dataset gets the ruins right, so I drew them in code from photos: 594 stone cubes. Their size is an estimate, not a survey.
- **The facades** are single-colour boxes. I didn't work on them.

![The whole map: the Callosa sierra on the left, the town and the huerta on the right](/blog/callosa-voxels/mapa.jpg)

## What you can do on the page

- Fly over the town, the castle and the sierra with the keyboard, like in a video game.
- Change the day, the hour and the weather. The shadows move with the sun.
- Search for a place by name, like the church of San Martín, the sanctuary of San Roque or the Pico del Águila.

## Credits

- Engine: [Warsaw in voxels](https://github.com/stared/warsaw-vibe-voxel), by Piotr Migdał (MIT).
- Data: © IGN/CNIG (PNOA-LiDAR and MDT05), Institut Cartogràfic Valencià (2024 orthophoto, CC BY 4.0), Dirección General del Catastro and © OpenStreetMap contributors (ODbL). Climate data from Open-Meteo.
