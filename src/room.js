import * as THREE from 'three'

const palette = {
  wall: 0xf3e6d4,
  floor: 0xc4a574,
  trim: 0x6b4f3a,
  bed: 0x8b3a3a,
  sheet: 0xf7f1e6,
  desk: 0x5c4033,
  laptop: 0x2a2a2a,
  screen: 0x8ec8c4,
  plant: 0x3d6b4f,
  pot: 0xb85c38,
  window: 0x9ec9e8,
  rug: 0x7a3b2e,
}

function box(w, h, d, color, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.04 })
  )
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

export function createRoom(scene) {
  const room = new THREE.Group()
  room.name = 'room'

  room.add(box(6.4, 0.12, 6.4, palette.floor, 0, 0.06, 0))
  room.add(box(6.4, 3.4, 0.12, palette.wall, 0, 1.76, -3.14))
  room.add(box(0.12, 3.4, 6.4, palette.wall, -3.14, 1.76, 0))

  const windowPane = box(1.8, 1.5, 0.06, palette.window, 0.4, 2.15, -3.06)
  windowPane.name = 'window'
  room.add(windowPane)
  room.add(box(2, 0.1, 0.14, palette.trim, 0.4, 2.92, -3.05))
  room.add(box(2, 0.1, 0.14, palette.trim, 0.4, 1.38, -3.05))
  room.add(box(0.1, 1.64, 0.14, palette.trim, -0.55, 2.15, -3.05))
  room.add(box(0.1, 1.64, 0.14, palette.trim, 1.35, 2.15, -3.05))

  const light = new THREE.RectAreaLight(0xfff2d6, 6, 1.7, 1.4)
  light.position.set(0.4, 2.15, -3.02)
  light.lookAt(0.4, 1.4, 0)
  room.add(light)

  room.add(box(2.4, 0.08, 1.6, palette.rug, 1.3, 0.13, 1.1))

  room.add(box(2.2, 0.38, 1.5, palette.bed, 1.55, 0.32, -1.85))
  room.add(box(2.05, 0.16, 1.35, palette.sheet, 1.55, 0.56, -1.78))
  room.add(box(0.7, 0.22, 1.2, palette.sheet, 0.75, 0.7, -1.85))

  room.add(box(1.7, 0.08, 0.7, palette.desk, -1.85, 0.86, -2.55))
  room.add(box(0.08, 0.78, 0.08, palette.desk, -2.55, 0.47, -2.8))
  room.add(box(0.08, 0.78, 0.08, palette.desk, -1.15, 0.47, -2.8))
  room.add(box(0.08, 0.78, 0.08, palette.desk, -2.55, 0.47, -2.3))
  room.add(box(0.08, 0.78, 0.08, palette.desk, -1.15, 0.47, -2.3))

  const laptop = new THREE.Group()
  laptop.name = 'laptop'
  laptop.position.set(-1.7, 0.96, -2.5)
  const base = box(0.55, 0.03, 0.36, palette.laptop, 0, 0, 0)
  const lid = box(0.55, 0.34, 0.02, palette.laptop, 0, 0.17, -0.17)
  const screen = box(0.48, 0.28, 0.01, palette.screen, 0, 0.17, -0.158)
  screen.name = 'screen'
  laptop.add(base, lid, screen)
  laptop.userData.clickable = true
  room.add(laptop)

  room.add(box(0.42, 0.46, 0.42, palette.trim, -1.85, 0.35, -1.85))
  room.add(box(0.38, 0.06, 0.38, palette.desk, -1.85, 0.6, -1.85))

  const pot = box(0.22, 0.18, 0.22, palette.pot, 2.55, 0.21, -2.55)
  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 12),
    new THREE.MeshStandardMaterial({ color: palette.plant, roughness: 0.9 })
  )
  leaves.position.set(2.55, 0.52, -2.55)
  leaves.castShadow = true
  room.add(pot, leaves)

  const lamp = box(0.08, 0.7, 0.08, palette.trim, -2.7, 0.47, 2.4)
  const shade = box(0.36, 0.16, 0.36, 0xf0d9b5, -2.7, 0.88, 2.4)
  room.add(lamp, shade)
  const lampLight = new THREE.PointLight(0xffd7a1, 4, 6, 2)
  lampLight.position.set(-2.7, 1.05, 2.4)
  lampLight.castShadow = true
  room.add(lampLight)

  scene.add(room)
  return { room, laptop, screen }
}
