import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { createRoom } from './room.js'
import './style.css'

RectAreaLightUniformsLib.init()

const canvas = document.querySelector('#scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.12

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x2a2622)

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 60)
camera.position.set(0.8, 4.8, 7.6)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.minDistance = 6
controls.maxDistance = 18
controls.maxPolarAngle = Math.PI / 2.08
controls.target.set(0.1, 1.15, -0.5)

scene.add(new THREE.AmbientLight(0xfff6ea, 0.62))
const sun = new THREE.DirectionalLight(0xfff3dd, 1.2)
sun.position.set(3.5, 8.5, 4)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
scene.add(sun)

const { laptops, screens } = createRoom(scene)
let screenOn = true

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function setPointer(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

window.addEventListener('pointermove', (event) => {
  setPointer(event)
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObject(laptops, true)
  document.body.style.cursor = hits.length ? 'pointer' : 'default'
})

window.addEventListener('click', (event) => {
  setPointer(event)
  raycaster.setFromCamera(pointer, camera)
  if (!raycaster.intersectObject(laptops, true).length) return
  screenOn = !screenOn
  for (const screen of screens) {
    screen.material.color.set(screenOn ? 0x8ec8c4 : 0x1a1f22)
    screen.material.emissive = new THREE.Color(screenOn ? 0x244844 : 0x000000)
  }
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
