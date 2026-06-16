# Why Scientific Figures Matter—and Why They're Hard

Scientific figures are among the most effective means of communicating complex research ideas. Yet producing publication-quality illustrations remains one of the most labor-intensive parts of paper preparation.

Recent advances in text-to-image generation and agentic AI have created promising pipelines—systems that pair planning agents with powerful image generators to produce visually polished figures from text. Similarly, code-generation methods synthesize editable diagrams in formats like TikZ. But both approaches fall short in the same two fundamental ways:

## The scope problem

Existing systems are narrow. In practice, researchers produce figures across a spectrum of types—academic diagrams, posters, infographics. They rarely begin from text alone; instead, they iterate from rough sketches, partial layouts, or reference visual elements. Current methods focus almost exclusively on text-to-image generation, leaving the diversity of figure types and input conditions entirely unaddressed.

## The editability problem

Raster-based generators produce static images that cannot be locally revised. When researchers need to adjust labels, swap color schemes, or rearrange components, they're stuck. Code-generation methods yield editable output but lack the visual richness of icons and stylized layouts. Recent raster-to-vector attempts remain limited by unreliable element extraction and fragile composition.

## Why the generator alone isn't the solution

Scientific figures, unlike natural images, are structured compositions of discrete semantic components: labeled boxes, directional arrows, icons, annotations, each carrying specific meaning within precise spatial relationships. Modern generators exhibit high output variance on such structured layouts, producing localized errors—garbled labels, misaligned connectors—that rephrasing alone cannot fix.

Naive retry is ineffective because each attempt produces a different constellation of failures, and accumulating free-text corrections across iterations introduces contradictions that further degrade quality.

What is needed is not a better backbone generator, but an **orchestration layer**—a harness that wraps the generator with planning, verification, and structured revision, detecting and correcting the generator's failure modes without modifying the generator itself.
