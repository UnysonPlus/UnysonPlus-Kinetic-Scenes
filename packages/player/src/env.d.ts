declare const __PLAYER_VERSION__: string;

/** p5.brush's standalone build (MIT): the parts the paint engine (scene-paint.js) uses. */
declare module 'p5.brush/standalone' {
  export const DEGREES: string;
  export function load(canvas: HTMLCanvasElement | OffscreenCanvas): void;
  export function angleMode(mode: string): void;
  export function seed(n: number): void;
  export function noiseSeed(n: number): void;
  export function clear(color?: string): void;
  export function render(): void;
  export function push(): void;
  export function pop(): void;
  export function translate(x: number, y: number): void;
  export function set(brush: string, color: string, weight: number): void;
  export function noStroke(): void;
  export function fill(color: string, opacity?: number): void;
  export function noFill(): void;
  export function fillBleed(strength: number, direction?: 'in' | 'out', angle?: number): void;
  export function fillTexture(texture: number, border: number, scatter?: boolean, split?: number): void;
  export function wash(color: string, opacity: number): void;
  export function noWash(): void;
  export function hatch(dist: number, angle: number, options?: { rand?: number | false; continuous?: boolean; gradient?: number | false }): void;
  export function hatchStyle(brush: string, color: string, weight: number): void;
  export function noHatch(): void;
  export function beginShape(curvature?: number): void;
  export function vertex(x: number, y: number, pressure?: number): void;
  export function endShape(close?: boolean): unknown;
}
