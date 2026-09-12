import type { WearablePrimitive } from "../types/pipeline";

export const mockPrimitives: WearablePrimitive[] = [
  { id: "wp-01", name: "Shoulder module", category: "garment", description: "Structured outer layer with an exaggerated shoulder and modular pockets.", confidence: 0.94, imageUrl: "/primitive-shoulder.svg", targetBodyRegion: "left shoulder", fabricationNotes: "Laser-cut shell over a flexible textile base.", electronicsRequired: false, attributes: { color: "cobalt", fabric: "technical nylon" } },
  { id: "wp-02", name: "Reflective collar piece", category: "material", description: "Light-catching trim tracing a raised collar silhouette.", confidence: 0.87, imageUrl: "/primitive-collar.svg", targetBodyRegion: "neck", fabricationNotes: "Bond reflective film to 3D-printed TPU.", electronicsRequired: false, attributes: { finish: "holographic", placement: "collar" } },
  { id: "wp-03", name: "Wearable electronics cuff", category: "accessory", description: "Asymmetric cuff enclosure with a soft industrial profile.", confidence: 0.81, imageUrl: "/primitive-cuff.svg", targetBodyRegion: "wrist", fabricationNotes: "Print enclosure in flexible resin; add snap closure.", electronicsRequired: true, attributes: { material: "brushed steel", side: "left" } }
];
