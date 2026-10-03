import * as THREE from 'three'

const palette = {
  wall: 0xf4efe6,
  floor: 0xeee6d6,
  wood: 0xc4a57a,
  woodDark: 0xa88860,
  white: 0xf7f4ee,
  curtain: 0x8f9eae,
  curtainRust: 0xb08978,
  sheer: 0xf4f1ea,
  sky: 0xc9dce8,
  laptop: 0x1f1f1f,
  screen: 0x8ec8c4,
  teal: 0x128c96,
  frame: 0x1c1c1c,
  paper: 0xf3ecd8,
  plant: 0x3f6d48,
  stripe: 0xd5d0c4,
  clothesRed: 0xb4232c,
  clothesWhite: 0xf3f1ea,
}

function mat(color, extras = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.84,
    metalness: 0.03,
    ...extras,
  })
}

function box(w, h, d, color, x, y, z, extras = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, extras))
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function cyl(rTop, rBot, h, color, x, y, z, rx = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, 12), mat(color))
  mesh.position.set(x, y, z)
  mesh.rotation.x = rx
  mesh.castShadow = true
  return mesh
}

function addBooks(parent, x, y, z, count = 5) {
  const colors = [0x6b4f3a, 0x355c7d, 0xb85c38, 0x2f4a3a, 0xc4a574, 0x4a3f55]
  for (let i = 0; i < count; i++) {
    parent.add(
      box(0.07, 0.18 + (i % 3) * 0.03, 0.14, colors[i % colors.length], x + i * 0.085, y, z)
    )
  }
}

function makeLaptop(x, y, z, open = true) {
  const group = new THREE.Group()
  group.position.set(x, y, z)
  group.add(box(0.52, 0.025, 0.34, palette.laptop, 0, 0, 0))
  if (open) {
    group.add(box(0.52, 0.32, 0.018, palette.laptop, 0, 0.16, -0.16))
    const screen = box(0.46, 0.26, 0.01, palette.screen, 0, 0.16, -0.148, {
      emissive: 0x244844,
      roughness: 0.35,
    })
    screen.name = 'screen'
    group.add(screen)
  } else {
    group.add(box(0.52, 0.02, 0.34, palette.laptop, 0, 0.02, 0))
  }
  return group
}

function makeChair() {
  const chair = new THREE.Group()
  chair.add(box(0.42, 0.05, 0.42, palette.white, 0, 0.5, 0))
  chair.add(box(0.42, 0.38, 0.05, palette.white, 0, 0.72, -0.18))
  chair.add(box(0.36, 0.03, 0.36, palette.stripe, 0, 0.54, 0.02))
  chair.add(cyl(0.03, 0.03, 0.42, 0xc5c8cc, 0, 0.27, 0))
  chair.add(cyl(0.1, 0.1, 0.04, 0xc5c8cc, 0, 0.08, 0))
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    chair.add(cyl(0.035, 0.035, 0.05, 0x2d2d2d, Math.cos(a) * 0.2, 0.04, Math.sin(a) * 0.2))
  }
  return chair
}

function makeCurtainPair(x, z) {
  const group = new THREE.Group()
  group.add(box(0.42, 2.55, 0.06, palette.curtain, x - 0.55, 1.55, z))
  group.add(box(0.42, 2.55, 0.06, palette.curtainRust, x + 0.55, 1.55, z))
  group.add(box(1.7, 0.04, 0.04, palette.woodDark, x, 2.86, z - 0.02))
  const sheer = box(0.85, 2.5, 0.02, palette.sheer, x, 1.52, z + 0.02, {
    transparent: true,
    opacity: 0.42,
    roughness: 0.95,
  })
  sheer.castShadow = false
  group.add(sheer)
  return group
}

