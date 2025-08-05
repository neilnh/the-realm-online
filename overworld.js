import categories from "./res/categories.json" with {"type": "json"}
import cells from "./res/cells.json" with {"type": "json"}
import monsterless_regions from "./res/monsterless_regions.json" with {"type": "json"}
import regions from "./res/regions.json" with {"type": "json"}

const collections_box = document.querySelector("#collections_box")
const hide_collections_button = document.querySelector("#hide_collections")
const hide_info_button = document.querySelector("#hide_info")
const info_box = document.querySelector("#info_box")
const item_categories = document.querySelectorAll(".category")
const map_tiles = document.querySelectorAll(".map_tile")
const show_collections_button = document.querySelector("#show_collections")
const world_map = document.querySelector("#world_map")

world_map.style.fontSize = "0.3em"
world_map.style.left = "0px"
world_map.style.top = "0px"

let animated_cells = []
let map_moving = false
let rel_x = 0
let rel_y = 0
let old_map_x = parseInt(world_map.style.left)
let old_map_y = parseInt(world_map.style.top)

hide_collections_button.addEventListener("click", hide_collections)
hide_info_button.addEventListener("click", hide_info)
show_collections_button.addEventListener("click", show_collections)
world_map.addEventListener("mousedown", move_map)
world_map.addEventListener("mouseleave", drop_map)
world_map.addEventListener("mousemove", moving_map)
world_map.addEventListener("mouseup", drop_map)
world_map.addEventListener("wheel", zoom_map)

for (const cat of item_categories) {
   cat.addEventListener("click", highlight)
}

for (const tile of map_tiles) {
   tile.addEventListener("click", show_info_box)
}

function drop_map() {
   map_moving = false
   old_map_x = parseInt(world_map.style.left)
   old_map_y = parseInt(world_map.style.top)
}

function hide_collections() {
   stop_animation()

   hide_collections_button.style.display = "none"
   collections_box.style.display = "none"
}

function hide_info() {
   hide_info_button.style.display = "none"
   info_box.style.display = "none"
}

function highlight(ev) {
   stop_animation()
   
   for (const cell of categories[ev.srcElement.id]){
      (document.getElementById(cell)).classList.toggle("highlight")
      animated_cells.push(cell)
   }
}

function move_map(ev) {
   map_moving = true
   rel_x = ev.pageX
   rel_y = ev.pageY
}

function moving_map(ev) {
   if (map_moving){
      world_map.style.left = `${(old_map_x + ev.pageX - rel_x).toString()}px`
      world_map.style.top = `${(old_map_y + ev.pageY - rel_y).toString()}px`
   }
}

function show_collections() {
   collections_box.style.display = "block"
   hide_collections_button.style.display = "block"
}

function show_info_box(ev) {
   const room = cells[ev.srcElement.id]
   
   info_box.textContent = ""
   
   const room_number = document.createElement("p")
   room_number.textContent = ev.srcElement.id
   info_box.appendChild(room_number)

   const room_name = document.createElement("p")
   room_name.textContent = `"${room["name"]}"`
   info_box.appendChild(room_name)

   const room_region = document.createElement("p")
   room_region.textContent = `region: ${room["region"]}`
   info_box.appendChild(room_region)

   if ("dungeon" in room){
      const room_dungeon = document.createElement("p")
      room_dungeon.textContent = `dungeon entrance to: ${room["dungeon"]}`
      info_box.appendChild(room_dungeon)
   }

   if ("maps" in room){
      const room_maps = document.createElement("ul")
      room_maps.textContent = "potential off-site maps:"
      for (const item of room["maps"]){
         const li = document.createElement("li")
         const map_link = document.createElement("a")
         map_link.href = item
         map_link.textContent = "map"
         li.appendChild(map_link)
         room_maps.appendChild(li)
      }
      info_box.appendChild(room_maps)
   }

   if ("feature" in room){
      const room_feature = document.createElement("p")
      room_feature.textContent = `feature: ${room["feature"]}`
      info_box.appendChild(room_feature)
   }

   if ("teleporter" in room){
      const room_teleporter = document.createElement("p")
      room_teleporter.textContent = `teleports to: ${room["teleporter"]}`
      info_box.appendChild(room_teleporter)
   }

   if ("shop" in room){
      const room_shop = document.createElement("p")
   room_shop.textContent = `shop name: ${room["shop"]}`
      info_box.appendChild(room_shop)
   }

   if ("teacher" in room){
      const room_teacher = document.createElement("p")
   room_teacher.textContent = `teacher of: ${room["teacher"]}`
      info_box.appendChild(room_teacher)
   }

   if ("sells" in room){
      const room_sells = document.createElement("ul")
      room_sells.textContent = "sells:"
      for (const item of room["sells"]){
         const li = document.createElement("li")
         li.textContent = item
         room_sells.appendChild(li)
      }
      info_box.appendChild(room_sells)
   }

   if (!("dungeon" in room) && !(monsterless_regions.includes(room["region"]))){
      const room_enemies = document.createElement("ul")
      room_enemies.textContent = "potential enemies and their hit point ranges:"
      for (const [enemy, hp] of Object.entries(regions[room["region"]])){
         const li = document.createElement("li")
         li.textContent = `${enemy}: ${hp[0] || ""} - ${hp[1] || ""}`
         room_enemies.appendChild(li)
      }
      info_box.appendChild(room_enemies)
   }

   info_box.style.display = "block"
   hide_info_button.style.display = "block"
}

function stop_animation() {
   for (const cell of animated_cells){
      (document.getElementById(cell)).classList.toggle("highlight")
   }

   animated_cells = []
}

function zoom_map(ev) {
   ev.preventDefault()
   
   let font_size = parseFloat(world_map.style.fontSize)
   let y = ev.deltaY
   if (y < 0) {
      font_size += 0.1
   }
   else {
      font_size -= 0.1
      if (font_size < 0.1) {
         font_size = 0.1
      }
   }
   world_map.style.fontSize = font_size.toString() + "em"
}
