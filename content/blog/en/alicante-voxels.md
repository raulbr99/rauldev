---
title: Alicante in 1 m cubes
description: I rebuilt Alicante in voxels from open data (IGN, Catastro and OpenStreetMap). How I did it, and what I had to fix by hand because the data doesn't show it.
date: 2026-11-05
tags: [open-data, 3d, claude-code]
---

I rebuilt Alicante in 1 m cubes, and you can explore it in your browser: [raulbr99.github.io/alicante-voxels](https://raulbr99.github.io/alicante-voxels/). It works best on a computer.

![Santa Bárbara castle and Postiguet beach in 1 m cubes](/blog/alicante-voxels/castillo-postiguet.jpg)

## Where each cube comes from

It's all open data, with no API keys and no cost:

- **Terrain and aerial photos** from IGN, Spain's mapping agency: the MDT05 elevation model and the PNOA orthophoto.
- **Building heights** from Catastro, the Spanish land registry. Catastro doesn't give heights, it gives floor counts, so each floor counts as 3.1 m with a 1 m parapet on top.
- **Streets, tram and trees** from OpenStreetMap.

The engine that turns all of that into cubes isn't mine: it's [Warsaw in voxels](https://github.com/stared/warsaw-vibe-voxel) by Piotr Migdał, MIT licence. I put it together with Claude Code in an afternoon.

## What the data doesn't show

The data doesn't show everything, so a few things had to be filled in by hand:

- **The sea** comes from the aerial photo.
- **The Explanada's mosaic and its rows of palm trees** are drawn in code. In the first version the mosaic's bands ran along the promenade; the 10 cm orthophoto shows they cross it, so I turned them.
- **The castle** had to become stone.
- **The roofs are flat.** There's no LiDAR, so there's no way to know the shape of each roof.

And one thing that looks like a bug but isn't: on the coast there's a brown tower with no windows that stands out over everything else. Catastro gives it 22 to 26 floors, while OpenStreetMap says 15. The viewer paints that facade without windows, but the height is Catastro's.

![The whole of Alicante from the sea, with the marina, the Explanada, the castle and the stadium](/blog/alicante-voxels/ciudad.jpg)

## What you can do on the page

- Fly over the Explanada, the Postiguet, the marina and the castle with the keyboard, like in a game.
- Change the day, the hour and the weather. The shadows move with the sun.
- Follow a tram, a car or a pedestrian, or fly down to a street and walk it.

## Credits

- Engine: [Warsaw in voxels](https://github.com/stared/warsaw-vibe-voxel) by Piotr Migdał (MIT).
- Data: © IGN/CNIG (PNOA and MDT05, CC BY 4.0), Dirección General del Catastro and © OpenStreetMap contributors (ODbL). Weather from Open-Meteo.
