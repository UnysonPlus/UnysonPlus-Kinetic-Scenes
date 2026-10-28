/** The animation names in a glTF model (a .glb or .gltf, as a data: URL or an address), without loading it in 3D. */
export async function gltfAnimations(src: string): Promise<string[]> {
  const buf = new Uint8Array(await (await fetch(src)).arrayBuffer());
  let json: { animations?: Array<{ name?: string }> };
  // A .glb starts with "glTF"; its first chunk is the JSON.
  if (buf[0] === 0x67 && buf[1] === 0x6c && buf[2] === 0x54 && buf[3] === 0x46) {
    const len = new DataView(buf.buffer, buf.byteOffset).getUint32(12, true);
    json = JSON.parse(new TextDecoder().decode(buf.subarray(20, 20 + len)));
  } else json = JSON.parse(new TextDecoder().decode(buf));
  return (json.animations ?? []).map((a, i) => a.name || `Animation ${i + 1}`);
}
