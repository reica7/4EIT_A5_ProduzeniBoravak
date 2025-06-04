document.addEventListener("DOMContentLoaded", () => {
    const izvodjacInput = document.getElementById("izvodjac");
    const nazivInput = document.getElementById("naziv");
    const zanrSelect = document.getElementById("zanr");
    const godinaSelect = document.getElementById("godina");
    const izdavackaInput = document.getElementById("izdavacka");
    const tabelaBody = document.querySelector("#tabela tbody");
    const forma = document.querySelector("form");
  

    async function ucitajPodatke() {
      try {
        const response = await fetch("Katalog.txt");
        if (!response.ok) throw new Error("Nije moguće učitati fajl.");
        const tekst = await response.text();
  
        const linije = tekst.trim().split("\n").filter(l => l.trim() !== "");
  
    
        const albumi = linije.map(linija => {
          const [izvodjac, naziv, zanr, godina, izdavacka, omot] = linija.split("|").map(s => s.trim());
          return { izvodjac, naziv, zanr, godina, izdavacka, omot };
        });
  
        
        const jedinstveniZanrovi = [...new Set(albumi.map(a => a.zanr))].sort();
        const jedinstveneGodine = [...new Set(albumi.map(a => a.godina))].sort((a, b) => a - b);
  
        zanrSelect.innerHTML = `<option value="">-- Izaberite žanr --</option>`;
        jedinstveniZanrovi.forEach(zanr => {
          const opt = document.createElement("option");
          opt.value = zanr;
          opt.textContent = zanr;
          zanrSelect.appendChild(opt);
        });
  
        godinaSelect.innerHTML = `<option value="">-- Izaberite godinu --</option>`;
        jedinstveneGodine.forEach(godina => {
          const opt = document.createElement("option");
          opt.value = godina;
          opt.textContent = godina;
          godinaSelect.appendChild(opt);
        });
  
        return albumi;
      } catch (err) {
        alert("Greška pri učitavanju podataka: " + err.message);
        return [];
      }
    }
  
    // Filtriranje prema unetim kriterijumima
    function filtriraj(albumi) {
      const filter = {
        izvodjac: izvodjacInput.value.trim().toLowerCase(),
        naziv: nazivInput.value.trim().toLowerCase(),
        zanr: zanrSelect.value,
        godina: godinaSelect.value,
        izdavacka: izdavackaInput.value.trim().toLowerCase()
      };
  
      return albumi.filter(a => {
        const izvodjacMatch = !filter.izvodjac || a.izvodjac.toLowerCase().includes(filter.izvodjac);
        const nazivMatch = !filter.naziv || a.naziv.toLowerCase().includes(filter.naziv);
        const izdavackaMatch = !filter.izdavacka || a.izdavacka.toLowerCase().includes(filter.izdavacka);
  
        const zanrMatch = !filter.zanr || a.zanr === filter.zanr;
        const godinaMatch = !filter.godina || a.godina === filter.godina;
  
        return izvodjacMatch && nazivMatch && izdavackaMatch && zanrMatch && godinaMatch;
      });
    }
  
    // Prikaz tabele
    function prikazi(albumi) {
      tabelaBody.innerHTML = "";
      if (albumi.length === 0) {
        tabelaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nema rezultata za prikaz.</td></tr>`;
        return;
      }
  
      albumi.forEach(a => {
        const red = document.createElement("tr");
        red.innerHTML = `
          <td>${a.izvodjac}</td>
          <td>${a.naziv}</td>
          <td>${a.zanr}</td>
          <td>${a.godina}</td>
          <td>${a.izdavacka}</td>
          <td><img src="${a.omot}" alt="Omot albuma" width="60"></td>
        `;
        tabelaBody.appendChild(red);
      });
    }
  
    ucitajPodatke().then(albumi => {
      prikazi(albumi);
  
      forma.addEventListener("submit", e => {
        e.preventDefault();
        const filtrirani = filtriraj(albumi);
        prikazi(filtrirani);
      });
    });
  });
  