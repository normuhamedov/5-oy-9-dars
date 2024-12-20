let elCategoryList = document.querySelector(".category-list");
let elProductList = document.querySelector(".products-list");
let elSearchInput = document.querySelector(".search-input");
let elSingleData = document.querySelector(".get-single-data");

const request = async (API) => {
    const resolve = await fetch(API);
    const data = await resolve.json();
    return data;
};

request("https://api.escuelajs.co/api/v1/categories").then(data => {
    // "Get All" tugmasini yaratish
    let getAllButton = document.createElement("button");
    getAllButton.textContent = "Get All";
    getAllButton.className = "get-all-btn cursor-pointer bg-blue-500 text-white py-1 px-2 rounded-2xl";
    elCategoryList.appendChild(getAllButton);

    // "Get All" tugmasi bosilganda barcha mahsulotlarni chiqarish
    getAllButton.addEventListener("click", function() {
        elProductList.innerHTML = "Loading ...";
        setTimeout(() => renderProduct("", 0), 500);
    });

    // Faqat boshidagi 5 ta kategoriya uchun elementlar yaratish
    data.slice(0, 5).map(item => {
        let elItem = document.createElement("li");
        elItem.className = "cursor-pointer";
        elItem.textContent = item.name;
        elCategoryList.appendChild(elItem);

        elItem.addEventListener("click", function() {
            elProductList.innerHTML = "Loading ...";
            setTimeout(() => renderProduct("", item.id), 1000);
        });
    });
});


elSearchInput.addEventListener("input", function (e) {
    elProductList.innerHTML = "Loading ...";
    setTimeout(() => renderProduct(e.target.value, 0), 500);
});

function renderSingleData(id, list) {
    request(`https://api.escuelajs.co/api/v1/products/${id}`).then(res => {
        list.innerHTML = `
            <strong>${res.category.id}</strong>
            <h2 class="font-bold mb-2 text-[22px]">${res.title}</h2>
            <p class="line-clamp-3">${res.description}</p>
        `;
    });
}

function renderProduct(title, id) {
    request(`https://api.escuelajs.co/api/v1/products/?title=${title}&categoryId=${id}`).then(data => {
        elProductList.innerHTML = null;
        data.map(item => {
            let elItem = document.createElement("li");
            elItem.className = "w-[300px] cursor-pointer bg-gray-400 rounded-2xl p-2";
            elItem.innerHTML = `
                <strong>${item.category.id}</strong>
                <h2 class="font-bold mb-2 text-[22px]">${item.title}</h2>
                <p class="line-clamp-3">${item.description}</p>
            `;
            elProductList.appendChild(elItem);

            elItem.addEventListener("click", function () {
                renderSingleData(item.id, elSingleData);
            });
        });
    });
}

renderProduct("", 0);