export function createRoom(scene) {
  const room = new THREE.Group()
  room.name = 'room'

  room.add(box(7.6, 0.1, 7.2, palette.floor, 0, 0.05, 0.1))
  room.add(box(7.6, 3.25, 0.1, palette.wall, 0, 1.72, -3.5))
  room.add(box(0.1, 3.25, 7.2, palette.wall, -3.75, 1.72, 0.1))
  room.add(box(0.1, 3.25, 5.2, palette.wall, 3.75, 1.72, -0.9))

  // Back wall: two windows, corner shelves, printer.
  const windowL = box(1.15, 2.2, 0.04, palette.sky, -1.55, 1.7, -3.44)
  const windowR = box(1.15, 2.2, 0.04, palette.sky, 1.85, 1.7, -3.44)
  room.add(windowL, windowR)
  room.add(makeCurtainPair(-1.55, -3.42))
  room.add(makeCurtainPair(1.85, -3.42))

  const windowLightL = new THREE.RectAreaLight(0xfff4e0, 8, 1.1, 2.1)
  windowLightL.position.set(-1.55, 1.7, -3.4)
  windowLightL.lookAt(-1.55, 1.4, 0)
  room.add(windowLightL)
  const windowLightR = new THREE.RectAreaLight(0xfff4e0, 6, 1.1, 2.1)
  windowLightR.position.set(1.85, 1.7, -3.4)
  windowLightR.lookAt(1.85, 1.4, 0)
  room.add(windowLightR)

  room.add(box(0.42, 3.05, 0.42, palette.wood, -0.28, 1.62, -3.22))
  room.add(box(0.28, 0.22, 0.04, palette.paper, -0.28, 3.08, -3.0))

  room.add(box(1.55, 0.05, 0.42, palette.white, 0.72, 2.55, -3.18))
  room.add(box(0.05, 1.55, 0.42, palette.white, 0.08, 1.78, -3.18))
  room.add(box(0.05, 1.55, 0.42, palette.white, 0.72, 1.78, -3.18))
  room.add(box(0.05, 1.55, 0.42, palette.white, 1.36, 1.78, -3.18))
  room.add(box(1.55, 0.05, 0.42, palette.white, 0.72, 1.95, -3.18))
  room.add(box(1.55, 0.05, 0.42, palette.white, 0.72, 1.0, -3.18))
  addBooks(room, 0.2, 2.18, -3.18, 6)
  addBooks(room, 0.85, 2.18, -3.18, 5)
  addBooks(room, 0.25, 1.18, -3.18, 7)
  room.add(box(0.08, 0.28, 0.08, 0xd4af37, 0.55, 2.72, -3.05))
  room.add(box(0.08, 0.22, 0.08, 0xc0c0c0, 0.7, 2.69, -3.05))
  room.add(box(0.08, 0.26, 0.08, 0xd4af37, 1.05, 2.71, -3.05))
  room.add(box(0.12, 0.42, 0.04, palette.clothesRed, 0.42, 2.22, -3.0))

  room.add(box(0.55, 0.05, 0.42, palette.wood, -0.28, 0.92, -2.85))
  room.add(box(0.55, 0.05, 0.42, palette.wood, -0.28, 0.55, -2.85))
  room.add(cyl(0.03, 0.03, 0.9, palette.wood, -0.46, 0.5, -2.7))
  room.add(cyl(0.03, 0.03, 0.9, palette.wood, -0.1, 0.5, -2.7))
  room.add(box(0.42, 0.03, 0.32, 0x2a6b6e, -0.28, 0.96, -2.85))
  room.add(box(0.36, 0.16, 0.28, 0x1a1a1a, -0.28, 1.06, -2.85))

  // Left wall: photo board, wardrobe, desk.
  room.add(box(0.04, 0.55, 1.15, palette.wood, -3.66, 1.85, 1.85))
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      room.add(
        box(
          0.01,
          0.08,
          0.06,
          col % 2 ? 0xe8dcc4 : 0xd9c4a8,
          -3.63,
          2.05 - row * 0.16,
          1.45 + col * 0.14
        )
      )
    }
  }
  room.add(box(0.32, 0.22, 0.38, palette.frame, -3.64, 2.55, 1.35))
  room.add(box(0.28, 0.18, 0.34, palette.paper, -3.62, 2.55, 1.35))
  room.add(box(0.28, 0.32, 0.28, palette.white, -3.64, 2.62, 2.15))
  room.add(box(0.02, 0.28, 0.32, 0xc45c2d, -3.62, 2.38, 2.55))

  room.add(box(0.38, 2.55, 0.95, palette.wood, -3.5, 1.35, 0.55))

  room.add(box(0.72, 0.06, 1.85, palette.wood, -3.22, 0.82, -1.15))
  room.add(box(0.55, 0.72, 0.55, palette.white, -3.28, 0.42, -2.0))
  room.add(box(0.52, 0.2, 0.5, palette.white, -3.27, 0.22, -2.0))
  room.add(box(0.52, 0.2, 0.5, palette.white, -3.27, 0.44, -2.0))
  room.add(box(0.52, 0.2, 0.5, palette.white, -3.27, 0.66, -2.0))

  room.add(box(0.42, 0.32, 1.85, palette.white, -3.48, 2.95, -1.15))
  room.add(box(0.38, 0.32, 0.88, palette.wood, -3.46, 2.62, -1.15))
  room.add(cyl(0.03, 0.03, 0.16, palette.white, -3.48, 3.2, -1.7))
  room.add(cyl(0.03, 0.03, 0.16, palette.white, -3.48, 3.2, -1.15))
  room.add(cyl(0.03, 0.03, 0.16, palette.white, -3.48, 3.2, -0.6))
  room.add(box(0.04, 0.1, 0.04, palette.plant, -3.48, 3.34, -1.7))
  room.add(box(0.04, 0.1, 0.04, palette.plant, -3.48, 3.34, -1.15))
  room.add(box(0.04, 0.1, 0.04, palette.plant, -3.48, 3.34, -0.6))

  room.add(box(0.18, 0.04, 0.28, 0x2b2b2b, -3.55, 1.15, -0.35))
  room.add(box(0.02, 0.16, 0.02, 0x111111, -3.48, 1.24, -0.28))
  room.add(box(0.02, 0.16, 0.02, 0x111111, -3.48, 1.24, -0.42))

  const laptops = new THREE.Group()
  laptops.name = 'laptops'
  const openLaptop = makeLaptop(-3.05, 0.88, -0.85, true)
  const closedLaptop = makeLaptop(-3.0, 0.86, -1.55, false)
  laptops.add(openLaptop, closedLaptop)
  room.add(laptops)

  const chair = makeChair()
  chair.position.set(-2.45, 0, -1.05)
  chair.rotation.y = 0.15
  room.add(chair)

  room.add(box(0.02, 0.28, 0.02, 0x111111, -2.55, 1.12, -1.85))
  room.add(box(0.12, 0.02, 0.08, 0x111111, -2.5, 1.26, -1.85))

  // Right wall: bed, frames, suitcase.
  room.add(box(2.35, 0.12, 0.08, palette.wood, 2.55, 0.95, -2.55))
  room.add(box(2.2, 0.42, 1.7, palette.white, 2.55, 0.32, -1.75))
  room.add(box(2.1, 0.1, 1.6, palette.stripe, 2.55, 0.56, -1.7))
  room.add(box(0.42, 0.16, 0.38, palette.stripe, 2.05, 0.7, -2.35))
  room.add(box(0.42, 0.16, 0.38, palette.stripe, 3.05, 0.7, -2.35))
  room.add(box(0.38, 0.1, 0.18, 0xd8cbb8, 2.05, 0.68, -2.05))
  room.add(box(0.38, 0.1, 0.18, 0xd8cbb8, 3.05, 0.68, -2.05))
  room.add(box(0.48, 0.38, 0.42, palette.white, 1.55, 0.28, -2.45))
  room.add(box(0.48, 0.38, 0.42, palette.white, 3.55, 0.28, -2.45))

  const suitcase = new THREE.Group()
  suitcase.position.set(1.85, 0.32, -1.15)
  suitcase.add(box(0.62, 0.38, 0.42, palette.teal, 0, 0, 0))
  suitcase.add(box(0.18, 0.04, 0.22, palette.teal, 0, 0.22, 0.12))
  suitcase.add(cyl(0.03, 0.03, 0.08, 0x1a1a1a, -0.22, -0.16, 0.16))
  suitcase.add(cyl(0.03, 0.03, 0.08, 0x1a1a1a, 0.22, -0.16, 0.16))
  room.add(suitcase)

  room.add(box(0.38, 0.08, 0.32, palette.clothesWhite, 2.55, 0.64, -1.35))
  room.add(box(0.22, 0.06, 0.18, palette.clothesRed, 2.62, 0.7, -1.32))

  const frames = [
    [3.68, 2.55, -2.5, 0.22, 0.16],
    [3.68, 2.35, -2.15, 0.18, 0.22],
    [3.68, 2.6, -1.85, 0.16, 0.2],
    [3.68, 2.15, -1.7, 0.2, 0.14],
    [3.68, 2.45, -1.45, 0.14, 0.18],
    [3.68, 2.05, -2.35, 0.12, 0.16],
  ]
  for (const [x, y, z, w, h] of frames) {
    room.add(box(0.03, h, w, palette.frame, x, y, z))
    room.add(box(0.01, h - 0.04, w - 0.04, palette.paper, x - 0.02, y, z))
  }
  for (let i = 0; i < 10; i++) {
    room.add(box(0.02, 0.02, 0.02, 0xf2e6b0, 3.68, 2.05, -2.6 + i * 0.14))
  }
  room.add(box(0.08, 0.28, 0.42, palette.wood, 3.62, 1.7, -0.15))
  room.add(box(0.06, 0.08, 0.06, 0x2a2a2a, 3.55, 1.86, -0.05))

  scene.add(room)
  return {
    room,
    laptops,
    screens: openLaptop.children.filter((child) => child.name === 'screen'),
  }
}
