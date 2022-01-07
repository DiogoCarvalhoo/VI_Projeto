//function that is called on the load of the body, and receives the current page
function main(page) {

    //Menu appears in all pages, so we render it, and pass the current page, so it know which tab is active
    renderMenu(page);

    //switch with all pages
    switch (page) {
      case "home":
        loadInitialCarousel();
        break;
      
      case "population":
        loadInitialPopulation();
        break;
      
      case "health":
        loadInitialHealth();
        break;

      case "education":
        loadInitialEducation();
        break;
        
      default:
        break;
    }
  }
 