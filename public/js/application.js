document.addEventListener("DOMContentLoaded", () => {
  const main = document?.querySelector(".main");
  const form = document?.querySelector("#editEntryForm");
  const lernbtn = document?.querySelector("#lernbtn");
  const contres = document?.querySelector("#contres");
  const countrybtn = document?.querySelector("[data-id='countrybtn']");

  if (lernbtn) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("я еще в другом слушателе");
      const response = await fetch(
        "https://covid-19-data.p.rapidapi.com/help/countries?format=json",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "x-rapidapi-key":
              "b3a07e61e1mshf1dc9d956df9b83p10fc5cjsncd832c7862ce",
          },
        }
      );

      const responseJson = await response.json();

      if (responseJson) {
        main.innerHTML = "";
        main.innerHTML =
          ' <p class="entry-stub">Выберете интересующую вас страну из списка ниже:</p>';
        const contres = document?.querySelector("#contres");
        for (let i = 0; i < responseJson.length; i++) {
          main.innerHTML += `
            <button id="${i}" data-id="countrybtn" data-latitude="${responseJson[i].latitude}" data-longitude="${responseJson[i].longitude}" data-code="${responseJson[i].alpha2code}"  value="${responseJson[i].name}" class="no-border no-outline no-bg c-white hover-underline" >${responseJson[i].name}</button>
            `;
        }

        const countrybtn = document?.querySelector("[data-id='countrybtn']");
        //  console.log(countrybtn);
        //  console.log(contres);

        document.addEventListener("click", async (e) => {
          if (e.target.dataset.id === "countrybtn") {
            console.log(e.target.dataset.code);
            const response = await fetch(`https://covid-19-data.p.rapidapi.com/country/code?code=${e.target.dataset.code}&format=json`, {
              "method": "GET",
              "headers": {
                "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
                "x-rapidapi-key": "b3a07e61e1mshf1dc9d956df9b83p10fc5cjsncd832c7862ce"
              }
            })
  
            const responseJson = await response.json();
            console.log("тут хочу получить джейсон ", responseJson);
            if (responseJson) {
              console.log();
              const regPeople = /\B(?=(\d{3})+(?!\d))/g;
              const regDate = /(\d{2,4})\W*(\d{1,2})\W*(\d{1,2})\W*.............../g; // 2000-12-12T13:00:00 -> 12-12-2000 
              main.innerHTML = "";
              main.innerHTML =
              `<p class="entry-stub">Вот свежая информация по ${responseJson[0].country} по состоянию на ${responseJson[0].lastChange.toString().replace(regDate, '$3-$2-$1 г.')} </p>
<ul class="list-group">
  <li class="list-group-item list-group-item-info">Выявлено ${responseJson[0].confirmed.toString().replace(regPeople, " ")} чел.</li>
  <li class="list-group-item list-group-item-success">Поправились ${responseJson[0].recovered.toString().replace(regPeople, " ")} чел.</li>
  <li class="list-group-item list-group-item-warning">Под аппаратами ИВЛ ${responseJson[0].critical.toString().replace(regPeople, " ")} чел.</li>
  <li class="list-group-item list-group-item-danger">Погибли ${responseJson[0].deaths.toString().replace(regPeople, " ")} чел.</li>
</ul>`
  
            }
          }  
        }); // конец второго обработчика
      } else {
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.innerText = responseJson.errorMessage;
        event.target.parentElement.append(errorDiv);
        return;
      }
    });
  } // первый обработчик
});
