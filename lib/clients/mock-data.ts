import type { WearablePrimitive } from "../types/pipeline";

export const mockPrimitives: WearablePrimitive[] = [
  { id: "wp-01", name: "Cropped utility jacket", category: "garment", description: "Structured outer layer with an exaggerated shoulder and modular pockets.", confidence: 0.94, attributes: { color: "cobalt", fabric: "technical nylon", silhouette: "boxy" } },
  { id: "wp-02", name: "Reflective piping", category: "material", description: "Light-catching trim tracing the jacket seams.", confidence: 0.87, attributes: { finish: "holographic", placement: "seams" } },
  { id: "wp-03", name: "Sculptural ear cuff", category: "accessory", description: "Asymmetric silver ear piece with a soft industrial profile.", confidence: 0.81, attributes: { material: "brushed steel", side: "left" } }
];
