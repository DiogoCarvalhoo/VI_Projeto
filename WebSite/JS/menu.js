 function renderMenu(page) {
    const main = document.getElementById("body");
  
    //create nav and sidemenu
    var nav = document.createElement("nav");
    var sidemenu = document.createElement("div");
    sidemenu.className = "sidemenu";
  
    /* MAIN LOGO */
    var logo = document.createElement("div");
    logo.className = "logo";
    var logo_icon = [
      "InfoPortugal",
      '<img src="Images/logo.png" class="logo-img" fill="none" viewBox="0 0 24 24" stroke="currentColor"> </img>',
    ];
  
    //eventListener when clicking on logo, redirects to the index page
    logo.addEventListener("click", () => {
      location.href = "./home.html";
    });
  
    //CREATE THE LOGO OF THE PAGE
    logo.innerHTML = logo_icon[1];
    var logo_text = document.createElement("p");
    logo_text.className = "logo-name";
    logo_text.textContent = logo_icon[0];
    logo.append(logo_text);
    sidemenu.append(logo);
  
    /* MENU ICONS */
    var menu_icons = {
      home: [
        "Home",
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> </svg>',
        "home.html",
      ],
      populacao: [
        "Dados População",
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
        "population.html",
      ],
      saude: [
        "Dados Saúde",
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> </svg>',
        "health.html",
      ],
      educacao: [
        "Dados Educação",
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path d="M12 14l9-5-9-5-9 5 9 5z" /> <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /> </svg>',
        "education.html",
      ],
    };
  
    var menu = document.createElement("div");
    menu.className = "menu";
    var menu_title = document.createElement("p");
    menu_title.className = "sub-menu-title";
    menu_title.textContent = "MENU";
    menu.append(menu_title);
    var ul_menu = document.createElement("ul");
  
    for (let i in menu_icons) {
      var a_item = document.createElement("a");
      a_item.href = menu_icons[i][2];
      var li_item = document.createElement("li");
      if (page.includes(i)) {
        a_item.className = "menu-option option--active";
      } else {
        a_item.className = "menu-option";
      }
  
      //CREATION OF THE SUBMENU ITEMS THAT CONTAIN A ICON AND THE TEXT THAT IS STORED IN menu_icons
      a_item.innerHTML = menu_icons[i][1] + menu_icons[i][0];
      li_item.append(a_item);
      ul_menu.append(li_item);
    }
  
    menu.append(ul_menu);
  
    /* SECOND MENU ICONS */
    var general_icons = {
      aboutus: [
        "Sobre Nós",
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /> </svg>',
        "aboutus.html",
      ],
    };
  
    var general = document.createElement("div");
    general.className = "general";
    var general_title = document.createElement("p");
    general_title.className = "sub-menu-title";
    general_title.textContent = "GENERAL";
    general.append(general_title);
    var ul_general = document.createElement("ul");
  
    for (let i in general_icons) {
      var a_item = document.createElement("a");
      a_item.href = general_icons[i][2];
      var li_item = document.createElement("li");
      if (page.includes(i)) {
        a_item.className = "menu-option option--active";
      } else {
        a_item.className = "menu-option";
      }
  
      a_item.innerHTML = general_icons[i][1] + general_icons[i][0];
      li_item.append(a_item);
      ul_general.append(li_item);
    }
    general.append(ul_general);
  
    sidemenu.append(menu);
    sidemenu.append(general);
  
    nav.append(sidemenu);
  
    main.prepend(nav);
  }