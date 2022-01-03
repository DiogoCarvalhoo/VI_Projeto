//Function that creates initial carousel
function loadInitialCarousel() {

    let data_info = [
      {
        title: "Dados População",
        description:
            "Visualiza dados que caracterizam a população em Portugal. A distribuição da população geograficamente, faixas etárias mais preenchidas e distribuição por género.",
        src: "Images/population-initial-img.jpg",
        link: "population.html",
        index: "0",
      },
      {
        title: "Dados Educação",
        description:
            "Visualiza dados que caracterizam a qualidade de Ensino em Portugal. Número de estabelicementos de ensino, número frequentadores dos diversos graus de ensino bem como o número de novos diplomados por ano em Portugal.",
        src: "Images/education-initial-img.jpg",
        link: "education.html",
        index: "1",
      },
      {
        title: "Dados Saúde",
        description:
            "Visualiza dados que caracterizam a qualidade da Saúde em Portugal. Número de médicos por especialidade bem como número de camas e consultas efetuadas por tipo de estabelecimento de saúde.",
        src: "Images/health-initial-img.jpg",
        link: "health.html",
        index: "2",
      }
    ];
  
    for (let i = 0; i < data_info.length; i++) {
      /*All Images Section */
      let data = data_info[i];
  
      /*Carousel Indicators */
      let slide_button = document.createElement("button");
      slide_button.type = "button";
      slide_button.setAttribute("data-bs-target", "#carouselExampleCaptions");
      slide_button.setAttribute("data-bs-slide-to", data.index);
      if (data.index === "0") {
        slide_button.classList.add("active");
      }
      /*Add carousel indicators to carousel-indicators div */
      document.getElementById("carousel-indicators").appendChild(slide_button);
  
      /*Carousel Images */
      let img_element = document.createElement("img");
      img_element.className = "d-block w-100";
      img_element.src = data.src;
      img_element.alt = data.title + " WALLPAPER";
  
      /*Carousel Caption */
      let carousel_caption_element = document.createElement("div");
      carousel_caption_element.className = "carousel-caption d-none d-md-block";
      let title = document.createElement("h2");
      title.textContent = data.title;
      let description = document.createElement("p");
      description.className = "description";
      description.textContent = data.description;
      let link = document.createElement("a");
      link.className = "btn-more-info";
      link.href = data.link 
      link.textContent = "More Info";
      /*Add all elements into carousel caption */
      carousel_caption_element.append(title);
      carousel_caption_element.append(description);
      carousel_caption_element.append(link);
  
      /* Creation of carousel-item */
      let carousel_item_element = document.createElement("div");
      carousel_item_element.classList.add("carousel-item");
      if (data.index === "0") {
        carousel_item_element.classList.add("active");
      }
      /* Add elements into carousel-item */
      carousel_item_element.append(img_element);
      carousel_item_element.append(carousel_caption_element);
  
      /*Add carousel-items to carousel-inner */
      document.getElementById("carousel-inner").append(carousel_item_element);
    }
  }
  