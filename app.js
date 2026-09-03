const products=[
{id:1,name:"Alternator Assembly",price:3599,cat:"engine",icon:"⚙",tag:"ENGINE",rating:5},
{id:2,name:"Oil Filter",price:249,cat:"service",icon:"◉",tag:"SERVICE",rating:5},
{id:3,name:"Spark Plug",price:199,cat:"engine",icon:"ϟ",tag:"ENGINE",rating:5},
{id:4,name:"Air Filter",price:399,cat:"service",icon:"▤",tag:"SERVICE",rating:4},
{id:5,name:"Brake Disc & Pad Kit",price:899,cat:"brakes",icon:"◍",tag:"BRAKES",rating:5},
{id:6,name:"Front Shock Absorber",price:1699,cat:"service",icon:"⌇",tag:"SUSPENSION",rating:5},
{id:7,name:"LED Headlight Assembly",price:1199,cat:"service",icon:"◒",tag:"LIGHTING",rating:4},
{id:8,name:"Car Body Bumper",price:2499,cat:"body",icon:"▱",tag:"BODY PARTS",rating:5}
];
const categories=[
["ENGINE PARTS","⚙","From ₹1,299","engine"],["BRAKE PARTS","◍","From ₹899","brakes"],
["BODY PARTS","▱","From ₹2,499","body"],["LIGHTING","◒","From ₹1,199","service"],
["SUSPENSION","⌇","From ₹1,699","service"],["ACCESSORIES","◇","From ₹599","service"]
];
let cart=JSON.parse(localStorage.getItem("riaCart")||"[]");
let activeFilter="all", searchTerm="";
const money=n=>"₹"+n.toLocaleString("en-IN");
function renderCategories(){
  document.querySelector("#categoryGrid").innerHTML=categories.map(([name,icon,price,cat])=>`
  <article class="category" data-cat="${cat}" onclick="filterCategory('${cat}')">
    <div class="icon">${icon}</div><h3>${name}</h3><p>Quality automotive products</p><strong>${price}</strong>
  </article>`).join("");
}
function renderProducts(){
  const list=products.filter(p=>(activeFilter==="all"||p.cat===activeFilter)&&p.name.toLowerCase().includes(searchTerm));
  document.querySelector("#productGrid").innerHTML=list.length?list.map(p=>`
  <article class="product">
    <div class="product-visual">${p.icon}</div>
    <div class="product-body">
      <span class="tag">${p.tag}</span><h3>${p.name}</h3>
      <div class="stars">${"★".repeat(p.rating)}${"☆".repeat(5-p.rating)}</div>
      <div class="price">${money(p.price)}</div>
      <button class="add" onclick="addToCart(${p.id})">ADD TO CART</button>
    </div>
  </article>`).join(""):`<p style="color:#89919b">No products matched your search.</p>`;
}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++; else cart.push({id,qty:1});
  saveCart(); openCart();
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta; if(item.qty<=0)cart=cart.filter(x=>x.id!==id); saveCart();
}
function saveCart(){localStorage.setItem("riaCart",JSON.stringify(cart)); renderCart(); updateCount();}
function renderCart(){
  const el=document.querySelector("#cartItems");
  if(!cart.length){el.innerHTML='<p style="color:#7e8791;padding:25px 0">Your cart is empty.</p>';document.querySelector("#cartTotal").textContent="₹0";return}
  el.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-line"><div><h4>${p.name}</h4><small>${money(p.price)} each</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join("");
  document.querySelector("#cartTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function updateCount(){document.querySelector("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function openCart(){document.querySelector("#cartDrawer").classList.add("open");document.querySelector("#overlay").classList.add("show")}
function closeCart(){document.querySelector("#cartDrawer").classList.remove("open");document.querySelector("#overlay").classList.remove("show")}
function filterCategory(cat){activeFilter=cat;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));document.querySelector(`[data-filter="${cat}"]`)?.classList.add("active");renderProducts();location.hash="shop"}
document.querySelector("#searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=document.querySelector("#searchInput").value.trim().toLowerCase();activeFilter="all";renderProducts();document.querySelector("#shop").scrollIntoView({behavior:"smooth"})});
document.querySelector("#clearFilters").onclick=()=>{searchTerm="";document.querySelector("#searchInput").value="";activeFilter="all";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="all"));renderProducts()};
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;searchTerm="";document.querySelector("#searchInput").value="";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
document.querySelector("#findParts").onclick=()=>{const m=document.querySelector("#make").value,model=document.querySelector("#model").value,year=document.querySelector("#year").value;document.querySelector("#fitmentMessage").textContent=m&&model&&year?`Showing parts suitable for ${m} ${model} (${year}). Check product compatibility with us before ordering.`:"Please select make, model and year to narrow your search.";};
document.querySelector("#cartButton").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
document.querySelector("#overlay").onclick=closeCart;
document.querySelector("#checkout").onclick=()=>{if(!cart.length)return alert("Your cart is empty.");alert("Checkout is ready for the next integration step. Payment gateway and order database can be connected after deployment.")};
document.querySelector("#yearNow").textContent=new Date().getFullYear();
renderCategories();renderProducts();renderCart();updateCount();
