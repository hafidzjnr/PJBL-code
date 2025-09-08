// Ambil elemen dari DOM
const form = document.querySelector("form");
const input = document.querySelector("input");
const msg = document.querySelector(".msg");
const list = document.querySelector(".ajax-section .cities");

// Ganti "YOUR_API_KEY" dengan kunci API Anda dari OpenWeatherMap
const apiKey = "4d8fb5b93d4af21d66a2948710284366";

form.addEventListener("submit", e => {
  // Mencegah perilaku default form (refresh halaman)
  e.preventDefault();
  
  // Hapus pesan kesalahan sebelumnya
  msg.textContent = "";

  const inputVal = input.value.toLowerCase();

  // Periksa apakah kota sudah ditampilkan
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.some(item => {
      const cityName = item.querySelector(".city-name span").textContent.toLowerCase();
      return cityName === inputVal;
  })) {
      msg.textContent = `Anda sudah mengetahui cuaca untuk ${input.value}. Mohon cari kota lain.`;
      form.reset();
      input.focus();
      return;
  }

  // Buat URL untuk permintaan API
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric&lang=id`;

  // Ambil data cuaca menggunakan Fetch API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Jika kota tidak ditemukan, tampilkan pesan kesalahan
      if (data.cod === "404") {
        msg.textContent = "Kota tidak ditemukan, coba lagi.";
        return;
      }

      // Ekstrak informasi yang relevan dari data
      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

      // Buat elemen HTML untuk kartu kota
      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      
      // Tambahkan kartu kota ke daftar
      list.appendChild(li);
    })
    .catch(() => {
      // Tangani kesalahan jaringan
      msg.textContent = "Terjadi kesalahan jaringan.";
    });

  // Reset form setelah submit
  form.reset();
  input.focus();
});
