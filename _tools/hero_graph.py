"""Generate the hero illustration: the portrait as the subject of a small RDF graph.

Resources are ellipses and properties are labelled arrows, as in the classic RDF
graph notation. Edit NODES below, then regenerate the include:

    python3 _tools/hero_graph.py _includes/hero-graph.svg
"""
import math
import sys

W, H = 640, 520
C = (320.0, 232.0)   # subject node (portrait) centre
R = 104.0            # portrait radius

# label, predicate, centre x, centre y, rx, ry, where the predicate label goes
NODES = [
    ("Semantic Web",           ":worksOn",     92,  62, 70, 26, "left"),
    ("Knowledge Graphs",       ":worksOn",    546,  62, 86, 26, "right"),
    ("Data Spaces",            ":worksOn",     72, 262, 64, 26, "above"),
    ("Generative AI",          ":worksOn",    566, 262, 70, 26, "above"),
    ("RWTH Aachen University", ":professorAt", 152, 456, 112, 28, "left"),
    ("Fraunhofer FIT",         ":directorOf", 490, 456, 80, 28, "right"),
]

# Portrait placement inside the circle (photo is 801 x 1049, head centred at x 48%)
IMG_W = 262.0
IMG_H = IMG_W * 1049 / 801
IMG_X = C[0] - 0.483 * IMG_W
IMG_Y = (C[1] - R) + 20 - 0.029 * IMG_H   # top of the hair ~20 units below the rim


def ellipse_hit(cx, cy, rx, ry, ux, uy):
    """Distance from an ellipse centre to its boundary along unit vector (ux, uy)."""
    return 1 / math.sqrt((ux / rx) ** 2 + (uy / ry) ** 2)


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


out = []
out.append(f'<svg class="hero-graph" viewBox="0 0 {W} {H}" role="img" aria-labelledby="hero-graph-title">')
out.append('  <title id="hero-graph-title">Portrait of Stefan Decker as the subject of a small RDF graph: '
           'professor at RWTH Aachen University, director of Fraunhofer FIT, working on the Semantic Web, '
           'Knowledge Graphs, Data Spaces and Generative AI</title>')
out.append('  <defs>')
out.append('    <marker id="hg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">')
out.append('      <path class="hg-arrowhead" d="M0 0L10 5L0 10z"/>')
out.append('    </marker>')
out.append(f'    <clipPath id="hg-portrait"><circle cx="{f(C[0])}" cy="{f(C[1])}" r="{f(R)}"/></clipPath>')
out.append('  </defs>')

edges, labels, nodes = [], [], []
for text, pred, cx, cy, rx, ry, side in NODES:
    dx, dy = cx - C[0], cy - C[1]
    d = math.hypot(dx, dy)
    ux, uy = dx / d, dy / d
    sx, sy = C[0] + ux * (R + 10), C[1] + uy * (R + 10)
    t = ellipse_hit(cx, cy, rx, ry, -ux, -uy)
    ex, ey = cx - ux * (t + 5), cy - uy * (t + 5)
    edges.append(f'    <line class="hg-edge" x1="{f(sx)}" y1="{f(sy)}" x2="{f(ex)}" y2="{f(ey)}" marker-end="url(#hg-arrow)"/>')
    mx, my = (sx + ex) / 2, (sy + ey) / 2
    if side == "left":
        lx, ly, anchor = mx - 10, my + 4, "end"
    elif side == "right":
        lx, ly, anchor = mx + 10, my + 4, "start"
    else:
        lx, ly, anchor = (sx + 2 * ex) / 3, my - 10, "middle"   # nearer the object node, clear of the portrait
    labels.append(f'    <text class="hg-pred" x="{f(lx)}" y="{f(ly)}" text-anchor="{anchor}">{pred}</text>')
    nodes.append(f'    <g class="hg-node"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>'
                 f'<text x="{cx}" y="{cy + 5.5}" text-anchor="middle">{text}</text></g>')
    print(f"{text:24} arrow {math.hypot(ex - sx, ey - sy):5.1f}  label at ({lx:.0f},{ly:.0f}) {anchor}", file=sys.stderr)

out.append('  <g class="hg-edges">')
out += edges
out.append('  </g>')
out.append(f'  <circle class="hg-halo" cx="{f(C[0])}" cy="{f(C[1])}" r="{f(R + 9)}"/>')
out.append(f'  <image href="{{{{ \'/assets/img/stefan-decker.jpg\' | relative_url }}}}" x="{f(IMG_X)}" y="{f(IMG_Y)}" '
           f'width="{f(IMG_W)}" height="{f(IMG_H)}" clip-path="url(#hg-portrait)" preserveAspectRatio="xMidYMid slice"/>')
out.append(f'  <circle class="hg-ring" cx="{f(C[0])}" cy="{f(C[1])}" r="{f(R)}"/>')
out.append('  <g class="hg-labels">')
out += labels
out.append('  </g>')
out.append('  <g class="hg-nodes">')
out += nodes
out.append('  </g>')
out.append('</svg>')
open(sys.argv[1], "w").write("\n".join(out) + "\n")
