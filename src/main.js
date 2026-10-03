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
renderer.toneMappingExposure = 1.05

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1b1714)

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 50)
camera.position.set(7.4, 5.2, 7.8)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.minDistance = 5
controls.maxDistance = 16
controls.maxPolarAngle = Math.PI / 2.05
controls.target.set(0, 1.1, 0)

scene.add(new THREE.AmbientLight(0xfff4e5, 0.45))
const sun = new THREE.DirectionalLight(0xfff1d6, 1.15)
sun.position.set(4, 8, 3)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
scene.add(sun)

const { laptop, screen } = createRoom(scene)
const screenMaterial = screen.material
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
  const hits = raycaster.intersectObject(laptop, true)
  document.body.style.cursor = hits.length ? 'pointer' : 'default'
})

window.addEventListener('click', (event) => {
  setPointer(event)
  raycaster.setFromCamera(pointer, camera)
  if (!raycaster.intersectObject(laptop, true).length) return
  screenOn = !screenOn
  screenMaterial.color.set(screenOn ? 0x8ec8c4 : 0x1a1f22)
  screenMaterial.emissive = new THREE.Color(screenOn ? 0x244844 : 0x000000)
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
